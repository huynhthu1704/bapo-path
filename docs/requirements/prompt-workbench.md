# Prompt Workbench — requirements and traceability

**Module:** Prompt Workbench (BAPO Path) · **Flag:** `prompts` · **Baseline:** v0.1 (23 Nov 2026)

This file is the source of truth in the repo. Each REQ has a GitHub issue (#1–#25) with the full story and criteria,
and each acceptance criterion maps to a test case TC-xxx. A test's title starts with its TC id, so
`npx playwright test -g TC-018` runs the tests for REQ-018.

The original baseline was drafted in a private claude.ai artifact. From now on, change requirements here (in a PR)
and update the matching issue.

## How to add or change a requirement

1. Open an issue with the **Requirement (REQ)** template. Write the criteria as Given / When / Then.
2. Add a row to the matrix below with status **Planned**.
3. In the implementing PR, write the TC test first, then the code. Set the status to **Covered** or **Partial**.
4. A PR that closes a REQ without a TC test needs a reason in the PR's "Departures" section.

## Traceability matrix

Status: **Covered** = every criterion has an automated test · **Partial** = some criteria tested · **Manual** = checked by hand only.

| REQ | Title | Pri | Sprint | Issue | TC → test | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-001 | Browse prompts by phase or category | Must | 1 | #1 | TC-001 → `prompt-library.spec.js` | Covered |
| REQ-002 | Keyword search | Must | 1 | #2 | TC-002 → `prompt-library.spec.js` | Partial (no 300 ms timing check) |
| REQ-003 | Filter by role, phase and category | Must | 1 | #3 | TC-003 → `prompt-library.spec.js` | Covered |
| REQ-004 | Show newly published prompts | Should | 1 | #4 | — | Manual (no prompt is "new" yet) |
| REQ-005 | Prompt detail page | Must | 1 | #5 | TC-005 → `prompt-library.spec.js` | Covered |
| REQ-006 | One-click copy | Must | 1 | #6 | TC-006 → `prompt-library.spec.js` | Covered |
| REQ-007 | Fill-in placeholders with live preview | Must | 1 | #7 | TC-007 → `prompt-library.spec.js` | Covered |
| REQ-008 | Remember filled placeholder values | Should | 1 | #8 | TC-008 → `prompt-library.spec.js` | Partial (clear not tested) |
| REQ-009 | 6-phase workflow view | Must | 1 | #9 | TC-009 → `prompt-library.spec.js` | Covered |
| REQ-010 | Next prompt suggestion | Must | 1 | #10 | TC-010 → `prompt-library.spec.js` | Covered |
| REQ-011 | Workflow collections | Must | 1 | #11 | TC-011 → `prompt-library.spec.js` | Partial (step-through not tested) |
| REQ-012 | Favorite prompts | Must | 1 | #12 | TC-012 → `prompt-library.spec.js` | Partial (cross-device needs live Firebase) |
| REQ-013 | Recently used prompts | Must | 1 | #13 | TC-013 → `prompt-library.spec.js` | Partial (order of 3+ not tested) |
| REQ-014 | Rate a prompt and send private feedback | Should | 3 | #14 | rules: `tests/rules.test.mjs` | Partial (rules only, no e2e) |
| REQ-015 | Create and edit prompts | Must | 2 | #15 | TC-015 → `prompt-admin.spec.js` | Covered |
| REQ-016 | Preview before publishing | Must | 2 | #16 | TC-016 → `prompt-admin.spec.js` | Covered |
| REQ-017 | Submit a draft for review | Must | 2 | #17 | TC-017 → `prompt-admin.spec.js` | Covered |
| REQ-018 | Review checklist and publish | Must | 2 | #18 | TC-018 → `prompt-admin.spec.js` + rules | Covered |
| REQ-019 | Unpublish or archive | Must | 2 | #19 | TC-019 → `prompt-admin.spec.js` | Partial (archive not tested) |
| REQ-020 | Version history and rollback | Must | 2 | #20 | TC-020 → `prompt-admin.spec.js` | Covered |
| REQ-021 | Manage categories, phases and collections | Must | 2 | #21 | — | Manual |
| REQ-022 | Assign Editor and Reviewer roles | Must | 2 | #22 | TC-022 → `prompt-admin.spec.js` + rules | Covered |
| REQ-023 | Admin audit log | Should | 3 | #23 | TC-023 → `prompt-admin.spec.js` + rules | Partial |
| REQ-024 | Prompt insights | Should | 3 | #24 | — | Manual |
| REQ-025 | Prompt metadata in VI, KO and FR | Must | 1 | #25 | TC-025 → `prompt-library.spec.js` | Covered |

**Also covered:** bug #27 (landing menu links) → `smoke.spec.js`; guest onboarding and 375 px layout → `smoke.spec.js`;
feature-flag visibility → `prompt-library.spec.js`; prompt content rules → `npm run check:prompts`.

**Gaps to close next:** REQ-004, REQ-021 and REQ-024 have no automated test. REQ-014 has no e2e test.

## Acceptance criteria

### Browse (F-01)
- **REQ-001** Given the library, when I pick "Define", then only Define prompts show, grouped by subcategory, with a count.
  *Built:* grouped by category A–I, because every prompt has its own subcategory (agreed in PR #26).
- **REQ-002** Given the query "gherkin", when I search, then prompts matching title, description, tags or body show, title matches first, in under 300 ms.
- **REQ-003** Given role PO and phase Build, when both filters are on, then only matching prompts show and the filters stay in the URL.
- **REQ-004** Given a prompt published in the last 30 days, when I open the library, then it has a "New" badge and appears in a "New this month" row.

### Detail (F-02)
- **REQ-005** Given a prompt, when I open it, then I see title, category, roles, purpose, when to use, inputs to prepare, placeholders, body, expected output, tips and example.
  *Built:* the same three general tips on every prompt.
- **REQ-006** Given a prompt, when I click Copy, then the full prompt is on my clipboard and "Copied" shows for 2 s. Keyboard Enter does the same, and screen readers announce "Copied".

### Template (F-03)
- **REQ-007** Given 3 placeholders, when I type values, then the preview updates live and Copy copies the filled prompt. An empty placeholder stays in [brackets] and is highlighted.
- **REQ-008** Given I filled [Business Context], when I open another prompt with the same placeholder, then it is prefilled. Values stay in this browser and can be cleared.

### Workbench (F-04)
- **REQ-009** The Workbench shows Discover → Define → Design → Build → Release → Monitor with ordered steps; prompts I used are ticked.
- **REQ-010** Given a prompt with next prompts, when I copy it, then a "Next step" panel shows 1–3 linked prompts, one marked Recommended.
- **REQ-011** Launch collections: New Product Discovery, Feature Development, Sprint Management, UAT and Release, Project Kickoff, Post-launch Review — each with ordered prompts, progress and step-through.

### Personal (F-05)
- **REQ-012** Tapping the star adds a prompt to My prompts → Favourites. Guests keep favourites in the browser; signed-in users across devices.
- **REQ-013** Given I copied 3 prompts, when I open My prompts, then the last 20 used show, newest first.

### Feedback (F-06)
- **REQ-014** Signed in, I give 1–5 stars and optional text: the public average updates and the text goes privately to the admin inbox. I can change my rating; there are no public comments.

### Editor (F-07)
- **REQ-015** Saving makes a draft with my name and time. Placeholders are detected from the body. VI, KO and FR title, description and when-to-use fields are available.
- **REQ-016** Given a draft, Preview shows the learner detail page including the fill-in form.

### Publishing (F-08)
- **REQ-017** Given a complete draft, when I submit, then status = In review and reviewers see it in their queue.
- **REQ-018** With completeness, clarity, placeholder match and a test run ticked, a reviewer can Publish or Return with a comment. Publish is blocked if a required field is empty. A reviewer cannot publish their own draft (the Owner can).
- **REQ-019** Given a published prompt, when I unpublish, then learners no longer see it and favourites show "No longer available".

### Versions (F-09)
- **REQ-020** History shows who changed what and when, and compares two versions. Restoring a version creates a new draft that goes through review.

### Taxonomy (F-10)
- **REQ-021** Adding, renaming or reordering on the taxonomy page updates the library. A category with prompts can't be deleted, only hidden.

### Staff (F-11)
- **REQ-022** The Owner assigns Editor or Reviewer to a user who signed in once; permissions apply immediately and are enforced by Firestore rules, not only the UI.
- **REQ-023** Every admin action logs who, what, which prompt and when, and the log is viewable.

### Insights (F-12)
- **REQ-024** Insights shows copies per prompt, top 10 this month and average rating, with no personal data.

### Translations (F-13)
- **REQ-025** With Korean chosen, the Korean title, description and when-to-use show under the English. The prompt text and Copy stay English. A missing translation falls back to English.
