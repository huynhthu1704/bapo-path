import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { onUser, loadProgress, saveProgress, isAdmin, LOCAL_MODE, signInWithGoogle, logOut } from './firebase.js';
import { can, useFlags } from './data/flags.js';
import { getStaffRole, touchDirectory } from './data/promptApi.js';
import { track } from './busy.js';
import { TERMS, TERM_BY_ID, CATEGORIES, termsIn } from './data/terms.js';
import { SKILLS, TRACKS, RANK_XP, skillsFor } from './data/skills.js';

const KEY = 'bapo-path-v1';

export const dayStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return dayStr(d); };
const diffDays = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
export const weekKey = (d = new Date()) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${Math.ceil(((t - y) / 86400000 + 1) / 7)}`;
};

const fresh = () => ({
  onboarded: false, name: '', email: '', track: 'BA', startLevel: 1, domains: ['banking', 'ecommerce'],
  dailyGoal: 20, langs: ['vi'], circleOptIn: true, circleJoined: false,
  xp: 0, streak: { count: 0, best: 0, last: null, freezes: 0 },
  completedSkills: [], selfChecks: {}, saved: [], learned: [], cards: {}, totalReviews: 0,
  attempts: [], challengesPassed: [], speedBest: 0, storyDone: [], storyBest: {},
  daily: { date: dayStr(), cards: 0, terms: 0, quizPassed: 0, chest: false },
  weekly: { week: weekKey(), xp: 0, cards: 0 }, activity: {}, badgesEarned: {}, toasts: [], lastResult: null,
  // Prompt Workbench: favourite prompt ids and recently used prompts (newest first, max 20).
  promptFavs: [], promptRecent: [], promptUsed: [],
});

// Older saves stored a single Vietnamese on/off switch; convert it to the language list.
const migrate = (s) => {
  if (!Array.isArray(s.langs)) s.langs = s.viHints === false ? [] : ['vi'];
  delete s.viHints; return s;
};

const load = () => {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return { ...fresh(), ...migrate(s), toasts: [] }; } catch (e) { /* ignore */ }
  return fresh();
};

// ---------- derived helpers ----------
export const rankInfo = (xp, track = 'BA') => {
  let i = 0; for (let k = 0; k < RANK_XP.length; k++) if (xp >= RANK_XP[k]) i = k;
  const names = TRACKS[track].ranks;
  const next = RANK_XP[i + 1];
  return { index: i, name: names[i], nextName: names[i + 1] || null, floor: RANK_XP[i], next: next || null,
    pct: next ? Math.round(((xp - RANK_XP[i]) / (next - RANK_XP[i])) * 100) : 100, toNext: next ? next - xp : 0, names };
};

export const levelUnlocked = (s, track, level) =>
  level <= (s.track === track ? s.startLevel : 1) || s.challengesPassed.includes(`${track}-${level - 1}`);

export const skillState = (s, skill) => {
  if (s.completedSkills.includes(skill.id)) return 'done';
  if (!levelUnlocked(s, skill.track, skill.level)) return 'locked';
  const list = skillsFor(skill.track, skill.level);
  const done = list.filter((x) => s.completedSkills.includes(x.id)).length;
  return skill.order < done + 2 ? 'open' : 'locked';
};

export const challengeState = (s, track, level) => {
  if (s.challengesPassed.includes(`${track}-${level}`)) return 'passed';
  if (!levelUnlocked(s, track, level)) return 'locked';
  const list = skillsFor(track, level);
  return list.every((x) => s.completedSkills.includes(x.id)) ? 'open' : 'locked';
};

const quizBest = (s) => s.attempts.reduce((m, a) => Math.max(m, a.total ? a.score / a.total : 0), 0);

export const BADGES = [
  { id: 'first-steps', icon: 'Star', color: 'primary', name: 'First Steps', desc: 'Finish your first skill', prog: (s) => [s.completedSkills.length, 1] },
  { id: 'on-fire', icon: 'Flame', color: 'accent', name: 'On Fire', desc: 'Keep a 7-day streak', prog: (s) => [s.streak.best, 7] },
  { id: 'sharp-shooter', icon: 'Target', color: 'success', name: 'Sharp Shooter', desc: 'Score 80%+ in 3 tests', prog: (s) => [s.attempts.filter((a) => a.total >= 5 && a.score / a.total >= 0.8).length, 3] },
  { id: 'team-player', icon: 'Users', color: 'po', name: 'Team Player', desc: 'Join a study circle', prog: (s) => [s.circleJoined ? 1 : 0, 1] },
  { id: 'card-shark', icon: 'Copy', color: 'advanced', name: 'Card Shark', desc: 'Review 100 flashcards', prog: (s) => [s.totalReviews, 100] },
  { id: 'story-teller', icon: 'BookOpen', color: 'primary', name: 'Story Teller', desc: 'Finish 2 Story Mode chapters', prog: (s) => [s.storyDone.length, 2] },
  { id: 'domain-explorer', icon: 'Globe', color: 'po', name: 'Domain Explorer', desc: 'Learn terms in 3 business domains', prog: (s) => [new Set(s.learned.map((id) => TERM_BY_ID[id]?.cat).filter((c) => CATEGORIES.find((x) => x.id === c)?.type === 'domain')).size, 3] },
  { id: 'polyglot', icon: 'MessageSquare', color: 'accent', name: 'Polyglot', desc: 'Learn 15 corporate phrases', prog: (s) => [s.learned.filter((id) => id.startsWith('corp-')).length, 15] },
  { id: 'graduate', icon: 'Award', color: 'success', name: 'Beginner Graduate', desc: 'Pass a Beginner Challenge', prog: (s) => [s.challengesPassed.filter((c) => c.endsWith('-1')).length, 1] },
  { id: 'collector', icon: 'Layers', color: 'advanced', name: 'Collector', desc: 'Complete one card set', prog: (s) => [Math.max(0, ...CATEGORIES.map((c) => { const all = termsIn(c.id); return all.length && all.every((t) => s.learned.includes(t.id)) ? 1 : 0; })), 1] },
  { id: 'speed-demon', icon: 'Zap', color: 'accent', name: 'Speed Demon', desc: 'Get 15 matches in a Speed Round', prog: (s) => [s.speedBest, 15] },
  { id: 'perfect', icon: 'Crown', color: 'primary', name: 'Perfect Score', desc: 'Score 100% in a test of 5+ questions', prog: (s) => [s.attempts.some((a) => a.total >= 5 && a.score === a.total) ? 1 : 0, 1], best: (s) => Math.round(quizBest(s) * 100) + '%' },
];

// Flashcard scheduling (Leitner boxes)
const INTERVALS = [0, 1, 3, 7, 14, 30];
export const dueCards = (s) => Object.entries(s.cards).filter(([, c]) => c.due <= dayStr()).map(([id]) => id).filter((id) => TERM_BY_ID[id]);

// ---------- staff identity ----------
// Live site: Owner = admins/{uid}; Editor / Reviewer = staff/{uid}.role.
// Local (demo) mode has no sign-in, so the admin area lets you act as one of these demo people.
export const DEMO_PEOPLE = [
  { uid: 'demo-owner', name: 'Christine (Owner)', email: 'owner@demo.local', role: 'owner' },
  { uid: 'demo-reviewer', name: 'Minh (Reviewer)', email: 'minh@demo.local', role: 'reviewer' },
  { uid: 'demo-editor', name: 'Lan (Editor)', email: 'lan@demo.local', role: 'editor' },
  { uid: 'demo-learner', name: 'Hoa (Learner)', email: 'hoa@demo.local', role: null },
];
const DEMO_KEY = 'bapo-path-demo-identity';
const readDemo = () => { try { return DEMO_PEOPLE.find((p) => p.uid === localStorage.getItem(DEMO_KEY)) || DEMO_PEOPLE[0]; } catch (e) { return DEMO_PEOPLE[0]; } };
// Demo mode has no Google: "Continue with Google" signs this browser in as a demo learner instead.
const DEMO_SIGNED_KEY = 'bapo-path-demo-signed-in';
const DEMO_USER = { uid: 'demo-signed-in', displayName: 'Demo learner', email: null };
const readDemoSignedIn = () => { try { return localStorage.getItem(DEMO_SIGNED_KEY) === '1'; } catch (e) { return false; } };

// ---------- context ----------
const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [user, setUser] = useState(null); const [admin, setAdmin] = useState(false); const [sync, setSync] = useState('off');
  const [staffRole, setStaffRole] = useState(null); const [demo, setDemo] = useState(readDemo);
  const [demoSignedIn, setDemoSignedIn] = useState(readDemoSignedIn);
  const [askSignIn, setAskSignIn] = useState(false);
  const ready = useRef(false);
  // REQ-035: with the googleOnly flag on, a visitor who is not signed in can look around but nothing is saved.
  // A save opens the "Sign in to save" prompt; the change waits in `pending` and is applied after sign-in.
  const pending = useRef(null);
  const gated = useRef(() => false);
  useEffect(() => { const { toasts, ...rest } = state; localStorage.setItem(KEY, JSON.stringify(rest)); }, [state]);

  // Google account: on sign-in, merge cloud progress with this browser, then keep the cloud copy up to date.
  useEffect(() => onUser(async (u) => {
    ready.current = false; setUser(u); setAdmin(false); setStaffRole(null);
    if (!u) { setSync('off'); return; }
    setSync('loading');
    touchDirectory(u).catch(() => {}); // lets the Owner find this person on the Staff page
    try {
      const [cloud, adm, role] = await track(Promise.all([loadProgress(u.uid), isAdmin(u.uid), getStaffRole(u.uid)]));
      setAdmin(adm); setStaffRole(role);
      setState((local) => {
        const c = cloud && cloud.progress;
        const useCloud = c && (c.xp > local.xp || !local.onboarded);
        const base = useCloud ? { ...fresh(), ...migrate({ ...c }), toasts: [] } : local;
        return { ...base, name: base.name && base.name !== 'Guest' ? base.name : (u.displayName || base.name), email: u.email };
      });
      applyPending();
      ready.current = true; setSync('saved');
    } catch (e) { console.warn(e); setSync('error'); }
  }), []);
  useEffect(() => {
    if (!user || !ready.current) return;
    setSync('saving');
    const t = setTimeout(() => {
      const { toasts, lastResult, ...progress } = state;
      saveProgress(user.uid, { name: state.name, email: user.email, photo: user.photoURL || null }, progress).then(() => setSync('saved')).catch(() => setSync('error'));
    }, 1500);
    return () => clearTimeout(t);
  }, [state, user]);

  const apply = useCallback((fn) => setState((prev) => {
    const s = structuredClone(prev);
    const today = dayStr();
    if (s.daily.date !== today) s.daily = { date: today, cards: 0, terms: 0, quizPassed: 0, chest: false };
    if (s.weekly.week !== weekKey()) s.weekly = { week: weekKey(), xp: 0, cards: 0 };
    const rankBefore = rankInfo(s.xp, s.track).index;
    fn(s);
    const rankAfter = rankInfo(s.xp, s.track);
    if (rankAfter.index > rankBefore) s.toasts.push({ id: Math.random(), kind: 'rank', title: 'Rank up!', text: `You are now ${rankAfter.name}.` });
    for (const b of BADGES) {
      if (s.badgesEarned[b.id]) continue;
      const [cur, goal] = b.prog(s);
      if (cur >= goal) {
        s.badgesEarned[b.id] = today;
        s.toasts.push({ id: Math.random(), kind: 'badge', title: 'Badge unlocked', text: b.name, badge: b.id });
        if (s.lastResult && s.lastResult.fresh) s.lastResult.newBadges.push(b.id);
      }
    }
    return s;
  }), []);
  // Saves go through here. When saving needs sign-in, hold the change and ask the visitor to sign in.
  const update = useCallback((fn) => {
    if (gated.current()) { pending.current = fn; setAskSignIn(true); return; }
    apply(fn);
  }, [apply]);
  // After sign-in from the prompt: apply the held change and keep the visitor where they are
  // (they were already learning on the default path, so the setup steps are skipped).
  function applyPending() {
    const fn = pending.current; if (!fn) return;
    pending.current = null; setAskSignIn(false);
    apply((s) => { fn(s); s.onboarded = true; });
  }
  const signIn = useCallback(async () => {
    if (!LOCAL_MODE) return signInWithGoogle(); // the auth listener above loads progress, then applies the held change
    try { localStorage.setItem(DEMO_SIGNED_KEY, '1'); } catch (e) { /* ignore */ }
    setDemoSignedIn(true);
    apply((s) => { s.name = s.name || DEMO_USER.displayName; });
    applyPending();
    return DEMO_USER;
  }, [apply]); // eslint-disable-line react-hooks/exhaustive-deps
  const signOut = useCallback(() => {
    if (!LOCAL_MODE) return logOut();
    try { localStorage.removeItem(DEMO_SIGNED_KEY); } catch (e) { /* ignore */ }
    setDemoSignedIn(false); return Promise.resolve();
  }, []);
  const cancelSignIn = useCallback(() => { pending.current = null; setAskSignIn(false); }, []);

  // shared mutations used inside update()
  const touch = (s) => {
    const today = dayStr();
    const st = s.streak;
    if (st.last !== today) {
      const gap = st.last ? diffDays(st.last, today) : null;
      if (gap === 1) st.count += 1;
      else if (gap === 2 && st.freezes > 0) { st.freezes -= 1; st.count += 1; }
      else st.count = 1;
      st.last = today;
      if (st.count > 0 && st.count % 7 === 0) st.freezes = Math.min(2, st.freezes + 1);
      st.best = Math.max(st.best, st.count);
    }
  };
  const gain = (s, n) => {
    s.xp += n; s.weekly.xp += n;
    const d = dayStr(); s.activity[d] = (s.activity[d] || 0) + n;
    touch(s);
  };
  const learn = (s, id) => {
    if (!s.learned.includes(id)) { s.learned.push(id); s.daily.terms += 1; gain(s, 5); }
  };

  const actions = useMemo(() => ({
    set: (patch) => update((s) => Object.assign(s, patch)),
    finishOnboarding: (patch) => update((s) => { Object.assign(s, patch, { onboarded: true }); touch(s); }),
    dismissToast: (id) => setState((p) => ({ ...p, toasts: p.toasts.filter((t) => t.id !== id) })),
    toggleSave: (id) => update((s) => { s.saved = s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id]; }),
    learnTerm: (id) => update((s) => learn(s, id)),
    addCards: (ids) => update((s) => { for (const id of ids) if (!s.cards[id]) s.cards[id] = { box: 1, due: dayStr() }; }),
    toggleCheck: (skillId, i) => update((s) => { const k = `${skillId}:${i}`; s.selfChecks[k] = !s.selfChecks[k]; }),
    completeSkill: (id) => update((s) => { if (!s.completedSkills.includes(id)) { s.completedSkills.push(id); gain(s, 50); } }),
    rateCard: (id, rating) => update((s) => {
      const c = s.cards[id] || { box: 1, due: dayStr() };
      const box = rating === 'again' ? 1 : rating === 'hard' ? c.box : rating === 'good' ? Math.min(5, c.box + 1) : Math.min(5, c.box + 2);
      s.cards[id] = { box, due: addDays(dayStr(), rating === 'again' ? 0 : INTERVALS[box]) };
      s.totalReviews += 1; s.daily.cards += 1; s.weekly.cards += 1;
      gain(s, 2);
      if (rating === 'good' || rating === 'easy') learn(s, id);
    }),
    recordAttempt: (r) => update((s) => {
      const xp = r.score * 10 + (r.score === r.total && r.total >= 5 ? 20 : 0);
      s.attempts.push({ date: dayStr(), score: r.score, total: r.total, mode: r.mode, cats: r.cats });
      if (r.total && r.score / r.total >= 0.7) s.daily.quizPassed += 1;
      for (const id of r.correctIds) learn(s, id);
      for (const id of r.mistakes) s.cards[id] = { box: 1, due: dayStr() };
      gain(s, xp);
      s.lastResult = { ...r, xp, fresh: true, newBadges: [], quest: r.total && r.score / r.total >= 0.7 };
    }),
    seenResult: () => apply((s) => { if (s.lastResult) s.lastResult.fresh = false; }),
    passChallenge: (key) => update((s) => { if (!s.challengesPassed.includes(key)) { s.challengesPassed.push(key); gain(s, 300); } }),
    claimChest: () => update((s) => { if (!s.daily.chest) { s.daily.chest = true; gain(s, 50); } }),
    speedResult: (matches) => update((s) => { s.speedBest = Math.max(s.speedBest, matches); gain(s, matches * 5); }),
    storyChoice: (q) => update((s) => gain(s, q === 'best' ? 40 : q === 'ok' ? 15 : 5)),
    storyDone: (n, score) => update((s) => { if (!s.storyDone.includes(n)) { s.storyDone.push(n); gain(s, 100); } s.storyBest[n] = Math.max(s.storyBest[n] || 0, score); }),
    joinCircle: () => update((s) => { s.circleJoined = true; s.circleOptIn = true; }),
    togglePromptFav: (id) => apply((s) => { s.promptFavs = s.promptFavs.includes(id) ? s.promptFavs.filter((x) => x !== id) : [id, ...s.promptFavs]; }),
    usePrompt: (id) => apply((s) => { if (!s.promptUsed.includes(id)) s.promptUsed.push(id); s.promptRecent = [{ id, at: new Date().toISOString() }, ...s.promptRecent.filter((r) => r.id !== id)].slice(0, 20); }),
    reset: () => setState(fresh()),
    loadDemo: () => apply((s) => {
      const t = s.track;
      s.onboarded = true; s.name = s.name || 'Christine';
      s.completedSkills = SKILLS.filter((k) => k.track === t && k.level === 1 && k.order < 3).map((k) => k.id);
      s.learned = TERMS.filter((x, i) => i % 2 === 0).slice(0, 48).map((x) => x.id);
      s.saved = ['it-uat', 'it-api', 'team-definition-of-done', 'corp-take-this-offline', 'banking-kyc', 'it-environment', 'corp-bandwidth', 'banking-chargeback', 'team-retrospective'];
      for (const id of s.learned.slice(0, 30)) s.cards[id] = { box: 2, due: dayStr() };
      s.xp = 1240; s.weekly.xp = 510; s.totalReviews = 118;
      s.streak = { count: 8, best: 8, last: dayStr(), freezes: 1 };
      s.attempts = [{ date: dayStr(), score: 8, total: 10 }, { date: dayStr(), score: 9, total: 10 }, { date: dayStr(), score: 8, total: 10 }];
      s.circleJoined = true; s.speedBest = 14; s.storyDone = [1];
      for (let i = 6; i >= 0; i--) s.activity[addDays(dayStr(), -i)] = [60, 100, 40, 120, 90, 150, 30][6 - i];
    }),
  }), [update, apply]);

  // role: 'owner' | 'reviewer' | 'editor' | null; me: who is acting (signed-in user, or the demo person).
  const role = LOCAL_MODE ? demo.role : admin ? 'owner' : staffRole;
  const me = LOCAL_MODE ? demo : user ? { uid: user.uid, name: user.displayName || state.name || user.email, email: user.email } : null;
  const setDemoPerson = useCallback((uid) => { try { localStorage.setItem(DEMO_KEY, uid); } catch (e) { /* ignore */ } setDemo(DEMO_PEOPLE.find((p) => p.uid === uid) || DEMO_PEOPLE[0]); }, []);
  // Signed in = a Google account on the live site; the demo sign-in in demo mode.
  const signedIn = LOCAL_MODE ? demoSignedIn : !!user;
  useFlags();
  // The flag follows the signed-in person's role only: in demo mode the "Act as" identity alone does not turn it on.
  const googleOnly = can('googleOnly', { role: signedIn ? role : null, uid: me && me.uid });
  gated.current = () => googleOnly && !signedIn;
  return <Ctx.Provider value={{ s: state, a: actions, user, admin: LOCAL_MODE ? role === 'owner' : admin, sync, role, me, setDemoPerson,
    signedIn, googleOnly, signIn, signOut, askSignIn, cancelSignIn }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
