---
name: ship
description: Use when a change is ready to go up for review. Pre-PR gate for BAPO Path that runs the Compass checks, an independent review, updates traceability opens a PR from the template and merges it once the review approves.
---

# Ship a change

Stop and report at the first failure; never skip or weaken a check.

1. `git diff main...HEAD --stat`. More than 12 files, or more than one REQ or sprint? Suggest splitting it first.
2. A code change has its plan file in `compass/plans/`: `node compass/plan-file.mjs origin/main`.
3. `npm test` (process tests, test-first on `--bug`) and `npm run verify` (prompt check, build, e2e).
4. If `firestore.rules`, `src/data/promptApi.js`, `src/firebase.js` or role logic changed: `tests/rules.test.mjs` covers
   the change (CI runs it; locally `npm run test:rules:emulator` when Java is available), and run `/security-review`.
5. Every closed criterion has a test titled `TC-0xx …`. Update the REQ and TC statuses in `compass/spec.json`, run
   `node compass/build-views.mjs`, then `node compass/check-spec.mjs` and `node compass/check-guardrails.mjs origin/main`.
6. New user-facing behaviour is behind a flag in `src/data/flags.js`.
7. Push and open a PR (ready for review) filled from `.github/pull_request_template.md`, including `## Plan`, an honest **Not tested**
   list and the Owner's after-merge steps.
8. **Independent review:** start a fresh review agent (it must not be you) with only the PR number, the diff, the linked
   REQs, the plan file and `compass/REVIEW.md`; post its `## Independent review (Claude)` comment with `Reviewed commit:`.
   Fix important findings and ask for a new review.
9. **Merge (ADR-006):** CI green + APPROVE for the head commit → `MERGE_TRAILER="…" node compass/merge-pr.mjs <n>`
   (`--dry-run` first if unsure). Not for PRs that need a person (compass/REVIEW.md): ask the Owner instead.
10. Tell the user the PR link and merge commit, the review verdict, which flag to roll out and any after-merge steps.

## Enforced by
- `compass/plan-file.mjs`, `compass/check-spec.mjs`, `compass/check-guardrails.mjs`, `compass/merge-pr.mjs`.
