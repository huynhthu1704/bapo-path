---
name: ship
description: Pre-PR gate for BAPO Path. Runs the checks, an AI review, updates traceability and opens a draft PR from the template. Use when a change is ready to go up for review.
---

# Ship a change

Stop and report at the first failure; never skip or weaken a check.

1. `git diff main...HEAD --stat`. If the change spans more than one REQ or sprint, suggest splitting it before going on.
2. `npm run verify` (prompt check, build, e2e).
3. If `firestore.rules`, `src/data/promptApi.js`, `src/firebase.js` or role logic changed: make sure `tests/rules.test.mjs` covers the change. The rules tests run in CI (`rules-test.yml`); locally run `npm run test:rules:emulator` when Java is available.
4. Run `/code-review` on the diff. If rules or auth changed, also run `/security-review`. Fix real findings and list anything you chose not to fix, with the reason.
5. Every closed REQ criterion has a test titled `TC-0xx …`. Update the status in `docs/requirements/<module>.md`.
6. New user-facing behaviour is behind a flag in `src/data/flags.js`.
7. Push and open a **draft** PR filled from `.github/pull_request_template.md`. Include an honest **Not tested** list and the Owner's after-merge steps.
8. Tell the user the PR link and what still needs a person: reading the diff, approving, merging, and any after-merge steps.
