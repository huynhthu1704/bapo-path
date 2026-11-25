## What and why

<!-- One or two sentences. Link the requirement or bug. -->

Closes #

## Requirements covered

| REQ | Acceptance criterion | Test (TC) | Status |
| --- | --- | --- | --- |
| REQ-0xx | | `tests/e2e/…` TC-0xx | ✅ / ⚠️ partial / ❌ |

**Departures from the requirement:** <!-- anything built differently from the issue, and why — or "None" -->

## Checks

- [ ] `npm run verify` passes (prompt check, build, e2e)
- [ ] New or changed behaviour has an e2e test named after its TC id
- [ ] New user-facing feature is behind a flag in `src/data/flags.js`
- [ ] If `firestore.rules` changed: a test in `tests/rules.test.mjs` covers it
- [ ] Docs updated (README, `docs/requirements/`, CLAUDE.md) if the way things work changed

## Tested

<!-- What you ran and what passed. -->

**Not tested:** <!-- Be explicit: real Google sign-in, live Firebase, Safari, … -->

## After merging

<!-- Manual steps for the Owner, or "Nothing". -->

## AI involvement

- [ ] Written with an AI agent (session link in the commit trailer)
- [ ] AI review (`/code-review`, and `/security-review` if rules or auth changed) run and findings handled
- [ ] A person read the diff before merging
