import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Tag, IconBox, PageHead, GoogleButton } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { enabled, signInWithGoogle, listJobs, saveJob, deleteJob, listSearches, clearSearches, publishKnowledge, kbInfo, saveTerm, deleteTerm } from '../firebase.js';
import { BUNDLED, KB_SOURCE } from '../knowledge.js';
import { CATEGORIES, CAT_BY_ID, TERMS, TERM_BY_ID } from '../data/terms.js';

const slug = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------- shared: sign-in prompt ----------
export function SignInCard({ why }) {
  const [err, setErr] = useState('');
  return (
    <div className="card p28" style={{ alignItems: 'center', textAlign: 'center', gap: 14 }}>
      <IconBox name="Lock" tone="primary" size={64} iconSize={30} />
      <span className="h2">Sign in to continue</span>
      <span className="body muted" style={{ maxWidth: 520 }}>{why}</span>
      {enabled ? <GoogleButton primary /> : <span className="soft bg-accent-soft small">Google sign-in is not switched on for this site yet. The site owner needs to add the Firebase settings.</span>}
    </div>
  );
}
export { GoogleG } from '../components/ui.jsx';

// ---------- My Job Search ----------
export const STATUSES = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];
const STATUS_TONE = { Wishlist: 'ink', Applied: 'primary', Interviewing: 'accent', Offer: 'success', Rejected: 'danger', Withdrawn: 'ink' };
const FIELDS = [
  ['company', 'Company', 'Company'], ['position', 'Position', 'Position'], ['companyDomain', 'Company domain', 'Company Domain'],
  ['roleDomain', 'Role domain / what they do', 'Role Domain'], ['markets', 'Markets / countries', 'Markets / Countries'],
  ['size', 'Company size (headcount)', 'Company Size (Headcount)'], ['jdLink', 'Job description link', 'JD Link'], ['source', 'Source', 'Source'],
  ['dateApplied', 'Date applied', 'Date Applied'], ['status', 'Status', 'Status'], ['nextStep', 'Next step & date', 'Next Step & Date'],
  ['contact', 'Contact', 'Contact'], ['followUp', 'Follow-up date', 'Follow-up Date'], ['notes', 'Notes', 'Notes'], ['questions', 'Questions to ask them', 'Questions to Ask Them'],
];
const emptyJob = () => Object.fromEntries(FIELDS.map(([k]) => [k, k === 'status' ? 'Wishlist' : '']));

