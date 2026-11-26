// TC-031 — a written plan (file + PR body) before any code change
import test from 'node:test';
import assert from 'node:assert/strict';
import { planFileProblems, missingSections, isPlanFile, planTextsFromPatches } from '../../compass/plan-file.mjs';
import { planProblems, extractPlan, CODE_PATH } from '../../compass/guardrails-lib.mjs';

const full = '# Plan\n## Files\n- src/a.jsx — x\n## Steps\n1. do it\n## Risks\n- low\n## Proof\n- TC-035\n';

test('TC-031: what counts as code', () => {
  for (const p of ['src/App.jsx', 'src/data/promptApi.js', 'src/data/flags.js', 'tests/e2e/a.spec.js', 'scripts/check-prompts.mjs', 'compass/check-spec.mjs', 'firestore.rules', 'package.json', '.claude/skills/ship/SKILL.md'])
    assert.ok(CODE_PATH.test(p), p);
  for (const p of ['src/data/terms.js', 'src/data/prompts/a-discover.js', 'src/data/i18n/vi.js', 'README.md', 'compass/spec.json', 'docs/WORKFLOW.md'])
    assert.ok(!CODE_PATH.test(p), p);
});

test('TC-031: a code change needs a plan file with real Files, Steps, Risks and Proof', () => {
  const code = [{ path: 'src/App.jsx', status: 'M' }];
  assert.deepEqual(planFileProblems([{ path: 'src/data/terms.js', status: 'M' }]), [], 'content-only changes need no plan');
  assert.match(planFileProblems(code)[0], /adds no plan file/);
  assert.deepEqual(planFileProblems(code, { 'compass/plans/REQ-035-x.md': full }), []);
  assert.match(planFileProblems(code, { 'compass/plans/REQ-035-x.md': '## Files\n- TBD\n## Steps\n-\n' })[0], /Files, Steps, Risks, Proof/);
  assert.match(planFileProblems(code, { 'compass/plans/README.md': full })[0], /adds no plan file/, 'the README is not a plan');
  assert.deepEqual(missingSections(full), []);
  assert.equal(isPlanFile('compass/plans/README.md'), false);
  const patch = planTextsFromPatches([{ filename: 'compass/plans/REQ-035-x.md', status: 'added', patch: full.split('\n').map((l) => `+${l}`).join('\n') }]);
  assert.deepEqual(missingSections(patch['compass/plans/REQ-035-x.md']), []);
});

test('TC-031: a code PR body needs a filled-in "## Plan"', () => {
  const files = [{ path: 'src/App.jsx' }];
  assert.match(planProblems('## What\nx', files)[0], /no "## Plan" section/);
  assert.match(planProblems('## Plan\n- Files: a\n- Steps: TBD\n- Risks: -\n- Proof: n/a\n', files)[0], /Steps, Risks, Proof/);
  const good = '## Plan\n<!-- note -->\n- Files: src/App.jsx\n- Steps: change\n- Risks: low\n- Proof (how we know it works): TC-035\n\n## Checks\n';
  assert.deepEqual(planProblems(good, files), []);
  assert.ok(!extractPlan(good).includes('Checks'));
  assert.deepEqual(planProblems('', [{ path: 'README.md' }]), []);
});
