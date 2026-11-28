// Prompt Workbench backend. The same functions run on Cloud Firestore (live site) or on this
// browser's localStorage (local / demo mode, see LOCAL_MODE in firebase.js).
//
// Firestore layout (rules: firestore.rules)
//   prompts/{id}                    working copy of a prompt + workflow status      (read/write: staff)
//   prompts/{id}/versions/{n}       snapshot of every saved version                 (read/create: staff)
//   prompt_bundles/published        all live prompts in one doc (1 read for learners) (read: everyone, write: reviewers)
//   prompt_taxonomy/main            phases, categories, subcategories, collections (read: everyone, write: owner)
//   prompt_stats/{promptId}         copies, rating sum and count                    (read: everyone, +1 / rating updates only)
//   prompt_month/{promptId}_{YYYY-MM} copies per month                              (read: staff, +1 only)
//   prompt_ratings/{promptId}_{uid} one learner's stars                             (read/write: that learner)
//   prompt_feedback/{id}            private improvement suggestions                 (create: signed in, read: reviewers)
//   staff/{uid}                     Editor or Reviewer role                          (read: owner + self, write: owner)
//   directory/{uid}                 name/email of people who signed in, for the Staff page (write: self, read: owner)
//   admin_logs/{id}                 audit log of admin actions                       (create: staff, read: owner)
//   settings/site                   feature flags                                    (read: everyone, write: owner)
//
// Roles: Owner = admins/{uid} (created by hand). Reviewer can do everything an Editor can, plus
// publish / return / unpublish / archive. Nobody but the Owner may publish their own submission.
import {
  doc, getDoc, setDoc, deleteDoc, onSnapshot, collection, getDocs, query, where, orderBy, limit as qLimit, addDoc, writeBatch, increment,
} from 'firebase/firestore';
import { getDb, LOCAL_MODE } from '../firebase.js';

export const STATUS = {
  draft: { label: 'Draft', tone: 'ink' },
  review: { label: 'In review', tone: 'accent' },
  published: { label: 'Published', tone: 'success' },
  unpublished: { label: 'Unpublished', tone: 'danger' },
  archived: { label: 'Archived', tone: 'ink' },
};
export const CONTENT_FIELDS = ['id', 'phase', 'step', 'cat', 'sub', 'roles', 'title', 'desc', 'when', 'prepare', 'ph', 'body', 'output', 'next', 'tags', 'tr', 'added'];
export const LANG_IDS = ['vi', 'ko', 'fr'];

const now = () => new Date().toISOString();
export const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const clean = (x) => JSON.parse(JSON.stringify(x));
const who = (me) => ({ uid: me.uid, name: me.name || me.email || 'Unknown' });

// Firestore cannot store arrays inside arrays, so placeholders [name, label, example] become objects.
export const toCloud = (p) => {
  const c = {};
  for (const k of CONTENT_FIELDS) if (p[k] !== undefined) c[k] = p[k];
  c.ph = (p.ph || []).map(([name, label, example]) => ({ name, label, example }));
  return clean(c);
};
export const fromCloud = (c) => (c ? { ...c, ph: (c.ph || []).map((x) => (Array.isArray(x) ? x : [x.name, x.label, x.example])) } : c);
export const contentOf = (p) => { const c = {}; for (const k of CONTENT_FIELDS) if (p[k] !== undefined) c[k] = p[k]; return c; };

// ---------- storage layers ----------
const ref = (path) => doc(getDb(), path);
const fsLayer = {
  get: async (path) => { const s = await getDoc(ref(path)); return s.exists() ? { _id: s.id, ...s.data() } : null; },
  set: (path, data, merge = false) => setDoc(ref(path), clean(data), { merge }),
  del: (path) => deleteDoc(ref(path)),
  add: async (col, data) => (await addDoc(collection(getDb(), col), clean(data))).id,
  list: async (col, { where: w, order, n } = {}) => {
    const parts = [];
    if (w) parts.push(where(...w));
    if (order) parts.push(orderBy(order[0], order[1] || 'asc'));
    if (n) parts.push(qLimit(n));
    const s = await getDocs(query(collection(getDb(), col), ...parts));
    return s.docs.map((d) => ({ _id: d.id, ...d.data() }));
  },
  inc: (path, fields, extra = {}) => setDoc(ref(path), { ...clean(extra), ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, increment(v)])) }, { merge: true }),
  batch: async (ops) => {
    for (let i = 0; i < ops.length; i += 400) {
      const b = writeBatch(getDb());
      for (const [path, data] of ops.slice(i, i + 400)) b.set(ref(path), clean(data));
      await b.commit();
    }
  },
};

