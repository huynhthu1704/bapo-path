// Feature flags. New features ship off by default (release policy).
//
// audience:
//   'owner'    — only the Owner and staff (Editors, Reviewers) see it
//   'beta'     — staff plus the beta testers listed in settings/site.flags.<key>.beta (user ids)
//   'everyone' — released to all visitors
// The code default below applies until the Owner changes it in Prompt admin → Insights → Features
// (stored in settings/site, every change written to the audit log).
//
// For design review, a reviewer can open any page with ?preview=<flag> (e.g. #/prompts?preview=prompts).
// This only shows the UI in that browser; it grants no data or admin rights. ?preview=off removes it.
import { useSyncExternalStore } from 'react';

export const FLAGS = {
  prompts: { name: 'Prompt Workbench', audience: 'owner', since: '2026-11-23' },
  googleOnly: { name: 'Google-only sign-in (browse without an account)', audience: 'owner', since: '2026-11-27' },
};
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
