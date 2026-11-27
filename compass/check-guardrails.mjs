// REQ-027: CI check of a pull request against compass/guardrails.json. Exits 1 on any error.
// Usage (CI, pull_request event): node compass/check-guardrails.mjs
// Locally: node compass/check-guardrails.mjs [baseRef]   (default origin/main)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { loadGuardrails, checkChange, dependenciesChanged, planProblems, APPROVAL_LABEL } from './guardrails-lib.mjs';

// quotePath=false keeps non-ASCII (e.g. Vietnamese) file names readable instead of quoted octal escapes
const git = (...args) => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const event = process.env.GITHUB_EVENT_PATH && existsSync(process.env.GITHUB_EVENT_PATH) ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : {};
const pr = event.pull_request;
// In CI the checkout is the PR merge commit: its first parent is main at merge time, so HEAD^1..HEAD is exactly
// the PR's change even if main moved after the PR was opened. Locally: <baseRef>...HEAD.
const range = pr ? ['HEAD^1', 'HEAD'] : [`${process.argv[2] || 'origin/main'}...HEAD`];
const baseRef = pr ? 'HEAD^1' : null;
const labels = (pr?.labels || []).map((l) => l.name);

const g = loadGuardrails();
// -z: NUL-separated output, so no path is ever quoted (quotes, backslashes, tabs, newlines in names)
const parts = git('diff', '--name-status', '--no-renames', '-z', ...range).split('\0').filter(Boolean);
const pairs = [];
for (let i = 0; i + 1 < parts.length; i += 2) pairs.push([parts[i], parts[i + 1]]);
const files = pairs
  .map(([status, path]) => {
    const addedText = status === 'D' ? '' : git('diff', '-U0', ...range, '--', path).split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).join('\n');
    const lines = status === 'D' || !existsSync(path) ? 0 : readFileSync(path, 'utf8').split('\n').length;
    return { path, status: status[0], addedText, lines };
  });

const show = (ref) => {
  try {
    return git('show', `${ref}:package.json`);
  } catch {
    return '';
  }
};
const depsChanged = files.some((f) => f.path === 'package.json') && dependenciesChanged(show(baseRef || git('merge-base', process.argv[2] || 'origin/main', 'HEAD').trim()), show('HEAD'));

const { errors, warnings } = checkChange(files, g, { labels, depsChanged });
// REQ-031: a PR that changes code needs a plan (only checked in CI, where the PR body is known)
if (pr) errors.push(...planProblems(pr.body, files));
for (const w of warnings) console.log(`::warning::${w}`);
if (errors.length) {
  for (const e of errors) console.log(`::error::${e}`);
  console.error(`Guardrails check failed (${errors.length}). Approval label: "${APPROVAL_LABEL}" (${labels.includes(APPROVAL_LABEL) ? 'present' : 'absent'}).`);
  process.exit(1);
}
console.log(`Guardrails OK: ${files.length} files changed${labels.includes(APPROVAL_LABEL) ? ` (approved: ${APPROVAL_LABEL})` : ''}.`);
