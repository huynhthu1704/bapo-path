import { useState } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon, Tag, IconBox, Progress, Crumbs, PageHead, Check, LevelTag, FocusLayout } from '../components/ui.jsx';
import { useStore, skillState, challengeState, levelUnlocked } from '../store.jsx';
import { SKILLS, LEVELS, TRACKS, SKILL_BY_ID, skillsFor } from '../data/skills.js';
import { TERM_BY_ID } from '../data/terms.js';
import { CHALLENGES } from '../data/challenges.js';

const LV_COLOR = { 1: '#22C55E', 2: '#3B82F6', 3: '#8B5CF6', 4: '#F59E0B' };

export function Roadmap() {
  const { s } = useStore();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') || 'map';
  const [track, setTrack] = useState(s.track);
  const firstOpen = LEVELS.find((l) => skillsFor(track, l.n).some((k) => skillState(s, k) !== 'done') && levelUnlocked(s, track, l.n))?.n || 1;
  const [level, setLevel] = useState(firstOpen);
  const list = skillsFor(track, level);
  const current = SKILLS.find((k) => k.track === track && skillState(s, k) === 'open');
  return (
    <>
      <PageHead title="Skill Roadmap" sub="Everything you need to grow as a Business Analyst or Product Owner. Complete skills to unlock the next ones, and beat the challenge at the end of each level.">
        <div className="seg dark"><button className={view === 'list' ? 'on' : ''} onClick={() => setParams({ view: 'list' })}>List</button><button className={view === 'map' ? 'on' : ''} onClick={() => setParams({ view: 'map' })}>Map</button></div>
      </PageHead>
      <div className="row center wrap gap24">
        <div className="seg dark" style={{ background: '#fff', border: '1px solid var(--border)' }}>
          {Object.values(TRACKS).map((t) => <button key={t.id} className={track === t.id ? 'on' : ''} onClick={() => setTrack(t.id)}>{t.name}</button>)}
        </div>
        {view === 'map' && <div className="row center wrap gap24 caption muted">{[['#16A34A', 'Done'], ['#4F46E5', 'Next up'], ['#CBD5E1', 'Locked'], ['#F59E0B', 'Level challenge']].map(([c, l]) => <span key={l} className="row center gap6"><span style={{ width: 10, height: 10, borderRadius: 99, background: c }} />{l}</span>)}</div>}
      </div>

      {view === 'map' ? <TreeView track={track} current={current} /> : <>
        <div className="grid g4">
          {LEVELS.map((l) => {
            const ks = skillsFor(track, l.n); const done = ks.filter((k) => s.completedSkills.includes(k.id)).length;
            const unlocked = levelUnlocked(s, track, l.n);
            return (
              <button key={l.n} className="card" style={{ textAlign: 'left', border: level === l.n ? `2px solid ${LV_COLOR[l.n]}` : undefined }} onClick={() => setLevel(l.n)}>
                <div className="row center"><span className="h3 grow">{l.name}</span>{unlocked ? <LevelTag level={l.n} /> : <Icon name="Lock" size={18} color="#94A3B8" />}</div>
                <span className="small muted">{ks.length} skills · {l.blurb}</span>
                <Progress value={(done / ks.length) * 100} h={6} color={LV_COLOR[l.n]} />
                <span className="caption faint">{done} of {ks.length} done</span>
              </button>);
          })}
        </div>
        <h2 className="h2">{LEVELS[level - 1].name} skills</h2>
        <div className="grid g3">
          {list.map((k) => { const st = skillState(s, k); return (
            <Link key={k.id} to={`/skill/${k.id}`} className="card hover" style={{ opacity: st === 'locked' ? 0.6 : 1 }}>
              <div className="row center"><span className="caption faint grow">Skill {k.order + 1}</span>
                {st === 'done' ? <Tag tone="success">Done</Tag> : st === 'open' ? <Tag>Available</Tag> : <Tag tone="ink"><Icon name="Lock" size={12} />Locked</Tag>}</div>
              <div className="h3">{k.title}</div><p className="small muted">{k.summary}</p>
              <div className="row center gap6 caption faint"><Icon name="Clock" size={14} />{k.minutes} min · {k.terms.length} terms · +50 XP</div>
            </Link>); })}
        </div>
        <ChallengeBanner track={track} level={level} />
      </>}
    </>
  );
}

