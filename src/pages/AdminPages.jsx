// Admin pages other than Prompts (REQ-038, moved out of PromptAdmin.jsx): A6 taxonomy, A7 staff, A8 feedback inbox,
// A9 insights, A10 features (REQ-037), A11 audit log, A0 overview (REQ-039). All render inside AdminShell.
// Roles: Owner (admins/{uid}), Reviewer, Editor (staff/{uid}). Firestore rules enforce the same.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, DEMO_PEOPLE } from '../store.jsx';
import { Icon, Tag, Loading, Spinner, Toggle } from '../components/ui.jsx';
import { LOCAL_MODE } from '../firebase.js';
import { DEFAULT_TAXONOMY, usePromptData, loadPromptData } from '../data/promptStore.js';
import { FLAGS, audienceOf, remoteFlags, setRemoteFlags, useFlags } from '../data/flags.js';
import * as api from '../data/promptApi.js';
import { PROMPTS as BUNDLED, ROLES } from '../data/prompts/index.js';
import { PhaseChip, ago } from './Prompts.jsx';
import { AdminShell, useAction, friendly, Err, Ok, when, isReviewer, ROLE_LABEL } from './AdminShell.jsx';

// ---------- A6 taxonomy ----------
const move = (arr, i, d) => { const a = [...arr]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; };
export function Taxonomy() {
  const { role, me } = useStore();
  const [t, setT] = useState(null); const [counts, setCounts] = useState({}); const [dirty, setDirty] = useState(false);
  const [newCol, setNewCol] = useState('');
  const act = useAction();
  useEffect(() => {
    api.getTaxonomy().then((x) => setT(x ? { ...DEFAULT_TAXONOMY, ...x } : structuredClone(DEFAULT_TAXONOMY))).catch((e) => act.setErr(friendly(e)));
    api.listPrompts().then((l) => { const src = l.length ? l : BUNDLED; const c = {}; for (const p of src) if (p.status !== 'archived') c[p.cat] = (c[p.cat] || 0) + 1; setCounts(c); }).catch(() => {});
  }, []); // eslint-disable-line
  if (role !== 'owner') return <AdminShell title="Taxonomy"><p className="body muted">Only the Owner can change the taxonomy.</p></AdminShell>;
  if (!t) return <AdminShell title="Taxonomy"><Err>{act.err}</Err>{!act.err && <Loading />}</AdminShell>;
  const up = (k, v) => { setT((x) => ({ ...x, [k]: v })); setDirty(true); };
  const edit = (k, i, patch) => up(k, t[k].map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const save = async () => { const ok = await act.run(() => api.saveTaxonomy(t, me, 'Phases, categories and collections updated'), 'Saved. The library uses the new names and order now.'); if (ok !== undefined) { setDirty(false); loadPromptData(true); } };
  const nextCatId = String.fromCharCode(Math.max(...t.categories.map((c) => c.id.charCodeAt(0))) + 1);

  return (
    <AdminShell title="Taxonomy" sub="Phases, categories, subcategories and collections. Changes apply to the library when you save."
      actions={<button type="button" className="btn btn-primary" disabled={!dirty || act.busy} onClick={save}>{act.busy ? <Spinner label="Saving…" /> : 'Save changes'}</button>}>
      <Err>{act.err}</Err>{act.msg && <Ok>{act.msg}</Ok>}
      <section className="card p24">
        <h2 className="h3">Phases</h2>
        <p className="small muted">Rename or reorder. Phase colours belong to the design system, so phases can't be added or removed here.</p>
        {t.phases.map((p, i) => (
          <div key={p.id} className="tax-row">
            <PhaseChip phase={p.id} />
            <input className="input" aria-label={`${p.id} name`} value={p.name} onChange={(e) => edit('phases', i, { name: e.target.value })} />
            <input className="input grow" aria-label={`${p.id} description`} value={p.sub} onChange={(e) => edit('phases', i, { sub: e.target.value })} />
            <Order onUp={() => up('phases', move(t.phases, i, -1))} onDown={() => up('phases', move(t.phases, i, 1))} label={p.name} />
          </div>
        ))}
      </section>
      <section className="card p24">
        <h2 className="h3">Categories and subcategories</h2>
        <p className="small muted">A category that has prompts can't be deleted, only hidden. Hidden categories and their prompts disappear from the library.</p>
        {t.categories.map((c, i) => (
          <div key={c.id} className="col gap8 tax-block">
            <div className="tax-row">
              <span className="label mono">{c.id}</span>
              <input className="input grow" aria-label={`Category ${c.id} name`} value={c.name} onChange={(e) => edit('categories', i, { name: e.target.value })} />
              <span className="caption faint">{counts[c.id] || 0} prompts</span>
              <label className="row center gap6 small"><input type="checkbox" checked={!!c.hidden} onChange={(e) => edit('categories', i, { hidden: e.target.checked })} />Hidden</label>
              <Order onUp={() => up('categories', move(t.categories, i, -1))} onDown={() => up('categories', move(t.categories, i, 1))} label={c.name} />
              <button type="button" className="icon-btn" aria-label={`Delete category ${c.id}`} title={counts[c.id] ? 'Has prompts — hide it instead' : 'Delete'} disabled={!!counts[c.id]} onClick={() => up('categories', t.categories.filter((_, j) => j !== i))}><Icon name="X" size={16} /></button>
            </div>
            <div className="row wrap gap6 subs">
              {(c.subs || []).map((s, k) => (
                <span key={k} className="sub-pill"><input aria-label={`Subcategory ${k + 1} of ${c.id}`} value={s} onChange={(e) => edit('categories', i, { subs: c.subs.map((x, m) => (m === k ? e.target.value : x)) })} size={Math.max(8, s.length)} />
                  <button type="button" aria-label={`Remove ${s}`} onClick={() => edit('categories', i, { subs: c.subs.filter((_, m) => m !== k) })}><Icon name="X" size={12} /></button></span>
              ))}
              <button type="button" className="btn btn-ghost" onClick={() => edit('categories', i, { subs: [...(c.subs || []), 'New subcategory'] })}><Icon name="Plus" size={14} />Subcategory</button>
            </div>
          </div>
        ))}
        {nextCatId <= 'Z' && <button type="button" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => up('categories', [...t.categories, { id: nextCatId, name: 'New category', hidden: false, subs: [] }])}><Icon name="Plus" size={16} />Add category {nextCatId}</button>}
      </section>
      <section className="card p24">
        <h2 className="h3">Collections</h2>
        {t.collections.map((c, i) => (
          <div key={c.id} className="col gap8 tax-block">
            <div className="tax-row">
              <input className="input" aria-label="Collection name" value={c.name} onChange={(e) => edit('collections', i, { name: e.target.value })} />
              <input className="input grow" aria-label={`${c.name} description`} value={c.desc} onChange={(e) => edit('collections', i, { desc: e.target.value })} />
              <label className="row center gap6 small"><input type="checkbox" checked={!!c.hidden} onChange={(e) => edit('collections', i, { hidden: e.target.checked })} />Hidden</label>
              <Order onUp={() => up('collections', move(t.collections, i, -1))} onDown={() => up('collections', move(t.collections, i, 1))} label={c.name} />
              <button type="button" className="icon-btn" aria-label={`Delete collection ${c.name}`} onClick={() => up('collections', t.collections.filter((_, j) => j !== i))}><Icon name="X" size={16} /></button>
            </div>
            <div className="row center wrap gap6">
              <span className="caption faint">Roles:</span>
              {ROLES.map((r) => { const on = (c.roles || []).includes(r); return <button key={r} type="button" className={`check-chip small-chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => edit('collections', i, { roles: on ? c.roles.filter((x) => x !== r) : [...(c.roles || []), r] })}>{r}</button>; })}
              <span className="caption faint" style={{ marginLeft: 8 }}>Steps (in order):</span>
              <input className="input grow" aria-label={`${c.name} steps`} value={c.steps.join(', ')} onChange={(e) => edit('collections', i, { steps: e.target.value.split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean) })} />
            </div>
          </div>
        ))}
        <div className="row center gap8 wrap">
          <input className="input" style={{ maxWidth: 320 }} aria-label="New collection name" placeholder="New collection name" value={newCol} onChange={(e) => setNewCol(e.target.value)} />
          <button type="button" className="btn btn-secondary" disabled={!newCol.trim()} onClick={() => { const id = newCol.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); if (t.collections.some((c) => c.id === id)) { act.setErr('A collection with that name exists.'); return; } up('collections', [...t.collections, { id, name: newCol.trim(), desc: '', roles: [], steps: [], hidden: false }]); setNewCol(''); }}><Icon name="Plus" size={16} />Add collection</button>
        </div>
      </section>
    </AdminShell>
  );
}
const Order = ({ onUp, onDown, label }) => (
  <span className="row gap4"><button type="button" className="icon-btn" aria-label={`Move ${label} up`} onClick={onUp}><Icon name="ChevronUp" size={16} /></button><button type="button" className="icon-btn" aria-label={`Move ${label} down`} onClick={onDown}><Icon name="ChevronDown" size={16} /></button></span>
);

// ---------- A7 staff ----------
export function Staff() {
  const { role, me } = useStore();
  const [people, setPeople] = useState(null); const [q, setQ] = useState('');
  const act = useAction();
  const load = async () => {
    try {
      let [dir, staff] = await Promise.all([api.listDirectory(), api.listStaff()]);
      if (LOCAL_MODE && !dir.length) { await Promise.all(DEMO_PEOPLE.filter((p) => p.role !== 'owner').map((p) => api.touchDirectory({ uid: p.uid, displayName: p.name, email: p.email }))); dir = await api.listDirectory(); }
      const roles = Object.fromEntries(staff.map((s) => [s._id, s.role]));
      setPeople(dir.map((d) => ({ uid: d._id, name: d.name, email: d.email, lastSeen: d.lastSeen, role: roles[d._id] || '' })).sort((a, b) => (b.role ? 1 : 0) - (a.role ? 1 : 0) || (b.lastSeen || '').localeCompare(a.lastSeen || '')));
    } catch (e) { act.setErr(friendly(e)); setPeople([]); }
  };
  useEffect(() => { if (role === 'owner') load(); }, [role]); // eslint-disable-line
  if (role !== 'owner') return <AdminShell title="Staff"><p className="body muted">Only the Owner can manage staff.</p></AdminShell>;
  const assign = async (person, r) => { const ok = await act.run(() => api.setStaffRole(person, r || null, me), `${person.name || person.email} is now ${r ? ROLE_LABEL[r] : 'a learner (no role)'}.`); if (ok !== undefined) load(); };
  const rows = (people || []).filter((p) => p.uid !== me.uid && (!q || `${p.name} ${p.email}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <AdminShell title="Staff" sub="People appear here after they sign in with Google once. Editors write and submit prompts; Reviewers also publish, return and take down prompts. Roles apply at their next page load.">
      <Err>{act.err}</Err>{act.msg && <Ok>{act.msg}</Ok>}
      <label className="search pw-search"><Icon name="Search" size={18} color="#94A3B8" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" aria-label="Search people" /></label>
      {people === null ? <Loading /> : (
        <section className="card p0">
          <div className="list-row admin-row"><div className="col grow" style={{ gap: 2 }}><span className="label">{me.name}</span><span className="caption faint">{me.email}</span></div><Tag tone="primary">Owner</Tag></div>
          {rows.map((p) => (
            <div key={p.uid} className="list-row admin-row">
              <div className="col grow" style={{ gap: 2 }}><span className="label">{p.name || p.email}</span><span className="caption faint">{p.email}{p.lastSeen ? ` · last seen ${ago(p.lastSeen)}` : ''}</span></div>
              <select className="input pw-select" aria-label={`Role for ${p.name || p.email}`} value={p.role} disabled={act.busy} onChange={(e) => assign(p, e.target.value)}>
                <option value="">Learner (no role)</option><option value="editor">Editor</option><option value="reviewer">Reviewer</option>
              </select>
            </div>
          ))}
          {!rows.length && <p className="body muted" style={{ padding: 24 }}>Nobody else has signed in yet.</p>}
        </section>
      )}
    </AdminShell>
  );
}

// ---------- A8 feedback inbox ----------
export function FeedbackInbox() {
  const { role } = useStore();
  const [list, setList] = useState(null); const [tab, setTab] = useState('new'); const [err, setErr] = useState('');
  const load = () => api.listFeedback().then(setList).catch((e) => { setErr(friendly(e)); setList([]); });
  useEffect(() => { if (isReviewer(role)) load(); }, [role]);
  if (!isReviewer(role)) return <AdminShell title="Feedback"><p className="body muted">Only Reviewers and the Owner can read feedback.</p></AdminShell>;
  const rows = (list || []).filter((f) => (tab === 'new' ? f.status !== 'done' : f.status === 'done'));
  const mark = async (f, status) => { try { await api.setFeedbackStatus(f._id, status); load(); } catch (e) { setErr(friendly(e)); } };
  return (
    <AdminShell title="Feedback inbox" sub="Private improvement suggestions from learners. Only staff see these.">
      <Err>{err}</Err>
      <div className="seg" role="group" aria-label="Filter">
        <button type="button" className={tab === 'new' ? 'on' : ''} aria-pressed={tab === 'new'} onClick={() => setTab('new')}>New · {(list || []).filter((f) => f.status !== 'done').length}</button>
        <button type="button" className={tab === 'done' ? 'on' : ''} aria-pressed={tab === 'done'} onClick={() => setTab('done')}>Done</button>
      </div>
      {list === null ? <Loading /> : (
        <section className="card p0">
          {rows.map((f) => (
            <div key={f._id} className="list-row admin-row" style={{ alignItems: 'flex-start' }}>
              <div className="col grow" style={{ gap: 4 }}>
                <span className="caption faint"><Link to={`/admin/prompts/${f.promptId}/edit`} className="c-primary">{f.promptId} · {f.title}</Link> · {f.name} · {ago(f.at)}</span>
                <p className="small" style={{ whiteSpace: 'pre-wrap' }}>{f.text}</p>
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => mark(f, f.status === 'done' ? 'new' : 'done')}>{f.status === 'done' ? 'Reopen' : 'Mark done'}</button>
            </div>
          ))}
          {!rows.length && <p className="body muted" style={{ padding: 24 }}>{tab === 'new' ? 'No new feedback.' : 'Nothing marked done yet.'}</p>}
        </section>
      )}
    </AdminShell>
  );
}

// ---------- A10 features (REQ-037, design SCR-5) ----------
// Who sees each feature. Stored as settings/site.flags.<key> = { audience, beta }: the switch "Released to everyone"
// sets audience 'everyone'; off means 'beta' when the feature has beta testers, else 'owner'.
const FEATURE_FILTERS = [['all', 'All'], ['released', 'Released'], ['unreleased', 'Unreleased'], ['beta', 'Beta']];
export function Features() {
  const { role, me } = useStore();
  useFlags();
  const [dir, setDir] = useState([]); const [q, setQ] = useState(''); const [filter, setFilter] = useState('all');
  const act = useAction();
  useEffect(() => { if (role === 'owner') api.listDirectory().then(setDir).catch(() => {}); }, [role]);
  if (role !== 'owner') return <AdminShell title="Features"><p className="body muted">Only the Owner can change features.</p></AdminShell>;

  const betaOf = (key) => (remoteFlags()[key] || {}).beta || [];
  const stateOf = (key) => { const a = audienceOf(key); return a === 'everyone' ? 'released' : a === 'beta' && betaOf(key).length ? 'beta' : 'owner'; };
  // `what` is the audit-log line; by default "<feature>: <audience>".
  const save = (key, patch, what) => act.run(async () => {
    const next = { ...remoteFlags(), [key]: { audience: audienceOf(key), beta: betaOf(key), ...patch } };
    await api.saveFlags(next, me, what || `${FLAGS[key].name}: ${next[key].audience}`); setRemoteFlags(next);
  }, 'Feature setting saved.');
  const setReleased = (key, on) => save(key, { audience: on ? 'everyone' : betaOf(key).length ? 'beta' : 'owner' });
  const setBeta = (key, list, who, added) => {
    const audience = audienceOf(key) === 'everyone' ? 'everyone' : list.length ? 'beta' : 'owner';
    return save(key, { beta: list, audience }, `${FLAGS[key].name} beta: ${added ? 'added' : 'removed'} ${who} (${audience})`);
  };

  const keys = Object.keys(FLAGS);
  const count = (f) => keys.filter((k) => f === 'all' || (f === 'unreleased' ? stateOf(k) !== 'released' : stateOf(k) === f)).length;
  const ql = q.trim().toLowerCase();
  const shown = keys.filter((k) => (filter === 'all' || (filter === 'unreleased' ? stateOf(k) !== 'released' : stateOf(k) === filter))
    && (!ql || `${k} ${FLAGS[k].name} ${FLAGS[k].where}`.toLowerCase().includes(ql)));
  const STATUS = { released: ['Everyone', 'success'], beta: [null, 'accent'], owner: ['Owner only', 'ink'] };

  return (
    <AdminShell title="Features" sub="Who sees each feature. Roll out to beta testers first, then to everyone.">
      <p className="small muted">Turn a feature on for everyone, or keep it off and pick beta testers. Owner and staff always see every feature. Every change is written to the audit log.</p>
      <Err>{act.err}</Err>{act.msg && <Ok>{act.msg}</Ok>}
      <div className="row center wrap gap8">
        <div className="search" style={{ flex: '1 1 240px', maxWidth: 'none', background: '#fff', border: '1px solid var(--border)' }}><Icon name="Search" size={18} color="#94A3B8" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search features" aria-label="Search features" /></div>
        <div className="seg" role="group" aria-label="Filter features" style={{ flexWrap: 'wrap' }}>
          {FEATURE_FILTERS.map(([k, l]) => <button key={k} type="button" className={filter === k ? 'on' : ''} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l} ({count(k)})</button>)}
        </div>
      </div>
      {!shown.length && <p className="body muted">No feature matches.</p>}
      {shown.map((key) => {
        const f = FLAGS[key]; const st = stateOf(key); const beta = betaOf(key); const released = st === 'released';
        const [label, tone] = STATUS[st];
        return (
          <section key={key} className="card flag-card" aria-label={f.name}>
            <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
              <span className="bg-primary-soft c-primary" style={{ width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={f.icon || 'Flag'} size={20} /></span>
              <div className="col grow" style={{ gap: 2, minWidth: 0 }}>
                <h2 className="label">{f.name}</h2>
                <span className="small muted">{f.where}</span>
                <span className="caption faint">{f.since ? `Since ${f.since}` : 'Live before flags'}</span>
              </div>
              <Tag tone={tone}>{label || `Beta · ${beta.length} ${beta.length === 1 ? 'person' : 'people'}`}</Tag>
            </div>
            <div className="row center wrap gap10">
              <span style={{ opacity: act.busy ? 0.5 : 1 }}><Toggle on={released} disabled={act.busy} label={`Released to everyone: ${f.name}`} onChange={(v) => setReleased(key, v)} /></span>
              <span className="label">Released to everyone</span>
              {!released && <span className="caption faint">Off: Owner and staff see it{beta.length ? ', plus the beta testers below' : ''}. Preview link: <code>?preview={key}</code></span>}
            </div>
            {!released && (
              <div className="col gap6"><span className="caption muted">Beta testers · {beta.length}</span>
                {dir.filter((d) => d._id !== me.uid).map((d) => { const on = beta.includes(d._id); return (
                  <label key={d._id} className="row center gap8 small"><input type="checkbox" checked={on} disabled={act.busy} onChange={() => setBeta(key, on ? beta.filter((x) => x !== d._id) : [...beta, d._id], d.email || d.name, !on)} />{d.name || d.email} <span className="faint">{d.email}</span></label>
                ); })}
                {!dir.length && <span className="caption faint">People appear here after they sign in once.</span>}
              </div>
            )}
          </section>
        );
      })}
    </AdminShell>
  );
}

// ---------- A9 insights (usage) ----------
export function Insights() {
  const { role, me } = useStore();
  const D = usePromptData();
  const [stats, setStats] = useState(null); const [month, setMonth] = useState([]);
  const [sort, setSort] = useState('copies');
  const act = useAction();
  useEffect(() => {
    if (role !== 'owner') return;
    api.listStats().then(setStats).catch((e) => { act.setErr(friendly(e)); setStats([]); });
    api.listMonth().then(setMonth).catch(() => {});
  }, [role]); // eslint-disable-line
  if (role !== 'owner') return <AdminShell title="Insights"><p className="body muted">Only the Owner can see insights.</p></AdminShell>;

  const title = (id) => (D.byId[id] ? D.byId[id].title : id);
  const rows = (stats || []).map((s) => ({ id: s._id, copies: s.copies || 0, count: s.ratingCount || 0, avg: s.ratingCount ? s.ratingSum / s.ratingCount : 0 }));
  const top = [...month].sort((a, b) => b.copies - a.copies).slice(0, 10);
  const totalCopies = rows.reduce((n, r) => n + r.copies, 0); const monthCopies = month.reduce((n, r) => n + (r.copies || 0), 0);
  const ratings = rows.reduce((n, r) => n + r.count, 0); const avg = ratings ? rows.reduce((n, r) => n + r.avg * r.count, 0) / ratings : 0;
  const sorted = [...rows].sort((a, b) => (sort === 'rating' ? b.avg - a.avg || b.count - a.count : b.copies - a.copies));

  return (
    <AdminShell title="Insights" sub="How learners use the prompts. Counts only — no names or emails.">
      <Err>{act.err}</Err>{act.msg && <Ok>{act.msg}</Ok>}
      <div className="grid g4">
        {[['Copies, all time', totalCopies], ['Copies this month', monthCopies], ['Ratings', ratings], ['Average rating', ratings ? `★ ${avg.toFixed(1)}` : '—']].map(([l, v]) => (
          <div key={l} className="card"><span className="caption faint">{l}</span><span className="h1">{v}</span></div>
        ))}
      </div>
      <section className="card p24">
          <h2 className="h3">Top 10 this month</h2>
          {!top.length && <p className="small faint">No copies yet this month.</p>}
          <ol className="top-list">{top.map((m) => <li key={m.promptId}><span className="grow">{title(m.promptId)}</span><b>{m.copies}</b></li>)}</ol>
      </section>
      <section className="card p0">
        <div className="row center list-head"><h2 className="h3 grow">All prompts</h2>
          <div className="seg" role="group" aria-label="Sort"><button type="button" className={sort === 'copies' ? 'on' : ''} onClick={() => setSort('copies')}>Most copied</button><button type="button" className={sort === 'rating' ? 'on' : ''} onClick={() => setSort('rating')}>Best rated</button></div></div>
        {stats === null ? <Loading /> : sorted.map((r) => (
          <div key={r.id} className="list-row admin-row"><span className="caption faint mono" style={{ width: 52 }}>{r.id}</span><span className="small grow">{title(r.id)}</span><span className="small" style={{ width: 90 }}>{r.copies} copies</span><span className="small c-accent" style={{ width: 110 }}>{r.count ? `★ ${r.avg.toFixed(1)} (${r.count})` : '—'}</span></div>
        ))}
        {stats && !sorted.length && <p className="body muted" style={{ padding: 24 }}>No usage yet.</p>}
      </section>
    </AdminShell>
  );
}

// ---------- A11 audit log (its own page since REQ-038) ----------
export function AuditLog() {
  const { role } = useStore();
  const [logs, setLogs] = useState(null);
  const act = useAction();
  useEffect(() => { if (role === 'owner') api.listLogs().then(setLogs).catch((e) => { act.setErr(friendly(e)); setLogs([]); }); }, [role]); // eslint-disable-line
  if (role !== 'owner') return <AdminShell title="Audit log"><p className="body muted">Only the Owner can see the audit log.</p></AdminShell>;
  return (
    <AdminShell title="Audit log" sub="The latest 200 admin actions: who did what, and when.">
      <Err>{act.err}</Err>
      <section className="card p0">
                {logs === null ? <Loading /> : logs.map((l) => (
          <div key={l._id} className="list-row admin-row">
            <span className="caption faint" style={{ width: 140 }}>{when(l.at)}</span>
            <span className="small" style={{ width: 150 }}>{l.name}</span>
            <Tag tone="ink">{l.action}</Tag>
            <span className="small grow">{l.promptId ? `${l.promptId} · ${l.title}` : ''}{l.detail ? <span className="faint"> {l.promptId ? '— ' : ''}{l.detail}</span> : null}</span>
          </div>
        ))}
        {logs && !logs.length && <p className="body muted" style={{ padding: 24 }}>No admin actions yet.</p>}
      </section>
    </AdminShell>
  );
}

// ---------- A0 overview (REQ-039, design SCR-4) ----------
// What needs attention, as count cards that link to their page. Each role only gets cards for pages it can open
// (the same rule as the admin side menu); a card with nothing to do is left out.
export function Overview() {
  const { role, me } = useStore();
  useFlags();
  const [prompts, setPrompts] = useState(null); const [feedback, setFeedback] = useState(null);
  const act = useAction();
  useEffect(() => {
    if (!role) return;
    api.listPrompts().then(setPrompts).catch((e) => { act.setErr(friendly(e)); setPrompts([]); });
    if (isReviewer(role)) api.listFeedback().then(setFeedback).catch((e) => { act.setErr(friendly(e)); setFeedback([]); }); else setFeedback([]);
  }, [role]); // eslint-disable-line
  const loading = prompts === null || feedback === null;
  const mine = (prompts || []).filter((p) => p.status === 'draft' && p.createdBy && me && p.createdBy.uid === me.uid);
  const cards = [
    ['Prompts waiting for review', (prompts || []).filter((p) => p.status === 'review').length, 'ListChecks', 'primary', 'Open review queue', '/admin/review', isReviewer(role)],
    ['New feedback', (feedback || []).filter((f) => f.status !== 'done').length, 'MessageSquare', 'po', 'Open feedback', '/admin/feedback', isReviewer(role)],
    ['Features not released to everyone', Object.keys(FLAGS).filter((k) => audienceOf(k) !== 'everyone').length, 'Send', 'success', 'Open features', '/admin/features', role === 'owner'],
    ['Your drafts', mine.length, 'FileText', 'accent', 'Open prompts', '/admin/prompts', role === 'editor'],
    ['Sent back for changes', mine.filter((p) => p.reviewNote).length, 'ArrowLeft', 'danger', 'Open prompts', '/admin/prompts', role === 'editor'],
  ].filter((c) => c[6] && c[1] > 0);
  const quick = [['New prompt', '/admin/prompts/new', true], ['Review queue', '/admin/review', isReviewer(role)], ['Feedback', '/admin/feedback', isReviewer(role)],
    ['Knowledge base', '/admin/knowledge', role === 'owner'], ['Staff', '/admin/staff', role === 'owner'], ['Insights', '/admin/insights', role === 'owner']].filter((q) => q[2]);
  return (
    <AdminShell title="Admin" sub="What needs your attention today.">
      <Err>{act.err}</Err>
      {loading ? <Loading label="Checking what needs attention…" /> : !cards.length ? (
        <section className="card p28" style={{ alignItems: 'center', textAlign: 'center' }}>
          <Icon name="Check" size={28} color="#16A34A" /><h2 className="h3">Nothing to do right now</h2>
          <p className="small muted">{role === 'editor' ? 'No drafts waiting and nothing sent back to you.' : `No prompts waiting and no new feedback${role === 'owner' ? ', and every feature is released' : ''}.`}</p>
        </section>
      ) : (
        <div className="grid g3">
          {cards.map(([label, n, icon, tone, btn, to]) => (
            <Link key={label} to={to} className="card hover" aria-label={`${label}: ${n}. ${btn}`}>
              <div className="row center gap10"><span className={`bg-${tone}-soft c-${tone}`} style={{ width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={20} /></span><span className="h1">{n}</span></div>
              <span className="label">{label}</span>
              <span className="small c-primary row center gap6">{btn}<Icon name="ChevronRight" size={16} /></span>
            </Link>
          ))}
        </div>
      )}
      <section className="card p24"><h2 className="h3">Quick links</h2>
        <div className="row wrap gap8">{quick.map(([l, to]) => <Link key={to} to={to} className="btn btn-secondary">{l}</Link>)}</div>
      </section>
    </AdminShell>
  );
}
