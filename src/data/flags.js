// Feature flags. New features ship off by default (release policy).
//
// audience:
//   'owner'    — only the owner/admins (users with an admins/{uid} doc) see it
//   'beta'     — admins plus testers (sprint 2: beta list in settings/site.flags)
//   'everyone' — released to all visitors
//
// For design review, a reviewer can open any page with ?preview=<flag> (e.g.
// #/prompts?preview=prompts). This only shows the UI in that browser; it grants
// no data or admin rights. Open ?preview=off to remove all previews.
export const FLAGS = {
  prompts: { name: 'Prompt Workbench', audience: 'owner', since: '2026-11-23' },
};

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

/** Whether a flag is on for this visitor. ctx: { admin: boolean }. */
export function can(key, ctx = {}) {
  const f = FLAGS[key];
  if (!f) return false;
  if (f.audience === 'everyone') return true;
  if (ctx.admin) return true; // owner and admins always see new features
  return readPreview().includes(key);
}