function ChallengeBanner({ track, level }) {
  const { s } = useStore();
  const st = challengeState(s, track, level);
  const has = !!CHALLENGES[`${track}-${level}`];
  return (
    <div className={`boss ${st === 'locked' ? 'locked' : ''}`}>
      <Icon name={st === 'passed' ? 'Award' : 'Swords'} size={24} color={st === 'locked' ? '#94A3B8' : '#D97706'} />
      <div className="col grow gap4" style={{ gap: 2 }}>
        <span className="label">{LEVELS[level - 1].name} Challenge — {st === 'passed' ? 'passed!' : 'pass 4 of 5 scenarios to unlock the next level'}</span>
        <span className="caption muted">{st === 'locked' ? 'Complete every skill in this level to unlock it.' : has ? '+300 XP · badge · next level unlocked' : 'Scenarios for this level are coming soon.'}</span>
      </div>
      {st === 'open' && has && <Link to={`/challenge/${track}/${level}`} className="btn btn-primary">Start challenge</Link>}
      {st !== 'locked' && <Tag tone="accent">+300 XP</Tag>}
    </div>
  );
}

function TreeView({ track, current }) {
  const { s } = useStore();
  const nav = useNavigate();
  return (
    <>
      <div className="tree">
        {LEVELS.map((l) => {
          const ks = skillsFor(track, l.n);
          const unlocked = levelUnlocked(s, track, l.n);
          const done = ks.filter((k) => s.completedSkills.includes(k.id)).length;
          if (!unlocked) return (
            <div key={l.n} className="boss locked"><Icon name="Lock" size={18} /><span className="label">{l.name.toUpperCase()} · {ks.length} skills · Locked — pass the {LEVELS[l.n - 2].name} Challenge to unlock</span></div>
          );
          const rows = []; for (let i = 0; i < ks.length; i += 6) rows.push(ks.slice(i, i + 6));
          return (
            <div key={l.n} className="col" style={{ gap: 14 }}>
              <span className="overline" style={{ color: LV_COLOR[l.n] }}>{l.name} · {done} of {ks.length} done</span>
              {rows.map((row, ri) => (
                <div key={ri} className={`tree-row ${ri % 2 ? 'rev' : ''}`}>
                  {row.map((k) => {
                    const st = skillState(s, k); const isNow = current && current.id === k.id;
                    const cls = st === 'done' ? 'done' : isNow ? 'now' : st === 'open' ? 'open' : 'locked';
                    return (
                      <button key={k.id} className={`tree-node ${cls}`} disabled={st === 'locked'} onClick={() => nav(`/skill/${k.id}`)}>
                        <div className="row center gap6">
                          <Icon name={st === 'done' ? 'Check' : isNow ? 'Star' : st === 'open' ? 'Route' : 'Lock'} size={16} color={st === 'done' ? '#16A34A' : isNow ? '#fff' : st === 'open' ? '#4F46E5' : '#94A3B8'} />
                          <span className="grow" /><span className="caption" style={{ color: isNow ? '#fff' : st === 'locked' ? 'var(--ink-3)' : 'var(--accent)' }}>{st === 'locked' ? 'Locked' : '+50 XP'}</span>
                        </div>
                        <span className="label">{k.title}</span>
                      </button>);
                  })}
                </div>
              ))}
              <ChallengeBanner track={track} level={l.n} />
            </div>
          );
        })}
      </div>
      {current && (
        <div className="row center soft bg-primary-soft stack-sm" style={{ padding: 20, gap: 16, borderRadius: 16 }}>
          <div className="badge-ic" style={{ background: 'var(--primary)', width: 44, height: 44 }}><Icon name="Star" color="#fff" /></div>
          <div className="col grow gap4" style={{ gap: 2 }}><span className="h3" style={{ color: 'var(--primary-dark)' }}>Next up: {current.title}</span><span className="small muted">Finish this skill to earn +50 XP and unlock the next one.</span></div>
          <Link to={`/skill/${current.id}`} className="btn btn-primary">Start skill</Link>
        </div>
      )}
    </>
  );
}

