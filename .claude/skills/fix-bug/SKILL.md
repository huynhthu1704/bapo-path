---
name: fix-bug
description: Use when the user reports something broken on the site. Reproduce-first bug fixing for BAPO Path, with the failing test committed before the fix.
---

# Fix a bug

1. If there's no issue yet, write one with `.github/ISSUE_TEMPLATE/bug.md`: where, steps, expected, actual.
2. Branch `compass/fix-<issue>-short-name` from fresh `main`. Write the plan file
   `compass/plans/<REQ-id or bug-<issue>>-<name>.md` (Files, Steps, Risks, Proof).
3. **Reproduce with a failing test first.** Add a Playwright test in `tests/e2e/` titled `#<issue> …` and run it to watch
   it fail. **Commit it on its own** (commit 1 touches only `tests/`). If it can't be reproduced in demo mode, say so and
   explain why.
4. Find the cause and write it in the issue in one or two plain sentences.
5. Fix it with the smallest change, in later commits that **do not edit the failing test**. Look for the same mistake
   elsewhere (for example, other `href="#…"` anchors after bug #27).
6. Run `npm test` and `npm run verify`, then follow the `ship` skill. The PR gets label `bug` and says `Fixes #<issue>`.
   If the same kind of bug happened before, add a line to `CLAUDE.md → Lessons learned`.

## Enforced by
- `compass/test-first.mjs` (run by `npm test` in CI on PRs labelled `bug`) and `compass/merge-pr.mjs` (a fix for a bug
  issue needs the `bug` label).
