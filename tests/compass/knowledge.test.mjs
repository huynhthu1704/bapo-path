// #52 — a published knowledge base must not hide bundled challenges it doesn't have yet
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

// Load src/knowledge.js without Vite or npm packages (the Compass CI job installs none): stub src/firebase.js,
// and give import.meta.env demo mode.
const hook = `export async function resolve(specifier, ctx, next) {
  if (/\\/firebase\\.js$/.test(specifier) && ctx.parentURL && ctx.parentURL.includes('/src/')) {
    return { url: 'data:text/javascript,export const loadKnowledge = async () => null;', shortCircuit: true };
  }
  return next(specifier, ctx);
}
export async function load(url, ctx, next) {
  const r = await next(url, ctx);
  if (url.includes('/src/') && r.source) return { ...r, source: String(r.source).replaceAll('import.meta.env', '({ VITE_LOCAL_MODE: "1" })') };
  return r;
}`;
register(`data:text/javascript,${encodeURIComponent(hook)}`);

const { applyKnowledge } = await import('../../src/knowledge.js');
const { CHALLENGES } = await import('../../src/data/challenges.js');

test('#52 cloud challenges replace bundled ones by key and keep bundled keys the cloud lacks', () => {
  const bundledKeys = Object.keys(CHALLENGES);
  assert.ok(bundledKeys.includes('BA-1') && bundledKeys.includes('PO-1'), 'bundled challenges present');
  const cloudBa = [{ topic: 'Cloud', situation: 's', question: 'q', options: ['a', 'b', 'c', 'd'], answer: 0, explain: 'e' }];
  // A knowledge base published before PO-1 existed holds only BA-1.
  applyKnowledge({ terms: [], skills: [], domains: [], story: [], challenges: { 'BA-1': cloudBa, 'XX-9': cloudBa } });
  assert.deepEqual(CHALLENGES['BA-1'], cloudBa, 'the cloud version wins for the same key');
  assert.deepEqual(CHALLENGES['XX-9'], cloudBa, 'a key only the cloud has is added');
  for (const k of bundledKeys) assert.ok(CHALLENGES[k]?.length, `${k} is still available after loading the cloud copy`);
});
