# Sign-in — requirements and traceability

**Module:** Sign-in (Entry / Account) · **Flag:** `googleOnly`

Each REQ has a GitHub issue with the full story and criteria. A test's title starts with its TC id, so
`npx playwright test -g TC-035` runs the tests for REQ-035. How to add or change a requirement: see
`prompt-workbench.md`.

## Traceability matrix

Status: **Covered** = every criterion has an automated test · **Partial** = some criteria tested · **Manual** = checked by hand only.

| REQ | Title | Pri | Sprint | Issue | TC → test | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-035 | Google is the only way to sign in; browsing stays open | Must | 3 | #42 | TC-035a–d → `sign-in.spec.js` | Partial (tested in demo mode; the real Google pop-up and cloud merge need the live site) |

## Requirements

- **REQ-035** Google is the only sign-in. The sign-up page shows only "Continue with Google" (no name, email, "Create account" or guest).
  Visitors can open the landing page, Home, the roadmap, the glossary and lessons without signing in, on the default BA Beginner path.
  Saving anything (lesson done, saved term, flashcard rating, quiz result, profile settings) asks them to sign in first; nothing is saved before that.
  After signing in from that prompt they stay on the same page and the change is saved to their account. Signing in from the
  sign-up page runs the 2-step setup for new accounts. Prompt Workbench favourites and recently used are not affected.
  Demo mode has no Google, so the same button signs in as a demo learner.
