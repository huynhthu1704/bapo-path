// All backend access (Firebase Auth + Cloud Firestore) lives in this file.
//
// Firestore layout
//   kb_terms/{id}        public knowledge: glossary terms        (read: everyone, write: admins)
//   kb_skills/{id}       public knowledge: roadmap skills
//   kb_domains/{id}      public knowledge: business domains
//   kb_challenges/{key}  public knowledge: level-up challenge scenarios
//   kb_story/{n}         public knowledge: Story Mode chapters
//   kb_meta/info         publish date and counts
//   admins/{uid}         who may edit the knowledge base (create by hand in the console)
//   users/{uid}                     private profile + learning progress (owner only)
//   users/{uid}/jobs/{jobId}        private job search tracker (owner only)
//   users/{uid}/searches/{id}       private search history (owner only)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, writeBatch, addDoc, query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.js';

export const enabled = Boolean(firebaseConfig.apiKey);
let auth = null; let db = null;
if (enabled) { const app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app); }

// ---------- auth ----------
const googleProvider = () => { const p = new GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' }); return p; };
// Opens Google's account chooser in a popup. If the browser blocks popups, falls back to a full-page redirect.
export const signInWithGoogle = async () => {
  if (!enabled) throw new Error('not-configured');
  try {
    const res = await signInWithPopup(auth, googleProvider());
    return res.user;
  } catch (e) {
    if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported'].includes(e.code)) {
      await signInWithRedirect(auth, googleProvider());
      return null; // the page navigates away to Google
    }
    throw e;
  }
};
export const finishRedirectSignIn = () => (enabled ? getRedirectResult(auth).catch(() => null) : Promise.resolve(null));
export const signInErrorText = (e) => ({
  'auth/popup-closed-by-user': '', 'auth/cancelled-popup-request': '',
  'auth/unauthorized-domain': 'This website address is not allowed to use Google sign-in yet (add it under Firebase → Authentication → Authorised domains).',
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
  'not-configured': 'Google sign-in is not switched on for this site yet.',
}[e?.code || e?.message] ?? 'Google sign-in failed. Please try again.');
export const logOut = () => (enabled ? signOut(auth) : Promise.resolve());
export const onUser = (cb) => { if (!enabled) { cb(null); return () => {}; } return onAuthStateChanged(auth, cb); };
export const isAdmin = async (uid) => { try { return (await getDoc(doc(db, 'admins', uid))).exists(); } catch (e) { return false; } };

// ---------- knowledge base ----------
// Firestore cannot store arrays inside arrays, so domain processes are stored as {name, steps} objects.
const toCloud = {
  domains: (d) => ({ ...d, processes: d.processes.map(([name, steps]) => ({ name, steps })) }),
  challenges: ([key, list]) => ({ key, list }),
};
const fromCloud = {
  domains: (d) => ({ ...d, processes: (d.processes || []).map((p) => [p.name, p.steps]) }),
};

export async function loadKnowledge() {
  if (!enabled) return null;
  const read = async (name) => (await getDocs(collection(db, `kb_${name}`))).docs.map((d) => d.data()).sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
  const [terms, skills, domains, challenges, story] = await Promise.all(['terms', 'skills', 'domains', 'challenges', 'story'].map(read));
  if (!terms.length) return null; // nothing published yet → keep bundled content
  return {
    terms, skills, domains: domains.map(fromCloud.domains),
    challenges: Object.fromEntries(challenges.map((c) => [c.key, c.list])),
    story,
  };
}

export async function publishKnowledge({ terms, skills, domains, challenges, story }) {
  const items = [
    ...terms.map((t, i) => ['kb_terms', t.id, { ...t, _order: i }]),
    ...skills.map((s, i) => ['kb_skills', s.id, { ...s, _order: i }]),
    ...domains.map((d, i) => ['kb_domains', d.id, { ...toCloud.domains(d), _order: i }]),
    ...Object.entries(challenges).map((e, i) => ['kb_challenges', e[0], { ...toCloud.challenges(e), _order: i }]),
    ...story.map((c, i) => ['kb_story', String(c.n), { ...c, _order: i }]),
  ];
  for (let i = 0; i < items.length; i += 400) {
    const batch = writeBatch(db);
    for (const [col, id, data] of items.slice(i, i + 400)) batch.set(doc(db, col, id), JSON.parse(JSON.stringify(data)));
    await batch.commit();
  }
  await setDoc(doc(db, 'kb_meta', 'info'), { publishedAt: serverTimestamp(), terms: terms.length, skills: skills.length, domains: domains.length });
  return items.length;
}
export const kbInfo = async () => { const d = await getDoc(doc(db, 'kb_meta', 'info')); return d.exists() ? d.data() : null; };
export const saveTerm = (t, order) => setDoc(doc(db, 'kb_terms', t.id), { ...t, _order: order });
export const deleteTerm = (id) => deleteDoc(doc(db, 'kb_terms', id));

// ---------- private user data ----------
export const loadProgress = async (uid) => { const d = await getDoc(doc(db, 'users', uid)); return d.exists() ? d.data() : null; };
export const saveProgress = (uid, profile, progress) => setDoc(doc(db, 'users', uid), { profile, progress: JSON.parse(JSON.stringify(progress)), updatedAt: serverTimestamp() }, { merge: true });

export const listJobs = async (uid) => (await getDocs(collection(db, 'users', uid, 'jobs'))).docs.map((d) => ({ id: d.id, ...d.data() }));
export const saveJob = (uid, job) => { const { id, ...data } = job; return setDoc(doc(db, 'users', uid, 'jobs', id), { ...data, updatedAt: new Date().toISOString() }); };
export const deleteJob = (uid, id) => deleteDoc(doc(db, 'users', uid, 'jobs', id));

export const logSearch = (uid, q, result) => addDoc(collection(db, 'users', uid, 'searches'), { q, result: result || null, at: new Date().toISOString() });
export const listSearches = async (uid, n = 50) => (await getDocs(query(collection(db, 'users', uid, 'searches'), orderBy('at', 'desc'), limit(n)))).docs.map((d) => ({ id: d.id, ...d.data() }));
export const clearSearches = async (uid) => { const docs = (await getDocs(collection(db, 'users', uid, 'searches'))).docs; for (let i = 0; i < docs.length; i += 400) { const b = writeBatch(db); docs.slice(i, i + 400).forEach((d) => b.delete(d.ref)); await b.commit(); } };
