// REQ-027: shared rules for compass/guardrails.json, used by the CI check and the Claude Code edit hook.
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

export const APPROVAL_LABEL = 'human-approved';

export function loadGuardrails(root = new URL('..', import.meta.url)) {
  return JSON.parse(readFileSync(new URL('compass/guardrails.json', root), 'utf8'));
}

/** A rule ending with "/" matches everything under that folder; otherwise the exact path. Case-insensitive (macOS/Windows file systems). */
export const matchesRule = (path, rule) => {
  const p = path.toLowerCase();
  const r = rule.toLowerCase();
  return r.endsWith('/') ? p.startsWith(r) : p === r;
};
export const matchesAny = (path, rules = []) => rules.some((r) => matchesRule(path, r));

/** Secret patterns found in a piece of text (returns the matching patterns, never the secret itself). */
export function findSecrets(text, g, path = '') {
  // Public-by-design files (e.g. the Firebase web config) are listed in secretAllowedPaths
  if (path && matchesAny(path, g.secretAllowedPaths)) return [];
  return (g.secretPatterns || []).filter((p) => new RegExp(p).test(text || ''));
}

// Generated or data files that may be long by nature
const LONG_OK = /^(package-lock\.json|compass\/(spec\.json|requirements\.md|tests\.md|decisions\.md)|src\/data\/.*)$/;

/**
 * Check one change set.
 * files: [{ path, status: 'A'|'M'|'D'|'R', addedText?, lines? }]
 * opts: { labels: string[], depsChanged: boolean }
 * Returns { errors: string[], warnings: string[] }.
 */
export function checkChange(files, g, { labels = [], depsChanged = false } = {}) {
  const errors = [];
  const warnings = [];
  const approved = labels.includes(APPROVAL_LABEL);
  const needApproval = new Set(g.requireHumanApprovalFor || []);
  const route = `Ask the Owner in chat; once the Owner approves, add the "${APPROVAL_LABEL}" label to the PR.`;

  if (files.length > g.maxFilesPerChange) errors.push(`${files.length} files changed — the limit is ${g.maxFilesPerChange}. Split the change into smaller PRs.`);
  for (const f of files) {
    if (matchesAny(f.path, g.forbiddenPaths)) errors.push(`${f.path} is a forbidden path and must never be committed.`);
    else if (matchesAny(f.path, g.protectedPaths) && needApproval.has('protected-path') && !approved) errors.push(`${f.path} is a protected path. ${route}`);
    if (f.status === 'D' && needApproval.has('delete') && !approved) errors.push(`${f.path} is deleted — deleting files needs approval. ${route}`);
    const secrets = findSecrets(f.addedText, g, f.path);
    if (secrets.length) errors.push(`${f.path} adds text that looks like a secret (pattern ${secrets.join(', ')}). Remove it and rotate the key.`);
    if (g.maxLinesPerFile && f.lines > g.maxLinesPerFile && !LONG_OK.test(f.path)) warnings.push(`${f.path} has ${f.lines} lines (guideline: ${g.maxLinesPerFile}). Consider splitting it.`);
  }
  if (depsChanged && needApproval.has('dependency-change') && !approved) errors.push(`package.json dependencies changed. ${route}`);
  return { errors, warnings };
}

/** True when the dependency lists differ between two package.json texts. */
export function dependenciesChanged(beforeText, afterText) {
  const deps = (t) => {
    try {
      const p = JSON.parse(t || '{}');
      return JSON.stringify([p.dependencies || {}, p.devDependencies || {}, p.peerDependencies || {}, p.optionalDependencies || {}]);
    } catch {
      return '';
    }
  };
  return deps(beforeText) !== deps(afterText);
}

/** Real path of p even if it does not exist yet: resolve symlinks of the nearest existing ancestor. */
export function realPathOf(p) {
  let cur = resolve(p);
  const rest = [];
  while (!existsSync(cur) && dirname(cur) !== cur) {
    rest.unshift(basename(cur));
    cur = dirname(cur);
  }
  try {
    cur = realpathSync(cur);
  } catch {
    /* keep the resolved path */
  }
  return rest.length ? join(cur, ...rest) : cur;
}

