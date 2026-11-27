// TC-034 — shared agent memory: CLAUDE.md lessons, the working knowledge file and repo skills backed by checks
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

test('TC-034: CLAUDE.md stays under one page, points to AGENTS.md and REVIEW.md and loads the knowledge file', () => {
  const md = read('CLAUDE.md');
  assert.ok(md.split('\n').length <= 50, 'keep CLAUDE.md under one page (50 lines)');
  assert.match(md, /^@compass\/agent-knowledge\.md$/m);
  for (const s of ['AGENTS.md', 'REVIEW.md', 'npm test', 'npm run verify', 'check-spec.mjs', 'build-views.mjs', 'check-guardrails.mjs']) assert.ok(md.includes(s), s);
  const lessons = md.split('## Lessons learned')[1] || '';
  assert.match(lessons, /same mistake .*happens twice/);
  assert.ok(lessons.split('\n').filter((l) => l.startsWith('- ')).length >= 5);
});

test('TC-034: the working knowledge has the key sections and no secrets or e-mail addresses', () => {
  const k = read('compass/agent-knowledge.md');
  for (const h of ['People and how to work with Christine', 'Delivery contract', 'Feature flags', 'Tests and CI/CD', 'Open items', 'Protected paths']) assert.ok(k.includes(h), h);
  assert.doesNotMatch(k, /[\w.+-]+@[\w-]+\.[\w.]+/);
  assert.doesNotMatch(k, /AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,}|-----BEGIN/);
});

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  return m && Object.fromEntries(m[1].split('\n').map((l) => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]));
}

test('TC-034: every repo skill says when to use it and names the check that enforces it', () => {
  const skills = readdirSync(new URL('.claude/skills/', root));
  for (const name of ['deliver-change', 'new-requirement', 'ship', 'fix-bug']) assert.ok(skills.includes(name), name);
  for (const name of skills) {
    const md = read(`.claude/skills/${name}/SKILL.md`);
    const fm = frontmatter(md);
    assert.equal(fm?.name, name);
    assert.match(fm.description, /^Use (when|whenever|for) /, `${name}: description says when to use it`);
    const section = md.split('## Enforced by')[1] || '';
    const paths = [...section.matchAll(/`((?:tests|compass|\.claude)\/[\w./-]+\.(?:mjs|json))`/g)].map((m) => m[1]);
    assert.ok(paths.length > 0, `${name}: names at least one check`);
    for (const p of paths) assert.ok(existsSync(new URL(p, root)), `${name}: ${p} exists`);
  }
});
