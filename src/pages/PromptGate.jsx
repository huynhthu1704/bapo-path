// Feature-flag gate for a feature's pages (REQ-037). Kept apart from the page files so the main bundle stays small:
// the Prompt Workbench pages and the prompt data load only when allowed.
import { Suspense } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { Loading, Layout } from '../components/ui.jsx';
import { LOCAL_MODE } from '../firebase.js';
import { FLAGS, can, capturePreview, useFlags } from '../data/flags.js';

/** Shows the page only when its feature is on for this visitor; otherwise "Coming soon".
 *  flag: a FLAGS key, or a function of the route params that returns one.
 *  framed: the page has no menu of its own (full-screen), so "Coming soon" is shown inside the normal page frame. */
export function FlagGate({ flag = 'prompts', framed, children }) {
  const loc = useLocation();
  const params = useParams();
  capturePreview(loc.search);
  useFlags();
  const { role, me, sync } = useStore();
  const key = typeof flag === 'function' ? flag(params) : flag;
  if (!key || can(key, { role, uid: me && me.uid })) return <Suspense fallback={<Loading label="Loading…" />}>{children}</Suspense>;
  if (sync === 'loading') return <Loading label="Checking access…" />;
  const name = key === 'prompts' ? 'The Prompt Workbench' : FLAGS[key].name;
  const soon = (
    <div className="card p28" style={{ maxWidth: 560 }}>
      <h1 className="h2">Coming soon</h1>
      <p className="body muted">{name} is not available yet. It will open here once it is released.</p>
      <Link to="/home" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>Back to Home</Link>
    </div>
  );
  return framed ? <Layout>{soon}</Layout> : soon;
}

// Prompt admin area: Owner, Reviewers and Editors only (Firestore rules enforce the same).
export function StaffGate({ children }) {
  const { role, user, sync } = useStore();
  if (role) return <Suspense fallback={<Loading label="Loading…" />}>{children}</Suspense>;
  if (sync === 'loading') return <Loading label="Checking access…" />;
  return (
    <div className="card p28" style={{ maxWidth: 600 }}>
      <h1 className="h2">Prompt admin</h1>
      <p className="body muted">{user || LOCAL_MODE ? 'Your account has no Editor, Reviewer or Owner role yet. Ask the Owner to add you on the Staff page.' : 'Sign in with Google to use the Prompt admin.'}</p>
      {user && <p className="small muted">Your user ID: <code>{user.uid}</code></p>}
    </div>
  );
}