function parseCSV(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
export function jobsFromFile(name, text) {
  let list;
  if (name.toLowerCase().endsWith('.json')) { const data = JSON.parse(text); list = Array.isArray(data) ? data : data.jobs || []; }
  else {
    const rows = parseCSV(text);
    const h = rows.findIndex((r) => r.map((x) => x.trim()).includes('Company') && r.map((x) => x.trim()).includes('Position'));
    if (h < 0) throw new Error('Could not find the header row (Company, Position…). Download the Pipeline tab as CSV.');
    const head = rows[h].map((x) => x.trim());
    list = rows.slice(h + 1).map((r) => Object.fromEntries(FIELDS.map(([k, , col]) => [k, (r[head.indexOf(col)] || '').trim()])));
  }
  return list.map((j) => ({ ...emptyJob(), ...j, company: (j.company || '').trim(), position: (j.position || '').trim() }))
    .filter((j) => j.company)
    .map((j) => ({ ...j, status: STATUSES.find((x) => x.toLowerCase() === (j.status || '').toLowerCase()) || (j.dateApplied ? 'Applied' : 'Wishlist'), id: j.id || `${slug(j.company)}-${slug(j.position) || 'role'}` }));
}

export function Jobs() {
  const { user } = useStore();
  const [jobs, setJobs] = useState(null); const [edit, setEdit] = useState(null); const [f, setF] = useState('All');
  const [msg, setMsg] = useState(''); const [err, setErr] = useState(''); const [confirmDel, setConfirmDel] = useState(null);
  const refresh = () => listJobs(user.uid).then((l) => setJobs(l.sort((a, b) => (b.dateApplied || '').localeCompare(a.dateApplied || '')))).catch(() => setErr('Could not load your jobs. Check your connection.'));
  useEffect(() => { if (user) refresh(); }, [user]); // eslint-disable-line
  if (!user) return <><PageHead title="My Job Search" sub="A private tracker for the BA / PO jobs you are applying for." /><SignInCard why="Your job search is private. Sign in with Google to see and update it — only you can read it." /></>;
  const save = async (e) => {
    e.preventDefault();
    if (!edit.company.trim()) { setErr('Company is required.'); return; }
    const job = { ...edit, id: edit.id || `${slug(edit.company)}-${slug(edit.position) || 'role'}-${Date.now().toString(36)}` };
    try { await saveJob(user.uid, job); setEdit(null); setErr(''); setMsg('Saved.'); refresh(); } catch (x) { setErr('Could not save. Please try again.'); }
  };
  const importFile = async (file) => {
    setErr(''); setMsg('');
    try {
      const list = jobsFromFile(file.name, await file.text());
      if (!list.length) { setErr('No jobs found in that file.'); return; }
      for (const j of list) await saveJob(user.uid, j);
      setMsg(`Imported ${list.length} job${list.length > 1 ? 's' : ''}.`); refresh();
    } catch (x) { setErr(x.message || 'Could not read that file.'); }
  };
  const shown = (jobs || []).filter((j) => f === 'All' || j.status === f);
  return (
    <>
      <PageHead title="My Job Search" sub="Private to your Google account. Track every BA / PO application in one place.">
        <label className="btn btn-secondary"><Icon name="Upload" size={16} />Import CSV / JSON<input type="file" accept=".csv,.json" hidden onChange={(e) => e.target.files[0] && importFile(e.target.files[0])} /></label>
        <button className="btn btn-primary" onClick={() => { setEdit(emptyJob()); setErr(''); }}>Add a job</button>
      </PageHead>
      {msg && <div className="soft bg-success-soft small c-success">{msg}</div>}
      {err && !edit && <div className="soft bg-danger-soft small c-danger">{err}</div>}
      <div className="grid g4">
        {[['All', 'Briefcase', 'primary'], ['Applied', 'Send', 'primary'], ['Interviewing', 'MessageSquare', 'accent'], ['Offer', 'Award', 'success']].map(([k, i, t]) => (
          <div key={k} className="card"><IconBox name={i} tone={t} /><span className="h1">{(jobs || []).filter((j) => k === 'All' || j.status === k).length}</span><span className="small muted">{k === 'All' ? 'Jobs tracked' : k}</span></div>))}
      </div>
      {edit && (
        <form className="card p24" onSubmit={save} style={{ gap: 16 }}>
          <div className="row center"><span className="h3 grow">{edit.id ? `Edit · ${edit.company}` : 'New job'}</span><button type="button" className="icon-btn" aria-label="Close" onClick={() => setEdit(null)}><Icon name="X" size={18} /></button></div>
          <div className="grid g2">
            {FIELDS.map(([k, label]) => (
              <label key={k} className="col gap6" style={{ gridColumn: ['notes', 'questions', 'roleDomain'].includes(k) ? '1 / -1' : undefined }}>
                <span className="label">{label}{k === 'company' && <span className="c-danger"> *</span>}</span>
                {k === 'status' ? <select className="input" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
                  : ['notes', 'questions', 'roleDomain'].includes(k) ? <textarea className="input" style={{ height: 80, padding: 12 }} value={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />
                  : <input className="input" type={['dateApplied', 'followUp'].includes(k) ? 'date' : 'text'} value={edit[k]} onChange={(e) => { setEdit({ ...edit, [k]: e.target.value }); setErr(''); }} />}
              </label>))}
          </div>
          {err && <span className="caption c-danger">{err}</span>}
          <div className="row" style={{ justifyContent: 'flex-end', gap: 10 }}><button type="button" className="btn btn-secondary" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary">Save job</button></div>
        </form>
      )}
      <div className="row wrap gap8">{['All', ...STATUSES].map((x) => <button key={x} className={`chip ${f === x ? 'on' : ''}`} onClick={() => setF(x)}>{x}</button>)}</div>
      {jobs === null ? <p className="muted">Loading…</p> : shown.length === 0 ? (
        <div className="card p28" style={{ alignItems: 'center', textAlign: 'center' }}><Icon name="Briefcase" size={32} color="#94A3B8" /><span className="h3">No jobs here yet</span><span className="small muted">Add a job, or import the Pipeline tab of your Job Search Tracker (File → Download → CSV).</span></div>
      ) : (
        <div className="grid g2">
          {shown.map((j) => (
            <div key={j.id} className="card">
              <div className="row center"><div className="col grow" style={{ gap: 2 }}><span className="h3">{j.company}</span><span className="small muted">{j.position || 'Role not set'}</span></div><Tag tone={STATUS_TONE[j.status] || 'ink'}>{j.status}</Tag></div>
              <div className="row wrap gap6">{j.companyDomain && <Tag tone="po">{j.companyDomain}</Tag>}{j.markets && <Tag tone="ink">{j.markets}</Tag>}{j.size && <Tag tone="ink">{j.size} people</Tag>}{j.source && <Tag tone="ink">via {j.source}</Tag>}</div>
              {j.roleDomain && <p className="small muted">{j.roleDomain.length > 180 ? j.roleDomain.slice(0, 178) + '…' : j.roleDomain}</p>}
              {j.notes && <p className="small" style={{ wordBreak: 'break-word' }}>{j.notes.split(/(https?:\/\/\S+)/).map((part, i) => (/^https?:\/\//.test(part)
                ? <a key={i} href={part} target="_blank" rel="noreferrer" className="c-primary label">{part.includes('claude.ai/artifact') ? 'Open job research' : 'Link'}</a> : <span key={i} className="muted">{part}</span>))}</p>}
              {j.questions && <div className="soft bg-primary-soft small"><b>Ask them:</b> {j.questions}</div>}
              <div className="row center wrap gap10 caption faint">{j.dateApplied && <span>Applied {j.dateApplied}</span>}{j.nextStep && <span>· Next: {j.nextStep}</span>}{j.followUp && <span>· Follow up {j.followUp}</span>}</div>
              <div className="row center gap8">
                {j.jdLink && <a className="label c-primary row center gap6" href={j.jdLink} target="_blank" rel="noreferrer">Job description <Icon name="ArrowRight" size={14} /></a>}
                <div className="grow" />
                <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => { setEdit({ ...emptyJob(), ...j }); setErr(''); window.scrollTo(0, 0); }}>Edit</button>
                {confirmDel === j.id ? <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={async () => { await deleteJob(user.uid, j.id); setConfirmDel(null); refresh(); }}>Confirm delete</button>
                  : <button className="btn btn-ghost" style={{ padding: '6px 10px', color: 'var(--danger)' }} onClick={() => setConfirmDel(j.id)}>Delete</button>}
              </div>
            </div>))}
        </div>
      )}
    </>
  );
}

// ---------- My Library: search history ----------
export function Library() {
  const { s, user } = useStore();
  const [items, setItems] = useState(null); const [confirm, setConfirm] = useState(false);
  useEffect(() => { if (user) listSearches(user.uid, 100).then(setItems).catch(() => setItems([])); }, [user]);
  if (!user) return <><PageHead title="My Library" sub="Everything you have searched and saved." /><SignInCard why="Sign in with Google to keep a private history of the terms and skills you search for, on any device." /></>;
  const groups = {};
  for (const x of items || []) { const d = x.at.slice(0, 10); (groups[d] = groups[d] || []).push(x); }
  const counts = {}; for (const x of items || []) if (x.result) counts[x.result.label] = (counts[x.result.label] || 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  return (
    <>
      <PageHead title="My Library" sub="Your private search history and saved knowledge, synced to your Google account." />
      <div className="row stack-sm gap24">
        <div className="card p0 grow">
          <div className="row center" style={{ padding: '16px 24px' }}><span className="h3 grow">Search history</span>
            {items && items.length > 0 && (confirm ? <button className="btn btn-danger" onClick={async () => { await clearSearches(user.uid); setItems([]); setConfirm(false); }}>Yes, clear all</button> : <button className="btn btn-ghost" onClick={() => setConfirm(true)}>Clear history</button>)}</div>
          {items === null ? <p className="muted" style={{ padding: 24 }}>Loading…</p> : !items.length ? <p className="small muted" style={{ padding: '0 24px 24px' }}>Nothing yet. Use the search box at the top — the terms and skills you open will appear here.</p>
            : Object.entries(groups).map(([d, list]) => (
              <div key={d}><div className="overline faint" style={{ padding: '10px 24px', background: 'var(--bg)' }}>{new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                {list.map((x) => (
                  <div key={x.id} className="list-row" style={{ padding: '12px 24px' }}>
                    <Icon name="Search" size={16} color="#94A3B8" /><span className="small faint" style={{ width: 140 }}>“{x.q}”</span>
                    {x.result ? <Link to={x.result.to} className="label c-primary grow">{x.result.label}</Link> : <span className="small muted grow">No result opened</span>}
                    <span className="caption faint">{x.result?.meta}</span><span className="caption faint">{x.at.slice(11, 16)}</span>
                  </div>))}
              </div>))}
        </div>
        <div className="col" style={{ width: 340, maxWidth: '100%', gap: 16 }}>
          <div className="card"><span className="label">Most looked-up</span>{top.length ? <div className="row wrap gap6">{top.map(([l, n]) => <Tag key={l} tone="po">{l} · {n}</Tag>)}</div> : <span className="small muted">Appears after a few searches.</span>}</div>
          <Link to="/saved" className="card hover row center" style={{ flexDirection: 'row' }}><IconBox name="Bookmark" /><div className="col grow" style={{ gap: 0 }}><span className="label">Saved terms</span><span className="caption faint">{s.saved.length} terms</span></div><Icon name="ChevronRight" color="#94A3B8" /></Link>
          <Link to="/jobs" className="card hover row center" style={{ flexDirection: 'row' }}><IconBox name="Briefcase" tone="accent" /><div className="col grow" style={{ gap: 0 }}><span className="label">My Job Search</span><span className="caption faint">Private tracker</span></div><Icon name="ChevronRight" color="#94A3B8" /></Link>
        </div>
      </div>
    </>
  );
}

// ---------- Knowledge base admin ----------
const emptyTerm = () => ({ id: '', cat: 'it', sub: '', level: 1, term: '', full: '', def: '', example: '', vi: '' });
export function Admin() {
  const { user, admin } = useStore();
  const [info, setInfo] = useState(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const [confirmPub, setConfirmPub] = useState(false); const [q, setQ] = useState(''); const [edit, setEdit] = useState(null); const [, force] = useState(0);
  useEffect(() => { if (admin) kbInfo().then(setInfo).catch(() => {}); }, [admin]);
  const list = useMemo(() => TERMS.filter((t) => (t.term + ' ' + t.def).toLowerCase().includes(q.toLowerCase())), [q, msg]); // eslint-disable-line
  if (!user) return <><PageHead title="Knowledge base admin" /><SignInCard why="Sign in with the admin Google account to manage the knowledge base." /></>;
  if (!admin) return (
    <><PageHead title="Knowledge base admin" />
      <div className="card p24"><span className="h3">You are not an admin yet</span>
        <p className="body muted">To make this account an admin, open Firebase console → Firestore Database → Start collection <b>admins</b>, and add a document whose ID is your user ID below (no fields needed). Then reload this page.</p>
        <div className="row center gap10"><code className="soft bg-bg" style={{ fontSize: 14 }}>{user.uid}</code><button className="btn btn-secondary" onClick={() => navigator.clipboard?.writeText(user.uid).catch(() => {})}>Copy ID</button></div></div></>
  );
  const publish = async () => {
    setBusy(true); setErr(''); setMsg('');
    try { const n = await publishKnowledge(BUNDLED); setMsg(`Published ${n} knowledge items to Firestore. Reload the site to read from the cloud.`); setInfo(await kbInfo()); } catch (x) { setErr(`Publish failed: ${x.message}`); }
    setBusy(false); setConfirmPub(false);
  };
  const saveT = async (e) => {
    e.preventDefault();
    if (!edit.term.trim() || !edit.def.trim()) { setErr('Term and definition are required.'); return; }
    const t = { ...edit, level: Number(edit.level), id: edit.id || `${edit.cat}-${slug(edit.term)}` };
    if (!edit.id && TERM_BY_ID[t.id]) { setErr('A term with this name already exists in that category.'); return; }
    try {
      const idx = TERMS.findIndex((x) => x.id === t.id);
      await saveTerm(t, idx < 0 ? TERMS.length : idx);
      if (idx < 0) TERMS.push(t); else TERMS[idx] = t; TERM_BY_ID[t.id] = t;
      setEdit(null); setErr(''); setMsg(`Saved “${t.term}”.`); force((x) => x + 1);
    } catch (x) { setErr(`Save failed: ${x.message}`); }
  };
  const del = async (t) => {
    try { await deleteTerm(t.id); TERMS.splice(TERMS.findIndex((x) => x.id === t.id), 1); delete TERM_BY_ID[t.id]; setEdit(null); setMsg(`Deleted “${t.term}”.`); } catch (x) { setErr(`Delete failed: ${x.message}`); }
  };
  return (
    <>
      <PageHead title="Knowledge base admin" sub="Manage the public knowledge base stored in Firestore. Learners always read the latest published content." />
      {msg && <div className="soft bg-success-soft small c-success">{msg}</div>}
      {err && !edit && <div className="soft bg-danger-soft small c-danger">{err}</div>}
      <div className="grid g4">
        {[['Database', 'primary', KB_SOURCE.value === 'cloud' ? 'Cloud' : 'Bundled', 'Content source now'], ['BookOpen', 'po', TERMS.length, 'Glossary terms'], ['Route', 'accent', BUNDLED.skills.length, 'Skills'], ['Clock', 'success', info?.publishedAt ? info.publishedAt.toDate().toLocaleDateString() : 'Never', 'Last full publish']].map(([i, t, n, l]) => (
          <div key={l} className="card"><IconBox name={i} tone={t} /><span className="h2">{n}</span><span className="small muted">{l}</span></div>))}
      </div>
      <div className="card p24 row center stack-sm" style={{ flexDirection: 'row' }}>
        <div className="col grow gap4"><span className="h3">Publish the full knowledge base</span><span className="small muted">Copies all bundled terms, skills, domains, challenges and Story Mode chapters into Firestore. Run it once at the start, and again after content changes in the code. It overwrites items with the same ID.</span></div>
        {confirmPub ? <><button className="btn btn-secondary" onClick={() => setConfirmPub(false)}>Cancel</button><button className="btn btn-primary" disabled={busy} onClick={publish}>{busy ? 'Publishing…' : 'Yes, publish'}</button></> : <button className="btn btn-primary" onClick={() => setConfirmPub(true)}>Publish to Firestore</button>}
      </div>
      {edit && (
        <form className="card p24" onSubmit={saveT} style={{ gap: 14 }}>
          <div className="row center"><span className="h3 grow">{edit.id ? `Edit · ${edit.term}` : 'New term'}</span><button type="button" className="icon-btn" onClick={() => setEdit(null)} aria-label="Close"><Icon name="X" size={18} /></button></div>
          <div className="grid g3">
            <label className="col gap6"><span className="label">Category</span><select className="input" disabled={!!edit.id} value={edit.cat} onChange={(e) => setEdit({ ...edit, cat: e.target.value })}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label className="col gap6"><span className="label">Sub-category</span><input className="input" value={edit.sub} onChange={(e) => setEdit({ ...edit, sub: e.target.value })} /></label>
            <label className="col gap6"><span className="label">Level</span><select className="input" value={edit.level} onChange={(e) => setEdit({ ...edit, level: e.target.value })}><option value={1}>Beginner</option><option value={2}>Intermediate</option><option value={3}>Advanced</option></select></label>
            <label className="col gap6"><span className="label">Term *</span><input className="input" disabled={!!edit.id} value={edit.term} onChange={(e) => { setEdit({ ...edit, term: e.target.value }); setErr(''); }} /></label>
            <label className="col gap6"><span className="label">Full name</span><input className="input" value={edit.full} onChange={(e) => setEdit({ ...edit, full: e.target.value })} /></label>
            <label className="col gap6"><span className="label">Vietnamese hint</span><input className="input" value={edit.vi} onChange={(e) => setEdit({ ...edit, vi: e.target.value })} /></label>
          </div>
          <label className="col gap6"><span className="label">Plain-English definition *</span><textarea className="input" style={{ height: 70, padding: 12 }} value={edit.def} onChange={(e) => { setEdit({ ...edit, def: e.target.value }); setErr(''); }} /></label>
          <label className="col gap6"><span className="label">Example at work</span><textarea className="input" style={{ height: 70, padding: 12 }} value={edit.example} onChange={(e) => setEdit({ ...edit, example: e.target.value })} /></label>
          {err && <span className="caption c-danger">{err}</span>}
          <div className="row gap10">{edit.id && <button type="button" className="btn btn-danger" onClick={() => del(edit)}>Delete term</button>}<div className="grow" /><button type="button" className="btn btn-secondary" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary">Save to Firestore</button></div>
        </form>
      )}
      <div className="row center wrap gap10">
        <div className="search" style={{ width: 320, background: '#fff', border: '1px solid var(--border)' }}><Icon name="Search" size={18} color="#94A3B8" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a term to edit" /></div>
        <div className="grow" /><button className="btn btn-primary" onClick={() => { setEdit(emptyTerm()); setErr(''); }}>Add a term</button>
      </div>
      <div className="card p0">{list.slice(0, 60).map((t) => (
        <button key={t.id} className="list-row" style={{ width: '100%', border: 0, borderBottom: '1px solid var(--border)', background: 'none', textAlign: 'left' }} onClick={() => { setEdit({ ...emptyTerm(), ...t }); setErr(''); window.scrollTo(0, 0); }}>
          <span className="label" style={{ width: 200 }}>{t.term}</span><span className="small muted grow">{t.def}</span><Tag tone="ink">{CAT_BY_ID[t.cat]?.short}</Tag><Icon name="ChevronRight" size={16} color="#94A3B8" />
        </button>))}
        {list.length > 60 && <p className="caption faint" style={{ padding: 16 }}>Showing 60 of {list.length}. Search to narrow down.</p>}
      </div>
    </>
  );
}
