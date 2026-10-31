import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { StoreProvider } from './store.jsx';
import { Layout, Toasts } from './components/ui.jsx';
import { Landing, SignUp, Onboarding1, Onboarding2, RequireOnboarding } from './pages/Entry.jsx';
import Home from './pages/Home.jsx';
import { Roadmap, SkillDetail, Challenge } from './pages/Roadmap.jsx';
import { General, Glossary, TermDetail, Domains, DomainDetail, Saved } from './pages/Knowledge.jsx';
import { PracticeSetup, Flashcards, Quiz, Results } from './pages/Practice.jsx';
import { Achievements, Collection, Story, Speed, Circle } from './pages/Game.jsx';
import Profile from './pages/Profile.jsx';
import { Jobs, Library, Admin } from './pages/Account.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const inApp = (el) => <RequireOnboarding><Layout>{el}</Layout></RequireOnboarding>;
const focus = (el) => <RequireOnboarding>{el}</RequireOnboarding>;

export default function App({ kbVersion = 0 }) {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollTop />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toasts />
      </HashRouter>
    </StoreProvider>
  );
}
