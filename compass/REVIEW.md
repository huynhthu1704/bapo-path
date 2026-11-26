# compass/REVIEW.md — independent review of every pull request (REQ-028)

Every pull request is reviewed **before it is merged** by a Claude review pass that **did not write the code**.
The author agent never reviews or approves its own work.

## Who reviews and how
Either of these counts as the independent review:
- **In CI:** `claude-review.yml` runs when a PR is marked *Ready for review* (needs the `CLAUDE_CODE_OAUTH_TOKEN` or
  `ANTHROPIC_API_KEY` secret) and posts the comment below.
- **In the session:** the author agent starts a **fresh review agent** (a subagent with no memory of how the code was
  written, e.g. `/code-review` in a new agent) and posts its result as the comment below.

The reviewer gets only: the PR number, its diff, the linked requirement(s) in `compass/spec.json`, the plan file in
`compass/plans/` and the PR's `## Plan`. It may read any file in the repo. It does not edit code.

## Review passes (in this order)
1. **Security and privacy:** changes to `firestore.rules`, `src/data/promptApi.js`, `src/firebase.js` or role checks.
   A permission enforced only in the UI is a bug: it must be in `firestore.rules` with a test in `tests/rules.test.mjs`.
   Also secrets in the diff, unsafe HTML, learner data exposed to other users, new third-party network calls.
2. **Correctness:** bugs with a concrete failing scenario; edge cases (demo mode, guest vs signed in, each role in
   "Act as", 375 px layout, missing translation); regressions in code the diff touches; `href="#…"` anchors (bug #27).
3. **Requirement match:** every Given/When/Then of the linked REQ is implemented and has a test titled with its TC id;
   nothing outside the plan was changed without being stated in the PR's *Departures*.
4. **Compass contract:** `compass/guardrails.json` (≤ 12 files, protected and forbidden paths), new user-facing
   features behind a default-off flag in `src/data/flags.js`, intent and design approved, plan file present,
   `compass/spec.json` statuses and the generated views updated, `Closes #N` in the PR body.
5. **Maintainability:** only issues that will cause real trouble later (duplicated logic, dead code, files growing
   past `maxLinesPerFile`).

**Bug fixes (REQ-032):** the PR carries the `bug` label; its first commit holds only the failing test (and the plan file) and later commits do
not edit it (`compass/test-first.mjs` checks this in CI). Playwright tests cannot run at the first commit in CI: the
reviewer checks out the first commit, runs `npx playwright test -g "#<issue>"` and confirms it fails. A test that does not
fail is an important finding.

## Severity
- **important:** must be fixed before merge: a bug learners would hit, an acceptance criterion not met or not tested,
  a security or privacy risk, a broken guardrail.
- **nit:** optional. Report **at most 5** nits; skip style preferences.

## Comment format
```
## Independent review (Claude)
Verdict: <APPROVE | CHANGES NEEDED>   ·   Important: <n>   ·   Nits: <n>
Reviewed commit: <full SHA of the PR head you reviewed>

### Important
1. <file:line> — <what is wrong> → <what to do>

### Nits
- <file:line> — <suggestion>

### Accepted by the Owner   (only when the Owner accepted a finding in chat)
- <finding> — accepted on <date>: "<their words>" (see the PR comment)
```
`CHANGES NEEDED` exactly when there is at least one important finding. An APPROVE only covers the reviewed commit:
any later push needs a fresh review before merging (`compass/merge-pr.mjs` enforces this).

## Merge rule
- `APPROVE` + CI green → **the author agent squash-merges** with `node compass/merge-pr.mjs <n>` and then reports the
  result to the Owner (set by the Owner on 2026-11-26, ADR-006). Without an authenticated `gh` CLI, the agent checks the
  same conditions itself (all required checks green on the head commit, the latest trusted review says APPROVE with
  `Reviewed commit:` equal to the head, plan file present, `bug` label on bug fixes) and merges with the GitHub tool,
  squash, pinned to that head commit; then it comments the branch, PR and merge commit on each closed issue.
- PRs under *What a person still decides* (below) are **not** merged by an agent: they wait for the Owner's decision
  (and the `human-approved` label).
- `CHANGES NEEDED` → **no merge**. The author fixes the findings, pushes, and asks for a **new** review (again a fresh
  reviewer). If important findings remain after the second fix, stop and ask the Owner.
- **Accepted finding:** the Owner may accept an important finding explicitly in chat. The author quotes the decision
  (date and words) in a PR comment and asks a fresh reviewer for a new review, which lists it under
  `### Accepted by the Owner` and can then APPROVE. Nobody edits an old review or merges over `CHANGES NEEDED`.

## What a person still decides
The Owner decides (the review agent cannot approve, and no agent merges) when a PR:
- changes a protected path in `compass/guardrails.json` (`.github/workflows/`, `.github/CODEOWNERS`, the enforcement
  files: every `compass/*.mjs` check script and `compass/hooks/`, `.claude/settings.json`, `firebase.json`, `.env`),
- changes `firestore.rules`, deletes files or adds or upgrades a dependency,
- deletes or migrates learner data, or changes sign-in or roles.

## Repeated findings
Reviewers start fresh, so the **author agent** checks earlier `## Independent review (Claude)` comments and
`CLAUDE.md → Lessons learned` before fixing. If the same kind of important finding appears in two PRs, add a one-line
lesson to `CLAUDE.md → Lessons learned` in the fixing PR.
