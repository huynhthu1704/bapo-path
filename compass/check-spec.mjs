// Compass traceability check — run in CI. Exits 1 if the spec is inconsistent.
import { readFileSync, existsSync } from 'node:fs';
import { handoverProblems, decisionProblems, intentProblems, needProblems, designProblems, testFileProblems, requirementProblems } from './build-views.mjs';
const spec = JSON.parse(readFileSync(new URL('./spec.json', import.meta.url), 'utf8'));
const errors = [];
const reqIds = new Set(spec.requirements.map((r) => r.id));
errors.push(...requirementProblems(spec));
for (const r of spec.requirements) {
  if (r.status !== 'Draft' && !spec.tests.some((t) => t.reqIds.includes(r.id))) errors.push(`${r.id} (${r.status}) has no test case`);
}
for (const t of spec.tests) {
  if (!t.reqIds.length) errors.push(`${t.id} does not reference a requirement`);
  for (const id of t.reqIds) if (!reqIds.has(id)) errors.push(`${t.id} references unknown ${id}`);
}
// REQ-029: requirements point to an Approved intent file (required from REQ-026 onward)
for (const p of intentProblems(spec, (f) => (existsSync(new URL(`../${f}`, import.meta.url)) ? readFileSync(new URL(`../${f}`, import.meta.url), 'utf8') : null))) errors.push(`intent: ${p}`);
const readRepo = (f) => (existsSync(new URL(`../${f}`, import.meta.url)) ? readFileSync(new URL(`../${f}`, import.meta.url), 'utf8') : null);
// REQ-029: new intents keep the Product Owner's business need next to the revised business intent
for (const p of needProblems(spec, readRepo)) errors.push(`intent: ${p}`);
// REQ-030: an approved design before any code (required from REQ-026)
for (const p of designProblems(spec, readRepo)) errors.push(`design: ${p}`);
// REQ-026: automated test cases point to a file that carries their TC id
for (const p of testFileProblems(spec, readRepo)) errors.push(`tests: ${p}`);
// REQ-033: every ADR has id, date, title, status, context, decision, consequences and valid requirement links
for (const p of decisionProblems(spec)) errors.push(`decisions: ${p}`);
// REQ-026: handover.md must match the spec (run `node compass/build-views.mjs` to regenerate)
const handoverFile = new URL('./handover.md', import.meta.url);
if (!existsSync(handoverFile)) errors.push('handover.md is missing — run `node compass/build-views.mjs`');
else for (const p of handoverProblems(spec, readFileSync(handoverFile, 'utf8'))) errors.push(`handover.md is stale (run \`node compass/build-views.mjs\`): ${p}`);
if (errors.length) { console.error('Compass spec check failed:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log(`Compass spec OK: ${spec.requirements.length} requirements, ${spec.tests.length} tests, ${(spec.decisions || []).length} decisions`);
