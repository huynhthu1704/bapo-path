// Prompt Workbench data: aggregates every category file and exposes helpers.
import A from './a-discovery.js';
import B from './b-planning.js';
import C from './c-design.js';
import D from './d-requirements.js';
import E from './e-backlog.js';
import F from './f-team.js';
import G from './g-testing.js';
import H from './h-delivery.js';
import I from './i-ai.js';
import { PHASES, LAUNCH_DATE } from './meta.js';

export * from './meta.js';

const PHASE_ORDER = Object.fromEntries(PHASES.map((p, i) => [p.id, i]));

// Sorted in workflow order: phase, then step.
export const PROMPTS = [...A, ...B, ...C, ...D, ...E, ...F, ...G, ...H, ...I]
  .sort((a, b) => (PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase]) || (a.step - b.step));

export const PROMPT_BY_ID = Object.fromEntries(PROMPTS.map((p) => [p.id, p]));

// Placeholders look like [Name]: they start with a capital letter. Lowercase
// brackets such as [role] are template words for the AI, not user fields.
export const PLACEHOLDER_RE = /\[([A-Z][A-Za-z0-9 /-]*)\]/g;

/** Unique placeholder names in the order they first appear in a prompt body. */
export function placeholdersOf(body) {
  const seen = new Set();
  for (const m of body.matchAll(PLACEHOLDER_RE)) seen.add(m[1]);
  return [...seen];
}

/**
 * Replace placeholders with values. Empty values keep their [Bracket] so the
 * copied prompt still shows what is missing.
 */
export function fill(body, values = {}) {
  return body.replace(PLACEHOLDER_RE, (whole, name) => {
    const v = (values[name] ?? '').trim();
    return v ? v : whole;
  });
}

/** Split a body into text and placeholder parts, for highlighted previews. */
export function parts(body, values = {}) {
  const out = [];
  let last = 0;
  for (const m of body.matchAll(PLACEHOLDER_RE)) {
    if (m.index > last) out.push({ text: body.slice(last, m.index) });
    const v = (values[m[1]] ?? '').trim();
    out.push({ name: m[1], text: v || m[0], filled: !!v });
    last = m.index + m[0].length;
  }
  if (last < body.length) out.push({ text: body.slice(last) });
  return out;
}

/** A prompt counts as "new" for 30 days if it was added after launch. */
export function isNew(p, now = Date.now()) {
  if (!p.added || p.added <= LAUNCH_DATE) return false;
  return now - Date.parse(p.added) < 30 * 864e5;
}
