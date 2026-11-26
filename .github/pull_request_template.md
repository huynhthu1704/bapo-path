## What and why

<!-- One or two sentences. Link the requirement or bug. -->

Closes #
Requirements: REQ-0
Test cases: TC-0
Intent: compass/intent/
Design: compass/design/   <!-- or none: <reason> -->

## Plan
<!-- Required when the PR changes code (src/ except content in src/data/, tests/, scripts/, compass/*.mjs, .claude/,
     firestore.rules). Commit compass/plans/<REQ-ids>-<name>.md first and link it; keep the four lines filled in:
     the CI guardrails check reads them. -->
Plan file: compass/plans/
- Files:
- Steps:
- Risks:
- Proof (how we know it works):

## Requirements covered

| REQ | Acceptance criterion | Test (TC) | Status |
| --- | --- | --- | --- |
| REQ-0xx | | `tests/e2e/…` TC-0xx | ✅ / ⚠️ partial / ❌ |

**Departures from the requirement or the plan:** <!-- anything built differently, and why — or "None" -->

## Checks

- [ ] `npm test` and `npm run verify` pass (process tests, prompt check, build, e2e)
- [ ] New or changed behaviour has a test titled with its TC id; `compass/spec.json` statuses updated and `node compass/build-views.mjs` run
- [ ] New user-facing feature is behind a flag in `src/data/flags.js`
- [ ] If `firestore.rules` changed: a test in `tests/rules.test.mjs` covers it, and the Owner approved (`human-approved`)
- [ ] No secrets, no protected paths changed without approval (see `compass/guardrails.json`)
- [ ] Bug fix: label `bug`, first commit only adds the failing test

## Tested

<!-- What you ran and what passed. -->

**Not tested:** <!-- Be explicit: real Google sign-in, live Firebase, Safari, … -->

## Independent review

- [ ] `## Independent review (Claude)` comment from a reviewer that did not write the code (see `compass/REVIEW.md`); verdict APPROVE for the head commit
- [ ] `/security-review` run if rules, auth or `promptApi.js` changed

## After merging

<!-- Manual steps for the Owner (flag audience, rules deploy approval…), or "Nothing". -->