/**
 * Decision of the Claude Code edit hook (REQ-027).
 * input: PreToolUse JSON; repoRoot: real path of the repository; approvedPaths: repo-relative paths the PO approved.
 */
export function decideEdit(input, g, approvedPaths, repoRoot) {
  const ti = (input && input.tool_input) || {};
  const file = ti.file_path || ti.notebook_path;
  if (!file) return { block: false };
  const text = [ti.content, ti.new_string, ti.new_source, ...(ti.edits || []).map((e) => e.new_string)].filter(Boolean).join('\n');
  // Compare real paths on both sides so symlinked folders, spaces and drive-letter case cannot hide the repo
  const rel = relative(realPathOf(repoRoot), realPathOf(resolve(repoRoot, file)));
  const path = rel.split('\\').join('/');
  const inside = !!path && !path.startsWith('..') && !/^[a-zA-Z]:/.test(path);
  const secrets = findSecrets(text, g, inside ? path : '');
  if (inside && matchesAny(path, g.forbiddenPaths)) return { block: true, reason: `${path} is a forbidden path (compass/guardrails.json) and must never be written.` };
  if (inside && matchesAny(path, g.protectedPaths) && !(approvedPaths || []).some((a) => a.toLowerCase() === path.toLowerCase()))
    return {
      block: true,
      reason: `${path} is a protected path (compass/guardrails.json). Ask the Owner in chat for explicit approval first. Once the Owner approves, record it by adding "${path}" to the JSON array in .claude/approved-paths.local.json (git-ignored), then retry. The PR also needs the "${APPROVAL_LABEL}" label for CI.`,
    };
  // Secrets are blocked everywhere, also outside the repo
  if (secrets.length) return { block: true, reason: `The new content for ${path} matches a secret pattern (${secrets.join(', ')}). Never commit secrets; use environment variables or GitHub secrets.` };
  return { block: false };
}

// REQ-031: pull requests that change code must carry a plan in the PR body.
// Content-only edits under src/data/ (prompts, glossary, translations) are not code; the data layer and flags are.
export const CODE_PATH = /^src\/(?!data\/)|^src\/data\/(promptApi|flags)\.js$|^(tests|scripts)\/|^compass\/.*\.mjs$|^\.claude\/|^(index\.html|vite\.config\.js|playwright\.config\.js|firestore\.rules|firebase\.json)$/;
const PLAN_FIELDS = ['Files', 'Steps', 'Risks', 'Proof'];
// values that only hold a place ("-", "TBD", "TODO", "n/a", "...") do not fill a Plan line
const PLACEHOLDER = /^(?:[-–—_.…?]+|tbd|tba|todo|n\/?a|xxx|fill ?in|later)\.?$/i;

/** True when the plan has a line "<label>: <real value>" (bold labels and a "(n)" count allowed). */
function hasPlanField(plan, label) {
  const line = new RegExp(`^\\s*[-*]?\\s*\\**${label}\\**\\s*(?:\\([^)]*\\))?\\s*:\\**(.*)$`, 'gmi');
  return [...plan.matchAll(line)].some((m) => {
    const value = m[1].replace(/\*/g, '').trim();
    return value !== '' && !PLACEHOLDER.test(value);
  });
}

/** The text of the "## Plan" section of a PR body ('' when missing), without HTML comments. */
export function extractPlan(body) {
  const text = (body || '').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
  // The section ends at the next "## " heading, a "---" rule (e.g. a footer) or the end of the body
  const m = text.match(/^##\s+Plan\s*$([\s\S]*?)(?=^##\s|^-{3,}\s*$|(?![\s\S]))/m);
  return m ? m[1].trim() : '';
}

/** Problems with the plan of a PR that changes the given files. */
export function planProblems(body, files) {
  const code = files.filter((f) => CODE_PATH.test(f.path));
  if (!code.length) return [];
  const plan = extractPlan(body);
  if (!plan) return [`this PR changes code (${code[0].path}…) but its body has no "## Plan" section — add files, steps, risks and proof (see the PR template), then push or re-run the CI check.`];
  const missing = PLAN_FIELDS.filter((k) => !hasPlanField(plan, k));
  return missing.length ? [`the "## Plan" section needs a filled-in line for: ${missing.join(', ')} (placeholders such as "-", "TBD", "TODO" or "n/a" do not count).`] : [];
}
