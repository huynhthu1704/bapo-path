import { HashRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, lazy } from 'react';
import { StoreProvider } from './store.jsx';
import { Layout, Toasts, TopLoader, SignInPrompt } from './components/ui.jsx';
import { Landing, SignUp, Onboarding1, Onboarding2, RequireOnboarding } from './pages/Entry.jsx';
import Home from './pages/Home.jsx';
import { Roadmap, SkillDetail, Challenge } from './pages/Roadmap.jsx';
import { General, Glossary, TermDetail, Domains, DomainDetail, Saved } from './pages/Knowledge.jsx';
import { PracticeSetup, Flashcards, Quiz, Results } from './pages/Practice.jsx';
import { Achievements, Collection, Story, Speed, Circle } from './pages/Game.jsx';
import Profile from './pages/Profile.jsx';
import { Frameworks, FrameworkDetail, References } from './pages/Frameworks.jsx';
import { Jobs, Library } from './pages/Account.jsx';
import { FlagGate, StaffGate } from './pages/PromptGate.jsx';
import { ROUTE_FLAGS, catFlag, termFlag } from './data/flags.js';

// Prompt Workbench pages load as their own chunk.
const pwPage = (name) => lazy(() => import('./pages/Prompts.jsx').then((m) => ({ default: m[name] })));
const PromptLibrary = pwPage('PromptLibrary'); const PromptDetail = pwPage('PromptDetail'); const Workbench = pwPage('Workbench');
const Collections = pwPage('Collections'); const CollectionRun = pwPage('CollectionRun'); const MyPrompts = pwPage('MyPrompts');
// The Admin area (staff only, REQ-038) loads as its own chunks.
const adm = (name) => lazy(() => import('./pages/PromptAdmin.jsx').then((m) => ({ default: m[name] })));
const admMore = (name) => lazy(() => import('./pages/AdminPages.jsx').then((m) => ({ default: m[name] })));
const ADMIN_ROUTES = [
  ['/admin/prompts', adm('AdminPrompts')], ['/admin/prompts/new', adm('PromptEditor')], ['/admin/prompts/:id/edit', adm('PromptEditor')],
  ['/admin/prompts/:id/preview', adm('PromptPreview')], ['/admin/prompts/:id/history', adm('VersionHistory')],
  ['/admin/review', adm('ReviewQueue')], ['/admin/review/:id', adm('ReviewPrompt')],
  ['/admin/feedback', admMore('FeedbackInbox')], ['/admin/taxonomy', admMore('Taxonomy')], ['/admin/knowledge', admMore('KnowledgeBase')],
  ['/admin/staff', admMore('Staff')], ['/admin/features', admMore('Features')], ['/admin/insights', admMore('Insights')],
  ['/admin/audit', admMore('AuditLog')], ['/admin', admMore('Overview')],
];
// Old Prompt admin and Knowledge admin links keep working (REQ-038).
const MOVED = [
  ['/pw-admin', () => '/admin/prompts'], ['/pw-admin/new', () => '/admin/prompts/new'],
  ['/pw-admin/edit/:id', ({ id }) => `/admin/prompts/${id}/edit`], ['/pw-admin/preview/:id', ({ id }) => `/admin/prompts/${id}/preview`],
  ['/pw-admin/history/:id', ({ id }) => `/admin/prompts/${id}/history`], ['/pw-admin/review', () => '/admin/review'],
  ['/pw-admin/review/:id', ({ id }) => `/admin/review/${id}`], ['/pw-admin/taxonomy', () => '/admin/taxonomy'],
  ['/pw-admin/staff', () => '/admin/staff'], ['/pw-admin/feedback', () => '/admin/feedback'],
  ['/pw-admin/insights', () => '/admin/insights'], ['/pw-admin/features', () => '/admin/features'],
];
function Moved({ to }) {
  const params = useParams(); const { search } = useLocation();
  return <Navigate to={to(params) + search} replace />;
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const inApp = (el) => <RequireOnboarding><Layout>{el}</Layout></RequireOnboarding>;
// Prompt Workbench: public (no sign-in or onboarding needed), behind the `prompts` feature flag.
const pw = (el) => <Layout><FlagGate>{el}</FlagGate></Layout>;
const focus = (el) => <RequireOnboarding>{el}</RequireOnboarding>;
// REQ-037: every feature page sits behind its feature flag. A glossary of a framework or domain category (and its terms)
// belongs to that feature, not to the general glossary.
const flagged = (path, el, flag) => <FlagGate flag={flag || ROUTE_FLAGS[path.split('/')[1]]}>{el}</FlagGate>;
// Full-screen pages (no menu): "Coming soon" still shows inside the normal page frame.
const flaggedFocus = (path, el) => <FlagGate flag={ROUTE_FLAGS[path.split('/')[1]]} framed>{el}</FlagGate>;

export default function App({ kbVersion = 0 }) {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollTop />
        <TopLoader />
        <Routes key={kbVersion}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding/1" element={<Onboarding1 />} />
          <Route path="/onboarding/2" element={<Onboarding2 />} />
          <Route path="/home" element={inApp(<Home />)} />
          <Route path="/roadmap" element={inApp(flagged('/roadmap', <Roadmap />))} />
          <Route path="/skill/:id" element={inApp(flagged('/skill/:id', <SkillDetail />))} />
          <Route path="/challenge/:track/:level" element={focus(flaggedFocus('/challenge/:track/:level', <Challenge />))} />
          <Route path="/general" element={inApp(flagged('/general', <General />))} />
          <Route path="/glossary/:cat" element={inApp(flagged('/glossary/:cat', <Glossary />, ({ cat }) => catFlag(cat)))} />
          <Route path="/term/:id" element={inApp(flagged('/term/:id', <TermDetail />, ({ id }) => termFlag(id)))} />
          <Route path="/frameworks" element={inApp(flagged('/frameworks', <Frameworks />))} />
          <Route path="/framework/:id" element={inApp(flagged('/framework/:id', <FrameworkDetail />))} />
          <Route path="/references" element={<Layout>{flagged('/references', <References />)}</Layout>} />
          <Route path="/domains" element={inApp(flagged('/domains', <Domains />))} />
          <Route path="/domain/:id" element={inApp(flagged('/domain/:id', <DomainDetail />))} />
          <Route path="/saved" element={inApp(flagged('/saved', <Saved />))} />
          <Route path="/practice" element={inApp(flagged('/practice', <PracticeSetup />))} />
          <Route path="/flashcards" element={focus(flaggedFocus('/flashcards', <Flashcards />))} />
          <Route path="/quiz" element={focus(flaggedFocus('/quiz', <Quiz />))} />
          <Route path="/results" element={inApp(flagged('/results', <Results />))} />
          <Route path="/profile" element={inApp(<Profile />)} />
          <Route path="/achievements" element={inApp(flagged('/achievements', <Achievements />))} />
          <Route path="/collection" element={inApp(flagged('/collection', <Collection />))} />
          <Route path="/story" element={inApp(flagged('/story', <Story />))} />
          <Route path="/speed" element={focus(flaggedFocus('/speed', <Speed />))} />
          <Route path="/circle" element={inApp(flagged('/circle', <Circle />))} />
          <Route path="/jobs" element={inApp(flagged('/jobs', <Jobs />))} />
          <Route path="/library" element={inApp(flagged('/library', <Library />))} />
          <Route path="/prompts" element={pw(<PromptLibrary />)} />
          <Route path="/prompts/:id" element={pw(<PromptDetail />)} />
          <Route path="/workbench" element={pw(<Workbench />)} />
          <Route path="/collections" element={pw(<Collections />)} />
          <Route path="/collections/:id" element={pw(<CollectionRun />)} />
          <Route path="/my-prompts" element={pw(<MyPrompts />)} />
          {ADMIN_ROUTES.map(([path, C]) => <Route key={path} path={path} element={<Layout><StaffGate><C /></StaffGate></Layout>} />)}
          {MOVED.map(([path, to]) => <Route key={path} path={path} element={<Moved to={to} />} />)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toasts />
        <SignInPrompt />
      </HashRouter>
    </StoreProvider>
  );
}
