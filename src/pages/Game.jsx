import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon, Tag, IconBox, Progress, PageHead, FocusLayout, Toggle, COLOR } from '../components/ui.jsx';
import { useStore, rankInfo, BADGES, weekKey } from '../store.jsx';
import { RANK_XP } from '../data/skills.js';
import { CATEGORIES, TERMS, RARITY, termsIn } from '../data/terms.js';
import { CHAPTERS } from '../data/story.js';
import { shuffle } from './Practice.jsx';

// ---------- Achievements ----------
export function Achievements() {
  const { s } = useStore();
  const r = rankInfo(s.xp, s.track);
  const perks = ['Start of your path', 'Unlocks Story Mode chapters', 'Unlocks Advanced challenges', 'Profile frame + certificate', 'Become a community reviewer'];
  const earned = BADGES.filter((b) => s.badgesEarned[b.id]).length;
  return (
    <>
      <PageHead title="Achievements" sub="Your career rank grows with every XP you earn. Badges celebrate real skills you can use at work." />
      <div className="card p28" style={{ gap: 20 }}>
        <div className="row center"><div className="col grow gap4"><span className="overline c-primary">Career rank</span><span className="h2">{r.name} · {s.xp.toLocaleString()} XP</span></div>{r.next && <Tag tone="accent">{r.toNext.toLocaleString()} XP to next rank</Tag>}</div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {r.names.map((n, i) => { const st = i < r.index ? 'done' : i === r.index ? 'now' : 'next'; return (
            <div key={n} className="col" style={{ alignItems: 'center', textAlign: 'center', gap: 8, padding: 16, borderRadius: 14, background: st === 'now' ? 'var(--primary-soft)' : 'var(--bg)', border: st === 'now' ? '2px solid var(--primary)' : '2px solid transparent' }}>
              <div className="badge-ic" style={{ width: 56, height: 56, borderRadius: 99, background: st === 'done' ? 'var(--success)' : st === 'now' ? 'var(--primary)' : 'var(--border)' }}><Icon name={st === 'done' ? 'Check' : st === 'now' ? 'Crown' : 'Lock'} size={24} color={st === 'next' ? '#94A3B8' : '#fff'} /></div>
              <span className={`label ${st === 'next' ? 'faint' : ''}`}>{n}</span><span className="caption faint">{RANK_XP[i].toLocaleString()} XP</span><span className="caption muted">{perks[i]}</span>
            </div>); })}
        </div>
      </div>
      <div className="row center"><h2 className="h2 grow">Badges</h2><span className="label muted">{earned} of {BADGES.length} earned</span></div>
      <div className="grid g4">
        {BADGES.map((b) => { const [cur, goal] = b.prog(s); const got = s.badgesEarned[b.id]; const c = COLOR[b.color]; return (
          <div key={b.id} className="card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div className={`badge-ic ${got ? c.soft : 'bg-bg'}`} style={{ width: 64, height: 64, borderRadius: 99, background: got && b.color === 'advanced' ? 'var(--advanced-soft)' : undefined }}><Icon name={b.icon} size={28} color={got ? c.hex : '#94A3B8'} /></div>
            <span className={`h3 ${got ? '' : 'muted'}`}>{b.name}</span><span className="caption faint">{b.desc}</span>
            {got ? <Tag tone="success">Earned {got}</Tag> : <><Progress value={(Math.min(cur, goal) / goal) * 100} h={6} /><span className="caption muted">{b.best ? `Best: ${b.best(s)}` : `${Math.min(cur, goal)} / ${goal}`}</span></>}
          </div>); })}
      </div>
    </>
  );
}

