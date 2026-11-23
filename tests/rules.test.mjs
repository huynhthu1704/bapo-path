// Firestore security rules tests. Run with the emulator:
//   npx firebase-tools emulators:exec --only firestore --project demo-bapo "npm run test:rules"
// (CI does this in .github/workflows/rules-test.yml.)
import { readFileSync } from 'node:fs';
import { test, before, after, beforeEach } from 'node:test';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, getDocs, increment } from 'firebase/firestore';

let env;
const OWNER = 'owner1', REV = 'rev1', REV2 = 'rev2', ED = 'ed1', LEARNER = 'learn1';
const who = (uid) => ({ uid, name: uid });
const content = { id: 'P-Z01', phase: 'discover', step: 1, cat: 'A', sub: 'x', roles: ['BA'], title: 'T', desc: 'D', when: ['w'], prepare: 'p', ph: [], body: 'Body', output: 'Out', next: [], tags: [] };
const draft = (by, extra = {}) => ({ ...content, status: 'draft', version: 1, live: false, published: null, createdBy: who(by), updatedBy: who(by), updatedAt: 't', submittedBy: null, reviewNote: '', ...extra });
const db = (uid) => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).firestore();
const seed = (fn) => env.withSecurityRulesDisabled((ctx) => fn(ctx.firestore()));

before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-bapo', firestore: { rules: readFileSync('firestore.rules', 'utf8') } });
});
after(() => env.cleanup());
beforeEach(async () => {
  await env.clearFirestore();
  await seed(async (f) => {
    await setDoc(doc(f, 'admins', OWNER), {});
    await setDoc(doc(f, 'staff', REV), { role: 'reviewer' });
    await setDoc(doc(f, 'staff', REV2), { role: 'reviewer' });
    await setDoc(doc(f, 'staff', ED), { role: 'editor' });
    await setDoc(doc(f, 'prompt_bundles', 'published'), { prompts: [] });
  });
});

test('learners read the bundle, taxonomy and settings but not working copies', async () => {
  await assertSucceeds(getDoc(doc(db(null), 'prompt_bundles', 'published')));
  await assertSucceeds(getDoc(doc(db(null), 'prompt_taxonomy', 'main')));
  await assertSucceeds(getDoc(doc(db(null), 'settings', 'site')));
  await assertFails(getDocs(collection(db(LEARNER), 'prompts')));
  await assertSucceeds(getDocs(collection(db(ED), 'prompts')));
});

test('editors create drafts but not published prompts', async () => {
  await assertSucceeds(setDoc(doc(db(ED), 'prompts', 'P-Z01'), draft(ED)));
  await assertFails(setDoc(doc(db(ED), 'prompts', 'P-Z02'), draft(ED, { status: 'published', live: true })));
  await assertFails(setDoc(doc(db(LEARNER), 'prompts', 'P-Z03'), draft(LEARNER)));
  await assertFails(setDoc(doc(db(ED), 'prompts', 'P-Z04'), draft(REV))); // must be written as yourself
});

test('editors submit for review but cannot publish', async () => {
  await seed((f) => setDoc(doc(f, 'prompts', 'P-Z01'), draft(ED)));
  await assertSucceeds(updateDoc(doc(db(ED), 'prompts', 'P-Z01'), { status: 'review', submittedBy: who(ED), updatedBy: who(ED) }));
  await assertFails(updateDoc(doc(db(ED), 'prompts', 'P-Z01'), { status: 'published', live: true, published: { ...content, version: 1 }, updatedBy: who(ED) }));
});

test('a reviewer publishes someone else\'s submission but not their own', async () => {
  const pub = (uid) => ({ status: 'published', live: true, published: { ...content, version: 1 }, updatedBy: who(uid) });
  await seed((f) => setDoc(doc(f, 'prompts', 'P-Z01'), draft(ED, { status: 'review', submittedBy: who(ED) })));
  await assertSucceeds(updateDoc(doc(db(REV), 'prompts', 'P-Z01'), pub(REV)));
  await seed((f) => setDoc(doc(f, 'prompts', 'P-Z02'), draft(REV, { id: 'P-Z02', status: 'review', submittedBy: who(REV) })));
  await assertFails(updateDoc(doc(db(REV), 'prompts', 'P-Z02'), pub(REV)));
  await assertSucceeds(updateDoc(doc(db(REV2), 'prompts', 'P-Z02'), pub(REV2)));
});

