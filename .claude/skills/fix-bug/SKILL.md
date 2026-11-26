---
name: fix-bug
description: Reproduce-first bug fixing for BAPO Path. Use when the user reports something broken on the site.
---

# Fix a bug

1. If there's no issue yet, write one with `.github/ISSUE_TEMPLATE/bug.md`: where, steps, expected, actual.
2. **Reproduce with a failing test first.** Add a Playwright test in `tests/e2e/` titled `#<issue> …` and run it to watch it fail. If it can't be reproduced in demo mode, say so and explain why.
3. Find the cause and write it in the issue in one or two plain sentences.
4. Fix it with the smallest change. Look for the same mistake elsewhere (for example, other `href="#…"` anchors after bug #27).
5. Run `npm run verify` and follow the `ship` skill. The PR says `Fixes #<issue>`.