// ---------- Collection ----------
export function Collection() {
  const { s } = useStore();
  const nav = useNavigate();
  const [set, setSet] = useState('team');
  const total = TERMS.length; const got = TERMS.filter((t) => s.learned.includes(t.id));
  const cards = termsIn(set); const have = cards.filter((t) => s.learned.includes(t.id)).length;
  const cat = CATEGORIES.find((c) => c.id === set);
  const missing = cards.filter((t) => !s.learned.includes(t.id));
  return (
    <>
      <PageHead title="Term Collection" sub="Every term you learn becomes a card. Complete a set to earn the Collector badge. Harder terms are rarer cards.">
        <button className="btn btn-primary" disabled={!missing.length} onClick={() => nav(`/flashcards?terms=${missing.map((t) => t.id).join(',')}&n=${missing.length}`)}>Collect missing cards</button>
      </PageHead>
      <div className="grid g4">
        {[[`${got.length} / ${total}`, 'Cards collected', 'primary'], [got.filter((t) => t.level === 1).length, 'Common', 'ink'], [got.filter((t) => t.level === 2).length, 'Rare', 'intermediate'], [got.filter((t) => t.level === 3).length, 'Epic', 'advanced']].map(([n, l, c]) => (
          <div key={l} className="card"><span className="h1" style={{ color: c === 'ink' ? 'var(--ink-2)' : `var(--${c})` }}>{n}</span><span className="small muted">{l}</span></div>))}
      </div>
      <h2 className="h2">Sets</h2>
      <div className="row wrap gap10">
        {CATEGORIES.map((c) => { const all = termsIn(c.id); const h = all.filter((t) => s.learned.includes(t.id)).length; const done = h === all.length; return (
          <button key={c.id} className={`card ${set === c.id ? 'selected' : ''}`} style={{ width: 200, padding: 16, gap: 8, textAlign: 'left' }} onClick={() => setSet(c.id)}>
            <div className="row center"><Icon name={done ? 'Award' : 'Copy'} size={18} color={done ? '#D97706' : set === c.id ? '#4F46E5' : '#475569'} /><div className="grow" /><span className="caption faint">{h}/{all.length}</span></div>
            <span className="label">{c.short === 'IT glossary' ? 'IT basics' : c.short}</span><Progress value={(h / all.length) * 100} h={6} />
          </button>); })}
      </div>
      <div className="row center"><h2 className="h2 grow">{cat.name} · {have} / {cards.length}</h2><span className="label c-primary">{cards.length - have ? `${cards.length - have} cards left to complete the set` : 'Set complete!'}</span></div>
      <div className="grid g6">
        {cards.map((t) => { const g = s.learned.includes(t.id); return g ? (
          <Link key={t.id} to={`/term/${t.id}`} className={`collect-card r${t.level}`}>
            <div className="stripe" style={{ background: t.level === 1 ? 'var(--ink-3)' : t.level === 2 ? 'var(--intermediate)' : 'var(--advanced)' }} />
            <span className="h3">{t.term}</span><span className="caption muted grow">{t.def.length > 70 ? t.def.slice(0, 68) + '…' : t.def}</span>
            <span className="overline" style={{ color: t.level === 1 ? 'var(--ink-3)' : t.level === 2 ? 'var(--intermediate)' : 'var(--advanced)' }}>{RARITY[t.level]}</span>
          </Link>) : (
          <Link key={t.id} to={`/term/${t.id}`} className="collect-card lock"><Icon name="Lock" size={24} /><span className="caption">Learn to unlock</span><span className="overline">{RARITY[t.level]}</span></Link>); })}
      </div>
    </>
  );
}

