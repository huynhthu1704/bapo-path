import { Translations } from '../components/Translations.jsx';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon, Tag, IconBox, Progress, PageHead, FocusLayout, Check, LevelTag } from '../components/ui.jsx';
import { useStore, dueCards, rankInfo, BADGES } from '../store.jsx';
import { CATEGORIES, CAT_BY_ID, TERMS, TERM_BY_ID } from '../data/terms.js';

export const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function poolFrom(params, s) {
  const terms = params.get('terms'); const cats = params.get('cats'); const src = params.get('src');
  let pool = terms ? terms.split(',').map((id) => TERM_BY_ID[id]).filter(Boolean) : cats ? TERMS.filter((t) => cats.split(',').includes(t.cat)) : TERMS;
  if (src === 'saved') pool = pool.filter((t) => s.saved.includes(t.id));
  if (src === 'weak') pool = pool.filter((t) => s.cards[t.id] && s.cards[t.id].box <= 2);
  return pool;
}

export function PracticeSetup() {
  const { s } = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState('mixed');
  const [cats, setCats] = useState(['team', 'se', ...s.domains.slice(0, 1)]);
  const [n, setN] = useState(10); const [src, setSrc] = useState('all'); const [err, setErr] = useState('');
  const pool = TERMS.filter((t) => cats.includes(t.cat) && (src !== 'saved' || s.saved.includes(t.id)) && (src !== 'weak' || (s.cards[t.id] && s.cards[t.id].box <= 2)));
  const due = dueCards(s).length;
  const tog = (id) => { setErr(''); setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id])); };
  const start = () => {
    if (!cats.length) { setErr('Choose at least one topic.'); return; }
    if (pool.length < (mode === 'flashcards' ? 1 : 4)) { setErr(src === 'all' ? 'Choose more topics — there are not enough terms.' : `Not enough ${src} terms in these topics yet. Try “All”.`); return; }
    const q = `cats=${cats.join(',')}&n=${n}&src=${src}`;
    nav(mode === 'flashcards' ? `/flashcards?${q}` : `/quiz?mode=${mode}&${q}`);
  };
  const groups = [['General knowledge', CATEGORIES.filter((c) => c.type === 'general')], ['BABOK & PMBOK', CATEGORIES.filter((c) => c.type === 'framework')], ['Domains', CATEGORIES.filter((c) => c.type === 'domain')]];
  const last = [...s.attempts].reverse().slice(0, 3);
  return (
    <>
      <PageHead title="Practice" sub="Build a test from anything you have learned. Short and daily works best." />
      <div className="row stack-sm gap24">
        <div className="col grow" style={{ gap: 20 }}>
          <div className="card p24" style={{ gap: 14 }}><h3 className="h3">1. Choose a mode</h3>
            <div className="grid g3" style={{ gap: 12 }}>
              {[['flashcards', 'Copy', 'primary', 'Flashcards', 'Flip, recall, rate yourself. Spaced repetition.'], ['mcq', 'ListChecks', 'po', 'Multiple choice', '4 options, instant explanation.'], ['mixed', 'Shuffle', 'accent', 'Mixed test', 'Meanings, terms and fill-the-gap questions.']].map(([k, i, t, h, d]) => (
                <button key={k} className={`card ${mode === k ? 'selected' : ''}`} style={{ textAlign: 'left' }} onClick={() => setMode(k)}>
                  <div className="row center"><IconBox name={i} tone={t} /><div className="grow" /><Check on={mode === k} /></div><span className="h3">{h}</span><span className="small muted">{d}</span>
                </button>))}
            </div>
          </div>
          <div className="card p24" style={{ gap: 14 }}><h3 className="h3">2. Choose topics</h3>
            {groups.map(([g, list]) => <div key={g} className="col gap8"><span className="overline faint">{g}</span><div className="row wrap gap8">{list.map((c) => (
              <button key={c.id} className={`check-chip ${cats.includes(c.id) ? 'on' : ''}`} onClick={() => tog(c.id)}><Check on={cats.includes(c.id)} />{c.name}<span className="caption faint">{TERMS.filter((t) => t.cat === c.id).length}</span></button>))}</div></div>)}
          </div>
          <div className="card p24" style={{ gap: 14 }}><h3 className="h3">3. Settings</h3>
            <div className="grid g2" style={{ gap: 24 }}>
              <div className="col gap8"><span className="label">Number of questions</span><div className="seg">{[10, 20, 30].map((x) => <button key={x} className={n === x ? 'on' : ''} onClick={() => setN(x)}>{x}</button>)}</div></div>
              <div className="col gap8"><span className="label">Questions from</span><div className="seg">{[['all', 'All'], ['weak', 'Weak areas'], ['saved', 'Saved']].map(([k, l]) => <button key={k} className={src === k ? 'on' : ''} onClick={() => setSrc(k)}>{l}</button>)}</div></div>
            </div>
          </div>
          {err && <span className="caption c-danger">{err}</span>}
          <div className="row center"><span className="row center gap8 small muted grow"><Icon name="Clock" size={16} />{Math.min(n, pool.length)} {mode === 'flashcards' ? 'cards' : 'questions'} · about {Math.max(2, Math.round(Math.min(n, pool.length) * 0.6))} minutes</span><button className="btn btn-primary" onClick={start}>Start {mode === 'flashcards' ? 'review' : 'test'}</button></div>
        </div>
        <div className="col" style={{ width: 340, maxWidth: '100%', gap: 16 }}>
          <div className="panel-primary" style={{ padding: 24, gap: 10 }}><span className="overline">Due for review today</span><span className="display">{due} card{due === 1 ? '' : 's'}</span><span className="small">Cards come back just before you would forget them.</span>
            <button className="btn btn-secondary" disabled={!due} onClick={() => nav('/flashcards?due=1')}>Review now</button></div>
          <div className="card" style={{ gap: 4 }}><span className="label">Recent results</span>
            {last.length === 0 && <span className="small muted">No tests yet.</span>}
            {last.map((r, i) => <div key={i} className="row center gap10" style={{ padding: '10px 0' }}><div className="col grow" style={{ gap: 0 }}><span className="small">{r.mode === 'mcq' ? 'Multiple choice' : 'Mixed test'}{r.cats ? ` · ${r.cats.slice(0, 2).map((c) => CAT_BY_ID[c]?.short).join(' + ')}` : ''}</span><span className="caption faint">{r.date}</span></div><Tag tone={r.score / r.total >= 0.8 ? 'success' : r.score / r.total >= 0.6 ? 'primary' : 'accent'}>{r.score}/{r.total}</Tag></div>)}
          </div>
        </div>
      </div>
    </>
  );
}