export function SkillDetail() {
  const { id } = useParams();
  const { s, a } = useStore();
  const nav = useNavigate();
  const k = SKILL_BY_ID[id];
  if (!k) return <p>Skill not found. <Link to="/roadmap" className="c-primary">Back to roadmap</Link></p>;
  const st = skillState(s, k);
  const levelList = skillsFor(k.track, k.level);
  const doneN = levelList.filter((x) => s.completedSkills.includes(x.id)).length;
  const nextSkill = levelList[k.order + 1];
  const terms = k.terms.map((t) => TERM_BY_ID[t]).filter(Boolean);
  const lvl = LEVELS[k.level - 1];
  return (
    <>
      <Crumbs items={[['Skill Roadmap', '/roadmap'], [`${k.track} · ${lvl.name}`, '/roadmap?view=list'], [k.title]]} />
      <div className="row end stack-sm gap24">
        <div className="col grow gap10">
          <div className="row gap8 wrap"><LevelTag level={k.level} /><Tag>{TRACKS[k.track].name}</Tag><Tag tone="ink">{k.minutes} min</Tag><Tag tone="accent">+50 XP</Tag></div>
          <h1 className="display">{k.title}</h1>
          <p className="body muted">{k.summary}</p>
        </div>
        <div className="row gap10">
          <button className="btn btn-secondary" disabled={!terms.length} onClick={() => nav(`/quiz?mode=mcq&terms=${k.terms.join(',')}&n=${Math.min(5, terms.length)}`)}>Practise this skill</button>
          {st === 'done' ? <span className="btn btn-secondary c-success"><Icon name="Check" size={16} />Completed</span>
            : <button className="btn btn-primary" disabled={st === 'locked'} onClick={() => a.completeSkill(k.id)}>Mark as complete</button>}
        </div>
      </div>
      {st === 'locked' && <div className="row center soft bg-bg gap10"><Icon name="Lock" size={18} /><span className="small">This skill is locked. Finish earlier skills in this level first — you can still read it.</span></div>}
      <div className="row stack-sm gap24">
        <div className="col grow" style={{ gap: 16 }}>
          {k.full ? <>
            <Section title="Why it matters"><p className="body muted">{k.why}</p></Section>
            <Section title="How to do it">
              {k.steps.map((t, i) => <div key={i} className="row center" style={{ gap: 12 }}><span className="mark" style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: 12 }}>{i + 1}</span><span className="body">{t}</span></div>)}
            </Section>
            <div className="card p24 bg-primary-soft" style={{ borderColor: 'var(--primary-soft)' }}>
              <span className="overline c-primary">Example</span><p className="h3" style={{ color: 'var(--primary-dark)' }}>{k.example}</p>
            </div>
            <Section title="Common mistakes">{k.mistakes.map((m) => <p key={m} className="body muted">• {m}</p>)}</Section>
            <Section title="Self-check">
              {k.checks.map((c, i) => { const on = !!s.selfChecks[`${k.id}:${i}`]; return (
                <button key={i} className="row center" style={{ gap: 10, border: 0, background: 'none', padding: 0, textAlign: 'left' }} onClick={() => a.toggleCheck(k.id, i)}><Check on={on} done /><span className="body">{c}</span></button>); })}
            </Section>
          </> : <>
            <Section title="Key points">{k.points.map((p) => <p key={p} className="body">• {p}</p>)}</Section>
            <div className="row center soft bg-accent-soft gap10"><Icon name="Sparkles" size={18} color="#D97706" /><span className="small">The full lesson for this skill is coming soon. You can still mark it complete when you have studied it on your own.</span></div>
          </>}
        </div>
        <div className="col" style={{ width: 340, maxWidth: '100%', gap: 16 }}>
          <div className="card"><span className="label">Your {lvl.name} progress</span><Progress value={(doneN / levelList.length) * 100} color={LV_COLOR[k.level]} /><span className="caption faint">{doneN} of {levelList.length} skills</span></div>
          {terms.length > 0 && <div className="card"><span className="label">Key terms</span><div className="row wrap gap6">{terms.map((t) => <Link key={t.id} to={`/term/${t.id}`}><Tag tone="po">{t.term}</Tag></Link>)}</div></div>}
          {nextSkill && <Link to={`/skill/${nextSkill.id}`} className="card hover"><span className="overline faint">Next skill</span><span className="h3">{nextSkill.title}</span><span className="row center gap6 label c-primary">Open <Icon name="ArrowRight" size={16} /></span></Link>}
          {!nextSkill && <ChallengeBanner track={k.track} level={k.level} />}
        </div>
      </div>
    </>
  );
}

