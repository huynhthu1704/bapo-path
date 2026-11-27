// TC-028 — independent review before merge: merge-pr refuses without green CI and an APPROVE for the head commit
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mergeBlockers, latestReview, parseCloses, commitMessage, REQUIRED_CHECKS, REVIEW_HEADING } from '../../compass/merge-pr.mjs';

const head = 'a'.repeat(40);
const green = REQUIRED_CHECKS.map((name) => ({ name, status: 'completed', conclusion: 'success' }));
const review = (verdict, sha = head, who = { author_association: 'OWNER' }, at = '2026-11-26T10:00:00Z', extra = '') => ({ body: `${REVIEW_HEADING}\nVerdict: ${verdict}   ·   Important: 0\nReviewed commit: ${sha}\n${extra}`, created_at: at, ...who });
const body = '## Plan\nPlan file: compass/plans/REQ-035-x.md\n- Files: src/a.jsx\n- Steps: change it\n- Risks: none known, covered by TC-035\n- Proof: TC-035\n';
const plan = { 'compass/plans/REQ-035-x.md': '# Plan\n## Files\n- src/a.jsx\n## Steps\n1. do\n## Risks\n- low\n## Proof\n- TC-035\n' };
const ok = { checkRuns: green, comments: [review('APPROVE')], files: [{ filename: 'src/a.jsx', status: 'modified' }], labels: [], headSha: head, body, planTexts: plan };

test('TC-028: a reviewed, green, planned PR can be merged', () => {
  assert.deepEqual(mergeBlockers(ok), []);
  assert.deepEqual(REQUIRED_CHECKS, ['Content, build and end-to-end tests', 'rules', 'Compass checks']);
});

test('TC-028: CI not green, no review, CHANGES NEEDED or a review of an older commit block the merge', () => {
  assert.match(mergeBlockers({ ...ok, checkRuns: green.slice(1) })[0], /has not run/);
  assert.match(mergeBlockers({ ...ok, comments: [] })[0], /no independent review/);
  assert.match(mergeBlockers({ ...ok, comments: [review('APPROVE', head, {}, '2026-11-26T09:00:00Z'), review('CHANGES NEEDED')] })[0], /CHANGES NEEDED/);
  assert.match(mergeBlockers({ ...ok, comments: [review('APPROVE', 'b'.repeat(40))] })[0], /ask for a fresh review/);
});

test('TC-028: only trusted reviewers count (collaborators and the CI review app)', () => {
  assert.equal(latestReview([review('APPROVE', head, { author_association: 'NONE', user: { login: 'someone' } })]), null);
  assert.equal(latestReview([review('APPROVE', head, { author_association: 'NONE', user: { login: 'claude[bot]' } })]).verdict, 'APPROVE');
});

test('TC-028: firestore.rules, a missing plan file and an unlabelled bug fix need a person', () => {
  const rules = mergeBlockers({ ...ok, files: [...ok.files, { filename: 'firestore.rules', status: 'modified' }] });
  assert.ok(rules.some((b) => /firestore\.rules changed/.test(b)));
  assert.deepEqual(mergeBlockers({ ...ok, files: [...ok.files, { filename: 'firestore.rules', status: 'modified' }], labels: ['human-approved'] }), []);
  assert.ok(mergeBlockers({ ...ok, planTexts: {} }).some((b) => /plan file/.test(b)));
  assert.ok(mergeBlockers({ ...ok, bugIssues: [27] }).some((b) => /#27 is a bug/.test(b)));
});

test('TC-028: protected paths and deletions need the human-approved label (the Owner\'s OK in chat)', () => {
  const withFiles = (extra, labels = []) => mergeBlockers({ ...ok, files: [...ok.files, extra], labels });
  assert.ok(withFiles({ filename: '.github/workflows/ci.yml', status: 'modified' }).some((b) => /protected path/.test(b)));
  assert.ok(withFiles({ filename: 'compass/merge-pr.mjs', status: 'modified' }).some((b) => /protected path/.test(b)));
  assert.ok(withFiles({ filename: 'src/old.jsx', status: 'removed' }).some((b) => /is deleted/.test(b)));
  assert.deepEqual(withFiles({ filename: '.github/workflows/ci.yml', status: 'modified' }, ['human-approved']), []);
  assert.deepEqual(withFiles({ filename: 'src/old.jsx', status: 'removed' }, ['human-approved']), []);
});

test('TC-028: a bug fix merges only when the APPROVE review reports the test-first run failing', () => {
  const bug = (extra) => mergeBlockers({ ...ok, labels: ['bug'], comments: [review('APPROVE', head, undefined, undefined, extra)] });
  assert.ok(bug('').some((b) => /Test-first run/.test(b)));
  assert.ok(bug('Test-first run: not run (CI reviewer) — needs an in-session reviewer\n').some((b) => /Test-first run/.test(b)));
  assert.deepEqual(bug('Test-first run: tests/e2e/smoke.spec.js "#41 …" fails at 1234567 (before the fix)\n'), []);
});

test('TC-028: closes links and the squash message keep the traceability', () => {
  assert.deepEqual(parseCloses('Closes #12, fixes #3 and Resolves #12'), [12, 3]);
  const msg = commitMessage(body, 'Trailer: x');
  assert.match(msg, /^Plan:\n/);
  assert.match(msg, /Independent review: APPROVE/);
  assert.match(msg, /Trailer: x$/);
});

test('TC-028: REVIEW.md and the CI reviewer use the same comment heading', () => {
  const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
  assert.ok(read('compass/REVIEW.md').includes(REVIEW_HEADING));
  assert.ok(read('.github/workflows/claude-review.yml').includes(REVIEW_HEADING));
  assert.match(read('compass/REVIEW.md'), /Reviewed commit:/);
});