test('the Owner may publish their own submission', async () => {
  await seed((f) => setDoc(doc(f, 'prompts', 'P-Z01'), draft(OWNER, { status: 'review', submittedBy: who(OWNER) })));
  await assertSucceeds(updateDoc(doc(db(OWNER), 'prompts', 'P-Z01'), { status: 'published', live: true, published: { ...content, version: 1 }, updatedBy: who(OWNER) }));
});

test('publishing is blocked when a required field is empty', async () => {
  await seed((f) => setDoc(doc(f, 'prompts', 'P-Z01'), draft(ED, { status: 'review', submittedBy: who(ED) })));
  await assertFails(updateDoc(doc(db(REV), 'prompts', 'P-Z01'), { status: 'published', live: true, published: { ...content, body: '', version: 1 }, updatedBy: who(REV) }));
});

test('only reviewers unpublish; only reviewers write the bundle', async () => {
  await seed((f) => setDoc(doc(f, 'prompts', 'P-Z01'), draft(ED, { status: 'published', live: true, published: { ...content, version: 1 } })));
  await assertFails(updateDoc(doc(db(ED), 'prompts', 'P-Z01'), { status: 'unpublished', live: false, updatedBy: who(ED) }));
  await assertSucceeds(updateDoc(doc(db(REV), 'prompts', 'P-Z01'), { status: 'unpublished', live: false, updatedBy: who(REV) }));
  await assertFails(setDoc(doc(db(ED), 'prompt_bundles', 'published'), { prompts: [] }));
  await assertSucceeds(setDoc(doc(db(REV), 'prompt_bundles', 'published'), { prompts: [] }));
});

test('versions can be added but never changed', async () => {
  const v = doc(db(ED), 'prompts/P-Z01/versions/1');
  await assertSucceeds(setDoc(v, { version: 1, content, by: who(ED), at: 't', note: 'Saved' }));
  await assertFails(setDoc(v, { version: 1, content, by: who(ED), at: 't', note: 'Changed' }));
});

test('only the Owner assigns roles and edits the taxonomy and flags', async () => {
  await assertFails(setDoc(doc(db(REV), 'staff', LEARNER), { role: 'editor' }));
  await assertSucceeds(setDoc(doc(db(OWNER), 'staff', LEARNER), { role: 'editor' }));
  await assertSucceeds(getDoc(doc(db(LEARNER), 'staff', LEARNER)));
  await assertFails(getDoc(doc(db(LEARNER), 'staff', ED)));
  await assertFails(setDoc(doc(db(REV), 'prompt_taxonomy', 'main'), {}));
  await assertSucceeds(setDoc(doc(db(OWNER), 'prompt_taxonomy', 'main'), {}));
  await assertFails(setDoc(doc(db(ED), 'settings', 'site'), { flags: {} }));
  await assertSucceeds(setDoc(doc(db(OWNER), 'settings', 'site'), { flags: {} }));
});

test('copy counters only go up by one', async () => {
  await assertSucceeds(setDoc(doc(db(null), 'prompt_stats', 'P-A01'), { copies: increment(1) }, { merge: true }));
  await assertSucceeds(setDoc(doc(db(null), 'prompt_stats', 'P-A01'), { copies: increment(1) }, { merge: true }));
  await assertFails(setDoc(doc(db(null), 'prompt_stats', 'P-A01'), { copies: increment(5) }, { merge: true }));
  await assertFails(setDoc(doc(db(null), 'prompt_stats', 'P-A01'), { ratingSum: increment(5), ratingCount: increment(1) }, { merge: true }));
  await assertSucceeds(setDoc(doc(db(null), 'prompt_month', 'P-A01_2026-11'), { promptId: 'P-A01', month: '2026-11', copies: increment(1) }, { merge: true }));
  await assertFails(setDoc(doc(db(null), 'prompt_month', 'P-A01_2026-12'), { promptId: 'P-A01', month: '2026-11', copies: increment(1) }, { merge: true }));
  await assertFails(getDocs(collection(db(LEARNER), 'prompt_month')));
});