const LOCAL_KEY = 'bapo-path-local-db';
const readLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; } catch (e) { return {}; } };
const writeLocal = (dbObj) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(dbObj)); } catch (e) { throw new Error('Browser storage is full. Clear the demo data and try again.'); }
};
const depth = (p) => p.split('/').length;
const localLayer = {
  get: async (path) => { const v = readLocal()[path]; return v ? { _id: path.split('/').pop(), ...v } : null; },
  set: async (path, data, merge = false) => { const d = readLocal(); d[path] = merge ? { ...(d[path] || {}), ...clean(data) } : clean(data); writeLocal(d); },
  del: async (path) => { const d = readLocal(); delete d[path]; writeLocal(d); },
  add: async (col, data) => { const id = Math.random().toString(36).slice(2, 12); await localLayer.set(`${col}/${id}`, data); return id; },
  list: async (col, { where: w, order, n } = {}) => {
    const d = readLocal();
    let rows = Object.entries(d).filter(([k]) => k.startsWith(col + '/') && depth(k) === depth(col) + 1).map(([k, v]) => ({ _id: k.split('/').pop(), ...v }));
    if (w) rows = rows.filter((r) => r[w[0]] === w[2]);
    if (order) rows.sort((a, b) => ((a[order[0]] > b[order[0]] ? 1 : a[order[0]] < b[order[0]] ? -1 : 0) * (order[1] === 'desc' ? -1 : 1)));
    return n ? rows.slice(0, n) : rows;
  },
  inc: async (path, fields, extra = {}) => {
    const d = readLocal(); const cur = { ...(d[path] || {}), ...clean(extra) };
    for (const [k, v] of Object.entries(fields)) cur[k] = (cur[k] || 0) + v;
    d[path] = cur; writeLocal(d);
  },
  batch: async (ops) => { const d = readLocal(); for (const [path, data] of ops) d[path] = clean(data); writeLocal(d); },
};
export const clearLocalData = () => localStorage.removeItem(LOCAL_KEY);

const db = LOCAL_MODE ? localLayer : fsLayer;

// ---------- validation ----------
const PH_RE = /\[([A-Z][A-Za-z0-9 /-]*)\]/g;
export const detectPlaceholders = (body) => [...new Set([...(body || '').matchAll(PH_RE)].map((m) => m[1]))];

/** Problems that block publishing (empty required fields, placeholder mismatch). */
export function validate(p) {
  const out = [];
  const need = [['title', 'Title'], ['desc', 'Short description'], ['phase', 'Phase'], ['cat', 'Category'], ['sub', 'Subcategory'], ['prepare', 'Inputs to prepare'], ['body', 'Prompt text'], ['output', 'Expected output']];
  for (const [k, l] of need) if (!String(p[k] ?? '').trim()) out.push(`${l} is empty.`);
  if (!p.roles || !p.roles.length) out.push('Pick at least one role.');
  if (!p.when || !p.when.filter((w) => w.trim()).length) out.push('Add at least one "When to use" line.');
  if (!Number(p.step)) out.push('Step in phase must be a number.');
  const inBody = detectPlaceholders(p.body);
  const declared = (p.ph || []).map((x) => x[0]);
  for (const n of inBody) if (!declared.includes(n)) out.push(`Placeholder [${n}] has no label.`);
  for (const n of declared) if (!inBody.includes(n)) out.push(`Placeholder "${n}" is not used in the prompt text.`);
  for (const x of p.ph || []) if (!String(x[1] || '').trim()) out.push(`Placeholder [${x[0]}] needs a hint.`);
  return out;
}

// ---------- audit log ----------
export const log = (me, action, promptId = null, title = '', detail = '') =>
  db.add('admin_logs', { at: now(), uid: me.uid, name: who(me).name, action, promptId, title, detail }).catch((e) => console.warn('audit log failed', e));
export const listLogs = (n = 200) => db.list('admin_logs', { order: ['at', 'desc'], n });

// ---------- learner library ----------
export async function loadLibrary() {
  const [bundle, taxonomy] = await Promise.all([db.get('prompt_bundles/published'), db.get('prompt_taxonomy/main')]);
  return { prompts: bundle && Array.isArray(bundle.prompts) ? bundle.prompts.map(fromCloud) : null, taxonomy: taxonomy || null };
}

