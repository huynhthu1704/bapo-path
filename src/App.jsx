import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { Jobs, Library, Admin } from './pages/Account.jsx';
import { FlagGate, StaffGate } from './pages/PromptGate.jsx';
import { ROUTE_FLAGS, catFlag, termFlag } from './data/flags.js';

// Prompt Workbench pages load as their own chunk.
const pwPage = (name) => lazy(() => import('./pages/Prompts.jsx').then((m) => ({ default: m[name] })));
const PromptLibrary = pwPage('PromptLibrary'); const PromptDetail = pwPage('PromptDetail'); const Workbench = pwPage('Workbench');
const Collections = pwPage('Collections'); const CollectionRun = pwPage('CollectionRun'); const MyPrompts = pwPage('MyPrompts');
// Prompt admin pages (staff only) load as another chunk.
const adm = (name) => lazy(() => import('./pages/PromptAdmin.jsx').then((m) => ({ default: m[name] })));
const ADMIN_ROUTES = [
  ['/pw-admin', adm('AdminPrompts')], ['/pw-admin/new', adm('PromptEditor')], ['/pw-admin/edit/:id', adm('PromptEditor')],
  ['/pw-admin/preview/:id', adm('PromptPreview')], ['/pw-admin/review', adm('ReviewQueue')], ['/pw-admin/review/:id', adm('ReviewPrompt')],
  ['/pw-admin/history/:id', adm('VersionHistory')], ['/pw-admin/taxonomy', adm('Taxonomy')], ['/pw-admin/staff', adm('Staff')],
  ['/pw-admin/feedback', adm('FeedbackInbox')], ['/pw-admin/insights', adm('Insights')],
];

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
          <Route path="/challenge/:track/:level" element={focus(flagged('/challenge/:track/:level', <Challenge />))} />
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
          <Route path="/flashcards" element={focus(flagged('/flashcards', <Flashcards />))} />
          <Route path="/quiz" element={focus(flagged('/quiz', <Quiz />))} />
          <Route path="/results" element={inApp(flagged('/results', <Results />))} />
          <Route path="/profile" element={inApp(<Profile />)} />
          <Route path="/achievements" element={inApp(flagged('/achievements', <Achievements />))} />
          <Route path="/collection" element={inApp(flagged('/collection', <Collection />))} />
          <Route path="/story" element={inApp(flagged('/story', <Story />))} />
          <Route path="/speed" element={focus(flagged('/speed', <Speed />))} />
          <Route path="/circle" element={inApp(flagged('/circle', <Circle />))} />
          <Route path="/jobs" element={inApp(flagged('/jobs', <Jobs />))} />
          <Route path="/library" element={inApp(flagged('/library', <Library />))} />
          <Route path="/admin" element={inApp(<Admin />)} />
          <Route path="/prompts" element={pw(<PromptLibrary />)} />
          <Route path="/prompts/:id" element={pw(<PromptDetail />)} />
          <Route path="/workbench" element={pw(<Workbench />)} />
          <Route path="/collections" element={pw(<Collections />)} />
          <Route path="/collections/:id" element={pw(<CollectionRun />)} />
          <Route path="/my-prompts" element={pw(<MyPrompts />)} />
          {ADMIN_ROUTES.map(([path, C]) => <Route key={path} path={path} element={<Layout><StaffGate><C /></StaffGate></Layout>} />)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toasts />
        <SignInPrompt />
      </HashRouter>
    </StoreProvider>
  );
}