// ---------- Story mode ----------
export function Story() {
  const { s, a } = useStore();
  const [ch, setCh] = useState(() => (CHAPTERS.find((c) => c.scenes.length && !s.storyDone.includes(c.n)) || CHAPTERS[0]).n);
  const [scene, setScene] = useState(0); const [pick, setPick] = useState(null);
  const [meters, setMeters] = useState({ trust: 50, clarity: 50, timeline: 70 }); const [delta, setDelta] = useState(null); const [score, setScore] = useState(0);
  const chapter = CHAPTERS.find((c) => c.n === ch);
  const unlocked = (c) => c.n === 1 || s.storyDone.includes(c.n - 1);
  const start = (n) => { setCh(n); setScene(0); setPick(null); setMeters({ trust: 50, clarity: 50, timeline: 70 }); setDelta(null); setScore(0); };
  const sc = chapter.scenes[scene];
  const choose = (i) => {
    if (pick !== null) return;
    const c = sc.choices[i]; setPick(i); setDelta(c.fx);
    setMeters((m) => ({ trust: clamp(m.trust + c.fx.trust), clarity: clamp(m.clarity + c.fx.clarity), timeline: clamp(m.timeline + c.fx.timeline) }));
    if (c.q === 'best') setScore((x) => x + 1);
    a.storyChoice(c.q);
  };
  const done = scene >= chapter.scenes.length;
  const nextScene = () => { const n = scene + 1; setScene(n); setPick(null); setDelta(null); if (n >= chapter.scenes.length) a.storyDone(ch, score); };
  return (
    <>
      <PageHead title="Story Mode: Your first job at ShopNow" sub="You are the new junior BA at an online fashion shop. Each chapter is a sprint. Your choices change how the project goes." />
      <div className="row stack-sm gap24">
        <div className="card" style={{ width: 320, maxWidth: '100%', gap: 4 }}>
          <span className="h3" style={{ paddingBottom: 8 }}>Chapters</span>
          {CHAPTERS.map((c) => { const isDone = s.storyDone.includes(c.n); const open = unlocked(c) && c.scenes.length; const cur = c.n === ch; return (
            <button key={c.n} className="row center" disabled={!open} onClick={() => start(c.n)} style={{ gap: 12, padding: 12, borderRadius: 12, border: 0, textAlign: 'left', background: cur ? 'var(--primary-soft)' : 'transparent', cursor: open ? 'pointer' : 'default' }}>
              <span className="mark" style={{ width: 32, height: 32, borderRadius: 99, background: isDone ? 'var(--success)' : cur ? 'var(--primary)' : 'var(--bg)', color: '#fff' }}>{isDone ? <Icon name="Check" size={16} /> : open ? c.n : <Icon name="Lock" size={14} color="#94A3B8" />}</span>
              <div className="col grow" style={{ gap: 0 }}><span className="caption faint">Chapter {c.n}{!c.scenes.length ? ' · coming soon' : ''}</span><span className={`label ${open ? '' : 'faint'}`}>{c.title}</span></div>
            </button>); })}
        </div>
        <div className="col grow" style={{ gap: 20 }}>
          <div className="card p28" style={{ gap: 20 }}>
            {!done ? <>
              <div className="row center"><span className="overline c-primary grow">Chapter {ch} · Scene {scene + 1} of {chapter.scenes.length}</span><Tag tone="accent">+40 XP for the best answer</Tag></div>
              <div className="row" style={{ gap: 16 }}>
                <span className="mark" style={{ width: 48, height: 48, borderRadius: 99, background: 'var(--danger-soft)', color: 'var(--danger)' }}>{sc.avatar}</span>
                <div className="col grow soft bg-bg" style={{ padding: 18, borderRadius: 16, gap: 6 }}><span className="label c-danger">{sc.speaker}</span><p className="body">“{sc.line}”</p></div>
              </div>
              <h2 className="h2">{sc.question}</h2>
              {sc.choices.map((c, i) => { const cls = pick === null ? '' : i === pick ? (c.q === 'best' ? 'right' : c.q === 'bad' ? 'wrong' : 'sel') : c.q === 'best' ? 'right' : ''; return (
                <button key={i} className={`option ${cls}`} disabled={pick !== null} style={{ opacity: pick !== null && i !== pick && c.q !== 'best' ? 0.6 : 1 }} onClick={() => choose(i)}><span className="letter">{'ABC'[i]}</span><span className="grow">{c.text}</span></button>); })}
              {pick !== null && <div className="card row" style={{ gap: 14 }}><IconBox name="Lightbulb" tone={sc.choices[pick].q === 'best' ? 'success' : sc.choices[pick].q === 'ok' ? 'accent' : 'danger'} size={36} /><div className="col grow gap4"><span className={`label ${sc.choices[pick].q === 'best' ? 'c-success' : sc.choices[pick].q === 'ok' ? 'c-accent' : 'c-danger'}`}>{sc.choices[pick].q === 'best' ? 'Great BA move!' : sc.choices[pick].q === 'ok' ? 'Okay, but there is a better option.' : 'Risky choice.'}</span><span className="small muted">{sc.choices[pick].fb}</span></div></div>}
            </> : <div className="col" style={{ alignItems: 'center', textAlign: 'center', gap: 12, padding: 20 }}>
              <IconBox name="BookOpen" tone="success" size={72} iconSize={36} />
              <h2 className="h1">Chapter {ch} complete!</h2>
              <p className="body muted">You made the best choice in {score} of {chapter.scenes.length} scenes. +100 XP for finishing the chapter.</p>
              {CHAPTERS.find((c) => c.n === ch + 1 && c.scenes.length) ? <button className="btn btn-primary" onClick={() => start(ch + 1)}>Start chapter {ch + 1}</button> : <p className="small muted">More chapters are coming soon: writing the backlog, sprint review drama, UAT week and go-live day.</p>}
            </div>}
          </div>
          <div className="grid g3">
            {[['Stakeholder trust', 'trust', 'success'], ['Team clarity', 'clarity', 'primary'], ['Timeline', 'timeline', 'accent']].map(([l, k, c]) => (
              <div key={k} className="card" style={{ padding: 18, gap: 8 }}><div className="row"><span className="label grow">{l}</span>{delta && <span className={`label ${delta[k] > 0 ? 'c-success' : delta[k] < 0 ? 'c-danger' : 'faint'}`}>{delta[k] > 0 ? '+' : ''}{delta[k]}</span>}</div><Progress value={meters[k]} color={`var(--${c === 'accent' ? 'accent-bright' : c})`} /></div>))}
          </div>
          {!done && <div className="row center"><span className="small faint grow">Your choices shape the ending of the chapter.</span><button className="btn btn-primary" disabled={pick === null} onClick={nextScene}>{scene + 1 < chapter.scenes.length ? 'Next scene' : 'Finish chapter'}</button></div>}
        </div>
      </div>
    </>
  );
}
const clamp = (n) => Math.max(0, Math.min(100, n));

