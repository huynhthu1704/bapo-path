# BAPO Path — instructions for AI agents

Follow **AGENTS.md**: it is the contract for every agent (Compass Framework). Every PR also gets an independent review
per **compass/REVIEW.md**. Key files: `compass/spec.json`, `compass/handover.md`, `compass/guardrails.json`,
`compass/decisions.md`. The Owner is Christine (`huynhthu1704`), a BA/PO: write PRs and notes in plain English.

## Commands (each exits non-zero on failure)
- `npm test`: process tests + failing-test-first check · `npm run verify`: prompt check, build, e2e (**before every PR**)
- `npm run dev:demo`: run with no Firebase ("Act as" Owner / Reviewer / Editor / learner) · `npx playwright test -g TC-018`
- `npm run test:rules:emulator`: Firestore rules tests (Java 21; CI always runs them)
- `node compass/check-spec.mjs`: traceability, intent, design, ADRs, handover · `node compass/build-views.mjs`: regenerate views
- `node compass/check-guardrails.mjs origin/main` · `node compass/plan-file.mjs origin/main`: the CI checks, locally

## Definition of done (before opening a PR)
- [ ] Intent and design approved (REQ-026 on); plan file committed first; TC tests written to fail first
- [ ] `npm test` and `npm run verify` pass; rules tests in CI if rules changed; spec statuses + `build-views` updated
- [ ] Behind a default-off flag if user-facing and new; 375 px with no horizontal scroll; real buttons, `aria-label`s
- [ ] PR from `.github/pull_request_template.md` (Plan, REQs covered, departures, **not tested**, after-merge steps)
- [ ] Independent review APPROVE (compass/REVIEW.md); then merge with `compass/merge-pr.mjs` and report (ADR-006)

## Lessons learned (REQ-034)
When the same mistake (or review finding) happens twice, add one line here in the PR that fixes it — this is the single
place for lessons. Keep this file under one page.
- **Hash routing:** never use in-page `href="#section"` anchors; they are read as routes (bug #27). Scroll with JS.
- **Hiding is not access control:** a permission checked only in the UI is a bug; put it in `firestore.rules` with a test.
- **Piped checks hide failures:** `npm test | grep …` exits with grep's status. Use `set -o pipefail` or run checks alone.
- **Never force push**, and never push to `main`: push to a new branch such as `-v2` and open a new PR.
- **Never commit build output** (`dist/`, `dist-e2e/`, `playwright-report/`, `test-results/`) or edit `package-lock.json`
  by hand; check `git status` before committing.
- **Branch every PR from fresh `main`.** Chained branches conflict after squash merges (spec.json, generated views).
- **Scripted text edits must assert the anchor exists**: a silent `str.replace` miss drops a change without an error.
- **A flaky e2e test is a bug until proven otherwise.** Investigate before re-running; write the cause on the issue.

## Working knowledge (loaded automatically)

@compass/agent-knowledge.md
