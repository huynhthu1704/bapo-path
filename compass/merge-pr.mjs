// REQ-028 (+ REQ-031): merge a pull request only when the delivery rules hold, and keep the plan in git history.
// Usage: node compass/merge-pr.mjs <pr-number> [--dry-run]
// Checks: the Compass CI jobs passed on the head commit · the latest independent review by a trusted author says
// APPROVE for exactly that head commit · a code PR still has a filled-in Plan and plan file (REQ-031) · a fix for a bug issue carries the bug label (REQ-032) · firestore.rules changes carry the human-approved label. Then squash-merges
// (pinned to the reviewed commit) with the PR's "## Plan" as the commit message and comments on each "Closes #N"
// issue with the branch, PR and merge commit (traceability rule). Uses the REST API only (no GraphQL).
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractPlan, planProblems, loadGuardrails, matchesAny, APPROVAL_LABEL } from './guardrails-lib.mjs';
import { isPlanFile, planFileProblems, planTextsFromPatches } from './plan-file.mjs';

export const REVIEW_HEADING = '## Independent review (Claude)';
// Job names of ci.yml, rules-test.yml and compass.yml (check runs are named after the job's `name:`)
export const REQUIRED_CHECKS = ['Content, build and end-to-end tests', 'rules', 'Compass checks'];
// Only people with write access count as reviewers: the repository is public, so anyone can comment
export const TRUSTED = ['OWNER', 'MEMBER', 'COLLABORATOR'];
// The CI reviewer (claude-review.yml) comments as a GitHub App; only apps installed on the repository can use these logins
export const TRUSTED_BOTS = ['claude[bot]', 'github-actions[bot]'];
const trusted = (c) => TRUSTED.includes(c.author_association) || TRUSTED_BOTS.includes(c.user?.login);

/** Issue numbers closed by a PR body ("Closes #12", "fixes #3", "resolves #4"). */
export function parseCloses(body) {
  return [...new Set([...(body || '').matchAll(/\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)/gi)].map((m) => Number(m[1])))];
}

/** Newest independent review by a trusted author: { verdict, sha, testFirst } or null. */
export function latestReview(comments) {
  const reviews = (comments || []).filter((c) => (c.body || '').trimStart().startsWith(REVIEW_HEADING) && trusted(c));
  if (!reviews.length) return null;
  const last = [...reviews].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).at(-1);
  return {
    verdict: (last.body.match(/Verdict:\s*(APPROVE|CHANGES NEEDED)/) || [])[1] || null,
    sha: (last.body.match(/Reviewed commit:\s*`?([0-9a-f]{7,40})`?/i) || [])[1] || null,
    // REQ-032: the reviewer's own run of the bug's failing test at the first commit ("Test-first run: <test> fails at <sha>")
    testFirst: (last.body.match(/^Test-first run:[ \t]*(.*)$/im) || [])[1]?.trim() || null,
  };
}
export const latestReviewVerdict = (comments) => latestReview(comments)?.verdict ?? null;

/**
 * REQ-032: true when a "Test-first run:" line proves the failing test failed at a named commit: at least one
 * "fails at <sha>" / "failed at <sha>" in it is not directly negated ("not", "no longer", "never" or "n't", plus at most
 * one word, right before it). Text elsewhere in the line, such as "does not fail at <sha> (after the fix)", is fine.
 */
