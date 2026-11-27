// Admin › Prompts (REQ-038; Prompt Workbench sprint 2 + 3): A1 list, A2 editor, preview, A3 review queue, A4 review,
// A5 version history. Taxonomy, staff, feedback, features, insights and the audit log are in AdminPages.jsx.
// Roles: Owner (admins/{uid}), Reviewer, Editor (staff/{uid}). Firestore rules enforce the same.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { Icon, Tag, Loading, Spinner } from '../components/ui.jsx';
import { PROMPTS as BUNDLED, ROLES } from '../data/prompts/index.js';
import { DEFAULT_TAXONOMY, usePromptData, loadPromptData } from '../data/promptStore.js';
import * as api from '../data/promptApi.js';
import { PhaseChip, PromptDetailView, ago } from './Prompts.jsx';
import { AdminShell, useAction, friendly, Err, Ok, when, isReviewer } from './AdminShell.jsx';

const StatusTag = ({ status }) => { const s = api.STATUS[status] || { label: status, tone: 'ink' }; return <Tag tone={s.tone}>{s.label}</Tag>; };

// ---------- A1 prompt list ----------
export function AdminPrompts() {
  const { role, me } = useStore();
  const [list, setList] = useState(null);
  const [q, setQ] = useState(''); const [status, setStatus] = useState('');
  const act = useAction();
  const load = () => api.listPrompts().then(setList).catch((e) => { act.setErr(friendly(e)); setList([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line
  const importAll = async () => {
    const n = await act.run(() => api.importBundled(me, BUNDLED, DEFAULT_TAXONOMY), (k) => `Imported ${k} prompts. Learners now read the published set from the database.`);
    if (n !== undefined) { load(); loadPromptData(true); }
  };
  const rows = useMemo(() => (list || []).filter((p) => (!status || p.status === status) && (!q || `${p.id} ${p.title} ${p.sub}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')), [list, q, status]);
  const counts = useMemo(() => Object.fromEntries(Object.keys(api.STATUS).map((k) => [k, (list || []).filter((p) => p.status === k).length])), [list]);

  return (
    <AdminShell title="Prompts" sub="Create, review and publish prompts. Learners only see published prompts." actions={<Link to="/admin/prompts/new" className="btn btn-primary"><Icon name="Plus" size={16} />New prompt</Link>}>
      <Err>{act.err}</Err>{act.msg && <Ok>{act.msg}</Ok>}
      {list === null ? <Loading label="Loading prompts…" /> : (
        <>
          {list.length === 0 && (
            <section className="card p24 bg-primary-soft">
              <h2 className="h3">No prompts in the database yet</h2>
              <p className="small muted">The library currently shows the {BUNDLED.length} prompts that ship with the site. {role === 'owner' ? 'Import them once to manage them here: they become published version 1, with history from now on.' : 'The Owner needs to import them before they can be edited here.'}</p>
              {role === 'owner' && <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={act.busy} onClick={importAll}>{act.busy ? <Spinner label="Importing…" /> : `Import the ${BUNDLED.length} launch prompts`}</button>}
            </section>
          )}
          <div className="row center wrap gap8">
            <label className="search pw-search" style={{ flex: '1 1 280px' }}><Icon name="Search" size={18} color="#94A3B8" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by id, title or subcategory" aria-label="Search prompts" /></label>
            <div className="row center gap6 wrap" role="group" aria-label="Status">
              <button type="button" className={`chip ${!status ? 'on' : ''}`} aria-pressed={!status} onClick={() => setStatus('')}>All · {list.length}</button>
              {Object.entries(api.STATUS).map(([k, v]) => <button key={k} type="button" className={`chip ${status === k ? 'on' : ''}`} aria-pressed={status === k} onClick={() => setStatus(k)}>{v.label} · {counts[k]}</button>)}
            </div>
          </div>
          <section className="card p0">
            {rows.map((p) => (
              <div key={p.id} className="list-row admin-row">
                <span className="caption faint mono" style={{ width: 52 }}>{p.id}</span>
                <div className="col grow" style={{ gap: 2 }}>
                  <Link to={`/admin/prompts/${p.id}/edit`} className="label">{p.title || '(untitled)'}</Link>
                  <span className="caption faint">v{p.version} · updated {p.updatedAt ? ago(p.updatedAt) : ''} by {p.updatedBy && p.updatedBy.name}{p.reviewNote && p.status === 'draft' ? ' · returned with a comment' : ''}</span>
                </div>
                <span className="hide-sm"><PhaseChip phase={p.phase} /></span>
                <StatusTag status={p.status} />{p.live && p.status !== 'published' && <Tag tone="success">Live v{p.published && p.published.version}</Tag>}
                <Link to={`/admin/prompts/${p.id}/history`} className="icon-btn" aria-label={`History of ${p.title}`} title="History"><Icon name="History" size={16} /></Link>
              </div>
            ))}
            {!rows.length && list.length > 0 && <p className="body muted" style={{ padding: 24 }}>No prompts match.</p>}
          </section>
        </>
      )}
    </AdminShell>
  );
}

// ---------- A2 editor ----------
const blank = (cat = 'A') => ({ id: '', phase: 'discover', step: 1, cat, sub: '', roles: ['BA'], title: '', desc: '', when: [''], prepare: '', ph: [], body: '', output: '', next: [], tags: [], tr: { vi: ['', '', ''], ko: ['', '', ''], fr: ['', '', ''] } });
const normTr = (tr) => Object.fromEntries(api.LANG_IDS.map((l) => [l, (tr && tr[l]) || ['', '', '']]));

export function PromptEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const { role, me } = useStore();
  const D = usePromptData();
  const [tax, setTax] = useState(null);
  const [doc, setDoc] = useState(null); // stored working copy (null = new)
  const [f, setF] = useState(null); // form
  const [dirty, setDirty] = useState(false);
  const [confirm, setConfirm] = useState('');
  const act = useAction();

  useEffect(() => {
    api.getTaxonomy().then((t) => setTax(t || DEFAULT_TAXONOMY)).catch(() => setTax(DEFAULT_TAXONOMY));
    if (!id) { setF(blank()); setDoc(null); return; }
    api.getPrompt(id).then((p) => { if (!p) { act.setErr(`Prompt ${id} was not found in the database.`); return; } setDoc(p); setF({ ...blank(), ...api.contentOf(p), tr: normTr(p.tr) }); setDirty(false); }).catch((e) => act.setErr(friendly(e)));
  }, [id]); // eslint-disable-line

  if (!f || !tax) return <AdminShell title={id ? 'Edit prompt' : 'New prompt'}><Err>{act.err}</Err>{!act.err && <Loading />}</AdminShell>;
  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setDirty(true); };
  // Placeholders come from the prompt text; labels and examples are kept by name.
  const setBody = (body) => {
    const names = api.detectPlaceholders(body);
    setF((x) => { const old = Object.fromEntries(x.ph.map((p) => [p[0], p])); return { ...x, body, ph: names.map((n) => old[n] || [n, '', '']) }; });
    setDirty(true);
  };
  const setPh = (i, j, v) => { setF((x) => ({ ...x, ph: x.ph.map((p, k) => (k === i ? Object.assign([...p], { [j]: v }) : p)) })); setDirty(true); };
  const setTr = (l, j, v) => { setF((x) => ({ ...x, tr: { ...x.tr, [l]: Object.assign([...x.tr[l]], { [j]: v }) } })); setDirty(true); };
  const content = () => {
    const tr = {}; for (const l of api.LANG_IDS) if (f.tr[l].some((s) => s.trim())) tr[l] = f.tr[l].map((s) => s.trim());
    return { ...f, step: Number(f.step) || 0, when: f.when.map((w) => w.trim()).filter(Boolean), next: f.next.filter(Boolean), tags: f.tags.filter(Boolean), tr, title: f.title.trim(), desc: f.desc.trim() };
  };
  const problems = api.validate(content());
  const unknownNext = f.next.filter((n) => n && !D.byId[n] && n !== f.id);
  const cats = tax.categories; const subs = (cats.find((c) => c.id === f.cat) || {}).subs || [];
  const status = doc ? doc.status : 'draft';
  const canEdit = status !== 'review' || isReviewer(role);

  const save = async () => {
    if (!f.title.trim()) { act.setErr('Add a title before saving.'); return null; }
    const r = await act.run(() => api.savePrompt(content(), me), (x) => `Saved as draft v${x.version}.`);
    if (r) { setDirty(false); const p = await api.getPrompt(r.id); setDoc(p); setF((x) => ({ ...x, id: r.id })); if (!id) nav(`/admin/prompts/${r.id}/edit`, { replace: true }); }
    return r;
  };
  const submit = async () => {
    const ok = await act.run(() => api.submitForReview(f.id, me), 'Submitted. Reviewers can see it in their queue.');
    if (ok !== undefined) setDoc(await api.getPrompt(f.id));
  };
  const takeDown = async (kind) => {
    setConfirm('');
    const ok = await act.run(() => api.takeDown(f.id, me, kind), kind === 'archived' ? 'Archived. Learners no longer see it.' : 'Unpublished. Learners no longer see it.');
    if (ok !== undefined) { setDoc(await api.getPrompt(f.id)); loadPromptData(true); }
  };

  return (
    <AdminShell title={id ? f.title || id : 'New prompt'} sub={doc ? `${f.id} · v${doc.version} · last saved ${when(doc.updatedAt)} by ${doc.updatedBy && doc.updatedBy.name}` : 'Fill in the fields, save as a draft, then submit it for review.'}
      actions={<div className="row center gap8 wrap">{doc && <StatusTag status={status} />}{doc && doc.live && <Tag tone="success">Live v{doc.published && doc.published.version}</Tag>}</div>}>
      {doc && doc.reviewNote && status === 'draft' && <div className="soft bg-accent-soft small"><b>Returned by the reviewer:</b> {doc.reviewNote}</div>}
      {status === 'review' && <div className="soft bg-primary-soft small">This prompt is in review{doc.submittedBy ? ` (submitted by ${doc.submittedBy.name})` : ''}. {isReviewer(role) ? <Link className="c-primary" to={`/admin/review/${f.id}`}>Open the review</Link> : 'Saving a change moves it back to Draft.'}</div>}
      <Err>{act.err}</Err>
      <div className="detail-split">
        <div className="col" style={{ gap: 20 }}>
          <section className="card p24">
            <h2 className="h3">Basics</h2>
            <Field label="Title" id="title"><input id="title" className="input" value={f.title} onChange={(e) => set('title', e.target.value)} maxLength={120} /></Field>
            <Field label="Short description" hint="One or two sentences shown on the card" id="desc"><textarea id="desc" className="input textarea" rows={2} value={f.desc} onChange={(e) => set('desc', e.target.value)} /></Field>
            <div className="grid g3 form-grid">
              <Field label="Phase" id="phase"><select id="phase" className="input" value={f.phase} onChange={(e) => set('phase', e.target.value)}>{D.phases.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
              <Field label="Step in phase" id="step"><input id="step" type="number" min="1" className="input" value={f.step} onChange={(e) => set('step', e.target.value)} /></Field>
              <Field label="Category" id="cat"><select id="cat" className="input" value={f.cat} disabled={!!doc} onChange={(e) => set('cat', e.target.value)}>{cats.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}</select></Field>
            </div>
            <Field label="Subcategory" hint="Pick one or type a new one" id="sub"><input id="sub" className="input" list="subs" value={f.sub} onChange={(e) => set('sub', e.target.value)} /><datalist id="subs">{subs.map((s) => <option key={s} value={s} />)}</datalist></Field>
            <div className="col gap6"><span className="label">Roles</span>
              <div className="row gap8 wrap">{ROLES.map((r) => { const on = f.roles.includes(r); return <button key={r} type="button" className={`check-chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => set('roles', on ? f.roles.filter((x) => x !== r) : [...f.roles, r])}>{r}</button>; })}</div>
            </div>
            <Field label="When to use" hint="One situation per line" id="when"><textarea id="when" className="input textarea" rows={3} value={f.when.join('\n')} onChange={(e) => set('when', e.target.value.split('\n'))} /></Field>
            <Field label="Inputs to prepare" hint="Comma-separated" id="prepare"><input id="prepare" className="input" value={f.prepare} onChange={(e) => set('prepare', e.target.value)} /></Field>
          </section>

          <section className="card p24">
            <h2 className="h3">Prompt text</h2>
            <p className="small muted">Write placeholders as <code>[Business Context]</code> (starting with a capital letter). They are detected automatically. Lowercase brackets like <code>[role]</code> stay as text for the AI.</p>
            <Field label="Prompt (English)" id="body"><textarea id="body" className="input textarea mono" rows={14} value={f.body} onChange={(e) => setBody(e.target.value)} /></Field>
            <div className="col gap6">
              <span className="label">Placeholders detected · {f.ph.length}</span>
              {!f.ph.length && <span className="caption faint">None yet.</span>}
              {f.ph.map(([n, l, ex], i) => (
                <div key={n} className="ph-row">
                  <span className="label mono">[{n}]</span>
                  <input className="input" aria-label={`Hint for ${n}`} placeholder="Hint, e.g. What is the initiative?" value={l} onChange={(e) => setPh(i, 1, e.target.value)} />
                  <input className="input" aria-label={`Example for ${n}`} placeholder="Example value" value={ex} onChange={(e) => setPh(i, 2, e.target.value)} />
                </div>
              ))}
            </div>
            <Field label="Expected output" id="output"><textarea id="output" className="input textarea" rows={2} value={f.output} onChange={(e) => set('output', e.target.value)} /></Field>
            <div className="grid g2 form-grid">
              <Field label="Next prompts" hint="Ids, first = Recommended" id="next"><input id="next" className="input" value={f.next.join(', ')} onChange={(e) => set('next', e.target.value.split(/[,\s]+/).map((x) => x.trim().toUpperCase()))} placeholder="P-A02, P-A03" /></Field>
              <Field label="Tags" hint="Comma-separated" id="tags"><input id="tags" className="input" value={f.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((x) => x.trim()))} /></Field>
            </div>
            {unknownNext.length > 0 && <span className="caption c-accent">Not published (yet): {unknownNext.join(', ')}. Learners won't see these as next steps.</span>}
          </section>

          <section className="card p24">
            <h2 className="h3">Translations</h2>
            <p className="small muted">Title, description and when-to-use for learners who read these languages. The prompt text stays English. Leave a language empty to show English only.</p>
            {[['vi', 'Vietnamese'], ['ko', 'Korean'], ['fr', 'French']].map(([l, name]) => (
              <fieldset key={l} className="tr-fieldset">
                <legend className="label">{name}</legend>
                <input className="input" lang={l} aria-label={`${name} title`} placeholder="Title" value={f.tr[l][0]} onChange={(e) => setTr(l, 0, e.target.value)} />
                <input className="input" lang={l} aria-label={`${name} description`} placeholder="Description" value={f.tr[l][1]} onChange={(e) => setTr(l, 1, e.target.value)} />
                <input className="input" lang={l} aria-label={`${name} when to use`} placeholder="When to use" value={f.tr[l][2]} onChange={(e) => setTr(l, 2, e.target.value)} />
              </fieldset>
            ))}
          </section>
        </div>

        <aside className="col" style={{ gap: 20 }}>
          <section className="card p24">
            <h2 className="h3">Actions</h2>
            <button type="button" className="btn btn-primary" disabled={act.busy || !canEdit} onClick={save}>{act.busy ? <Spinner label="Saving…" /> : 'Save draft'}</button>
            {dirty && <span className="caption c-accent">Unsaved changes</span>}
            {act.msg && <Ok>{act.msg}</Ok>}
            <button type="button" className="btn btn-secondary" disabled={!f.id || dirty} onClick={() => nav(`/admin/prompts/${f.id}/preview`)}><Icon name="BookOpen" size={16} />Preview</button>
            <button type="button" className="btn btn-secondary" disabled={!f.id || dirty || status !== 'draft' || problems.length > 0 || act.busy} onClick={submit}><Icon name="Send" size={16} />Submit for review</button>
            {(!f.id || dirty) && <span className="caption faint">Save first to preview or submit.</span>}
            {f.id && <Link to={`/admin/prompts/${f.id}/history`} className="small c-primary">Version history</Link>}
          </section>
          <section className="card p24">
            <h2 className="h3">Ready to publish?</h2>
            {problems.length ? <ul className="bullets c-danger">{problems.map((p) => <li key={p}>{p}</li>)}</ul> : <span className="small c-success"><Icon name="Check" size={16} /> All required fields are filled.</span>}
          </section>
          {doc && isReviewer(role) && (doc.live || status !== 'archived') && (
            <section className="card p24">
              <h2 className="h3">Take down</h2>
              <p className="small muted">Learners stop seeing it at once. Their favourites show “No longer available”.</p>
              {confirm ? (
                <div className="col gap8"><span className="small">{confirm === 'archived' ? 'Archive' : 'Unpublish'} “{f.title}”?</span>
                  <div className="row gap8"><button type="button" className="btn btn-danger" onClick={() => takeDown(confirm)}>Yes, {confirm === 'archived' ? 'archive' : 'unpublish'}</button><button type="button" className="btn btn-secondary" onClick={() => setConfirm('')}>Cancel</button></div></div>
              ) : (
                <div className="row gap8 wrap">
                  {doc.live && <button type="button" className="btn btn-danger" onClick={() => setConfirm('unpublished')}>Unpublish</button>}
                  {status !== 'archived' && <button type="button" className="btn btn-secondary" onClick={() => setConfirm('archived')}>Archive</button>}
                </div>
              )}
            </section>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}
const Field = ({ label, hint, id, children }) => (
  <div className="col gap6"><label htmlFor={id} className="row center gap8 wrap"><span className="label">{label}</span>{hint && <span className="caption faint">{hint}</span>}</label>{children}</div>
);

// ---------- preview ----------
export function PromptPreview() {
  const { id } = useParams();
  const [p, setP] = useState(null); const [err, setErr] = useState('');
  useEffect(() => { api.getPrompt(id).then((x) => (x ? setP(x) : setErr('Not found.'))).catch((e) => setErr(friendly(e))); }, [id]);
  return (
    <>
      <div className="soft bg-primary-soft row center wrap gap8 small"><Icon name="Info" size={16} color="#4F46E5" /><span className="grow"><b>Preview</b> — this is how learners will see version {p && p.version}. {p && p.status !== 'published' ? 'They do not see it yet.' : ''}</span><Link to={`/admin/prompts/${id}/edit`} className="btn btn-secondary">Back to the editor</Link></div>
      <Err>{err}</Err>
      {p ? <PromptDetailView p={p} preview /> : !err && <Loading />}
    </>
  );
}

// ---------- A3 review queue ----------
export function ReviewQueue() {
  const { role, me } = useStore();
  const [list, setList] = useState(null); const [err, setErr] = useState('');
  useEffect(() => { api.listPrompts().then((l) => setList(l.filter((p) => p.status === 'review').sort((a, b) => (a.updatedAt || '').localeCompare(b.updatedAt || '')))).catch((e) => { setErr(friendly(e)); setList([]); }); }, []);
  if (!isReviewer(role)) return <AdminShell title="Review queue"><p className="body muted">Only Reviewers and the Owner can review prompts.</p></AdminShell>;
  return (
    <AdminShell title="Review queue" sub="Prompts waiting for a quality check, oldest first.">
      <Err>{err}</Err>
      {list === null ? <Loading /> : (
        <section className="card p0">
          {list.map((p) => {
            const own = p.submittedBy && p.submittedBy.uid === me.uid;
            return (
              <div key={p.id} className="list-row admin-row">
                <span className="caption faint mono" style={{ width: 52 }}>{p.id}</span>
                <div className="col grow" style={{ gap: 2 }}><span className="label">{p.title}</span><span className="caption faint">v{p.version} · submitted by {p.submittedBy && p.submittedBy.name} · {ago(p.updatedAt)}{p.live ? ' · update to a live prompt' : ' · new prompt'}</span></div>
                {own && role !== 'owner' && <span className="caption faint hide-sm">Your submission</span>}
                <Link to={`/admin/review/${p.id}`} className="btn btn-secondary">Review</Link>
              </div>
            );
          })}
          {!list.length && <p className="body muted" style={{ padding: 24 }}>Nothing to review. 🎉</p>}
        </section>
      )}
    </AdminShell>
  );
}

// ---------- A4 review ----------
const CHECKS = [
  ['complete', 'Complete', 'Every field a learner needs is filled and makes sense.'],
  ['clear', 'Clear', 'Plain English, one clear task, the output format is stated.'],
  ['placeholders', 'Placeholders match', 'Every [Placeholder] has a helpful hint and a realistic example.'],
  ['tested', 'Test run', 'I ran it with the example values in an AI tool and the answer was useful.'],
];
export function ReviewPrompt() {
  const { id } = useParams();
  const nav = useNavigate();
  const { role, me } = useStore();
  const [p, setP] = useState(null);
  const [checks, setChecks] = useState({}); const [comment, setComment] = useState('');
  const act = useAction();
  useEffect(() => { api.getPrompt(id).then(setP).catch((e) => act.setErr(friendly(e))); }, [id]); // eslint-disable-line
  if (!isReviewer(role)) return <AdminShell title="Review"><p className="body muted">Only Reviewers and the Owner can review prompts.</p></AdminShell>;
  if (!p) return <AdminShell title="Review"><Err>{act.err}</Err>{!act.err && <Loading />}</AdminShell>;
  const problems = api.validate(p);
  const own = p.submittedBy && p.submittedBy.uid === me.uid && role !== 'owner';
  const allChecked = CHECKS.every(([k]) => checks[k]);
  const canPublish = p.status === 'review' && !own && !problems.length && allChecked;
  const publish = async () => { const ok = await act.run(() => api.publishPrompt(p.id, me, { isOwner: role === 'owner' })); if (ok !== undefined) { loadPromptData(true); nav('/admin/review', { replace: true }); } };
  const ret = async () => { const ok = await act.run(() => api.returnToDraft(p.id, me, comment)); if (ok !== undefined) nav('/admin/review', { replace: true }); };

  return (
    <AdminShell title={`Review · ${p.title}`} sub={`${p.id} · v${p.version} · submitted by ${p.submittedBy ? p.submittedBy.name : '—'}${p.live ? ` · replaces live v${p.published && p.published.version}` : ''}`}>
      {p.status !== 'review' && <div className="soft bg-bg small">This prompt is {api.STATUS[p.status].label.toLowerCase()}, not in review.</div>}
      <div className="detail-split review-split">
        <div className="col" style={{ gap: 20 }}><PromptDetailView p={p} preview /></div>
        <aside className="col" style={{ gap: 20 }}>
          <section className="card p24">
            <h2 className="h3">Automatic checks</h2>
            {problems.length ? <ul className="bullets c-danger">{problems.map((x) => <li key={x}>{x}</li>)}</ul> : <span className="small c-success"><Icon name="Check" size={16} /> Required fields filled, placeholders match.</span>}
            {p.live && <Link to={`/admin/prompts/${p.id}/history?a=${p.published.version}&b=${p.version}`} className="small c-primary">Compare with the live version</Link>}
          </section>
          <section className="card p24">
            <h2 className="h3">Quality checklist</h2>
            {CHECKS.map(([k, l, d]) => (
              <label key={k} className="row gap10 check-row">
                <input type="checkbox" checked={!!checks[k]} onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))} />
                <span className="col" style={{ gap: 2 }}><span className="label">{l}</span><span className="caption faint">{d}</span></span>
              </label>
            ))}
            <button type="button" className="btn btn-primary" disabled={!canPublish || act.busy} onClick={publish}>{act.busy ? <Spinner label="Publishing…" /> : 'Publish'}</button>
            {own && <span className="caption c-accent">You submitted this prompt, so another Reviewer or the Owner must publish it.</span>}
            {!own && !allChecked && p.status === 'review' && <span className="caption faint">Tick all four checks to publish.</span>}
            {!own && problems.length > 0 && <span className="caption c-danger">Publishing is blocked until the automatic checks pass.</span>}
          </section>
          <section className="card p24">
            <h2 className="h3">Return to the editor</h2>
            <label htmlFor="ret" className="sr-only">Comment for the editor</label>
            <textarea id="ret" className="input textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What should change? The editor sees this comment." />
            <button type="button" className="btn btn-secondary" disabled={!comment.trim() || act.busy || p.status !== 'review'} onClick={ret}>Return with comment</button>
          </section>
          <Err>{act.err}</Err>
        </aside>
      </div>
    </AdminShell>
  );
}

// ---------- A5 version history ----------
const FIELD_LABEL = { title: 'Title', desc: 'Description', phase: 'Phase', step: 'Step', cat: 'Category', sub: 'Subcategory', roles: 'Roles', when: 'When to use', prepare: 'Inputs to prepare', ph: 'Placeholders', body: 'Prompt text', output: 'Expected output', next: 'Next prompts', tags: 'Tags', tr: 'Translations', added: 'Published on' };
const show = (k, v) => (v === undefined || v === null ? '' : k === 'ph' ? v.map((x) => `[${x[0]}] ${x[1]} — e.g. ${x[2]}`).join('\n') : k === 'tr' ? Object.entries(v).map(([l, t]) => `${l.toUpperCase()}: ${t.join(' | ')}`).join('\n') : Array.isArray(v) ? v.join('\n') : String(v));

// Line diff (longest common subsequence) for comparing two versions.
export function lineDiff(a, b) {
  const x = a.split('\n'); const y = b.split('\n');
  const L = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = []; let i = 0; let j = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) { out.push([' ', x[i]]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) out.push(['-', x[i++]]); else out.push(['+', y[j++]]);
  }
  while (i < x.length) out.push(['-', x[i++]]); while (j < y.length) out.push(['+', y[j++]]);
  return out;
}

export function VersionHistory() {
  const { id } = useParams();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const { me } = useStore();
  const [list, setList] = useState(null); const [p, setP] = useState(null);
  const act = useAction();
  useEffect(() => { Promise.all([api.listVersions(id), api.getPrompt(id)]).then(([v, x]) => { setList(v); setP(x); }).catch((e) => { act.setErr(friendly(e)); setList([]); }); }, [id]); // eslint-disable-line
  const a = Number(sp.get('a')) || null; const b = Number(sp.get('b')) || null;
  const pick = (n) => {
    const cur = [a, b].filter(Boolean);
    const next = cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n].slice(-2);
    const [x, y] = next.sort((m, k) => m - k);
    const q = new URLSearchParams(); if (x) q.set('a', x); if (y) q.set('b', y); setSp(q, { replace: true });
  };
  const va = list && list.find((v) => v.version === a); const vb = list && list.find((v) => v.version === b);
  const restore = async (n) => { const r = await act.run(() => api.restoreVersion(id, n, me)); if (r) nav(`/admin/prompts/${id}/edit`); };

  return (
    <AdminShell title={`History · ${p ? p.title : id}`} sub="Every saved version, newest first. Pick two to compare. Restoring creates a new draft that goes through review." actions={<Link to={`/admin/prompts/${id}/edit`} className="btn btn-secondary">Back to the editor</Link>}>
      <Err>{act.err}</Err>
      {list === null ? <Loading /> : (
        <section className="card p0">
          {list.map((v) => (
            <div key={v.version} className="list-row admin-row">
              <input type="checkbox" aria-label={`Compare version ${v.version}`} checked={a === v.version || b === v.version} onChange={() => pick(v.version)} />
              <div className="col grow" style={{ gap: 2 }}>
                <span className="label">v{v.version} · {v.note}{p && p.published && p.published.version === v.version && p.live ? ' · live' : ''}</span>
                <span className="caption faint">{v.by && v.by.name} · {when(v.at)}</span>
              </div>
              {p && v.version !== p.version && <button type="button" className="btn btn-secondary" disabled={act.busy} onClick={() => restore(v.version)}>Restore</button>}
            </div>
          ))}
        </section>
      )}
      {va && vb ? (
        <section className="card p24">
          <h2 className="h3">Changes from v{va.version} to v{vb.version}</h2>
          {Object.keys(FIELD_LABEL).map((k) => {
            const x = show(k, va.content[k]); const y = show(k, vb.content[k]);
            if (x === y) return null;
            return (
              <div key={k} className="col gap6">
                <span className="label">{FIELD_LABEL[k]}</span>
                <pre className="prompt-pre diff">{lineDiff(x, y).map(([t, line], i) => <div key={i} className={t === '+' ? 'add' : t === '-' ? 'del' : ''}>{t === ' ' ? '  ' : `${t} `}{line}</div>)}</pre>
              </div>
            );
          })}
          {Object.keys(FIELD_LABEL).every((k) => show(k, va.content[k]) === show(k, vb.content[k])) && <p className="small muted">No differences.</p>}
        </section>
      ) : list && list.length > 1 && <p className="small faint">Tick two versions to compare them.</p>}
    </AdminShell>
  );
}

