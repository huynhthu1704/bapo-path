// Feature flags: one flag per feature (REQ-037), as on Bee There. A feature that is off is hidden everywhere it
// appears: menu item, its pages (a direct link shows "Coming soon"), Home cards, search results.
//
// audience:
//   'owner'    — only the Owner and staff (Editors, Reviewers) see it
//   'beta'     — staff plus the beta testers listed in settings/site.flags.<key>.beta (user ids)
//   'everyone' — released to all visitors
// The code default below applies until the Owner changes it in the admin Features settings
// (stored in settings/site, every change written to the audit log).
//
// Adding a feature: add an entry with audience 'owner' and today's `since`, check it with useFeature('<key>') in
// every place the feature shows, and map its routes in ROUTE_FLAGS. Features that were live before flags existed
// default to 'everyone' and have no `since`.
//
// For design review, a reviewer can open any page with ?preview=<flag> (e.g. #/prompts?preview=prompts).
// This only shows the UI in that browser; it grants no data or admin rights. ?preview=off removes it.
import { useSyncExternalStore } from 'react';
import { CAT_BY_ID, TERM_BY_ID } from './terms.js';

export const FLAGS = {
  // New features (released step by step)
  prompts: { name: 'Prompt Workbench', icon: 'Sparkles', where: 'Menu, prompt pages, Workbench, collections, prompt search results', audience: 'owner', since: '2026-11-23' },
  googleOnly: { name: 'Google-only sign-in (browse without an account)', icon: 'Lock', where: 'Sign-up page, save buttons, sign-in prompt', audience: 'owner', since: '2026-11-27' },
  pmTrack: { name: 'Product Manager role and learning path', icon: 'Compass', where: 'Onboarding role card, Roadmap tab, rank names, search', audience: 'owner', since: '2026-11-27' },
  // Features that were live before flags existed
  roadmap: { name: 'Skill Roadmap', icon: 'Route', where: 'Menu, roadmap, skill pages, challenges, Home "Continue learning", skill search results', audience: 'everyone' },
  glossary: { name: 'Glossary (General Knowledge)', icon: 'Globe', where: 'Menu, phone bar, glossary and term pages, term search results', audience: 'everyone' },
  frameworks: { name: 'BABOK & PMBOK', icon: 'Compass', where: 'Menu, framework pages and their term lists', audience: 'everyone' },
  domains: { name: 'Domain Knowledge', icon: 'Briefcase', where: 'Menu, domain pages and their term lists', audience: 'everyone' },
  references: { name: 'References', icon: 'Library', where: 'Menu, references page', audience: 'everyone' },
  practice: { name: 'Practice (flashcards & quiz)', icon: 'Zap', where: 'Menu, phone bar, practice setup, flashcards, quiz, results, Home "Review due cards"', audience: 'everyone' },
  speed: { name: 'Speed Round', icon: 'Timer', where: 'Menu, Speed Round page, Home card', audience: 'everyone' },
  story: { name: 'Story Mode', icon: 'BookOpen', where: 'Menu, Story Mode page, Home card', audience: 'everyone' },
  achievements: { name: 'Achievements', icon: 'Award', where: 'Menu, Achievements page, sidebar rank card link', audience: 'everyone' },
  collection: { name: 'Collection', icon: 'Copy', where: 'Menu, Collection page, Home card', audience: 'everyone' },
  circle: { name: 'Study Circle', icon: 'Users', where: 'Menu, Study Circle page, Home card', audience: 'everyone' },
  rewards: { name: 'XP, rank, streak and daily quests', icon: 'Flame', where: 'Top bar XP and streak, sidebar rank card, Home rank, streak and daily quests', audience: 'everyone' },
  saved: { name: 'Saved', icon: 'Bookmark', where: 'Menu, Saved page', audience: 'everyone' },
  library: { name: 'My Library', icon: 'History', where: 'Menu, My Library page', audience: 'everyone' },
  jobs: { name: 'My Job Search', icon: 'ClipboardList', where: 'Menu, My Job Search page', audience: 'everyone' },
};
// The feature each page belongs to (first path segment). Glossary pages of a framework or domain category follow
// that feature instead (catFlag, termFlag below).
export const ROUTE_FLAGS = {
  roadmap: 'roadmap', skill: 'roadmap', challenge: 'roadmap',
  general: 'glossary', glossary: 'glossary', term: 'glossary',
  frameworks: 'frameworks', framework: 'frameworks', domains: 'domains', domain: 'domains', references: 'references',
  practice: 'practice', flashcards: 'practice', quiz: 'practice', results: 'practice',
  speed: 'speed', story: 'story', achievements: 'achievements', collection: 'collection', circle: 'circle',
  saved: 'saved', library: 'library', jobs: 'jobs',
  prompts: 'prompts', workbench: 'prompts', collections: 'prompts', 'my-prompts': 'prompts',
};
// A glossary category of type framework or domain (BABOK, Banking…) belongs to that feature, not to the glossary.
const TYPE_FLAG = { framework: 'frameworks', domain: 'domains' };
export const catFlag = (cat) => (CAT_BY_ID[cat] && TYPE_FLAG[CAT_BY_ID[cat].type]) || 'glossary';
export const termFlag = (id) => (TERM_BY_ID[id] ? catFlag(TERM_BY_ID[id].cat) : 'glossary');
/** The flag of a menu path such as '/story' (undefined for pages that are not a feature, e.g. Home). */
export const flagOfPath = (to) => ROUTE_FLAGS[to.replace(/^\//, '').split(/[/?]/)[0]];
export const AUDIENCES = [
  ['owner', 'Owner and staff only'],
  ['beta', 'Beta testers'],
  ['everyone', 'Everyone'],
];

let remote = {};
const listeners = new Set();
export function setRemoteFlags(flags) { remote = flags || {}; listeners.forEach((l) => l()); }
export const remoteFlags = () => remote;
/** Re-renders the caller when the flags from settings/site arrive or change. */
export const useFlags = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => remote);

const KEY = 'bapo-path-preview';
const readPreview = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
};

// Picks up ?preview=<flag> from the hash or search part of the URL and remembers it.
export function capturePreview(href = window.location.href) {
  const m = href.match(/[?&]preview=([a-z0-9,-]+)/i);
  if (!m) return;
  const list = m[1] === 'off' ? [] : [...new Set([...readPreview(), ...m[1].split(',').filter((k) => FLAGS[k])])];
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
}

export const audienceOf = (key) => (remote[key] && remote[key].audience) || (FLAGS[key] && FLAGS[key].audience);

/** Whether a flag is on for this visitor. ctx: { role: 'owner'|'reviewer'|'editor'|null, uid }. */
export function can(key, ctx = {}) {
  const f = FLAGS[key];
  if (!f) return false;
  const audience = audienceOf(key);
  if (audience === 'everyone') return true;
  if (ctx.role || ctx.admin) return true; // Owner and staff always see new features
  if (audience === 'beta' && ctx.uid && ((remote[key] && remote[key].beta) || []).includes(ctx.uid)) return true;
  return readPreview().includes(key);
}
