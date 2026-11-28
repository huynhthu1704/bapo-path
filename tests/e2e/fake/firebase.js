// Test double for src/firebase.js (#84, #93): a fake Google sign-in the e2e tests control through window.__fake.
// Only src/store.jsx and src/pages/Profile.jsx get this module (tests/e2e/fake/server.mjs); the rest of the site
// keeps the real demo-mode module, so promptApi and the menus stay in local mode.
export * from '../../../src/firebase.js';

export const LOCAL_MODE = false;
export const enabled = true;

const f = (window.__fake = {
  user: { uid: 'fake-uid', displayName: 'Cloud Person', email: 'cloud@fake.local', photoURL: null },
  cloud: null, // what loadProgress returns: { progress: {...} }
  holdLoad: false, holdSave: false, failSave: false, failLogOut: false,
  // #93: admin = the person is the Owner; failLoad / failAdmin = how many reads fail before one works (a big number: all)
  admin: false, failLoad: 0, failAdmin: 0, loadCalls: 0,
  saves: [], listeners: new Set(),
  signIn() { for (const cb of f.listeners) cb(f.user); },
  releaseLoad: () => {}, releaseSave: () => {},
});

export const onUser = (cb) => { f.listeners.add(cb); cb(null); return () => f.listeners.delete(cb); };
export const signInWithGoogle = async () => { f.signIn(); return f.user; };
const offline = () => Object.assign(new Error('Failed to get document because the client is offline.'), { code: 'unavailable' });
export const loadProgress = () => {
  f.loadCalls += 1;
  if (f.failLoad > 0) { f.failLoad -= 1; return Promise.reject(offline()); }
  return f.holdLoad ? new Promise((r) => { f.releaseLoad = () => r(f.cloud); }) : Promise.resolve(f.cloud);
};
export const isAdmin = async () => {
  if (f.failAdmin > 0) { f.failAdmin -= 1; throw offline(); }
  return f.admin;
};
export const saveProgress = (uid, profile, progress) => {
  f.saves.push({ uid, name: profile.name, xp: progress.xp });
  if (f.failSave) return Promise.reject(new Error('offline'));
  if (f.holdSave) return new Promise((r) => { f.releaseSave = r; });
  return Promise.resolve();
};
export const logOut = async () => {
  if (f.failLogOut) throw Object.assign(new Error('network'), { code: 'auth/network-request-failed' });
  for (const cb of f.listeners) cb(null);
};
