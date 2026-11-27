import { useEffect, useState } from 'react';
import { Icon, Tag, IconBox, PageHead, GoogleButton, Spinner, Loading, track, FeatureLink } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { enabled, signInWithGoogle, listJobs, saveJob, deleteJob, listSearches, clearSearches } from '../firebase.js';

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
  const [msg, setMsg] = useState(''); const [err, setErr] = useState(''); const [confirmDel, setConfirmDel] = useState(null); const [busy, setBusy] = useState('');
  const refresh = () => track(listJobs(user.uid)).then((l) => setJobs(l.sort((a, b) => (b.dateApplied || '').localeCompare(a.dateApplied || '')))).catch(() => setErr('Could not load your jobs. Check your connection.'));
  useEffect(() => { if (user) refresh(); }, [user]); // eslint-disable-line
  if (!user) return <><PageHead title="My Job Search" sub="A private tracker for the BA / PO jobs you are applying for." /><SignInCard why="Your job search is private. Sign in with Google to see and update it — only you can read it." /></>;
  const save = async (e) => {
    e.preventDefault();
    if (!edit.company.trim()) { setErr('Company is required.'); return; }
    const job = { ...edit, id: edit.id || `${slug(edit.company)}-${slug(edit.position) || 'role'}-${Date.now().toString(36)}` };
    setBusy('save');
    try { await track(saveJob(user.uid, job)); setEdit(null); setErr(''); setMsg('Saved.'); refresh(); } catch (x) { setErr('Could not save. Please try again.'); }
    setBusy('');
  };
  const importFile = async (file) => {
    setErr(''); setMsg(''); setBusy('import');
    try {
      const list = jobsFromFile(file.name, await file.text());
      if (!list.length) { setErr('No jobs found in that file.'); setBusy(''); return; }
      await track((async () => { for (const j of list) await saveJob(user.uid, j); })());
      setMsg(`Imported ${list.length} job${list.length > 1 ? 's' : ''}.`); refresh();
    } catch (x) { setErr(x.message || 'Could not read that file.'); }
    setBusy('');
  };
  const shown = (jobs || []).filter((j) => f === 'All' || j.status === f);
  return (
    <>
      <PageHead title="My Job Search" sub="Private to your Google account. Track every BA / PO application in one place.">
        <label className="btn btn-secondary" aria-disabled={busy === 'import'}>{busy === 'import' ? <Spinner label="Importing…" /> : <><Icon name="Upload" size={16} />Import CSV / JSON</>}<input type="file" accept=".csv,.json" hidden disabled={busy === 'import'} onChange={(e) => { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; }} /></label>
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
          <div className="row" style={{ justifyContent: 'flex-end', gap: 10 }}><button type="button" className="btn btn-secondary" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary" disabled={busy === 'save'}>{busy === 'save' ? <Spinner label="Saving…" /> : 'Save job'}</button></div>
        </form>
      )}
      <div className="row wrap gap8">{['All', ...STATUSES].map((x) => <button key={x} className={`chip ${f === x ? 'on' : ''}`} onClick={() => setF(x)}>{x}</button>)}</div>
      {jobs === null ? <div className="card p0"><Loading label="Loading your jobs…" /></div> : shown.length === 0 ? (
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
                {confirmDel === j.id ? <button className="btn btn-danger" style={{ padding: '6px 10px' }} disabled={busy === 'del'} onClick={async () => { setBusy('del'); try { await track(deleteJob(user.uid, j.id)); } catch (x) { setErr('Could not delete. Please try again.'); } setBusy(''); setConfirmDel(null); refresh(); }}>{busy === 'del' ? <Spinner label="Deleting…" /> : 'Confirm delete'}</button>
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
  const [items, setItems] = useState(null); const [confirm, setConfirm] = useState(false); const [clearing, setClearing] = useState(false);
  useEffect(() => { if (user) track(listSearches(user.uid, 100)).then(setItems).catch(() => setItems([])); }, [user]);
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
            {items && items.length > 0 && (confirm ? <button className="btn btn-danger" disabled={clearing} onClick={async () => { setClearing(true); try { await track(clearSearches(user.uid)); setItems([]); } catch (x) { /* keep list */ } setClearing(false); setConfirm(false); }}>{clearing ? <Spinner label="Clearing…" /> : 'Yes, clear all'}</button> : <button className="btn btn-ghost" onClick={() => setConfirm(true)}>Clear history</button>)}</div>
          {items === null ? <Loading label="Loading your search history…" /> : !items.length ? <p className="small muted" style={{ padding: '0 24px 24px' }}>Nothing yet. Use the search box at the top — the terms and skills you open will appear here.</p>
            : Object.entries(groups).map(([d, list]) => (
              <div key={d}><div className="overline faint" style={{ padding: '10px 24px', background: 'var(--bg)' }}>{new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                {list.map((x) => (
                  <div key={x.id} className="list-row" style={{ padding: '12px 24px' }}>
                    <Icon name="Search" size={16} color="#94A3B8" /><span className="small faint" style={{ width: 140 }}>“{x.q}”</span>
                    {x.result ? <FeatureLink keep to={x.result.to} className="label c-primary grow">{x.result.label}</FeatureLink> : <span className="small muted grow">No result opened</span>}
                    <span className="caption faint">{x.result?.meta}</span><span className="caption faint">{x.at.slice(11, 16)}</span>
                  </div>))}
              </div>))}
        </div>
        <div className="col" style={{ width: 340, maxWidth: '100%', gap: 16 }}>
          <div className="card"><span className="label">Most looked-up</span>{top.length ? <div className="row wrap gap6">{top.map(([l, n]) => <Tag key={l} tone="po">{l} · {n}</Tag>)}</div> : <span className="small muted">Appears after a few searches.</span>}</div>
          <FeatureLink to="/saved" className="card hover row center" style={{ flexDirection: 'row' }}><IconBox name="Bookmark" /><div className="col grow" style={{ gap: 0 }}><span className="label">Saved terms</span><span className="caption faint">{s.saved.length} terms</span></div><Icon name="ChevronRight" color="#94A3B8" /></FeatureLink>
          <FeatureLink to="/jobs" className="card hover row center" style={{ flexDirection: 'row' }}><IconBox name="Briefcase" tone="accent" /><div className="col grow" style={{ gap: 0 }}><span className="label">My Job Search</span><span className="caption faint">Private tracker</span></div><Icon name="ChevronRight" color="#94A3B8" /></FeatureLink>
        </div>
      </div>
    </>
  );
}
