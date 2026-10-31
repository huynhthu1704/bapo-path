import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Icon, Tag, IconBox, Toggle } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { DOMAINS } from '../data/domains.js';
import { TERMS } from '../data/terms.js';
import { SKILLS } from '../data/skills.js';

const Logo = ({ light }) => (
  <div className="row center gap10">
    <div className="mark" style={light ? { background: '#fff', color: 'var(--primary)' } : {}}>BP</div>
    <span className="h3" style={{ color: light ? '#fff' : undefined }}>BAPO Path</span>
  </div>
);

export function Landing() {
  const { s } = useStore();
  const start = s.onboarded ? '/home' : '/signup';
  return (
    <div style={{ background: '#fff' }}>
      <nav className="landing-nav">
        <Logo /><div className="grow" />
        <a href="#modules" className="label muted hide-sm">Roadmap</a>
        <a href="#modules" className="label muted hide-sm">Glossary</a>
        <a href="#domains" className="label muted hide-sm">Domains</a>
        <a href="#how" className="label muted hide-sm">Practice</a>
        <Link to={start} className="btn btn-ghost">{s.onboarded ? 'Go to my dashboard' : 'Log in'}</Link>
      </nav>
      <section className="hero">
        <div className="col grow" style={{ gap: 20, minWidth: 0 }}>
          <span><Tag className="tag-white">FREE · FOR NEW BAs & POs</Tag></span>
          <h1 className="display hero-title">Learn the BA & PO job, one skill at a time.</h1>
          <p className="h3 muted" style={{ fontWeight: 400, maxWidth: 620 }}>A clear roadmap from beginner to expert, plain-English explanations of IT, teamwork and business jargon, and quick tests that show what you really know.</p>
          <div className="row gap10 wrap"><Link to={start} className="btn btn-primary">Start learning — it’s free</Link><Link to={start} className="btn btn-secondary">Explore the roadmap</Link></div>
          <div className="row center gap8 small muted"><Icon name="Users" size={18} color="#4F46E5" />Built for career switchers, juniors and non-native English speakers</div>
        </div>
        <div className="col hero-mock" style={{ gap: 16 }}>
          <div className="card p24">
            <div className="overline faint">Your path · Business Analyst</div>
            {[['Beginner', '#22C55E', 100, '12 / 12'], ['Intermediate', '#3B82F6', 45, '6 / 14'], ['Advanced', '#8B5CF6', 0, '0 / 12'], ['Expert', '#F59E0B', 0, '0 / 10']].map(([n, c, p, d]) => (
              <div key={n} className="row center" style={{ gap: 12 }}><span className="label" style={{ width: 110 }}>{n}</span><div className="progress grow"><div style={{ width: `${Math.max(p, 3)}%`, background: c }} /></div><span className="caption faint">{d}</span></div>
            ))}
          </div>
          <div className="panel-primary" style={{ padding: 24, gap: 10 }}>
            <div className="overline">Flashcard · IT glossary</div><div className="h1">Technical debt</div>
            <p className="body">Extra work caused by choosing a quick solution now instead of a better one that takes longer.</p>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 40 }}><div className="grid g4" style={{ gap: 24 }}>
        {[[`${SKILLS.length}`, 'skills across BA & PO tracks'], [`${TERMS.length}+`, 'IT, teamwork & business terms'], ['8', 'business domains'], ['3', 'practice modes + games']].map(([n, l]) => (
          <div key={l} className="col gap4"><div className="h1 c-primary">{n}</div><div className="small muted">{l}</div></div>
        ))}
      </div></section>
      <section id="modules" className="section" style={{ background: 'var(--bg)' }}>
        <h2 className="h1">Everything a starter needs, in one place</h2>
        <div className="grid g4">
          {[['Route', 'primary', 'Skill Roadmap', 'Every BA and PO skill, ordered Beginner → Expert, with examples and self-checks.'], ['Globe', 'po', 'General Knowledge', 'IT glossary, team collaboration and corporate language explained simply.'], ['Briefcase', 'accent', 'Domain Knowledge', 'Banking, e-commerce, healthcare and more — key processes and terms.'], ['Zap', 'success', 'Practice & Tests', 'Flashcards, multiple choice and mixed tests with instant explanations.']].map(([i, t, h, d]) => (
            <div key={h} className="card p24"><IconBox name={i} tone={t} size={44} /><div className="h3">{h}</div><p className="small muted">{d}</p></div>
          ))}
        </div>
      </section>
      <section id="how" className="section">
        <h2 className="h1">How it works</h2>
        <div className="grid g3" style={{ gap: 24 }}>
          {[['Pick your track and level', 'Tell us if you are learning BA or PO and where you are today.'], ['Learn one skill + its terms', 'Short lessons with real workplace examples and key vocabulary.'], ['Practise, play and level up', 'Daily quests, flashcards, games and a career rank that grows with you.']].map(([t, d], i) => (
            <div key={t} className="col gap10"><div className="mark" style={{ borderRadius: 999 }}>{i + 1}</div><div className="h3">{t}</div><p className="body muted">{d}</p></div>
          ))}
        </div>
      </section>
      <section id="domains" className="section" style={{ paddingTop: 0, gap: 20 }}>
        <h2 className="h2">Learn the language of the business you work in</h2>
        <div className="row wrap gap10">{DOMAINS.map((d) => <span key={d.id} className="chip"><Icon name={d.icon} size={18} />{d.name}</span>)}</div>
      </section>
      <section className="section" style={{ background: 'var(--primary)', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <h2 className="h1 c-white">Start your BA / PO path today</h2>
        <p className="body c-white">Free. No credit card. Progress saves on your device.</p>
        <Link to={start} className="btn btn-secondary">Create free account</Link>
      </section>
      <footer className="landing-nav" style={{ height: 'auto', paddingTop: 28, paddingBottom: 28, flexWrap: 'wrap', gap: 24 }}>
        <Logo /><div className="grow" />{['About', 'Contribute a term', 'Privacy', '© 2026 BAPO Path'].map((l) => <span key={l} className="small faint">{l}</span>)}
      </footer>
    </div>
  );
}

