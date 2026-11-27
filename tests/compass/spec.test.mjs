// TC-026, TC-029, TC-030, TC-033 — one source of truth with generated views, intents, designs and ADRs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  renderHandover, renderRequirements, renderTests, renderDecisions, handoverProblems, intentProblems, needProblems,
  designProblems, decisionProblems, testFileProblems, requirementProblems,
} from '../../compass/build-views.mjs';

const root = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const readOrNull = (p) => (existsSync(new URL(p, root)) ? read(p) : null);
const spec = JSON.parse(read('compass/spec.json'));
const req = (id, extra = {}) => ({ id, title: 't', priority: 'Must', status: 'Approved', ac: ['Given\nWhen\nThen'], ...extra });
const mini = (requirements, tests = [], decisions = []) => ({ features: [], requirements, tests, decisions });

test('TC-026: check-spec passes on this repository', () => {
  const r = spawnSync(process.execPath, [fileURLToPath(new URL('compass/check-spec.mjs', root))], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Compass spec OK/);
});

test('TC-026: the generated views match spec.json', () => {
  assert.equal(read('compass/requirements.md'), renderRequirements(spec));
  assert.equal(read('compass/tests.md'), renderTests(spec));
  assert.equal(read('compass/decisions.md'), renderDecisions(spec));
  assert.deepEqual(handoverProblems(spec, read('compass/handover.md')), []);
});

test('TC-026: a stale handover is reported', () => {
  const s = mini([req('REQ-001')], [{ id: 'TC-001', reqIds: ['REQ-001'], type: 'manual', status: 'Manual' }]);
  const text = renderHandover(s);
  assert.deepEqual(handoverProblems(s, text), []);
  const changed = { ...s, requirements: [req('REQ-001', { status: 'In build' })] };
  assert.ok(handoverProblems(changed, text).some((p) => /REQ-001 line should be/.test(p)));
});

test('TC-026: an automated test case must point to a file that carries its TC id', () => {
  const files = {
    'tests/e2e/a.spec.js': "test('TC-001 works', …)",
    'tests/e2e/b.spec.js': "test('TC-0010 other', …)",
    'tests/e2e/c.spec.js': "// TC-001 is only mentioned in a comment\ntest('something else', …)",
    'tests/e2e/d.spec.js': "test.describe('x', () => { test(`TC-006/TC-001 shared`, …) })",
    'tests/e2e/e.spec.js': "test.skip('TC-001 not ready', …); test.fixme('TC-001 later', …)",
  };
  const r = (t) => testFileProblems(mini([], [t]), (f) => files[f] ?? null);
  assert.deepEqual(r({ id: 'TC-001', type: 'automated', file: 'tests/e2e/a.spec.js' }), []);
  assert.match(r({ id: 'TC-001', type: 'automated', file: 'tests/e2e/b.spec.js' })[0], /no test titled with TC-001/);
  assert.match(r({ id: 'TC-001', type: 'automated', file: 'tests/e2e/c.spec.js' })[0], /no test titled with TC-001/, 'a comment does not count');
  assert.deepEqual(r({ id: 'TC-001', type: 'automated', file: 'tests/e2e/d.spec.js' }), []);
  assert.match(r({ id: 'TC-001', type: 'automated', file: 'tests/e2e/e.spec.js' })[0], /no test titled/, 'skipped tests do not count');
  assert.match(r({ id: 'TC-001', type: 'automated', file: 'tests/e2e/missing.spec.js' })[0], /missing/);
  assert.match(r({ id: 'TC-001', type: 'automated' })[0], /names no file/);
  assert.deepEqual(r({ id: 'TC-002', type: 'manual' }), []);
});

test('TC-026: acceptance criteria must be a list of strings and the story one sentence', () => {
  assert.deepEqual(requirementProblems(mini([req('REQ-001', { story: 'As a learner …' })])), []);
  assert.match(requirementProblems(mini([req('REQ-001', { ac: 'Given … When … Then …' })]))[0], /non-empty list/, 'a plain string is not a list');
  assert.match(requirementProblems(mini([req('REQ-001', { ac: [] })]))[0], /non-empty list/);
  assert.match(requirementProblems(mini([req('REQ-001', { story: ['Given'] })]))[0], /story must be one sentence/);
  assert.deepEqual(requirementProblems(spec), [], 'the repository requirements are well formed');
});

