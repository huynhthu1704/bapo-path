// REQ-031: every change that touches code carries a written plan file, compass/plans/<REQ-ids>-<short-name>.md,
// committed before the code. Checked by compass/merge-pr.mjs before merging, and locally with
//   node compass/plan-file.mjs [baseRef]        (default origin/main)
// The CI guardrails check reads the short "## Plan" in the PR body; merge-pr and this script check the file.
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CODE_PATH } from './guardrails-lib.mjs';

export const PLAN_SECTIONS = ['Files', 'Steps', 'Risks', 'Proof'];
const PLACEHOLDER = /^(?:[-–—_.…?]+|tbd|tba|todo|n\/?a|xxx|fill ?in|later)\.?$/i;
export const isPlanFile = (path) => /^compass\/plans\/(?!README\.md$)[^/]+\.md$/i.test(path || '');

/** Sections of a plan file that are missing or hold only placeholders. */
export function missingSections(text) {
  const clean = (text || '').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
  return PLAN_SECTIONS.filter((label) => {
    const m = clean.match(new RegExp(`^#{2,4}\\s*${label}\\b[^\\n]*\\n([\\s\\S]*?)(?=^#{1,4}\\s|(?![\\s\\S]))`, 'mi'));
    const lines = (m?.[1] || '').split('\n').map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s*/, '').replace(/\*/g, '').trim()).filter(Boolean);
    return !lines.some((l) => !PLACEHOLDER.test(l));
  });
}

/**
 * Problems with the plan files of a change.
 * files: [{ path, status }] changed by the PR · planTexts: { [path]: text } of the plan files it adds or updates.
 */
export function planFileProblems(files, planTexts = {}) {
  const code = files.filter((f) => CODE_PATH.test(f.path));
  if (!code.length) return [];
  const plans = Object.entries(planTexts).filter(([p]) => isPlanFile(p));
  if (!plans.length) return [`this change touches code (${code[0].path}…) but adds no plan file — write compass/plans/<REQ-ids>-<short-name>.md from compass/plans/README.md and commit it before the code.`];
  if (plans.some(([, t]) => !missingSections(t).length)) return [];
  const [path, text] = plans[0];
  return [`${path} needs real content under: ${missingSections(text).join(', ')} (placeholders such as "-", "TBD" or "n/a" do not count).`];
}

/** Text of the plan files a PR adds or updates, from the REST pulls/<n>/files list (added lines of each patch). */
export function planTextsFromPatches(files) {
  return Object.fromEntries((files || []).filter((f) => f.status !== 'removed' && isPlanFile(f.filename) && f.patch)
    .map((f) => [f.filename, f.patch.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1)).join('\n')]));
}

const real = (p) => {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
};

// Compare real paths, so running the script through a symlink still runs the check (CLAUDE.md: paths in Node scripts)
if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  // Run from the repository root (paths in the diff are root-relative) and judge the committed plan (HEAD), not the working tree
  const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const git = (...a) => execFileSync('git', ['-c', 'core.quotePath=false', ...a], { encoding: 'utf8', cwd: root, maxBuffer: 64 * 1024 * 1024 });
  const base = git('merge-base', process.argv[2] || 'origin/main', 'HEAD').trim();
  const parts = git('diff', '--name-status', '--no-renames', '-z', base, 'HEAD').split('\0').filter(Boolean);
  const files = [];
  for (let i = 0; i + 1 < parts.length; i += 2) files.push({ status: parts[i][0], path: parts[i + 1] });
  const texts = Object.fromEntries(files.filter((f) => f.status !== 'D' && isPlanFile(f.path)).map((f) => [f.path, git('show', `HEAD:${f.path}`)]));
  const problems = planFileProblems(files, texts);
  if (problems.length) {
    console.error(`Plan check failed:\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`Plan OK${Object.keys(texts).length ? `: ${Object.keys(texts).join(', ')}` : ' (no code changed)'}.`);
}