// ---------- Speed round ----------
const short = (d) => (d.length > 80 ? d.split(/[.—,]/)[0] : d);
export function Speed() {
  const { s, a } = useStore();
  const nav = useNavigate();
  const [phase, setPhase] = useState('intro');
  const [time, setTime] = useState(60); const [matches, setMatches] = useState(0); const [combo, setCombo] = useState(0); const [xp, setXp] = useState(0);
  const [round, setRound] = useState([]); const [right, setRight] = useState([]); const [sel, setSel] = useState(null); const [done, setDone] = useState([]); const [wrong, setWrong] = useState(null);
  const used = useRef(new Set());
  const deal = () => {
    let pool = TERMS.filter((t) => !used.current.has(t.id));
    if (pool.length < 5) { used.current = new Set(); pool = TERMS; }
    const pick = []; for (const t of shuffle(pool)) { if (!pick.some((p) => p.term === t.term)) pick.push(t); if (pick.length === 5) break; }
    pick.forEach((t) => used.current.add(t.id));
    setRound(pick); setRight(shuffle(pick)); setDone([]); setSel(null);
  };
  const begin = () => { setTime(60); setMatches(0); setCombo(0); setXp(0); used.current = new Set(); deal(); setPhase('play'); };
  useEffect(() => {
    if (phase !== 'play') return;
    if (time <= 0) { setPhase('end'); a.speedResult(matches); return; }
    const t = setTimeout(() => setTime((x) => x - 1), 1000); return () => clearTimeout(t);
  }, [phase, time]); // eslint-disable-line
  const pickRight = (t) => {
    if (!sel || done.includes(t.id)) return;
    if (sel === t.id) {
      const nd = [...done, t.id]; setDone(nd); setSel(null); setMatches((m) => m + 1);
      const nc = combo + 1; setCombo(nc); setXp((x) => x + 5 + (nc >= 3 ? 2 : 0));
      if (nd.length === round.length) setTimeout(deal, 250);
    } else { setWrong(t.id); setCombo(0); setTime((x) => Math.max(0, x - 3)); setTimeout(() => setWrong(null), 350); }
  };
  if (phase === 'intro' || phase === 'end') return (
    <FocusLayout title="Speed Round" icon="Timer" onClose={() => nav('/home')}>
      <div className="card p28 w760" style={{ alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <IconBox name={phase === 'end' ? 'Trophy' : 'Timer'} tone="accent" size={80} iconSize={40} />
        <h1 className="h1">{phase === 'end' ? `${matches} matches!` : 'Speed Round'}</h1>
        <p className="body muted">{phase === 'end' ? `You earned +${matches * 5} XP. ${matches >= s.speedBest ? 'New personal best!' : `Your best is ${s.speedBest}.`}` : 'Match each term to its meaning in 60 seconds. 3 correct in a row gives a combo bonus. A wrong match costs 3 seconds.'}</p>
        <div className="row gap8"><Tag tone="accent">Best: {s.speedBest}</Tag><Tag tone="primary">5 XP per match</Tag></div>
        <div className="row gap10"><Link to="/home" className="btn btn-secondary">Home</Link><button className="btn btn-primary" onClick={begin}>{phase === 'end' ? 'Play again' : 'Start'}</button></div>
      </div>
    </FocusLayout>
  );
  return (
    <FocusLayout title="Speed Round" icon="Timer" onClose={() => { setPhase('end'); a.speedResult(matches); }} right={<span className="label muted">Your best: {s.speedBest}</span>}>
      <div className="grid g4 w900">
        {[['Timer', 'accent', `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`, 'Time left'], ['Check', 'success', matches, 'Matches'], ['Zap', 'primary', `x${Math.max(1, combo)}`, 'Combo'], ['Star', 'accent', `+${xp}`, 'XP so far']].map(([i, t, n, l]) => (
          <div key={l} className="card row center" style={{ flexDirection: 'row', gap: 14, padding: 18 }}><IconBox name={i} tone={t} size={44} /><div className="col" style={{ gap: 0 }}><span className="h1">{n}</span><span className="caption faint">{l}</span></div></div>))}
      </div>
      <div className="w900"><Progress value={(time / 60) * 100} h={10} color="var(--accent-bright)" /></div>
      <span className="label muted">Tap a term, then its meaning</span>
      <div className="grid w900" style={{ gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="col">{round.map((t) => <button key={t.id} className={`match h3 ${done.includes(t.id) ? 'done' : sel === t.id ? 'sel' : ''}`} style={{ textAlign: 'center' }} disabled={done.includes(t.id)} onClick={() => setSel(t.id)}>{t.term}</button>)}</div>
        <div className="col">{right.map((t) => <button key={t.id} className={`match ${done.includes(t.id) ? 'done' : wrong === t.id ? 'wrong' : ''}`} disabled={done.includes(t.id)} onClick={() => pickRight(t)}>{short(t.def)}</button>)}</div>
      </div>
    </FocusLayout>
  );
}

// ---------- Study circle ----------
const PEERS = ['Minh', 'Lan', 'Huy', 'Thảo', 'Nam', 'Vy', 'Khoa', 'An', 'Linh', 'Tú', 'Mai', 'Quân', 'Hà', 'Phúc', 'Ngọc', 'Bảo', 'Trang'];
const seeded = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
export function circleBoard(s) {
  const wk = weekKey(); const day = (new Date().getDay() + 6) % 7 + 1;
  const peers = PEERS.map((n) => ({ name: n, xp: Math.round(seeded(wk + n) * 95 * day + 15 * day), trend: seeded(n + wk + 't') }));
  const me = { name: `${s.name || 'You'} (you)`, xp: s.weekly.xp, me: true, trend: 0.7 };
  return [...peers, ...(s.circleOptIn ? [me] : [])].sort((x, y) => y.xp - x.xp).map((p, i) => ({ ...p, rank: i + 1 }));
}
export function Circle() {
  const { s, a } = useStore();
  useEffect(() => { if (s.circleOptIn && !s.circleJoined) a.joinCircle(); }, [s.circleOptIn]); // eslint-disable-line
  const board = circleBoard(s);
  const end = new Date(); end.setDate(end.getDate() + (7 - ((end.getDay() + 6) % 7)) ); end.setHours(0, 0, 0, 0);
  const ms = end - new Date(); const dLeft = Math.floor(ms / 86400000); const hLeft = Math.floor((ms % 86400000) / 3600000);
  const group = board.reduce((t, p) => t + Math.round(p.xp / 5), 0); const goal = 2000;
  const show = board.slice(0, 10); const mine = board.find((p) => p.me);
  return (
    <>
      <div className="row center stack-sm" style={{ background: 'var(--po)', color: '#fff', borderRadius: 20, padding: 28, gap: 20 }}>
        <div className="badge-ic" style={{ width: 56, height: 56, background: '#fff', borderRadius: 14 }}><Icon name="Users" size={28} color="#0D9488" /></div>
        <div className="col grow gap4"><h1 className="h1">{['Beginner', 'Intermediate', 'Advanced', 'Expert'][s.startLevel - 1]} Circle · {weekKey().split('-')[1].replace('W', 'Week ')}</h1><p className="body">{board.length} learners at your level. Top 3 move up to the next circle. Nobody moves down.</p></div>
        <div className="col" style={{ alignItems: 'flex-end', gap: 2 }}><span className="caption">Ends in</span><span className="h2">{dLeft}d {hLeft}h</span></div>
      </div>
      <div className="row stack-sm gap24">
        <div className="card p0 grow">
          <div className="row center" style={{ padding: '16px 24px' }}><h3 className="h3 grow">Leaderboard</h3><span className="caption faint">XP this week</span></div>
          {!s.circleOptIn && <div className="soft bg-bg small" style={{ margin: '0 24px 16px' }}>You are hidden from the circle. Turn on “Show me in circles” to join the leaderboard.</div>}
          {show.map((p) => (
            <div key={p.name}>
              <div className="row center" style={{ gap: 14, padding: '12px 24px', background: p.me ? 'var(--primary-soft)' : p.rank <= 3 ? 'rgba(22,163,74,.06)' : 'transparent' }}>
                <span className={`label ${p.rank <= 3 ? 'c-success' : 'faint'}`} style={{ width: 24 }}>{p.rank}</span>
                <span className="mark" style={{ width: 36, height: 36, borderRadius: 99, background: p.me ? 'var(--primary)' : 'var(--bg)', color: p.me ? '#fff' : 'var(--ink-2)' }}>{p.name[0]}</span>
                <span className={`label grow ${p.me ? 'c-primary' : ''}`}>{p.name}</span>
                <Icon name={p.trend > 0.6 ? 'ChevronUp' : p.trend < 0.3 ? 'ChevronDown' : 'Minus'} size={16} color={p.trend > 0.6 ? '#16A34A' : p.trend < 0.3 ? '#DC2626' : '#94A3B8'} />
                <span className="label muted">{p.xp} XP</span>
              </div>
              {p.rank === 3 && <div className="row center gap8 caption c-success" style={{ padding: '8px 24px' }}><Icon name="ChevronUp" size={14} />Promotion zone — top 3 move up</div>}
            </div>))}
          {mine && mine.rank > 10 && <div className="row center" style={{ gap: 14, padding: '12px 24px', background: 'var(--primary-soft)', borderTop: '1px solid var(--border)' }}><span className="label faint" style={{ width: 24 }}>{mine.rank}</span><span className="label c-primary grow">{mine.name}</span><span className="label muted">{mine.xp} XP</span></div>}
        </div>
        <div className="col" style={{ width: 360, maxWidth: '100%', gap: 16 }}>
          <div className="card p24"><span className="overline c-po">Circle goal</span><span className="h3">{goal.toLocaleString()} cards together</span><Progress value={(Math.min(group, goal) / goal) * 100} h={10} color="var(--po)" />
            <div className="row"><span className="label c-po grow">{Math.min(group, goal).toLocaleString()} / {goal.toLocaleString()}</span><span className="caption faint">You: {s.weekly.cards}</span></div>
            <div className="row center soft bg-accent-soft gap8 label c-accent"><Icon name="Gift" size={18} />Everyone gets +100 XP</div></div>
          <div className="card p24"><span className="h3">Learn with friends</span><span className="small muted">Invite a colleague to learn with you. Real friend circles arrive with accounts in v2.</span>
            <button className="btn btn-secondary" onClick={() => { try { navigator.clipboard.writeText(window.location.origin + window.location.pathname); } catch (e) { /* ignore */ } }}>Copy invite link</button></div>
          <div className="card p24"><div className="row center gap8"><Icon name="Shield" size={18} /><span className="h3">Your privacy</span></div><span className="small muted">Circles are optional. Only first names are shown, and you can leave at any time.</span>
            <div className="row center"><span className="label grow">Show me in circles</span><Toggle on={s.circleOptIn} onChange={(v) => a.set({ circleOptIn: v })} label="Show me in circles" /></div>
            <span className="caption faint">Other learners in this preview are simulated until accounts launch.</span></div>
        </div>
      </div>
    </>
  );
}