test('TC-029: requirements from REQ-026 need an approved intent that lists them and keeps the business need', () => {
  const intent = (status, reqs = 'REQ-026', need = true) => `# Intent\n\nStatus: ${status}\n\n## What we want\nx\n${need ? '\n## Business need\n"words"\n' : ''}\n## Requirements\n- ${reqs} — t\n`;
  const f = 'compass/intent/x.md';
  const check = (text, r = req('REQ-026', { intent: f })) => intentProblems(mini([r]), () => text);
  assert.deepEqual(intentProblems(mini([req('REQ-025')]), () => null), [], 'the baseline is exempt');
  assert.match(intentProblems(mini([req('REQ-026')]), () => null)[0], /has no intent/);
  assert.match(check(null)[0], /missing/);
  assert.match(check(intent('Draft'))[0], /not Approved/);
  assert.match(check(intent('Approved (by C, 2026-11-26)', 'REQ-099'))[0], /does not list REQ-026/);
  assert.deepEqual(check(intent('Approved (by C, 2026-11-26)')), []);
  assert.match(needProblems(mini([req('REQ-026', { intent: f })]), () => intent('Approved', 'REQ-026', false))[0], /Business need/);
});

test('TC-030: a design (or "none: reason") is required, and it must be approved before code', () => {
  const f = 'compass/design/x.md';
  const d = (status) => `# Design\n\nStatus: ${status}\nRequirements: REQ-026\n`;
  const check = (r, text) => designProblems(mini([r]), () => text);
  assert.match(check(req('REQ-026'), null)[0], /has no design/);
  assert.deepEqual(check(req('REQ-026', { status: 'Draft' }), null), [], 'Draft requirements may wait');
  assert.deepEqual(check(req('REQ-026', { design: 'none: process change' }), null), []);
  assert.match(check(req('REQ-026', { design: f, status: 'In build' }), d('Draft'))[0], /no code before the design is approved/);
  assert.deepEqual(check(req('REQ-026', { design: f, status: 'In build' }), d('Approved (by C, 2026-11-26)')), []);
  assert.match(check(req('REQ-0260', { design: f }), d('Draft'))[0], /does not mention REQ-0260/);
});

test('TC-030: once designTool is set, a UI design from REQ-035 must link a frame of that Figma file', () => {
  const tool = 'https://www.figma.com/design/JswcODuAH6xx2QPipDHAca';
  const f = 'compass/design/x.md';
  const s = (text) => designProblems({ ...mini([req('REQ-035', { design: f, status: 'In build' })]), designTool: tool }, () => text);
  const base = 'Status: Approved (by C, 2026-11-26)\nRequirements: REQ-035\n';
  assert.match(s(base)[0], /links no Figma frame/);
  assert.match(s(`${base}Frame: https://www.figma.com/design/AAAAAAAAAAAAAAAAAAAAAAAA/x?node-id=1-2`)[0], /links no Figma frame/, 'other files do not count');
  assert.deepEqual(s(`${base}Frame: ${tool}/BAPO?node-id=12-34`), []);
});

test('TC-033: ADRs have every field, a valid status and known requirements', () => {
  const adr = { id: 'ADR-001', date: '2026-11-26', title: 't', status: 'Accepted', context: 'c', decision: 'd', consequences: 'q', reqIds: ['REQ-001'] };
  assert.deepEqual(decisionProblems(mini([req('REQ-001')], [], [adr])), []);
  const bad = decisionProblems(mini([], [], [{ ...adr, status: 'Maybe', decision: '' }, adr]));
  assert.ok(bad.some((p) => /status must be/.test(p)));
  assert.ok(bad.some((p) => /has no decision/.test(p)));
  assert.ok(bad.some((p) => /unknown REQ-001/.test(p)));
  assert.ok(bad.some((p) => /used twice/.test(p)));
  assert.deepEqual(decisionProblems(spec), [], 'the repository ADRs are valid');
});
