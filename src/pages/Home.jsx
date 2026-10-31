import { Link } from 'react-router-dom';
import { Icon, Tag, IconBox, Progress } from '../components/ui.jsx';
import { useStore, rankInfo, skillState, dueCards, dayStr, addDays } from '../store.jsx';
import { SKILLS } from '../data/skills.js';
import { TERMS } from '../data/terms.js';
import { CHAPTERS } from '../data/story.js';
import { circleBoard } from './Game.jsx';

export function quests(s) {
  return [
    { icon: 'Copy', tone: 'primary', title: `Review ${s.dailyGoal} flashcards`, cur: Math.min(s.daily.cards, s.dailyGoal), tot: s.dailyGoal, xp: 20, to: '/flashcards?due=1' },
    { icon: 'BookOpen', tone: 'po', title: 'Learn 2 new terms', cur: Math.min(s.daily.terms, 2), tot: 2, xp: 15, to: '/general' },
    { icon: 'Target', tone: 'success', title: 'Pass 1 quiz with 70%+', cur: Math.min(s.daily.quizPassed, 1), tot: 1, xp: 25, to: '/practice' },
  ];
}

const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };

export default function Home() {
  const { s, a } = useStore();
  const r = rankInfo(s.xp, s.track);
  const trackSkills = SKILLS.filter((k) => k.track === s.track);
  const next = trackSkills.find((k) => skillState(s, k) === 'open');
  const q = quests(s);
  const allDone = q.every((x) => x.cur >= x.tot);
  const due = dueCards(s).length;
  const week = Array.from({ length: 7 }, (_, i) => addDays(dayStr(), i - 6));
  const board = circleBoard(s).slice(0, 4);
  const setTerms = TERMS.filter((t) => t.cat === 'team' && t.sub !== 'Ways of working');
  const setGot = setTerms.filter((t) => s.learned.includes(t.id)).length;
  const ch = CHAPTERS.find((c) => !s.storyDone.includes(c.n) && c.scenes.length) || CHAPTERS[0];

  return (
    <>
      <div className="col gap6">
        <h1 className="h1">{greet()}, {s.name || 'there'}</h1>
        <p className="body muted">You are {/^[AEIOU]/.test(r.name) ? 'an' : 'a'} {r.name}{r.next ? ` — ${r.toNext.toLocaleString()} XP until your next rank.` : '.'} Finish today’s quests to get there faster.</p>
      </div>

      <div className="home-split">
        <div className="panel-primary">
          <span className="overline">Career rank</span>
          <div className="h1">{r.name}</div>
          <Progress value={r.pct} h={10} color="var(--accent-bright)" track="rgba(255,255,255,.28)" />
          <div className="row center label"><span className="grow">{s.xp.toLocaleString()} / {(r.next || s.xp).toLocaleString()} XP</span>{r.nextName && <span>Next: {r.nextName}</span>}</div>
          <div className="row wrap gap8" style={{ paddingTop: 6 }}>
            {r.names.map((n, i) => (
              <span key={n} className="pill caption" style={{ border: '1px solid rgba(255,255,255,.6)', background: i === r.index ? '#fff' : 'transparent', color: i === r.index ? 'var(--primary)' : '#fff', opacity: i > r.index ? 0.6 : 1, fontSize: 12 }}>
                {i < r.index && <Icon name="Check" size={14} />}{i === r.index && <Icon name="Crown" size={14} />}{n}
              </span>
            ))}
          </div>
        </div>
        <div className="card p24" style={{ gap: 14 }}>
          <div className="row center gap10"><Icon name="Flame" size={28} color="#D97706" /><span className="h1">{s.streak.count}-day streak</span></div>
          <div className="row gap8">
            {week.map((d) => { const on = !!s.activity[d]; return (
              <div key={d} className="col" style={{ width: 38, height: 46, borderRadius: 10, background: on ? 'var(--accent-soft)' : 'var(--bg)', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Icon name={on ? 'Flame' : 'Square'} size={on ? 16 : 14} color={on ? '#D97706' : '#CBD5E1'} />
                <span className={`caption ${on ? 'c-accent' : 'faint'}`}>{'SMTWTFS'[new Date(d + 'T00:00:00').getDay()]}</span>
              </div>); })}
          </div>
          <div className="row center soft bg-primary-soft" style={{ gap: 10, padding: 12 }}>
            <Icon name="Snowflake" color="#3B82F6" />
            <div className="col gap4" style={{ gap: 2 }}><span className="label" style={{ color: 'var(--primary-dark)' }}>{s.streak.freezes} streak freeze{s.streak.freezes === 1 ? '' : 's'} ready</span><span className="caption muted">Protects your streak if you miss a day. Earn one every 7 days.</span></div>
          </div>
        </div>
      </div>

      <div className="home-split">
        <div className="card p24" style={{ gap: 4 }}>
          <div className="row center" style={{ paddingBottom: 8 }}><span className="h3 grow">Daily quests</span><span className="caption faint">Resets at midnight</span></div>
          {q.map((x) => { const done = x.cur >= x.tot; return (
            <Link to={x.to} key={x.title} className="row center" style={{ gap: 14, padding: '12px 0' }}>
              <IconBox name={done ? 'Check' : x.icon} tone={done ? 'success' : x.tone} />
              <div className="col grow gap6"><div className="row"><span className={`label grow ${done ? 'faint' : ''}`}>{x.title}</span><span className="caption faint">{x.cur} / {x.tot}</span></div><Progress value={(x.cur / x.tot) * 100} h={6} color={done ? 'var(--success)' : 'var(--primary)'} /></div>
              <Tag tone={done ? 'success' : 'accent'}>+{x.xp} XP</Tag>
            </Link>); })}
          <div className="row center soft bg-accent-soft wrap" style={{ gap: 12, marginTop: 8 }}>
            <Icon name="Gift" size={22} color="#D97706" />
            <span className="small grow" style={{ minWidth: 200 }}>{s.daily.chest ? 'Bonus chest opened today. See you tomorrow!' : 'Finish all 3 quests to open the bonus chest: +50 XP'}</span>
            {!s.daily.chest && <button className="btn btn-primary" style={{ padding: '8px 14px' }} disabled={!allDone} onClick={a.claimChest}>Open chest</button>}
          </div>
        </div>
        <div className="card p24">
          <span className="overline c-primary">Continue learning</span>
          {next ? <>
            <div className="h2">{next.title}</div>
            <p className="small muted">Skill {next.order + 1} · {['Beginner', 'Intermediate', 'Advanced', 'Expert'][next.level - 1]} · {next.track}</p>
            <span><Tag tone="accent">+50 XP when complete</Tag></span>
            <div className="grow" />
            <Link to={`/skill/${next.id}`} className="btn btn-primary block">Continue skill</Link>
          </> : <><div className="h3">All open skills done!</div><Link to="/roadmap" className="btn btn-primary block">Open roadmap</Link></>}
          {due > 0 && <Link to="/flashcards?due=1" className="btn btn-secondary block">Review {due} due card{due > 1 ? 's' : ''}</Link>}
        </div>
      </div>

      <div className="grid g4">
        <MiniCard icon="Users" tone="po" over="This week" title="Beginner Circle" to="/circle">
          {s.circleOptIn ? board.map((p) => (
            <div key={p.name} className="row center gap8" style={{ padding: '4px 8px', borderRadius: 8, background: p.me ? 'var(--primary-soft)' : 'transparent' }}>
              <span className={`caption ${p.rank <= 3 ? 'c-success' : 'faint'}`}>#{p.rank}</span><span className={`small grow ${p.me ? 'c-primary' : ''}`}>{p.me ? 'You' : p.name}</span><span className="caption muted">{p.xp} XP</span>
            </div>)) : <p className="small muted">You are not in a circle.</p>}
        </MiniCard>
        <MiniCard icon="Timer" tone="accent" over="60 seconds" title="Speed Round" to="/speed" btn="Play"><p className="small muted">Match terms to meanings before time runs out. Your best: {s.speedBest}.</p></MiniCard>
        <MiniCard icon="Copy" tone="primary" over="Collection" title="Scrum set" to="/collection" btn="View set"><p className="small muted">{setGot} of {setTerms.length} cards collected</p><Progress value={(setGot / setTerms.length) * 100} /></MiniCard>
        <MiniCard icon="BookOpen" tone="po" over="Story mode" title={`Chapter ${ch.n}: ${ch.title}`} to="/story" btn="Continue story"><p className="small muted">You are the new BA at ShopNow.</p></MiniCard>
      </div>
    </>
  );
}

function MiniCard({ icon, tone, over, title, to, btn, children }) {
  return (
    <div className="card">
      <div className="row center"><IconBox name={icon} tone={tone} /><div className="grow" /><span className="caption faint">{over}</span></div>
      <div className="h3">{title}</div>
      {children}
      <div className="grow" />
      {btn ? <Link to={to} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>{btn}</Link> : <Link to={to} className="label c-primary">Open circle →</Link>}
    </div>
  );
}
