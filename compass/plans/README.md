# compass/plans/ — a written plan before any code (REQ-031)

Before changing code, write **one plan file per change**: `compass/plans/<REQ-ids>-<short-name>.md`
(for example `compass/plans/REQ-035-prompt-search-speed.md`). Commit it as the first commit of the branch, then code.
**Bug fixes:** the plan file goes in commit 1 together with the failing test, and nothing else (REQ-032).
If the approach changes during the work, update the plan in the same PR: it is the record of *how* and *why*.

"Code" means `src/` (except content under `src/data/`, but including `promptApi.js` and `flags.js`), `tests/`,
`scripts/`, `compass/*.mjs`, `.claude/`, `firestore.rules`, `firebase.json`, `package.json` and the root config files. Content-only edits
(prompts, glossary, translations) need no plan.

`node compass/merge-pr.mjs` refuses to merge a code PR without a plan file that fills in **Files, Steps, Risks and
Proof**; check it locally with `node compass/plan-file.mjs`. Placeholders such as `-`, `TBD` or `n/a` do not count. The
PR body keeps a short `## Plan` (the same four lines; the CI guardrails check reads it) and links the plan file.

The independent reviewer reads the plan first and checks the diff against it.

## Template
```markdown
# Plan: <REQ-ids> <short title>

Requirements: REQ-0xx · Test cases: TC-0xx · Issue: #N
Intent: <intent file> · Design: <design file, or none: <reason>>

## Files
- <path> — <what changes>

## Steps
1. <step>

## Risks
- <what could break, and how we guard against it>

## Proof
- <which tests / checks show it works, e.g. `npx playwright test -g TC-035`, screenshot of the approved design>
```
