// REQ-038: the one Admin area. Every admin page renders inside AdminShell: breadcrumb, title, "Signed in as", the demo
// "Act as" bar and the admin side menu (a drop-down at 375 px). Shared helpers for admin pages live here too.
// Roles: Owner (admins/{uid}), Reviewer, Editor (staff/{uid}). The menu only hides what a role cannot use;
// firestore.rules enforce the same.
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore, DEMO_PEOPLE } from '../store.jsx';
import { Icon, PageHead, track } from '../components/ui.jsx';
import { LOCAL_MODE } from '../firebase.js';
import * as api from '../data/promptApi.js';

export const isReviewer = (role) => role === 'reviewer' || role === 'owner';
export const ROLE_LABEL = { owner: 'Owner', reviewer: 'Reviewer', editor: 'Editor' };
export const when = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
export const Err = ({ children }) => (children ? <div className="soft bg-danger-soft small c-danger" role="alert">{children}</div> : null);
export const Ok = ({ children }) => <span className="small c-success" aria-live="polite">{children}</span>;
export const friendly = (e) => (e && e.code === 'permission-denied' ? 'You do not have permission to do this (blocked by the database rules).' : (e && e.message) || 'Something went wrong. Try again.');

// Runs an async action with busy/error state. Returns the result (true if none), or undefined on failure.
export function useAction() {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [msg, setMsg] = useState('');
  const run = async (fn, okMsg) => {
    setBusy(true); setErr(''); setMsg('');
    try { const r = await track(fn()); if (okMsg) setMsg(typeof okMsg === 'function' ? okMsg(r) : okMsg); setBusy(false); return r === undefined ? true : r; }
    catch (e) { console.warn(e); setErr(friendly(e)); setBusy(false); return undefined; }
  };
  return { busy, err, msg, run, setErr, setMsg };
}

// The admin side menu (design SCR-4): [group, [[path, label, icon, who]]]; who: 'all' | 'reviewer' | 'owner'.
// Icons come from src/components/icons.js (only the icons the app already uses).
export const ADMIN_MENU = [
  [null, [['/admin', 'Overview', 'LayoutList', 'all']]],
  ['CONTENT', [['/admin/prompts', 'Prompts', 'FileText', 'all'], ['/admin/review', 'Review queue', 'ListChecks', 'reviewer'],
    ['/admin/feedback', 'Feedback', 'MessageSquare', 'reviewer'], ['/admin/taxonomy', 'Taxonomy', 'Layers', 'owner'],
    ['/admin/knowledge', 'Knowledge base', 'Database', 'owner']]],
  ['PEOPLE', [['/admin/staff', 'Staff', 'Users', 'owner']]],
  ['RELEASES', [['/admin/features', 'Features', 'Send', 'owner']]],
  ['ACTIVITY', [['/admin/insights', 'Insights', 'TrendingUp', 'owner'], ['/admin/audit', 'Audit log', 'History', 'owner']]],
];
const allowed = (who, role) => who === 'all' || (who === 'reviewer' && isReviewer(role)) || (who === 'owner' && role === 'owner');
const activeIn = (path, pathname) => pathname === path || (path !== '/admin' && pathname.startsWith(`${path}/`));

function useCounts(role) {
  const [counts, setCounts] = useState({});
  useEffect(() => {
    if (!isReviewer(role)) return;
    api.listPrompts().then((l) => setCounts((c) => ({ ...c, '/admin/review': l.filter((p) => p.status === 'review').length }))).catch(() => {});
    api.listFeedback().then((l) => setCounts((c) => ({ ...c, '/admin/feedback': l.filter((f) => f.status !== 'done').length }))).catch(() => {});
  }, [role]);
  return counts;
}

export function AdminShell({ title, sub, actions, children }) {
  const { role, me, setDemoPerson } = useStore();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const counts = useCounts(role);
  const groups = ADMIN_MENU.map(([g, items]) => [g, items.filter((x) => allowed(x[3], role))]).filter(([, items]) => items.length);
  const items = groups.flatMap(([, list]) => list);
  const here = items.find((x) => activeIn(x[0], pathname));
  return (
    <>
      {LOCAL_MODE && (
        <div className="soft bg-accent-soft row center wrap gap8 small demo-bar">
          <Icon name="Info" size={16} color="#D97706" /><b>Demo mode</b><span className="muted grow">Data stays in this browser. Act as:</span>
          <select className="input pw-select" aria-label="Act as" value={me ? me.uid : ''} onChange={(e) => setDemoPerson(e.target.value)}>
            {DEMO_PEOPLE.map((p) => <option key={p.uid} value={p.uid}>{p.name}</option>)}
          </select>
          <button type="button" className="btn btn-ghost" onClick={() => { api.clearLocalData(); window.location.reload(); }}>Reset demo data</button>
        </div>
      )}
      <div className="admin-layout">
        <nav className="admin-nav" aria-label="Admin">
          {groups.map(([g, list]) => (
            <div key={g || 'top'} className="col" style={{ gap: 2 }}>
              {g && <div className="nav-sec overline">{g}</div>}
              {list.map(([to, label, icon]) => (
                <NavLink key={to} to={to} className={`nav-item ${activeIn(to, pathname) ? 'active' : ''}`}>
                  <Icon name={icon} size={20} /><span className="grow">{label}</span>
                  {counts[to] > 0 && <span className="tag bg-accent-soft c-accent" aria-label={`${counts[to]} waiting`}>{counts[to]}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-body">
          <span className="caption faint">Admin{here && here[0] !== '/admin' ? ` › ${here[1]}` : ''}</span>
          <PageHead title={title} sub={sub}>{actions}</PageHead>
          <span className="caption faint tab-role" style={{ alignSelf: 'flex-start', paddingBottom: 0 }}>Signed in as {me && me.name} · {ROLE_LABEL[role]}</span>
          <label className="col gap6 admin-pick"><span className="label">Admin section</span>
            <select className="input" aria-label="Admin section" value={here ? here[0] : ''} onChange={(e) => nav(e.target.value)}>
              {!here && <option value="" disabled>Choose a section</option>}
              {items.map(([to, label]) => <option key={to} value={to}>{label}{counts[to] ? ` · ${counts[to]}` : ''}</option>)}
            </select>
          </label>
          {children}
        </div>
      </div>
    </>
  );
}