export function SignUp() {
  const { s, a } = useStore();
  const nav = useNavigate();
  const [name, setName] = useState(s.name); const [email, setEmail] = useState(s.email);
  const [err, setErr] = useState(''); const [g, setG] = useState(false);
  const go = (e) => { e.preventDefault(); if (!name.trim()) { setErr('Please enter your name.'); return; } a.set({ name: name.trim(), email: email.trim() }); nav('/onboarding/1'); };
  return (
    <div className="row" style={{ minHeight: '100vh', gap: 0, alignItems: 'stretch' }}>
      <div className="hide-sm" style={{ width: 600, background: 'var(--primary)', padding: 64, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Link to="/"><Logo light /></Link>
        <div className="col" style={{ gap: 20 }}>
          <p className="h2 c-white">“I switched from teaching to BA in 6 months. The glossary and daily flashcards made meetings finally make sense.”</p>
          <p className="body c-white" style={{ opacity: .8 }}>— Linh, Junior Business Analyst</p>
        </div>
        <div className="col">{['Free roadmap for BA & PO', `${TERMS.length}+ terms in plain English`, 'Track your progress every day'].map((t) => <div key={t} className="row center gap10 body c-white"><Icon name="Check" size={18} color="#fff" />{t}</div>)}</div>
      </div>
      <form className="col grow" style={{ padding: '48px clamp(20px, 8vw, 120px)', justifyContent: 'center', gap: 20, maxWidth: 840 }} onSubmit={go}>
        <h1 className="h1">Create your free account</h1>
        <p className="body muted">Save your progress and pick up where you left off.</p>
        <button type="button" className="btn btn-secondary block" onClick={() => setG(true)}>Continue with Google</button>
        {g && <p className="caption c-accent">Google sign-in comes with accounts in v2. For now, enter your name below — your progress is saved in this browser.</p>}
        <div className="row center gap10"><div className="grow" style={{ height: 1, background: 'var(--border)' }} /><span className="caption faint">or</span><div className="grow" style={{ height: 1, background: 'var(--border)' }} /></div>
        <label className="col gap6"><span className="label">Full name</span><input className="input" value={name} onChange={(e) => { setName(e.target.value); setErr(''); }} placeholder="Your name" /></label>
        {err && <span className="caption c-danger">{err}</span>}
        <label className="col gap6"><span className="label">Email <span className="faint">(optional)</span></span><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <button className="btn btn-primary block" type="submit">Create account</button>
        <div className="row center gap10 soft bg-bg small muted"><Icon name="User" size={18} style={{ flex: 'none' }} /><span>Just looking? <button type="button" className="label" style={{ border: 0, background: 'none', color: 'var(--primary)', padding: 0 }} onClick={() => { a.set({ name: 'Guest' }); nav('/onboarding/1'); }}>Continue as guest</button> — progress saves on this device.</span></div>
      </form>
    </div>
  );
}

function OnbFrame({ step, title, sub, children }) {
  return (
    <div className="focus" style={{ alignItems: 'center', padding: '48px 16px', gap: 32 }}>
      <div className="row center w760"><Logo /><div className="grow" /><Link to="/home" className="label faint">Skip for now</Link></div>
      <div className="card w760" style={{ padding: 40, gap: 28, borderRadius: 24 }}>
        <div className="col gap10"><span className="overline c-primary">Step {step} of 2</span>
          <div className="row gap8">{[1, 2].map((i) => <div key={i} className="grow" style={{ height: 6, borderRadius: 999, background: i <= step ? 'var(--primary)' : 'var(--border)' }} />)}</div></div>
        <div className="col gap6"><h1 className="h1">{title}</h1><p className="body muted">{sub}</p></div>
        {children}
      </div>
    </div>
  );
}

export function Onboarding1() {
  const { s, a } = useStore(); const nav = useNavigate();
  const [track, setTrack] = useState(s.track); const [level, setLevel] = useState(s.startLevel);
  const opts = [['BA', 'Briefcase', 'primary', 'Business Analyst', 'Bridge business needs and the tech team: requirements, processes, analysis.'], ['PO', 'Route', 'po', 'Product Owner', 'Own the product backlog, prioritise value and work with stakeholders.']];
  return (
    <OnbFrame step={1} title="What would you like to learn?" sub="We will build your roadmap around your role and current level. You can change this any time.">
      {opts.map(([id, i, t, h, d]) => (
        <button key={id} className={`card row center ${track === id ? 'selected' : ''}`} style={{ textAlign: 'left' }} onClick={() => setTrack(id)}>
          <IconBox name={i} tone={t} size={44} /><div className="col gap4 grow"><span className="h3">{h}</span><span className="small muted">{d}</span></div><span className={`box ${track === id ? 'on' : ''}`} style={{ borderRadius: 999 }}>{track === id && <Icon name="Check" size={14} color="#fff" />}</span>
        </button>
      ))}
      <div className="col gap10"><span className="label">Your current level</span>
        <div className="grid g4" style={{ gap: 10 }}>
          {[['Beginner', '0–1 year'], ['Intermediate', '1–3 years'], ['Advanced', '3–5 years'], ['Expert', '5+ years']].map(([n, d], i) => (
            <button key={n} className={`card ${level === i + 1 ? 'selected' : ''}`} style={{ padding: 14, gap: 2, textAlign: 'left' }} onClick={() => setLevel(i + 1)}><span className={`label ${level === i + 1 ? 'c-primary' : ''}`}>{n}</span><span className="caption faint">{d}</span></button>
          ))}
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}><button className="btn btn-primary" onClick={() => { a.set({ track, startLevel: level }); nav('/onboarding/2'); }}>Continue</button></div>
    </OnbFrame>
  );
}

export function Onboarding2() {
  const { s, a } = useStore(); const nav = useNavigate();
  const [doms, setDoms] = useState(s.domains); const [goal, setGoal] = useState(s.dailyGoal); const [vi, setVi] = useState(s.viHints);
  const [err, setErr] = useState('');
  const tog = (id) => { setErr(''); setDoms((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id])); };
  return (
    <OnbFrame step={2} title="Which business domains interest you?" sub="Pick any — we will add their glossary to your practice. Choose at least one.">
      <div className="grid g4" style={{ gap: 10 }}>
        {DOMAINS.map((d) => { const on = doms.includes(d.id); return (
          <button key={d.id} className={`card ${on ? 'selected' : ''}`} style={{ padding: 16, gap: 10, textAlign: 'left', minHeight: 108 }} onClick={() => tog(d.id)}>
            <Icon name={d.icon} size={22} color={on ? '#4F46E5' : '#475569'} /><span className={`label ${on ? 'c-primary' : ''}`}>{d.name}</span>
          </button>); })}
      </div>
      {err && <span className="caption c-danger">{err}</span>}
      <div className="col gap10"><span className="label">Daily goal</span>
        <div className="grid g3" style={{ gap: 10 }}>
          {[['Casual', 10, '5 min · 10 cards'], ['Regular', 20, '10 min · 20 cards'], ['Serious', 40, '20 min · 40 cards']].map(([n, v, d]) => (
            <button key={n} className={`card row center ${goal === v ? 'selected' : ''}`} style={{ padding: 14, gap: 10, textAlign: 'left' }} onClick={() => setGoal(v)}>
              <Icon name={goal === v ? 'Flame' : 'Clock'} size={18} color={goal === v ? '#D97706' : '#94A3B8'} /><div className="col gap4" style={{ gap: 0 }}><span className="label">{n}</span><span className="caption faint">{d}</span></div>
            </button>
          ))}
        </div>
      </div>
      <div className="row center soft bg-bg" style={{ gap: 14, padding: 16 }}>
        <div className="col grow gap4" style={{ gap: 2 }}><span className="label">Show Vietnamese hints</span><span className="caption muted">Add a short Vietnamese translation under each term (Gợi ý tiếng Việt).</span></div>
        <Toggle on={vi} onChange={setVi} label="Vietnamese hints" />
      </div>
      <div className="row center" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={() => nav('/onboarding/1')}>Back</button>
        <button className="btn btn-primary" onClick={() => { if (!doms.length) { setErr('Choose at least one domain.'); return; } a.finishOnboarding({ domains: doms, dailyGoal: goal, viHints: vi }); nav('/home'); }}>Start learning</button>
      </div>
    </OnbFrame>
  );
}

export function RequireOnboarding({ children }) {
  const { s } = useStore();
  if (!s.onboarded) return <Navigate to="/signup" replace />;
  return children;
}
