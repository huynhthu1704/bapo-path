// Feature-flag gate for the Prompt Workbench. Kept separate from Prompts.jsx so the
// main bundle stays small: the pages and the prompt data load only when allowed.
import { Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { Loading } from '../components/ui.jsx';
import { LOCAL_MODE } from '../firebase.js';
import { can, capturePreview, useFlags } from '../data/flags.js';

export function usePromptsFlag() {
  useFlags();
  const { role, me, sync } = useStore();
  return { on: can('prompts', { role, uid: me && me.uid }), loading: sync === 'loading' };
}

export function FlagGate({ children }) {
  const loc = useLocation();
  capturePreview(loc.search);
  const { on, loading } = usePromptsFlag();
  if (on) return <Suspense fallback={<Loading label="Loading prompts…" />}>{children}</Suspense>;
  if (loading) return <Loading label="Checking access…" />;
  return (
    <div className="card p28" style={{ maxWidth: 560 }}>
      <h1 className="h2">Coming soon</h1>
      <p className="body muted">The Prompt Workbench is not available yet. It will open here once it is released.</p>
      <Link to="/home" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>Back to Home</Link>
    </div>
  );
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
