# Plan: #52 keep bundled challenges the published knowledge base doesn't have yet

Requirements: none (bug) · Test cases: #52 test in tests/compass/knowledge.test.mjs · Issue: #52
Intent: the bug issue · Design: none: no UI change

## Files
- tests/compass/knowledge.test.mjs — failing test: a cloud copy with only BA-1 must keep the other bundled challenges
- src/knowledge.js — merge challenges by key (cloud wins), like skills, terms and domains

## Steps
1. Commit the failing test and this plan.
2. In applyKnowledge, rebuild CHALLENGES from a copy of the bundled challenges, then the cloud ones on top.
3. Run `npm test` and `npm run verify`.

## Risks
- A challenge removed in the cloud but still bundled would come back. Same behaviour as skills, terms and domains
  today, and the admin has no "delete challenge" action.
- Shared objects between BUNDLED and CHALLENGES: the bundled copy is cloned before it is assigned.
- The Compass CI job installs no npm packages: the test stubs `src/firebase.js` so it needs none (the first PR, #53,
  failed in CI for that reason and was replaced by this branch).

## Proof
- `node --test tests/compass/knowledge.test.mjs` fails before the fix and passes after; `npm test`; `npm run verify`.