test('learners rate once per prompt with 1 to 5 stars', async () => {
  const r = doc(db(LEARNER), 'prompt_ratings', `P-A01_${LEARNER}`);
  await assertSucceeds(getDoc(r)); // reading your own (not yet existing) rating
  await assertSucceeds(setDoc(r, { promptId: 'P-A01', uid: LEARNER, stars: 4, at: 't' }));
  await assertFails(setDoc(r, { promptId: 'P-A01', uid: LEARNER, stars: 6, at: 't' }));
  await assertFails(setDoc(doc(db(LEARNER), 'prompt_ratings', `P-A01_${ED}`), { promptId: 'P-A01', uid: ED, stars: 1, at: 't' }));
  await assertFails(getDoc(doc(db(LEARNER), 'prompt_ratings', `P-A01_${ED}`)));
  const s = doc(db(LEARNER), 'prompt_stats', 'P-A02');
  await assertSucceeds(setDoc(s, { ratingSum: increment(4), ratingCount: increment(1) }, { merge: true }));
  await assertSucceeds(setDoc(s, { ratingSum: increment(-2), ratingCount: increment(0) }, { merge: true }));
  await assertFails(setDoc(s, { ratingSum: increment(50), ratingCount: increment(10) }, { merge: true }));
});

test('feedback is private to reviewers', async () => {
  const fb = { promptId: 'P-A01', title: 'T', uid: LEARNER, name: 'L', email: 'l@x', text: 'Please add an example', at: 't', status: 'new' };
  await assertSucceeds(addDoc(collection(db(LEARNER), 'prompt_feedback'), fb));
  await assertFails(addDoc(collection(db(null), 'prompt_feedback'), fb));
  await assertFails(addDoc(collection(db(LEARNER), 'prompt_feedback'), { ...fb, uid: ED }));
  await assertFails(getDocs(collection(db(LEARNER), 'prompt_feedback')));
  await assertFails(getDocs(collection(db(ED), 'prompt_feedback')));
  await assertSucceeds(getDocs(collection(db(REV), 'prompt_feedback')));
});

test('audit log: staff append, only the Owner reads, nobody edits', async () => {
  await assertSucceeds(setDoc(doc(db(ED), 'admin_logs', 'l1'), { at: 't', uid: ED, name: 'E', action: 'edit' }));
  await assertFails(setDoc(doc(db(ED), 'admin_logs', 'l2'), { at: 't', uid: REV, name: 'E', action: 'edit' }));
  await assertFails(setDoc(doc(db(LEARNER), 'admin_logs', 'l3'), { at: 't', uid: LEARNER, action: 'edit' }));
  await assertFails(getDocs(collection(db(REV), 'admin_logs')));
  await assertSucceeds(getDocs(collection(db(OWNER), 'admin_logs')));
  await assertFails(setDoc(doc(db(OWNER), 'admin_logs', 'l1'), { at: 't', uid: OWNER, action: 'changed' }));
});

test('directory: you write your own entry, only the Owner reads', async () => {
  await assertSucceeds(setDoc(doc(db(LEARNER), 'directory', LEARNER), { name: 'L', email: 'l@x', photo: null, lastSeen: 't' }));
  await assertFails(setDoc(doc(db(LEARNER), 'directory', ED), { name: 'L', email: 'l@x', photo: null, lastSeen: 't' }));
  await assertFails(getDocs(collection(db(REV), 'directory')));
  await assertSucceeds(getDocs(collection(db(OWNER), 'directory')));
});

test('private learner data stays private', async () => {
  await assertSucceeds(setDoc(doc(db(LEARNER), 'users', LEARNER), { progress: {} }));
  await assertFails(getDoc(doc(db(OWNER), 'users', LEARNER)));
});
