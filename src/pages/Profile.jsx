import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Tag, IconBox, Progress, Toggle, LevelTag } from '../components/ui.jsx';
import { useStore, rankInfo, dayStr, addDays } from '../store.jsx';
import { LEVELS, TRACKS, skillsFor } from '../data/skills.js';
import { CATEGORIES, termsIn } from '../data/terms.js';

export default function Profile() {
  const { s, a } = useStore();
  const r = rankInfo(s.xp, s.track);
  const [name, setName] = useState(s.name); const [edit, setEdit] = useState(false); const [confirm, setConfirm] = useState(false);
  const avg = s.attempts.length ? Math.round((s.attempts.reduce((t, x) => t + x.score / x.total, 0) / s.attempts.length) * 100) : 0;
  const week = Array.from({ length: 7 }, (_, i) => addDays(dayStr(), i - 6));
  const max = Math.max(50, ...week.map((d) => s.activity[d] || 0));
  const doneTotal = s.completedSkills.filter((id) => id.startsWith(s.track.toLowerCase())).length;
  const allTrack = LEVELS.reduce((t, l) => t + skillsFor(s.track, l.n).length, 0);
  const strengths = CATEGORIES.map((c) => { const all = termsIn(c.id); return [c, Math.round((all.filter((t) => s.learned.includes(t.id)).length / all.length) * 100)]; }).sort((x, y) => y[1] - x[1]);
  return (
    <>
      <div className="card p28 row center stack-sm" style={{ flexDirection: 'row', gap: 20 }}>
        <span className="mark" style={{ width: 72, height: 72, borderRadius: 99, background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: 30 }}>{(s.name || 'Y')[0].toUpperCase()}</span>
        <div className="col grow gap6">
          {edit ? <div className="row gap8"><input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ maxWidth: 320 }} /><button className="btn btn-primary" onClick={() => { a.set({ name: name.trim() || s.name }); setEdit(false); }}>Save</button></div> : <h1 className="h1">{s.name || 'Learner'}</h1>}
          <div className="row wrap gap8"><Tag>{TRACKS[s.track].name}</Tag><LevelTag level={s.startLevel} /><Tag tone="ink">{r.name}</Tag></div>
        </div>
        {!edit && <button className="btn btn-secondary" onClick={() => setEdit(true)}>Edit profile</button>}
      </div>
      <div className="grid g4">
        {[['Flame', 'accent', `${s.streak.count} days`, 'Current streak'], ['Route', 'primary', `${doneTotal} / ${allTrack}`, 'Skills completed'], ['BookOpen', 'po', s.learned.length, 'Terms learned'], ['Target', 'success', `${avg}%`, 'Average score']].map(([i, t, n, l]) => (
          <div key={l} className="card"><IconBox name={i} tone={t} /><span className="h1">{n}</span><span className="small muted">{l}</span></div>))}
      </div>
      <div className="row stretch stack-sm gap24">
        <div className="card p24 grow" style={{ gap: 14 }}><h3 className="h3">Roadmap progress</h3>
          {Object.values(TRACKS).map((t) => <div key={t.id} className="col gap8"><span className="overline faint">{t.name}</span>
            {LEVELS.map((l) => { const ks = skillsFor(t.id, l.n); const d = ks.filter((k) => s.completedSkills.includes(k.id)).length; const p = Math.round((d / ks.length) * 100); return (
              <div key={l.n} className="row center" style={{ gap: 12 }}><span className="small muted" style={{ width: 100 }}>{l.name}</span><div className="grow"><Progress value={p} color={t.id === 'BA' ? 'var(--primary)' : 'var(--po)'} /></div><span className="caption faint" style={{ width: 36 }}>{p}%</span></div>); })}
          </div>)}
        </div>
        <div className="card p24 grow" style={{ gap: 16 }}><h3 className="h3">This week</h3>
          <div className="row end" style={{ height: 180, gap: 14 }}>
            {week.map((d) => { const v = s.activity[d] || 0; return (
              <div key={d} className="col grow" style={{ alignItems: 'center', gap: 6 }}><span className="caption faint">{v}</span><div style={{ width: 28, height: Math.max(4, (v / max) * 130), borderRadius: '6px 6px 0 0', background: d === dayStr() ? 'var(--accent-bright)' : 'var(--primary)' }} /><span className="caption faint">{new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })}</span></div>); })}
          </div>
          <span className="small muted">{week.reduce((t, d) => t + (s.activity[d] || 0), 0)} XP this week · {s.totalReviews} cards reviewed in total · {s.attempts.length} tests</span>
        </div>
      </div>
      <div className="row stretch stack-sm gap24">
        <div className="card p24 grow" style={{ gap: 14 }}><h3 className="h3">Knowledge strength</h3>
          {strengths.map(([c, p]) => <div key={c.id} className="row center" style={{ gap: 12 }}><Link to={`/glossary/${c.id}`} className="small" style={{ width: 190 }}>{c.name}</Link><div className="grow"><Progress value={p} color={p >= 70 ? 'var(--success)' : p >= 40 ? 'var(--primary)' : p > 0 ? 'var(--accent-bright)' : 'var(--border)'} /></div><span className="caption faint" style={{ width: 36 }}>{p}%</span></div>)}
        </div>
        <div className="card p24" style={{ width: 440, maxWidth: '100%', gap: 4 }}><h3 className="h3" style={{ paddingBottom: 8 }}>Settings</h3>
          <Row label="Learning track"><div className="seg">{Object.values(TRACKS).map((t) => <button key={t.id} className={s.track === t.id ? 'on' : ''} onClick={() => a.set({ track: t.id })}>{t.id}</button>)}</div></Row>
          <Row label="Daily goal"><select className="chip" value={s.dailyGoal} onChange={(e) => a.set({ dailyGoal: Number(e.target.value) })}><option value={10}>Casual · 10 cards</option><option value={20}>Regular · 20 cards</option><option value={40}>Serious · 40 cards</option></select></Row>
          <Row label="Vietnamese hints"><Toggle on={s.viHints} onChange={(v) => a.set({ viHints: v })} label="Vietnamese hints" /></Row>
          <Row label="Show me in study circles"><Toggle on={s.circleOptIn} onChange={(v) => a.set({ circleOptIn: v })} label="Study circles" /></Row>
          <div className="col gap8" style={{ paddingTop: 12 }}>
            <span className="caption faint">Your progress is saved in this browser only. Accounts and sync come in v2.</span>
            <div className="row gap8 wrap">
              <button className="btn btn-secondary" onClick={a.loadDemo}>Load demo progress</button>
              {!confirm ? <button className="btn btn-danger" onClick={() => setConfirm(true)}>Reset progress</button> : <button className="btn btn-danger" onClick={() => { a.reset(); setConfirm(false); }}>Yes, delete everything</button>}
            </div>
          </div>
        </div>
      </div>
      <Link to="/achievements" className="card row center hover" style={{ flexDirection: 'row' }}><IconBox name="Award" tone="accent" /><span className="label grow">See your rank and badges</span><Icon name="ChevronRight" color="#94A3B8" /></Link>
    </>
  );
}
const Row = ({ label, children }) => <div className="row center" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}><span className="small grow">{label}</span>{children}</div>;
