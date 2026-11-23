// Learner-side prompt data. Starts with the prompts that ship with the site, then switches to
// the published set (prompt_bundles/published + prompt_taxonomy/main) once it loads.
import { useSyncExternalStore } from 'react';
import { PROMPTS as BUNDLED, PHASES as PHASE_DEFAULTS, CATEGORIES as CAT_DEFAULTS, COLLECTIONS as COL_DEFAULTS } from './prompts/index.js';
import { loadLibrary } from './promptApi.js';

// Phase colours are part of the design system, so only names, descriptions and order are editable.
const PHASE_STYLE = Object.fromEntries(PHASE_DEFAULTS.map((p) => [p.id, { color: p.color, soft: p.soft }]));

export const DEFAULT_TAXONOMY = {
  phases: PHASE_DEFAULTS.map(({ id, name, sub }) => ({ id, name, sub })),
  categories: CAT_DEFAULTS.map(({ id, name }) => ({ id, name, hidden: false, subs: [...new Set(BUNDLED.filter((p) => p.cat === id).map((p) => p.sub))] })),
  collections: COL_DEFAULTS.map((c) => ({ ...c, hidden: false })),
};

function build(prompts, taxonomy, source) {
  const t = taxonomy || DEFAULT_TAXONOMY;
  const phases = t.phases.filter((p) => PHASE_STYLE[p.id]).map((p) => ({ ...p, ...PHASE_STYLE[p.id] }));
  const order = Object.fromEntries(phases.map((p, i) => [p.id, i]));
  const categories = t.categories.filter((c) => !c.hidden);
  const visibleCats = new Set(categories.map((c) => c.id));
  // A hidden category hides its prompts from learners (they stay in the admin area).
  const list = prompts.filter((p) => visibleCats.has(p.cat) && order[p.phase] !== undefined)
    .sort((a, b) => (order[a.phase] - order[b.phase]) || (a.step - b.step) || a.id.localeCompare(b.id));
  const byId = Object.fromEntries(list.map((p) => [p.id, p]));
  const collections = (t.collections || []).filter((c) => !c.hidden)
    .map((c) => ({ ...c, steps: c.steps.filter((id) => byId[id]) })).filter((c) => c.steps.length);
  return {
    source, prompts: list, byId, phases, categories, collections,
    phaseById: Object.fromEntries(phases.map((p) => [p.id, p])),
    categoryById: Object.fromEntries(t.categories.map((c) => [c.id, c])),
    collectionById: Object.fromEntries(collections.map((c) => [c.id, c])),
    phaseCount: Object.fromEntries(phases.map((p) => [p.id, list.filter((x) => x.phase === p.id).length])),
  };
}

let data = build(BUNDLED, null, 'bundled');
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

let loading = null;
/** Loads the published prompts once per page load (call again with force=true after publishing). */
export function loadPromptData(force = false) {
  if (loading && !force) return loading;
  loading = loadLibrary().then((r) => {
    if (r.prompts) { data = build(r.prompts, r.taxonomy, 'cloud'); emit(); }
    else if (r.taxonomy) { data = build(BUNDLED, r.taxonomy, 'bundled'); emit(); }
  }).catch((e) => console.warn('Prompt library: using the bundled prompts', e));
  return loading;
}

export function usePromptData() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => data);
}
export const promptData = () => data;
