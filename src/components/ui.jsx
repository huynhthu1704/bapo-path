import * as L from './icons.js';
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore, rankInfo } from '../store.jsx';
import { logSearch, enabled as authEnabled, signInWithGoogle, signInErrorText } from '../firebase.js';
import { TERMS, LEVEL_NAMES } from '../data/terms.js';
import { SKILLS, TRACKS } from '../data/skills.js';

export const Icon = ({ name, size = 20, color, ...p }) => {
  const C = L[name] || L.Circle;
  return <C size={size} color={color} strokeWidth={2} {...p} />;
};

export const COLOR = {
  primary: { hex: '#4F46E5', soft: 'bg-primary-soft', tag: 't-primary' },
  po: { hex: '#0D9488', soft: 'bg-po-soft', tag: 't-po' },
  accent: { hex: '#D97706', soft: 'bg-accent-soft', tag: 't-accent' },
  success: { hex: '#16A34A', soft: 'bg-success-soft', tag: 't-success' },
  danger: { hex: '#DC2626', soft: 'bg-danger-soft', tag: 't-danger' },
  advanced: { hex: '#8B5CF6', soft: 'bg-primary-soft', tag: 't-advanced' },
  ink: { hex: '#475569', soft: 'bg-bg', tag: 't-ink' },
};

export const Tag = ({ children, tone = 'primary', className = '' }) => <span className={`tag t-${tone} ${className}`}>{children}</span>;
export const LevelTag = ({ level }) => {
  const n = typeof level === 'number' ? level : 1;
  const name = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert' }[n];
  return <Tag tone={name.toLowerCase()}>{name}</Tag>;
};
export const Progress = ({ value, color = 'var(--primary)', h = 8, track }) => (
  <div className="progress" style={{ height: h, background: track }}><div style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} /></div>
);
export const IconBox = ({ name, tone = 'primary', size = 40, iconSize = 20 }) => (
  <div className={`badge-ic ${COLOR[tone].soft}`} style={{ width: size, height: size }}><Icon name={name} size={iconSize} color={COLOR[tone].hex} /></div>
);
export const Toggle = ({ on, onChange, label }) => (
  <button className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on} aria-label={label}><span /></button>
);
export const Check = ({ on, done }) => <span className={`box ${on ? (done ? 'done' : 'on') : ''}`}>{on && <Icon name="Check" size={14} color="#fff" />}</span>;
export const Crumbs = ({ items }) => (
  <div className="row center gap8 small">
    {items.map(([label, to], i) => (
      <span key={i} className="row center gap8">
        {i > 0 && <Icon name="ChevronRight" size={14} color="#94A3B8" />}
        {to ? <Link to={to} className="faint">{label}</Link> : <span>{label}</span>}
      </span>
    ))}
  </div>
);
export const PageHead = ({ title, sub, children }) => (
  <div className="row end stack-sm" style={{ gap: 16 }}>
    <div className="col grow gap6"><h1 className="h1">{title}</h1>{sub && <p className="body muted">{sub}</p>}</div>
    {children}
  </div>
);

const NAV = [
  ['LEARN', [['/home', 'Home', 'Home'], ['/roadmap', 'Skill Roadmap', 'Route'], ['/general', 'General Knowledge', 'Globe'], ['/domains', 'Domain Knowledge', 'Briefcase'], ['/practice', 'Practice', 'Zap'], ['/saved', 'Saved', 'Bookmark']]],
  ['PLAY', [['/story', 'Story Mode', 'BookOpen'], ['/speed', 'Speed Round', 'Timer'], ['/collection', 'Collection', 'Copy'], ['/circle', 'Study Circle', 'Users']]],
  ['YOU', [['/jobs', 'My Job Search', 'ClipboardList'], ['/library', 'My Library', 'History'], ['/achievements', 'Achievements', 'Award'], ['/profile', 'Progress & Profile', 'User']]],
];

function Sidebar() {
  const { s, admin } = useStore();
  const r = rankInfo(s.xp, s.track);
  return (
    <aside className="sidebar">
      <Link to="/home" className="logo"><div className="mark">BP</div><div><div className="h3">BAPO Path</div><div className="caption faint">BA & PO learning</div></div></Link>
      {NAV.map(([sec, items]) => (
        <div key={sec} className="col gap4" style={{ gap: 2 }}>
          <div className="nav-sec overline">{sec}</div>
          {items.map(([to, label, icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon name={icon} size={20} />{label}</NavLink>
          ))}
        </div>
      ))}
      {admin && <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon name="Database" size={20} />Knowledge admin</NavLink>}
      <Link to="/achievements" className="rank-card">
        <div className="row center gap8"><Icon name="Award" size={18} color="#4F46E5" /><span className="label grow" style={{ color: 'var(--primary-dark)' }}>{r.name}</span><span className="caption c-primary">Rank {r.index + 1}</span></div>
        <Progress value={r.pct} h={6} track="#fff" />
        <div className="caption muted">{r.next ? `${s.xp.toLocaleString()} / ${r.next.toLocaleString()} XP to ${r.nextName}` : `${s.xp.toLocaleString()} XP · top rank`}</div>
        <div className="row center gap6 caption"><Icon name="Flame" size={14} color="#D97706" /><span className="c-accent">{s.streak.count}-day streak</span><Icon name="Snowflake" size={14} color="#3B82F6" /><span className="muted">{s.streak.freezes} freeze</span></div>
      </Link>
    </aside>
  );
}

function SearchBox() {
  const { user } = useStore();
  const [q, setQ] = useState(''); const [open, setOpen] = useState(false);
  const record = (r) => { if (user && q.trim()) logSearch(user.uid, q.trim(), r ? { label: r.label, to: r.to, meta: r.meta } : null).catch(() => {}); };
  const ref = useRef(); const nav = useNavigate();
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const ql = q.trim().toLowerCase();
  const results = ql.length < 2 ? [] : [
    ...TERMS.filter((t) => (t.term + ' ' + t.full).toLowerCase().includes(ql)).slice(0, 6).map((t) => ({ to: `/term/${t.id}`, label: t.term, meta: 'Term' })),
    ...SKILLS.filter((k) => k.title.toLowerCase().includes(ql)).slice(0, 4).map((k) => ({ to: `/skill/${k.id}`, label: k.title, meta: `Skill · ${k.track}` })),
  ];
  return (
    <div className="search" ref={ref}>
      <Icon name="Search" size={18} color="#94A3B8" />
      <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Search terms, skills, domains…" aria-label="Search"
        onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) { record(results[0]); nav(results[0].to); setOpen(false); setQ(''); } }} />
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((r) => <Link key={r.to} to={r.to} onClick={() => { record(r); setOpen(false); setQ(''); }}><span className="label">{r.label}</span><span className="caption faint">{r.meta}</span></Link>)}
        </div>
      )}
    </div>
  );
}