export function Flashcards() {
  const { s, a } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const deck = useMemo(() => {
    if (params.get('due')) return shuffle(dueCards(s)).slice(0, 50);
    if (params.get('saved')) return shuffle(s.saved.filter((id) => TERM_BY_ID[id]));
    const pool = poolFrom(params, s);
    const n = Number(params.get('n') || 20);
    const unlearned = shuffle(pool.filter((t) => !s.learned.includes(t.id))); const rest = shuffle(pool.filter((t) => s.learned.includes(t.id)));
    return [...unlearned, ...rest].slice(0, n).map((t) => t.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [i, setI] = useState(0); const [flip, setFlip] = useState(false); const [tally, setTally] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const t = TERM_BY_ID[deck[i]];
  const box = t && s.cards[t.id] ? s.cards[t.id].box : 1;
  const rate = (r) => { a.rateCard(t.id, r); setTally((x) => ({ ...x, [r]: x[r] + 1 })); setFlip(false); setI(i + 1); };
  useEffect(() => {
    const h = (e) => {
      if (!t) return;
      if (e.code === 'Space') { e.preventDefault(); setFlip((f) => !f); }
      if (flip && ['1', '2', '3', '4'].includes(e.key)) rate(['again', 'hard', 'good', 'easy'][Number(e.key) - 1]);
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  });
  const nextIv = (r) => { const b = r === 'again' ? 1 : r === 'hard' ? box : r === 'good' ? Math.min(5, box + 1) : Math.min(5, box + 2); const d = r === 'again' ? 0 : [0, 1, 3, 7, 14, 30][b]; return d === 0 ? '< 1 min' : d === 1 ? '1 day' : `${d} days`; };
  if (!deck.length) return <FocusLayout title="Flashcards" onClose={() => nav('/practice')}><div className="card p28 w760" style={{ alignItems: 'center', textAlign: 'center' }}><Icon name="PartyPopper" size={36} color="#4F46E5" /><span className="h2">Nothing to review right now</span><span className="body muted">Learn new terms or add some to your flashcards first.</span><Link className="btn btn-primary" to="/practice">Back to Practice</Link></div></FocusLayout>;
  if (!t) {
    const total = deck.length;
    return <FocusLayout title="Flashcards" onClose={() => nav('/practice')}><div className="card p28 w760" style={{ alignItems: 'center', textAlign: 'center', gap: 16 }}>
      <div className="badge-ic bg-success-soft" style={{ width: 72, height: 72, borderRadius: 99 }}><Icon name="Check" size={36} color="#16A34A" /></div>
      <h1 className="h1">Session complete</h1><p className="body muted">You reviewed {total} card{total > 1 ? 's' : ''} and earned +{total * 2} XP. Cards you knew come back later; tricky ones come back sooner.</p>
      <div className="row gap8 wrap" style={{ justifyContent: 'center' }}><Tag tone="danger">Again {tally.again}</Tag><Tag tone="accent">Hard {tally.hard}</Tag><Tag>Good {tally.good}</Tag><Tag tone="success">Easy {tally.easy}</Tag></div>
      <div className="row gap10"><Link className="btn btn-secondary" to="/home">Home</Link><Link className="btn btn-primary" to="/practice">Back to Practice</Link></div>
    </div></FocusLayout>;
  }
  const c = CAT_BY_ID[t.cat];
  return (
    <FocusLayout title={`Flashcards · ${c.name}`} onClose={() => nav('/practice')} right={<><span className="label muted">Card {i + 1} of {deck.length}</span><div style={{ width: 240 }} className="hide-sm"><Progress value={(i / deck.length) * 100} /></div></>}>
      <div className="flashcard w760" onClick={() => setFlip((f) => !f)} role="button" tabIndex={0} aria-label="Flip card">
        <div className="col" style={{ padding: 40, alignItems: 'center', gap: 14, textAlign: 'center' }}>
          <div className="row gap8"><Tag tone="ink">{t.sub}</Tag><LevelTag level={t.level} /></div>
          <span className="display">{t.term}</span>
          {t.full && <span className="body muted">{t.full}</span>}
          {!flip && <span className="caption faint">Tap or press Space to see the meaning</span>}
        </div>
        {flip && <div className="col" style={{ borderTop: '1px solid var(--border)', padding: 40, gap: 14 }}>
          <span className="overline faint">Answer</span><p className="h3">{t.def}</p>
          <div className="soft bg-bg small muted">“{t.example}”</div>
          <Translations id={t.id} mode="full" />
        </div>}
      </div>
      {flip ? <div className="col w760" style={{ alignItems: 'center', gap: 12 }}>
        <span className="label muted">How well did you remember it?</span>
        <div className="grid g4 w760" style={{ gap: 12 }}>
          {[['again', 'Again', 'danger'], ['hard', 'Hard', 'accent'], ['good', 'Good', 'primary'], ['easy', 'Easy', 'success']].map(([k, l, c2], n) => (
            <button key={k} className="card" style={{ alignItems: 'center', padding: 14, gap: 2, border: `1.5px solid var(--${c2})` }} onClick={() => rate(k)}><span className={`label c-${c2}`}>{l}</span><span className="caption faint">{nextIv(k)} · key {n + 1}</span></button>))}
        </div>
      </div> : <button className="btn btn-primary" onClick={() => setFlip(true)}>Show answer</button>}
      <span className="row center gap8 caption faint"><Icon name="RotateCcw" size={16} />Space to flip · 1–4 to rate</span>
    </FocusLayout>
  );
}

function buildQuestions(pool, n, mode) {
  const picks = shuffle(pool).slice(0, n);
  return picks.map((t) => {
    const others = shuffle((pool.length >= 4 ? pool : TERMS).filter((x) => x.id !== t.id && x.term !== t.term)).slice(0, 3);
    const opts = shuffle([t, ...others]);
    const canGap = t.example.toLowerCase().includes(t.term.toLowerCase());
    const types = mode === 'mcq' ? ['def', 'term'] : ['def', 'term', ...(canGap ? ['gap', 'gap'] : [])];
    const type = types[Math.floor(Math.random() * types.length)];
    let prompt;
    if (type === 'def') prompt = `What does “${t.term}” mean?`;
    else if (type === 'term') prompt = `Which term means: “${t.def}”`;
    else { const re = new RegExp(t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); prompt = `Fill the gap: “${t.example.replace(re, '______')}”`; }
    return { term: t, type, prompt, options: opts.map((o) => ({ id: o.id, text: type === 'def' ? o.def : o.term })), answer: t.id };
  });
}

export function Quiz() {
  const { s, a } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get('mode') || 'mixed';
  const qs = useMemo(() => buildQuestions(poolFrom(params, s), Number(params.get('n') || 10), mode), []); // eslint-disable-line
  const [i, setI] = useState(0); const [sel, setSel] = useState(null); const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]); const [err, setErr] = useState('');
  if (qs.length < 1) return <FocusLayout title="Test"><p>Not enough terms for a test. <Link to="/practice" className="c-primary">Back</Link></p></FocusLayout>;
  const q = qs[i];
  const check = () => { if (!sel) { setErr('Choose an answer first.'); return; } setChecked(true); };
  const next = () => {
    const na = [...answers, { q, sel, ok: sel === q.answer }];
    setAnswers(na); setSel(null); setChecked(false);
    if (i + 1 < qs.length) { setI(i + 1); return; }
    const correctIds = na.filter((x) => x.ok).map((x) => x.q.term.id);
    const mistakes = na.filter((x) => !x.ok).map((x) => x.q.term.id);
    const byCat = {};
    for (const x of na) { const c = x.q.term.cat; byCat[c] = byCat[c] || [0, 0]; byCat[c][1]++; if (x.ok) byCat[c][0]++; }
    a.recordAttempt({ score: correctIds.length, total: na.length, mode, cats: Object.keys(byCat), correctIds, mistakes, byCat,
      review: na.map((x) => ({ prompt: x.q.prompt, ok: x.ok, your: x.q.options.find((o) => o.id === x.sel)?.text, right: x.q.options.find((o) => o.id === x.q.answer)?.text, termId: x.q.term.id })) });
    nav('/results', { replace: true });
  };
  const c = CAT_BY_ID[q.term.cat];
  return (
    <FocusLayout title={mode === 'mcq' ? 'Multiple choice' : 'Mixed test'} onClose={() => nav('/practice')} right={<><span className="label muted">Question {i + 1} of {qs.length}</span><div style={{ width: 240 }} className="hide-sm"><Progress value={(i / qs.length) * 100} /></div></>}>
      <div className="col w760" style={{ gap: 20 }}>
        <div className="row gap8"><Tag tone={c.color === 'danger' || c.color === 'success' ? c.color : c.color}>{c.short}</Tag><Tag tone="ink">{q.type === 'gap' ? 'Fill the gap' : 'Multiple choice'}</Tag></div>
        <h1 className="h1">{q.prompt}</h1>
        {q.options.map((o, n) => {
          const cls = checked ? (o.id === q.answer ? 'right' : o.id === sel ? 'wrong' : '') : o.id === sel ? 'sel' : '';
          return <button key={o.id} className={`option ${cls}`} disabled={checked} onClick={() => { setSel(o.id); setErr(''); }}><span className="letter">{'ABCD'[n]}</span><span className="grow">{o.text}</span>{checked && o.id === q.answer && <Icon name="Check" color="#16A34A" />}{checked && o.id === sel && o.id !== q.answer && <Icon name="X" color="#DC2626" />}</button>;
        })}
        {err && <span className="caption c-danger">{err}</span>}
        {checked && <div className="card row" style={{ gap: 14 }}><IconBox name="Lightbulb" tone={sel === q.answer ? 'success' : 'danger'} size={36} /><div className="col grow gap4"><span className={`label ${sel === q.answer ? 'c-success' : 'c-danger'}`}>{sel === q.answer ? 'Correct!' : 'Not quite.'} {q.term.term}{q.term.full ? ` (${q.term.full})` : ''}</span><span className="small muted">{q.term.def}</span><Translations id={q.term.id} mode="brief" /></div></div>}
        <div className="row center"><Link to={`/term/${q.term.id}`} className="label c-primary" style={{ visibility: checked ? 'visible' : 'hidden' }}>Learn more: {q.term.term} →</Link><div className="grow" />
          {!checked ? <button className="btn btn-primary" onClick={check}>Check answer</button> : <button className="btn btn-primary" onClick={next}>{i + 1 < qs.length ? 'Next question' : 'See results'}</button>}</div>
      </div>
    </FocusLayout>
  );
}

export function Results() {
  const { s, a } = useStore();
  const nav = useNavigate();
  const r = s.lastResult;
  const [showAll, setShowAll] = useState(false);
  const seen = useRef(false);
  useEffect(() => { if (r && r.fresh && !seen.current) { seen.current = true; const t = setTimeout(a.seenResult, 6000); return () => clearTimeout(t); } }, []); // eslint-disable-line
  if (!r) return <div className="card p28"><span className="h3">No test results yet</span><Link to="/practice" className="btn btn-primary">Start a test</Link></div>;
  const pct = Math.round((r.score / r.total) * 100);
  const rank = rankInfo(s.xp, s.track);
  const C = 2 * Math.PI * 76;
  const badges = r.newBadges.map((id) => BADGES.find((b) => b.id === id)).filter(Boolean);
  const review = showAll ? r.review : r.review.filter((x) => !x.ok).concat(r.review.filter((x) => x.ok)).slice(0, 5);
  return (
    <>
      <div className="card p28 row center stack-sm" style={{ flexDirection: 'row', gap: 32 }}>
        <svg width="170" height="170" viewBox="0 0 170 170" role="img" aria-label={`Score ${pct}%`}>
          <circle cx="85" cy="85" r="76" fill="none" stroke="#E2E8F0" strokeWidth="13" />
          <circle cx="85" cy="85" r="76" fill="none" stroke={pct >= 70 ? '#16A34A' : '#F59E0B'} strokeWidth="13" strokeLinecap="round" strokeDasharray={`${(C * pct) / 100} ${C}`} transform="rotate(-90 85 85)" />
          <text x="85" y="84" textAnchor="middle" fontSize="40" fontWeight="700" fill="#0F172A">{r.score}/{r.total}</text>
          <text x="85" y="112" textAnchor="middle" fontSize="14" fontWeight="600" fill={pct >= 70 ? '#16A34A' : '#D97706'}>{pct}%</text>
        </svg>
        <div className="col grow gap10">
          <h1 className="h1">{pct >= 90 ? 'Outstanding' : pct >= 70 ? 'Great job' : 'Good effort'}, {s.name || 'there'}!</h1>
          <p className="body muted">{r.mistakes.length ? `Your ${r.mistakes.length} mistake${r.mistakes.length > 1 ? 's are' : ' is'} now in your flashcards, ready for review.` : 'No mistakes — perfect run!'}</p>
          <div className="row wrap gap8">
            <span className="pill bg-primary-soft c-primary"><Icon name="Star" size={16} />+{r.xp} XP</span>
            {r.quest && <span className="pill bg-success-soft c-success"><Icon name="Check" size={16} />Quest: pass 1 quiz</span>}
            <span className="pill bg-accent-soft c-accent"><Icon name="Flame" size={16} />{s.streak.count}-day streak</span>
          </div>
        </div>
        <div className="col" style={{ width: 240, gap: 10 }}>
          <button className="btn btn-primary" disabled={!r.mistakes.length} onClick={() => nav(`/flashcards?terms=${r.mistakes.join(',')}&n=${r.mistakes.length}`)}>Review mistakes</button>
          <Link className="btn btn-secondary" to="/practice">Take another test</Link>
          <Link className="btn btn-ghost" to="/home">Back to Home</Link>
        </div>
      </div>
      <div className="grid g3">
        <div className="card p24"><span className="overline faint">Rank progress</span><span className="h3">{rank.name}</span><Progress value={rank.pct} h={10} /><div className="row"><span className="label c-primary grow">{s.xp.toLocaleString()} XP</span>{rank.next && <span className="caption faint">{rank.toNext.toLocaleString()} to {rank.nextName}</span>}</div></div>
        {badges.length ? badges.map((b) => (
          <div key={b.id} className="card p24 row center bg-accent-soft" style={{ flexDirection: 'row', gap: 16, borderColor: 'var(--accent-soft)' }}>
            <div className="badge-ic" style={{ width: 72, height: 72, borderRadius: 99, background: 'var(--accent-bright)' }}><Icon name={b.icon} size={34} color="#fff" /></div>
            <div className="col gap4"><span className="overline c-accent">New badge unlocked</span><span className="h2">{b.name}</span><span className="small muted">{b.desc}.</span></div>
          </div>)) : (
          <div className="card p24 row center" style={{ flexDirection: 'row', gap: 16 }}><IconBox name="Award" tone="accent" size={56} iconSize={28} /><div className="col gap4"><span className="overline faint">Next badge</span><span className="h3">{(BADGES.find((b) => !s.badgesEarned[b.id]) || {}).name || 'All badges earned!'}</span><span className="small muted">{(BADGES.find((b) => !s.badgesEarned[b.id]) || {}).desc}</span></div></div>)}
        <div className="card p24"><h3 className="h3">Score by topic</h3>
          {Object.entries(r.byCat).map(([c, [ok, tot]]) => <div key={c} className="col gap6"><div className="row"><span className="small grow">{CAT_BY_ID[c].name}</span><span className="caption muted">{ok} / {tot}</span></div><Progress value={(ok / tot) * 100} h={6} color={ok / tot >= 0.7 ? 'var(--success)' : 'var(--danger)'} /></div>)}
        </div>
      </div>
      <div className="card p0">
        <div className="row center" style={{ padding: '18px 24px' }}><h3 className="h3 grow">Question review</h3>{r.review.length > 5 && <button className="btn btn-ghost" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer' : `Show all ${r.review.length}`}</button>}</div>
        {review.map((x, n) => (
          <div key={n} className="row" style={{ gap: 14, padding: '14px 24px', borderTop: '1px solid var(--border)' }}>
            <span className={`badge-ic ${x.ok ? 'bg-success-soft' : 'bg-danger-soft'}`} style={{ width: 28, height: 28, borderRadius: 99 }}><Icon name={x.ok ? 'Check' : 'X'} size={14} color={x.ok ? '#16A34A' : '#DC2626'} /></span>
            <div className="col grow gap4"><span className="label">{x.prompt}</span>
              {x.ok ? <span className="small muted">{x.right}</span> : <><span className="small c-danger">Your answer: {x.your}</span><span className="small c-success">Correct: {x.right}</span></>}
              {x.termId && <Translations id={x.termId} mode="term" />}
            </div>
            <Link to={`/term/${x.termId}`} className="caption c-primary">Open term</Link>
          </div>))}
      </div>
    </>
  );
}
