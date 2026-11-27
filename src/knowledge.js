// Knowledge base loader. The app ships with bundled content (src/data/*). When Firebase is configured and the
// knowledge base has been published, the cloud version replaces the bundled data in place at startup,
// so every page reads the latest content without code changes.
import { TERMS, TERM_BY_ID } from './data/terms.js';
import { SKILLS, SKILL_BY_ID } from './data/skills.js';
import { DOMAINS, DOMAIN_BY_ID } from './data/domains.js';
import { CHALLENGES } from './data/challenges.js';
import { CHAPTERS } from './data/story.js';
import { loadKnowledge } from './firebase.js';

export const BUNDLED = structuredClone({ terms: TERMS, skills: SKILLS, domains: DOMAINS, challenges: CHALLENGES, story: CHAPTERS });
export const KB_SOURCE = { value: 'bundled' };

const refill = (arr, list) => arr.splice(0, arr.length, ...list);
const remap = (map, list) => { for (const k of Object.keys(map)) delete map[k]; for (const x of list) map[x.id] = x; };

// Cloud entries replace bundled ones with the same id and add new ones; bundled entries the cloud
// doesn't have yet (e.g. content shipped after the last publish) stay visible.
const mergeById = (bundled, cloud) => {
  const byId = new Map(cloud.map((x) => [x.id, x]));
  const out = bundled.map((x) => byId.get(x.id) || x);
  const seen = new Set(bundled.map((x) => x.id));
  return out.concat(cloud.filter((x) => !seen.has(x.id)));
};

export function applyKnowledge(kb) {
  const terms = mergeById(BUNDLED.terms, kb.terms || []);
  refill(TERMS, terms); remap(TERM_BY_ID, terms);
  if (kb.skills.length) { const sk = mergeById(BUNDLED.skills, kb.skills); refill(SKILLS, sk); remap(SKILL_BY_ID, sk); }
  if (kb.domains.length) { const dm = mergeById(BUNDLED.domains, kb.domains); refill(DOMAINS, dm); remap(DOMAIN_BY_ID, dm); }
  if (Object.keys(kb.challenges).length) { for (const k of Object.keys(CHALLENGES)) delete CHALLENGES[k]; Object.assign(CHALLENGES, kb.challenges); }
  if (kb.story.length) refill(CHAPTERS, kb.story);
}

export async function initKnowledge() {
  try {
    const kb = await Promise.race([loadKnowledge(), new Promise((r) => setTimeout(() => r(null), 15000))]);
    if (kb) { applyKnowledge(kb); KB_SOURCE.value = 'cloud'; }
  } catch (e) { console.warn('Knowledge base: using bundled content', e); }
}