export function testFirstProven(line) {
  const text = line || '';
  const negated = /(?:\b(?:not|no longer|never)|n't)\s+(?:\w+\s+)?$/i;
  return [...text.matchAll(/\b(?:fails|failed) at `?[0-9a-f]{7,40}\b/gi)].some((m) => !negated.test(text.slice(0, m.index)));
}

/** Reasons the PR must not be merged yet (empty = OK). */
export function mergeBlockers({ checkRuns, comments, files, labels, headSha, body, bugIssues = [], planTexts, guardrails = loadGuardrails() }) {
  const blockers = [];
  const runs = checkRuns || [];
  for (const name of REQUIRED_CHECKS) {
    const r = runs.filter((x) => x.name === name).at(-1);
    if (!r) blockers.push(`CI check "${name}" has not run on the latest commit`);
    else if (r.status !== 'completed') blockers.push(`CI check "${name}" is still ${r.status}`);
    else if (r.conclusion !== 'success') blockers.push(`CI check "${name}" ended with ${r.conclusion}`);
  }
  for (const r of runs) if (!REQUIRED_CHECKS.includes(r.name) && r.status === 'completed' && ['failure', 'timed_out', 'cancelled'].includes(r.conclusion)) blockers.push(`check "${r.name}" ended with ${r.conclusion}`);
  const review = latestReview(comments);
  if (!review) blockers.push('no independent review comment from a trusted reviewer yet (see the independent review policy)');
  else if (review.verdict !== 'APPROVE') blockers.push(`the latest independent review says ${review.verdict || 'no verdict'} — fix and ask for a fresh review`);
  else if (!review.sha || !headSha || !headSha.startsWith(review.sha)) blockers.push(`the APPROVE review is for commit ${review.sha || '(none given)'}, but the PR head is ${headSha} — ask for a fresh review of the latest commit`);
  // REQ-031: CI checked the plan when it ran; the body may have been edited since, so check it again now
  for (const p of planProblems(body, (files || []).map((f) => ({ path: f.filename })))) blockers.push(`plan: ${p}`);
  // REQ-031: a code PR also carries its plan as a file in compass/plans/
  // planTexts: full text of each plan file at the PR head (main() fetches it); default = added lines of each patch
  for (const p of planFileProblems((files || []).map((f) => ({ path: f.filename, status: f.status })), planTexts || planTextsFromPatches(files))) blockers.push(`plan file: ${p}`);
  // REQ-032: a fix for a bug issue needs the bug label, so the CI test-first check (compass/test-first.mjs) ran on it
  for (const i of bugIssues) if (!(labels || []).includes('bug')) blockers.push(`#${i} is a bug — add the "bug" label to the PR so CI checks that a failing test was committed first (REQ-032), then wait for CI`);
  // REQ-032: a bug fix merges only when the APPROVE review reports that the failing test failed before the fix
  // (the CI reviewer cannot run Playwright tests, so a bug PR needs an in-session reviewer who ran it)
  if ((labels || []).includes('bug') && review?.verdict === 'APPROVE' && !testFirstProven(review.testFirst))
    blockers.push('this is a bug fix, but the APPROVE review has no "Test-first run: <test> fails at <sha> (before the fix)" line — ask a fresh in-session reviewer to run the failing test at the first commit (compass/REVIEW.md)');
  // ADR-006: PRs that need a person merge only after the Owner's OK in chat, recorded as the human-approved label
  if (!(labels || []).includes(APPROVAL_LABEL)) {
    const route = `the Owner decides (compass/REVIEW.md) — ask in chat; once the Owner approves, quote it in a PR comment and add "${APPROVAL_LABEL}"`;
    for (const f of files || []) {
      if (f.filename === 'firestore.rules') blockers.push(`firestore.rules changed — ${route}`);
      else if (matchesAny(f.filename, guardrails.protectedPaths)) blockers.push(`${f.filename} is a protected path — ${route}`);
      if (f.status === 'removed') blockers.push(`${f.filename} is deleted — ${route}`);
    }
  }
  return blockers;
}

/** REST path of a file's contents at a commit; each path segment is URL-encoded (spaces, #, ? in file names). */
export const contentsPath = (repo, path, ref) => `repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`;

/** Squash-commit message: the plan, so it is kept in git history with the code. */
export function commitMessage(prBody, trailer = '', planFiles = []) {
  const plan = extractPlan(prBody);
  // Name the plan files only when the body's Plan does not already link them
  const unnamed = planFiles.filter((f) => !plan.includes(f));
  return [plan ? `Plan:\n${plan}` : 'Plan: (none — PR without code changes)', unnamed.length ? `Plan file: ${unnamed.join(', ')}` : '', 'Independent review: APPROVE (see the PR).', trailer].filter(Boolean).join('\n\n');
}

const real = (p) => {
  try {
    return realpathSync(p);
  } catch {
    return resolve(p);
  }
};

if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  const n = Number(process.argv[2]);
  const dry = process.argv.includes('--dry-run');
  if (!n) {
    console.error('Usage: node compass/merge-pr.mjs <pr-number> [--dry-run]');
    process.exit(2);
  }
  const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  const api = (path, ...args) => JSON.parse(gh(['api', ...args, path]) || 'null');
  // All pages, flattened (--slurp wraps each page in an array)
  const all = (path, key) => JSON.parse(gh(['api', '--paginate', '--slurp', path]) || '[]').flatMap((page) => (key ? page[key] : page));
  try {
    const repo = gh(['api', 'repos/{owner}/{repo}', '--jq', '.full_name']).trim();
    const pr = api(`repos/${repo}/pulls/${n}`);
    if (pr.merged) {
      console.log(`PR #${n} is already merged.`);
      process.exit(0);
    }
    const issues = parseCloses(pr.body);
    const bugIssues = issues.filter((i) => api(`repos/${repo}/issues/${i}`).labels.some((l) => l.name === 'bug'));
    const files = all(`repos/${repo}/pulls/${n}/files?per_page=100`);
    // Full text of each plan file at the head commit, so a PR that edits a few lines of an existing plan is judged on the whole plan
    const planTexts = Object.fromEntries(files.filter((f) => f.status !== 'removed' && isPlanFile(f.filename)).map((f) => [f.filename, Buffer.from(api(contentsPath(repo, f.filename, pr.head.sha)).content, 'base64').toString('utf8')]));
    const blockers = mergeBlockers({
      checkRuns: all(`repos/${repo}/commits/${pr.head.sha}/check-runs?per_page=100`, 'check_runs'),
      comments: all(`repos/${repo}/issues/${n}/comments?per_page=100`),
      files,
      labels: pr.labels.map((l) => l.name),
      headSha: pr.head.sha,
      body: pr.body,
      bugIssues,
      planTexts,
    });
    if (blockers.length) {
      console.error(`Not merging PR #${n}:\n- ${blockers.join('\n- ')}`);
      process.exit(1);
    }
    const message = commitMessage(pr.body, process.env.MERGE_TRAILER || '', Object.keys(planTexts));
    if (dry) {
      console.log(`PR #${n} can be merged (head ${pr.head.sha}). Commit message:\n\n${message}\n\nWould comment on: ${issues.map((i) => `#${i}`).join(', ') || '—'}`);
      process.exit(0);
    }
    // sha pins the merge to the reviewed head: GitHub refuses if a new commit arrived meanwhile
    const sha = api(`repos/${repo}/pulls/${n}/merge`, '-X', 'PUT', '-f', 'merge_method=squash', '-f', `sha=${pr.head.sha}`, '-f', `commit_title=${pr.title} (#${n})`, '-f', `commit_message=${message}`).sha;
    console.log(`Merged PR #${n} as ${sha}.`);
    const failed = [];
    for (const issue of issues) {
      try {
        api(`repos/${repo}/issues/${issue}/comments`, '-X', 'POST', '-f', `body=Resolved by branch [\`${pr.head.ref}\`](https://github.com/${repo}/tree/${pr.head.ref}) — PR #${n}, merge commit ${sha}.`);
      } catch {
        failed.push(issue);
      }
    }
    console.log(`Commented on ${issues.filter((i) => !failed.includes(i)).map((i) => `#${i}`).join(', ') || 'no issues'}.`);
    if (failed.length) {
      console.error(`Could not comment on ${failed.map((i) => `#${i}`).join(', ')} — add the traceability comment by hand (merge commit ${sha}).`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`merge-pr failed: ${(e.stderr || e.message || '').toString().trim()}`);
    process.exit(1);
  }
}
