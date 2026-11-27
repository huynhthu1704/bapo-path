// TC-032 — a bug fix starts with a commit that only adds the failing test; the fix does not edit that test
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { testFirstProblems } from '../../compass/test-first.mjs';

const c = (sha, ...files) => ({ sha, files: files.map((p) => (typeof p === 'string' ? { status: 'A', path: p } : p)) });

test('TC-032: test first, then the fix, passes (an e2e-only test is left to the reviewer)', () => {
  const r = testFirstProblems([c('1111111', 'tests/e2e/smoke.spec.js'), c('2222222', 'src/App.jsx')]);
  assert.deepEqual(r.errors, []);
  assert.match(r.warnings[0], /reviewer checks/);
  assert.deepEqual(testFirstProblems([c('1', 'tests/compass/x.test.mjs'), c('2', 'compass/x.mjs')]).unitTests, ['tests/compass/x.test.mjs']);
  assert.deepEqual(testFirstProblems([c('1111111', 'tests/e2e/a.spec.js', 'compass/plans/bug-41-x.md'), c('2', 'src/App.jsx')]).errors, [], 'the plan file may go with the failing test');
  assert.match(testFirstProblems([c('1111111', 'compass/plans/bug-41-x.md', 'compass/x.mjs'), c('2', 'src/App.jsx')]).errors.join(' '), /also changes compass\/x\.mjs/);
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

// Proof step: build a throwaway git repo (base → failing test → fix) and run the real script on it
function proof(testBody, timeoutMs) {
  const dir = mkdtempSync(join(tmpdir(), 'tc032-'));
  const git = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', '-c', 'commit.gpgsign=false', ...a], { cwd: dir, stdio: 'pipe' });
  try {
    git('init', '-q', '-b', 'main');
    writeFileSync(join(dir, 'README.md'), 'x\n');
    git('add', '.');
    git('commit', '-qm', 'base');
    git('checkout', '-qb', 'fix');
    mkdirSync(join(dir, 'tests/compass'), { recursive: true });
    writeFileSync(join(dir, 'tests/compass/bug.test.mjs'), `import test from 'node:test';\nimport { existsSync } from 'node:fs';\ntest('#1 bug', async () => { ${testBody} });\n`);
    git('add', '.');
    git('commit', '-qm', 'failing test');
    writeFileSync(join(dir, 'fix.txt'), 'fixed\n');
    git('add', '.');
    git('commit', '-qm', 'fix');
    const script = fileURLToPath(new URL('../../compass/test-first.mjs', import.meta.url));
    const { NODE_TEST_CONTEXT, ...env } = process.env;
    return spawnSync(process.execPath, [script, 'main', '--bug'], { cwd: dir, encoding: 'utf8', env: { ...env, GITHUB_EVENT_PATH: '', TEST_FIRST_TIMEOUT_MS: String(timeoutMs) } });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('TC-032: the first commit\'s test must really fail at that commit; a passing or hanging test does not prove the bug', () => {
  const failing = proof("if (!existsSync('fix.txt')) throw new Error('bug');", 60000);
  assert.equal(failing.status, 0, failing.stdout + failing.stderr);
  assert.match(failing.stdout, /fails at .* \(before the fix\)/);
  const passing = proof('', 60000);
  assert.equal(passing.status, 1);
  assert.match(passing.stdout, /passes without the fix/);
  const hanging = proof('await new Promise(() => setInterval(() => {}, 1000));', 3000);
  assert.equal(hanging.status, 1);
  assert.match(hanging.stdout, /did not finish/);
});