const Section = ({ title, children }) => <div className="card p24"><h3 className="h3">{title}</h3>{children}</div>;

export function Challenge() {
  const { track, level } = useParams();
  const { s, a } = useStore();
  const nav = useNavigate();
  const key = `${track}-${level}`;
  const list = CHALLENGES[key] || [];
  const [i, setI] = useState(0); const [sel, setSel] = useState(null); const [checked, setChecked] = useState(false);
  const [lives, setLives] = useState(3); const [results, setResults] = useState([]); const [err, setErr] = useState('');
  const [hint, setHint] = useState(false);
  const correct = results.filter(Boolean).length;
  const finished = results.length === list.length || lives === 0;
  const passed = finished && correct >= 4;
  const lvName = LEVELS[level - 1]?.name;
  if (!list.length) return <FocusLayout title="Challenge"><p>Scenarios for this level are coming soon.</p></FocusLayout>;

  if (finished) {
    return (
      <FocusLayout title={`${lvName} Challenge`} icon="Swords" onClose={() => nav('/roadmap')}>
        <div className="card p28 w760" style={{ alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div className="badge-ic" style={{ width: 80, height: 80, borderRadius: 99, background: passed ? 'var(--accent-soft)' : 'var(--bg)' }}><Icon name={passed ? 'Award' : 'RotateCcw'} size={40} color={passed ? '#D97706' : '#475569'} /></div>
          <h1 className="h1">{passed ? `You passed the ${lvName} Challenge!` : 'Not this time'}</h1>
          <p className="body muted">{correct} of {list.length} scenarios correct. {passed ? 'The next level is now unlocked. +300 XP and a new badge are yours.' : 'You need 4 of 5. Review the skills and try again — your progress is kept.'}</p>
          <div className="row gap10">{passed ? <button className="btn btn-primary" onClick={() => nav('/roadmap')}>Back to roadmap</button> : <><button className="btn btn-secondary" onClick={() => nav('/roadmap')}>Back to roadmap</button><button className="btn btn-primary" onClick={() => { setI(0); setSel(null); setChecked(false); setLives(3); setResults([]); }}>Try again</button></>}</div>
        </div>
      </FocusLayout>
    );
  }
  const q = list[i];
  const check = () => {
    if (sel === null) { setErr('Choose an answer first.'); return; }
    setChecked(true);
    if (sel !== q.answer) setLives((l) => l - 1);
  };
  const next = () => {
    const ok = sel === q.answer;
    const nr = [...results, ok];
    setResults(nr);
    if (nr.filter(Boolean).length >= 4 && nr.length === list.length || (nr.length === list.length && nr.filter(Boolean).length >= 4)) a.passChallenge(key);
    setI(i + 1); setSel(null); setChecked(false); setHint(false);
  };
  return (
    <FocusLayout title={`${lvName} Challenge · Boss level`} icon="Swords" onClose={() => nav('/roadmap')} right={<>
      <span className="row center gap4">{[0, 1, 2].map((n) => <Icon key={n} name="Heart" size={20} color={n < lives ? '#DC2626' : '#CBD5E1'} fill={n < lives ? '#DC2626' : 'none'} />)}</span>
      <span className="label muted hide-sm">Scenario {i + 1} of {list.length}</span>
      <div style={{ width: 200 }} className="hide-sm"><Progress value={(i / list.length) * 100} color="var(--accent-bright)" /></div>
    </>}>
      <div className="row stack-sm w1100" style={{ gap: 32 }}>
        <div className="col grow" style={{ gap: 20 }}>
          <div className="row gap8"><Tag tone="po">{q.topic}</Tag><Tag tone="ink">Scenario</Tag></div>
          <div className="soft bg-primary-soft col gap10" style={{ padding: 24, borderRadius: 16 }}><span className="overline c-primary">The situation</span><p className="body">{q.situation}</p></div>
          <h2 className="h1">{q.question}</h2>
          {q.options.map((o, n) => {
            const cls = checked ? (n === q.answer ? 'right' : n === sel ? 'wrong' : '') : n === sel ? 'sel' : '';
            return <button key={n} className={`option ${cls}`} disabled={checked} onClick={() => { setSel(n); setErr(''); }}><span className="letter">{'ABCD'[n]}</span><span className="grow">{o}</span>{checked && n === q.answer && <Icon name="Check" color="#16A34A" />}</button>;
          })}
          {err && <span className="caption c-danger">{err}</span>}
          {hint && !checked && <div className="soft bg-accent-soft small">Hint: think about what a professional BA/PO would do to protect both the relationship and the team’s process.</div>}
          {checked && <div className="card row" style={{ gap: 14 }}><IconBox name="Lightbulb" tone={sel === q.answer ? 'success' : 'danger'} size={36} /><div className="col grow gap4"><span className={`label ${sel === q.answer ? 'c-success' : 'c-danger'}`}>{sel === q.answer ? 'Correct!' : 'Not quite — you lost a life.'}</span><span className="small muted">{q.explain}</span></div></div>}
          <div className="row center">
            {!checked && !hint && <button className="btn btn-ghost" style={{ color: 'var(--accent)' }} onClick={() => setHint(true)}><Icon name="Lightbulb" size={18} />Show a hint</button>}
            <div className="grow" />
            {!checked ? <button className="btn btn-primary" onClick={check}>Check answer</button> : <button className="btn btn-primary" onClick={next}>{i + 1 === list.length || lives === 0 ? 'See result' : 'Next scenario'}</button>}
          </div>
        </div>
        <div className="col" style={{ width: 340, maxWidth: '100%', gap: 16 }}>
          <div className="card p24"><span className="h3">To pass</span><span className="small muted">Get 4 of 5 scenarios right. You have 3 lives — a wrong answer costs one.</span>
            <div className="row gap8">{list.map((_, n) => { const r = results[n]; return <span key={n} className="mark" style={{ borderRadius: 99, background: r === true ? 'var(--success)' : r === false ? 'var(--danger)' : n === i ? 'var(--primary)' : 'var(--bg)', color: r === undefined && n !== i ? 'var(--ink-3)' : '#fff' }}>{r === true ? <Icon name="Check" size={16} /> : r === false ? <Icon name="X" size={16} /> : n + 1}</span>; })}</div>
          </div>
          <div className="card p24 bg-accent-soft" style={{ borderColor: 'var(--accent-soft)' }}><span className="overline c-accent">Rewards</span>
            {[['Unlock', `Unlock ${LEVELS[level]?.name || 'the next'} level`], ['Star', '+300 XP'], ['Award', 'Badge: Beginner Graduate'], ['FileText', 'Certificate (coming in v2)']].map(([ic, t]) => <div key={t} className="row center gap10 label"><Icon name={ic} size={18} color="#D97706" />{t}</div>)}
          </div>
        </div>
      </div>
    </FocusLayout>
  );
}
