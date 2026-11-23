import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy } from 'react';
import { StoreProvider } from './store.jsx';
import { Layout, Toasts, TopLoader } from './components/ui.jsx';
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
          <Route path="/roadmap" element={inApp(<Roadmap />)} />
          <Route path="/skill/:id" element={inApp(<SkillDetail />)} />
          <Route path="/challenge/:track/:level" element={focus(<Challenge />)} />
          <Route path="/general" element={inApp(<General />)} />
          <Route path="/glossary/:cat" element={inApp(<Glossary />)} />
          <Route path="/term/:id" element={inApp(<TermDetail />)} />
          <Route path="/frameworks" element={inApp(<Frameworks />)} />
          <Route path="/framework/:id" element={inApp(<FrameworkDetail />)} />
          <Route path="/references" element={<Layout><References /></Layout>} />
          <Route path="/domains" element={inApp(<Domains />)} />
          <Route path="/domain/:id" element={inApp(<DomainDetail />)} />
          <Route path="/saved" element={inApp(<Saved />)} />
          <Route path="/practice" element={inApp(<PracticeSetup />)} />
          <Route path="/flashcards" element={focus(<Flashcards />)} />
          <Route path="/quiz" element={focus(<Quiz />)} />
          <Route path="/results" element={inApp(<Results />)} />
          <Route path="/profile" element={inApp(<Profile />)} />
          <Route path="/achievements" element={inApp(<Achievements />)} />
          <Route path="/collection" element={inApp(<Collection />)} />
          <Route path="/story" element={inApp(<Story />)} />
          <Route path="/speed" element={focus(<Speed />)} />
          <Route path="/circle" element={inApp(<Circle />)} />
          <Route path="/jobs" element={inApp(<Jobs />)} />
          <Route path="/library" element={inApp(<Library />)} />
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
      </HashRouter>
    </StoreProvider>
  );
}
