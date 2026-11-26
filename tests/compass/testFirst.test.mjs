// TC-032 — a bug fix starts with a commit that only adds the failing test; the fix does not edit that test
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { testFirstProblems } from '../../compass/test-first.mjs';

const c = (sha, ...files) => ({ sha, files: files.map((p) => (typeof p === 'string' ? { status: 'A', path: p } : p)) });

test('TC-032: test first, then the fix, passes (an e2e-only test is left to the reviewer)', () => {
  const r = testFirstProblems([c('1111111', 'tests/e2e/smoke.spec.js'), c('2222222', 'src/App.jsx')]);
  assert.deepEqual(r.errors, []);
  assert.match(r.warnings[0], /reviewer checks/);
  assert.deepEqual(testFirstProblems([c('1', 'tests/compass/x.test.mjs'), c('2', 'compass/x.mjs')]).unitTests, ['tests/compass/x.test.mjs']);
});

test('TC-032: fix in the first commit, a single commit, or editing the test later fail', () => {
  assert.match(testFirstProblems([c('1111111', 'tests/e2e/a.spec.js', 'src/App.jsx'), c('2', 'src/b.js')]).errors[0], /must only add the failing test/);
  assert.ok(testFirstProblems([c('1111111', 'tests/e2e/a.spec.js')]).errors.some((e) => /at least two commits/.test(e)));
  assert.match(testFirstProblems([c('1111111', 'src/App.jsx'), c('2', 'src/b.js')]).errors.join(' '), /adds no test/);
  const edited = [c('1111111', 'tests/e2e/a.spec.js'), c('2222222', 'src/App.jsx', { status: 'M', path: 'tests/e2e/a.spec.js' })];
  assert.match(testFirstProblems(edited).errors[0], /changes the failing test/);
  assert.deepEqual(testFirstProblems(edited, { approved: true }).errors, [], 'the Owner may approve it');
});

test('TC-032: the check skips PRs that are not bug fixes', () => {
  const script = fileURLToPath(new URL('../../compass/test-first.mjs', import.meta.url));
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const r = spawnSync(process.execPath, [script], { encoding: 'utf8', env: { ...env, GITHUB_EVENT_PATH: '' } });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /skipped/);
});
