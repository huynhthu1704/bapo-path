// REQ-032: a bug fix starts with a commit that only adds a failing test; later commits must not edit that test.
// CI (npm test, pull_request event): runs when the PR carries the "bug" label; otherwise it skips.
// Locally: node compass/test-first.mjs [baseRef] --bug   (default base origin/main)
// Checks: ≥ 2 commits · the first commit only touches tests/ and adds or changes a test · later commits do
// not touch those test files (unless the PR has the human-approved label) · the unit tests of the first commit
// fail at that commit — a run that times out does not count (Playwright tests in tests/e2e/ cannot run in this job: the independent reviewer checks those).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BUG_LABEL = 'bug';
export const APPROVAL_LABEL = 'human-approved';
export const TEST_PATH = /^tests\//;
export const UNIT_TEST = /^tests\/compass\/[^/]+\.test\.mjs$/;
// How long the first commit's test may run (TEST_FIRST_TIMEOUT_MS lets the unit test use a short limit)
export const PROOF_TIMEOUT_MS = Number(process.env.TEST_FIRST_TIMEOUT_MS) || 300000;

/**
 * Rules for the commits of a bug-fix PR, oldest first.
 * commits: [{ sha, files: [{ status: 'A'|'M'|'D', path }] }]
 * Returns { errors, warnings, testFiles, unitTests }.
 */
export function testFirstProblems(commits, { approved = false } = {}) {
  const errors = [];
  const warnings = [];
  const short = (sha) => (sha || '').slice(0, 7);
  if (!commits.length) return { errors: ['the PR has no commits'], warnings, testFiles: [], unitTests: [] };
  const [first, ...later] = commits;
  const testFiles = first.files.filter((f) => TEST_PATH.test(f.path) && f.status !== 'D').map((f) => f.path);
  const unitTests = testFiles.filter((p) => UNIT_TEST.test(p));
  const other = first.files.filter((f) => !TEST_PATH.test(f.path)).map((f) => f.path);
  if (other.length) errors.push(`the first commit (${short(first.sha)}) must only add the failing test (tests/), but it also changes ${other.join(', ')} — put the fix in a later commit.`);
  if (!testFiles.length) errors.push(`the first commit (${short(first.sha)}) adds no test — start a bug fix with a commit that adds a failing test in tests/.`);
  if (!later.length) errors.push('a bug-fix PR needs at least two commits: first the failing test, then the fix.');
  for (const c of later) {
    const edited = c.files.filter((f) => testFiles.includes(f.path)).map((f) => f.path);
    if (!edited.length) continue;
    const msg = `commit ${short(c.sha)} changes the failing test from the first commit (${edited.join(', ')}) — the fix must not edit the test that proves it.`;
    if (approved) warnings.push(`${msg} Allowed: the Owner approved (${APPROVAL_LABEL}).`);
    else errors.push(`${msg} Revert that change, or ask the Owner; once the Owner approves, add the "${APPROVAL_LABEL}" label.`);
  }
  if (testFiles.length && !unitTests.length) warnings.push(`the failing test is a Playwright test (${testFiles.join(', ')}); CI cannot run it at the first commit, so the independent reviewer checks that it fails without the fix (compass/REVIEW.md).`);
  return { errors, warnings, testFiles, unitTests };
}

const real = (p) => {
  try {
    return realpathSync(p);
  } catch {
    return resolve(p);
  }
};

if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  const git = (...args) => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const pr = eventPath && existsSync(eventPath) ? JSON.parse(readFileSync(eventPath, 'utf8')).pull_request : null;
  const labels = (pr?.labels || []).map((l) => l.name);
  const isBug = pr ? labels.includes(BUG_LABEL) : process.argv.includes('--bug');
  if (!isBug) {
    console.log(`Test-first check skipped: ${pr ? `the PR has no "${BUG_LABEL}" label` : 'not a bug fix (pass --bug to check locally)'}.`);
    process.exit(0);
  }
  // In CI the checkout is the PR merge commit: HEAD^1 = main, HEAD^2 = the PR head
  const base = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'origin/main';
  const range = pr ? 'HEAD^1..HEAD^2' : `${base}..HEAD`;
  const shas = git('rev-list', '--reverse', '--no-merges', range).split('\n').filter(Boolean);
  const commits = shas.map((sha) => {
    const parts = git('diff-tree', '--no-commit-id', '-r', '--name-status', '--no-renames', '-z', sha).split('\0').filter(Boolean);
    const files = [];
    for (let i = 0; i + 1 < parts.length; i += 2) files.push({ status: parts[i][0], path: parts[i + 1] });
    return { sha, files };
  });
  const { errors, warnings, unitTests } = testFirstProblems(commits, { approved: labels.includes(APPROVAL_LABEL) });

  // Proof: the unit tests of the first commit must fail at that commit (before the fix)
  if (!errors.length && unitTests.length) {
    const top = git('rev-parse', '--show-toplevel').trim();
    const dir = mkdtempSync(join(tmpdir(), 'test-first-'));
    const tree = join(dir, 'tree');
    try {
      git('worktree', 'add', '--detach', tree, commits[0].sha);
      if (existsSync(join(top, 'node_modules'))) symlinkSync(join(top, 'node_modules'), join(tree, 'node_modules'), 'junction');
      // NODE_TEST_CONTEXT would make the child report to a parent test runner instead of setting its exit code
      const { NODE_TEST_CONTEXT, ...rest } = process.env;
      const env = { ...rest, GITHUB_EVENT_PATH: '' };
      const run = spawnSync(process.execPath, ['--test', ...unitTests], { cwd: tree, env, encoding: 'utf8', timeout: PROOF_TIMEOUT_MS });
      // A run that hangs (killed by the timeout) or cannot start proves nothing: only a finished, failing run counts
      if (run.error || run.status === null) errors.push(`the test from the first commit did not finish (${unitTests.join(', ')}): ${run.error?.code === 'ETIMEDOUT' || run.signal ? `stopped after ${PROOF_TIMEOUT_MS / 1000} s` : run.error?.message || 'no exit code'} — a hanging test does not prove the bug; make it fail fast.`);
      else if (run.status === 0) errors.push(`the test from the first commit passes without the fix (${unitTests.join(', ')}) — it does not reproduce the bug.`);
      else console.log(`Test-first proof: ${unitTests.join(', ')} fails at ${commits[0].sha.slice(0, 7)} (before the fix), as expected.`);
    } finally {
      try {
        git('worktree', 'remove', '--force', tree);
      } catch {
        /* the temp folder is removed below */
      }
      rmSync(dir, { recursive: true, force: true });
    }
  }
  for (const w of warnings) console.log(`::warning::${w}`);
  if (errors.length) {
    for (const e of errors) console.log(`::error::${e}`);
    console.error(`Test-first check failed (${errors.length}). See REQ-032 in compass/requirements.md.`);
    process.exit(1);
  }
  console.log(`Test-first OK: ${commits.length} commits, failing test committed first and not edited by the fix.`);
}