// ---------- prompts (staff) ----------
export const listPrompts = async () => (await db.list('prompts')).map((p) => fromCloud(p));
export const getPrompt = async (id) => fromCloud(await db.get(`prompts/${id}`));
export const listVersions = async (id) => (await db.list(`prompts/${id}/versions`, { order: ['version', 'desc'] })).map((v) => ({ ...v, content: fromCloud(v.content) }));

export async function nextId(cat) {
  const ids = (await db.list('prompts')).map((p) => p._id).filter((id) => id.startsWith(`P-${cat}`));
  const n = Math.max(0, ...ids.map((id) => parseInt(id.slice(3), 10) || 0)) + 1;
  return `P-${cat}${String(n).padStart(2, '0')}`;
}

/** Saves a new version of the working copy. Always goes back to Draft. */
export async function savePrompt(content, me, note = 'Saved') {
  const id = content.id || await nextId(content.cat);
  const cur = await db.get(`prompts/${id}`);
  const version = ((cur && cur.version) || 0) + 1;
  const c = toCloud({ ...content, id });
  const data = {
    ...c, status: 'draft', version, live: cur ? !!cur.live : false, published: cur ? cur.published || null : null,
    createdBy: cur ? cur.createdBy : who(me), updatedBy: who(me), updatedAt: now(), submittedBy: null, reviewNote: cur ? cur.reviewNote || '' : '',
  };
  await db.set(`prompts/${id}`, data);
  await db.set(`prompts/${id}/versions/${version}`, { version, content: c, by: who(me), at: data.updatedAt, note });
  log(me, cur ? 'edit' : 'create', id, c.title, `v${version} · ${note}`);
  return { id, version };
}

export async function submitForReview(id, me) {
  const p = await getPrompt(id);
  const problems = validate(p);
  if (problems.length) throw new Error(`Complete the draft first: ${problems[0]}`);
  await db.set(`prompts/${id}`, { status: 'review', submittedBy: who(me), updatedBy: who(me), updatedAt: now() }, true);
  log(me, 'submit', id, p.title, `v${p.version}`);
}

export async function returnToDraft(id, me, comment) {
  if (!comment.trim()) throw new Error('Add a comment so the editor knows what to change.');
  const p = await getPrompt(id);
  await db.set(`prompts/${id}`, { status: 'draft', reviewNote: comment.trim(), updatedBy: who(me), updatedAt: now() }, true);
  log(me, 'return', id, p.title, comment.trim());
}

export async function publishPrompt(id, me, { isOwner }) {
  const p = await getPrompt(id);
  if (p.status !== 'review') throw new Error('Only prompts in review can be published.');
  if (!isOwner && p.submittedBy && p.submittedBy.uid === me.uid) throw new Error('You submitted this prompt, so another reviewer or the Owner must publish it.');
  const problems = validate(p);
  if (problems.length) throw new Error(`Publishing is blocked: ${problems[0]}`);
  const live = toCloud({ ...contentOf(p), added: p.added || (p.published && p.published.added) || new Date().toISOString().slice(0, 10) });
  await db.set(`prompts/${id}`, { status: 'published', live: true, published: { ...live, version: p.version }, added: live.added, reviewNote: '', publishedBy: who(me), updatedBy: who(me), updatedAt: now() }, true);
  await rebuildBundle();
  log(me, 'publish', id, p.title, `v${p.version}`);
}

export async function takeDown(id, me, kind /* 'unpublished' | 'archived' */) {
  const p = await getPrompt(id);
  await db.set(`prompts/${id}`, { status: kind, live: false, updatedBy: who(me), updatedAt: now() }, true);
  await rebuildBundle();
  log(me, kind === 'archived' ? 'archive' : 'unpublish', id, p.title, '');
}

/** Restoring creates a new draft from the old content; it must go through review again. */
export async function restoreVersion(id, n, me) {
  const v = await db.get(`prompts/${id}/versions/${n}`);
  if (!v) throw new Error(`Version ${n} not found.`);
  return savePrompt(fromCloud(v.content), me, `Restored from v${n}`);
}

export async function rebuildBundle() {
  const live = await db.list('prompts', { where: ['live', '==', true] });
  await db.set('prompt_bundles/published', { prompts: live.map((p) => p.published).filter(Boolean), count: live.length, updatedAt: now() });
  return live.length;
}

