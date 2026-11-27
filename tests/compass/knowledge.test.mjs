// #52 — a published knowledge base must not hide bundled challenges it doesn't have yet
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

// src/ reads Vite's import.meta.env; outside Vite, give it demo mode (no Firebase).
const hook = `export async function load(url, ctx, next) {
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
  applyKnowledge({ terms: [], skills: [], domains: [], story: [], challenges: { 'BA-1': cloudBa } });
  assert.deepEqual(CHALLENGES['BA-1'], cloudBa, 'the cloud version wins for the same key');
  for (const k of bundledKeys) assert.ok(CHALLENGES[k]?.length, `${k} is still available after loading the cloud copy`);
});
