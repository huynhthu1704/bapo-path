// Feature-flag gate for the Prompt Workbench. Kept separate from Prompts.jsx so the
// main bundle stays small: the pages and the prompt data load only when allowed.
import { Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { Loading } from '../components/ui.jsx';
import { can, capturePreview } from '../data/flags.js';

export function usePromptsFlag() {
  const { admin, sync } = useStore();
  return { on: can('prompts', { admin }), loading: sync === 'loading' };
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