/** One-time import of the prompts that ship with the site (Owner only). Skips ids that exist. */
export async function importBundled(me, prompts, taxonomy) {
  const existing = new Set((await db.list('prompts')).map((p) => p._id));
  const at = now(); const ops = [];
  for (const p of prompts) {
    if (existing.has(p.id)) continue;
    const c = toCloud(p);
    ops.push([`prompts/${p.id}`, { ...c, status: 'published', version: 1, live: true, published: { ...c, version: 1 }, createdBy: who(me), updatedBy: who(me), updatedAt: at, submittedBy: null, reviewNote: '' }]);
    ops.push([`prompts/${p.id}/versions/1`, { version: 1, content: c, by: who(me), at, note: 'Imported from the launch set' }]);
  }
  if (ops.length) await db.batch(ops);
  if (!(await db.get('prompt_taxonomy/main'))) await db.set('prompt_taxonomy/main', taxonomy);
  const n = await rebuildBundle();
  log(me, 'import', null, '', `${ops.length / 2} prompts imported, ${n} live`);
  return ops.length / 2;
}

// ---------- taxonomy ----------
export const getTaxonomy = () => db.get('prompt_taxonomy/main');
export async function saveTaxonomy(t, me, what = 'Taxonomy updated') {
  const { _id, ...data } = t;
  await db.set('prompt_taxonomy/main', { ...data, updatedAt: now(), updatedBy: who(me) });
  log(me, 'taxonomy', null, '', what);
}

// ---------- staff ----------
export const touchDirectory = (user) => db.set(`directory/${user.uid}`, { name: user.displayName || '', email: user.email || '', photo: user.photoURL || null, lastSeen: now() }, true);
export const listDirectory = () => db.list('directory');
export const listStaff = () => db.list('staff');
export const getStaffRole = async (uid) => { try { const s = await db.get(`staff/${uid}`); return s ? s.role : null; } catch (e) { return null; } };
export async function setStaffRole(target, role, me) {
  if (role) await db.set(`staff/${target.uid}`, { role, name: target.name || '', email: target.email || '', by: who(me), at: now() });
  else await db.del(`staff/${target.uid}`);
  log(me, 'role', null, '', `${target.email || target.name}: ${role || 'no role'}`);
}

// ---------- learner signals: copies, ratings, feedback ----------
export function recordCopy(promptId) {
  const m = monthKey();
  return Promise.all([
    db.inc(`prompt_stats/${promptId}`, { copies: 1 }),
    db.inc(`prompt_month/${promptId}_${m}`, { copies: 1 }, { promptId, month: m }),
  ]).catch((e) => console.warn('copy count failed', e));
}
export const getStats = (promptId) => db.get(`prompt_stats/${promptId}`);
export const listStats = () => db.list('prompt_stats');
export const listMonth = (m = monthKey()) => db.list('prompt_month', { where: ['month', '==', m] });
export const getMyRating = (promptId, uid) => db.get(`prompt_ratings/${promptId}_${uid}`);

export async function ratePrompt(promptId, me, stars) {
  if (!(stars >= 1 && stars <= 5)) throw new Error('Pick 1 to 5 stars.');
  const old = await getMyRating(promptId, me.uid);
  await db.set(`prompt_ratings/${promptId}_${me.uid}`, { promptId, uid: me.uid, stars, at: now() });
  await db.inc(`prompt_stats/${promptId}`, { ratingSum: stars - (old ? old.stars : 0), ratingCount: old ? 0 : 1 });
}

export async function sendFeedback(prompt, me, text) {
  const t = text.trim();
  if (!t) throw new Error('Write a suggestion first.');
  if (t.length > 2000) throw new Error('Keep it under 2,000 characters.');
  await db.add('prompt_feedback', { promptId: prompt.id, title: prompt.title, uid: me.uid, name: who(me).name, email: me.email || '', text: t, at: now(), status: 'new' });
}
export const listFeedback = () => db.list('prompt_feedback', { order: ['at', 'desc'], n: 300 });
export const setFeedbackStatus = (id, status) => db.set(`prompt_feedback/${id}`, { status }, true);

// ---------- settings / feature flags ----------
export const getSettings = () => db.get('settings/site');
/** #79: calls cb(settings) now and every time settings/site changes, so open pages follow the Owner's feature switches.
 *  Live site: a Firestore listener. Demo mode: the browser's storage event, fired when another tab saves. Returns stop(). */
export function watchSettings(cb) {
  if (!LOCAL_MODE) return onSnapshot(ref('settings/site'), (s) => cb(s.exists() ? s.data() : null), () => {});
  getSettings().then(cb).catch(() => {});
  const onStorage = (e) => { if (e.key === null || e.key === LOCAL_KEY) getSettings().then(cb).catch(() => {}); };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}
export async function saveFlags(flags, me, what) {
  await db.set('settings/site', { flags, updatedAt: now(), updatedBy: who(me) }, true);
  log(me, 'flag', null, '', what);
}
