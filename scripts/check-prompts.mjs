// Content check for the Prompt Workbench library. Run: npm run check:prompts
import { PROMPTS, PROMPT_BY_ID, COLLECTIONS, PHASE_BY_ID, CATEGORY_BY_ID, placeholdersOf } from '../src/data/prompts/index.js';

const errors = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);
const REQUIRED = ['id', 'phase', 'step', 'cat', 'sub', 'roles', 'title', 'desc', 'when', 'prepare', 'ph', 'body', 'output', 'next', 'tags', 'tr'];

const ids = new Set(), titles = new Set(), steps = new Set();
for (const p of PROMPTS) {
  const id = p.id || '(no id)';
  for (const f of REQUIRED) if (p[f] === undefined || p[f] === '') err(id, `missing field "${f}"`);
  if (ids.has(id)) err(id, 'duplicate id'); ids.add(id);
  if (titles.has(p.title)) err(id, `duplicate title "${p.title}"`); titles.add(p.title);
  const sk = `${p.phase}:${p.step}`; if (steps.has(sk)) err(id, `duplicate step ${sk}`); steps.add(sk);
  if (!PHASE_BY_ID[p.phase]) err(id, `unknown phase "${p.phase}"`);
  if (!CATEGORY_BY_ID[p.cat]) err(id, `unknown category "${p.cat}"`);
  if (!p.id.startsWith(`P-${p.cat}`)) err(id, `id does not match category ${p.cat}`);
  for (const r of p.roles || []) if (!['BA', 'PO', 'PM'].includes(r)) err(id, `unknown role "${r}"`);
  const inBody = placeholdersOf(p.body || '');
  const declared = (p.ph || []).map((x) => x[0]);
  for (const n of inBody) if (!declared.includes(n)) err(id, `placeholder [${n}] used but not declared in ph`);
  for (const n of declared) if (!inBody.includes(n)) err(id, `placeholder "${n}" declared but not used in body`);
  for (const x of p.ph || []) if (x.length !== 3 || x.some((s) => !s)) err(id, `placeholder entry ${JSON.stringify(x[0])} needs [name, label, example]`);
  for (const n of p.next || []) if (!PROMPT_BY_ID[n]) err(id, `next prompt ${n} does not exist`);
  if ((p.next || []).includes(id)) err(id, 'next points to itself');
  for (const l of ['vi', 'ko', 'fr']) {
    const t = p.tr?.[l];
    if (!Array.isArray(t) || t.length !== 3 || t.some((s) => !s)) err(id, `tr.${l} needs 3 strings`);
  }
}
for (const c of COLLECTIONS) for (const n of c.steps) if (!PROMPT_BY_ID[n]) err(c.id, `collection prompt ${n} does not exist`);

const byPhase = {};
for (const p of PROMPTS) byPhase[p.phase] = (byPhase[p.phase] || 0) + 1;
console.log(`${PROMPTS.length} prompts`, byPhase);
if (errors.length) { console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => ' - ' + e).join('\n')); process.exit(1); }
console.log('All prompt checks passed.');