function TopBar() {
  const { s, user } = useStore();
  return (
    <header className="topbar">
      <SearchBox />
      <div className="grow" />
      <Tag className="hide-sm">{s.track} · {['Beginner', 'Intermediate', 'Advanced', 'Expert'][s.startLevel - 1]}</Tag>
      <span className="pill bg-accent-soft c-accent"><Icon name="Flame" size={16} color="#D97706" />{s.streak.count}</span>
      <span className="pill bg-primary-soft c-primary hide-sm"><Icon name="Star" size={16} color="#4F46E5" />{s.xp.toLocaleString()} XP</span>
      {!user && <span className="hide-sm"><GoogleButton label="Sign in" small /></span>}
      <Link to="/profile" className="mark" title={user ? `Signed in as ${user.email}` : 'Not signed in'} style={{ background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: 999, overflow: 'hidden' }}>{user && user.photoURL ? <img src={user.photoURL} alt="" width="36" height="36" referrerPolicy="no-referrer" /> : (s.name || 'You')[0].toUpperCase()}</Link>
    </header>
  );
}

function MobileNav() {
  return (
    <nav className="mobile-nav">
      {[['/home', 'Home', 'Home'], ['/roadmap', 'Roadmap', 'Route'], ['/general', 'Glossary', 'Globe'], ['/practice', 'Practice', 'Zap'], ['/profile', 'Me', 'User']].map(([to, l, i]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}><Icon name={i} size={20} />{l}</NavLink>
      ))}
    </nav>
  );
}

export function Toasts() {
  const { s, a } = useStore();
  useEffect(() => {
    if (!s.toasts.length) return;
    const t = setTimeout(() => a.dismissToast(s.toasts[0].id), 4500);
    return () => clearTimeout(t);
  }, [s.toasts, a]);
  return (
    <div className="toasts" aria-live="polite">
      {s.toasts.slice(0, 3).map((t) => (
        <div key={t.id} className="toast" onClick={() => a.dismissToast(t.id)}>
          <div className="badge-ic" style={{ background: t.kind === 'rank' ? '#4F46E5' : '#F59E0B' }}><Icon name={t.kind === 'rank' ? 'Crown' : 'Award'} color="#fff" /></div>
          <div><div className="caption" style={{ color: '#CBD5E1' }}>{t.title}</div><div className="label">{t.text}</div></div>
        </div>
      ))}
    </div>
  );
}

export function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main"><TopBar /><main className="content">{children}</main></div>
      <MobileNav />
    </div>
  );
}

export function FocusLayout({ title, icon, right, onClose, children }) {
  const nav = useNavigate();
  return (
    <div className="focus">
      <header className="topbar">
        <button className="icon-btn" onClick={onClose || (() => nav(-1))} aria-label="Close"><Icon name="X" size={18} /></button>
        {icon && <Icon name={icon} size={20} color="#D97706" />}
        <span className="label">{title}</span>
        <div className="grow" />
        {right}
      </header>
      <div className="focus-body">{children}</div>
    </div>
  );
}

export const trackName = (t) => TRACKS[t].name;
export const levelName = (n) => LEVEL_NAMES[n] || 'Expert';

export const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
);

// "Sign in with Google" button used across the site. After sign-in it calls onDone(user) if given.
export function GoogleButton({ label = 'Sign in with Google', primary = false, block = false, small = false, onDone }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  if (!authEnabled) return null;
  const go = async () => {
    setErr(''); setBusy(true);
    try { const u = await signInWithGoogle(); if (u && onDone) await onDone(u); } catch (e) { setErr(signInErrorText(e)); }
    setBusy(false);
  };
  return (
    <span className="col" style={{ gap: 6, alignItems: block ? 'stretch' : 'flex-start', width: block ? '100%' : undefined }}>
      <button type="button" className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} ${block ? 'block' : ''}`} style={small ? { padding: '8px 14px' } : undefined} disabled={busy} onClick={go}>
        <span style={{ background: '#fff', borderRadius: 4, display: 'grid', placeItems: 'center', padding: primary ? 2 : 0 }}><GoogleG /></span>{busy ? 'Signing in…' : label}
      </button>
      {err && <span className="caption c-danger" role="alert">{err}</span>}
    </span>
  );
}
