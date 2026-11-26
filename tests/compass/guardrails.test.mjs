// TC-027 — compass/guardrails.json is enforced in CI and by the Claude Code edit hook
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkChange, dependenciesChanged, decideEdit, loadGuardrails, APPROVAL_LABEL } from '../../compass/guardrails-lib.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const g = loadGuardrails();
const f = (path, extra = {}) => ({ path, status: 'M', addedText: '', lines: 10, ...extra });
const edit = (file_path, content = 'x') => ({ tool_name: 'Write', tool_input: { file_path, content } });
const decide = (input, approved = [], root = repo) => decideEdit(input, g, approved, root);

test('TC-027: protected paths need the approval label; forbidden paths never pass', () => {
  assert.equal(checkChange([f('.github/workflows/ci.yml')], g).errors.length, 1);
  assert.deepEqual(checkChange([f('.github/workflows/ci.yml')], g, { labels: [APPROVAL_LABEL] }).errors, []);
  assert.equal(checkChange([f('dist/index.html')], g, { labels: [APPROVAL_LABEL] }).errors.length, 1);
  assert.equal(checkChange([f('Firebase.JSON')], g).errors.length, 1, 'matching is case-insensitive');
  assert.deepEqual(checkChange([f('src/App.jsx'), f('firestore.rules')], g).errors, [], 'rules changes are decided at review and merge');
  for (const p of ['compass/check-spec.mjs', 'compass/build-views.mjs', 'compass/plan-file.mjs', 'compass/test-first.mjs', 'compass/merge-pr.mjs', 'compass/guardrails-lib.mjs', 'compass/hooks/guard-edit.mjs'])
    assert.equal(checkChange([f(p)], g).errors.length, 1, `${p}: a PR must not weaken the checks that judge it`);
});

test('TC-027: more than 12 files, deletions and dependency changes are caught', () => {
  const many = Array.from({ length: 13 }, (_, i) => f(`src/f${i}.js`));
  assert.match(checkChange(many, g).errors[0], /13 files changed/);
  assert.equal(checkChange([f('src/old.js', { status: 'D' })], g).errors.length, 1);
  assert.equal(checkChange([f('package.json')], g, { depsChanged: true }).errors.length, 1);
  assert.deepEqual(checkChange([f('src/old.js', { status: 'D' }), f('package.json')], g, { depsChanged: true, labels: [APPROVAL_LABEL] }).errors, []);
  assert.equal(dependenciesChanged('{"dependencies":{"a":"1"}}', '{"dependencies":{"a":"2"}}'), true);
  assert.equal(dependenciesChanged('{"version":"1","dependencies":{"a":"1"}}', '{"version":"2","dependencies":{"a":"1"}}'), false);
});

test('TC-027: secrets fail even with approval, except in the public Firebase web config; long files only warn', () => {
  const key = 'ghp_' + 'a'.repeat(30);
  const r = checkChange([f('src/x.js', { addedText: `const t = "${key}"` })], g, { labels: [APPROVAL_LABEL] });
  assert.match(r.errors[0], /looks like a secret/);
  assert.ok(!r.errors[0].includes(key), 'the message never repeats the secret');
  const web = 'AIza' + 'b'.repeat(35);
  assert.deepEqual(checkChange([f('src/firebase-config.js', { addedText: web })], g).errors, []);
  assert.equal(checkChange([f('src/other.js', { addedText: web })], g).errors.length, 1);
  assert.equal(checkChange([f('keys.json', { addedText: `"type": "service_${'account'}"` })], g).errors.length, 1);
  const long = checkChange([f('src/pages/Prompts.jsx', { lines: 900 })], g);
  assert.deepEqual(long.errors, []);
  assert.equal(long.warnings.length, 1);
});

test('TC-027: the edit hook blocks protected paths until approved, and blocks secrets', () => {
  const blocked = decide(edit('.claude/settings.json'));
  assert.equal(blocked.block, true);
  assert.match(blocked.reason, /Owner/);
  assert.equal(decide(edit('.claude/settings.json'), ['.claude/settings.json']).block, false);
  assert.equal(decide(edit('.env'), ['.env']).block, true, 'forbidden paths stay blocked');
  assert.equal(decide(edit('src/a.js', 'AKIA' + 'B'.repeat(16))).block, true);
  assert.equal(decide(edit('src/firebase-config.js', 'AIza' + 'b'.repeat(35))).block, false);
  assert.equal(decide(edit('src/a.js', 'ok')).block, false);
  assert.equal(decide(edit('/tmp/elsewhere.txt')).block, false);
  assert.equal(decide(edit('/tmp/elsewhere.txt', 'AKIA' + 'B'.repeat(16))).block, true, 'secrets are blocked outside the repo too');
  const spaced = '/home/u/My Projects/bapo-path';
  assert.equal(decide(edit(`${spaced}/compass/guardrails.json`), [], spaced).block, true);
  assert.equal(decide(edit(`${spaced}/src/a.js`), [], spaced).block, false);
});

test('TC-027: the hook script exits 2 to block and fails closed on bad input', () => {
  const hook = fileURLToPath(new URL('../../compass/hooks/guard-edit.mjs', import.meta.url));
  const run = (input) => spawnSync(process.execPath, [hook], { input, encoding: 'utf8' });
  // a forbidden path: blocked whatever the local approval file says
  const blocked = run(JSON.stringify(edit(`${repo}.env.local`)));
  assert.equal(blocked.status, 2);
  assert.match(blocked.stderr, /Blocked by Compass guardrails/);
  assert.equal(run(JSON.stringify(edit(`${repo}src/a.js`))).status, 0);
  assert.equal(run('not json').status, 2);
});
