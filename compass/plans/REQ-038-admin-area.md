# Plan: REQ-038 part 1 — one Admin area

Requirements: REQ-038 · Test cases: TC-038 (b, c, d) · Issue: #59
Intent: compass/intent/2026-11-27-admin-redesign-and-flags.md · Design: compass/design/2026-11-27-admin-redesign-and-flags.md (SCR-4 shell, SCR-6, Figma F03/F06)

REQ-038 ships in two PRs (12-file limit). **This PR:** the single Admin entry and the Admin area with its own side
menu; all admin pages under `#/admin/...`; old links redirect; `PromptAdmin.jsx` split below the 600-line guideline.
**Next PR:** the learner sidebar groups (TC-038a), REQ-038 Done, README / docs / agent-knowledge wording. The spec does
not change in this PR (REQ-038 stays Approved, TC-038 manual) to stay within 12 files.

## Files
- src/pages/AdminShell.jsx (new) — `AdminShell`: breadcrumb "Admin › <page>", title, purpose, "Signed in as", the demo
  "Act as" bar, and the admin side menu (`<nav aria-label="Admin">`): CONTENT Prompts · Review queue · Feedback ·
  Taxonomy · Knowledge base; PEOPLE Staff; RELEASES Features; ACTIVITY Insights · Audit log. Items a role cannot use are
  not shown (Editor: Prompts; Reviewer: + Review queue, Feedback; Owner: all). Counts as badges. At 375 px the menu is an
  "Admin section" drop-down. Shared helpers moved here: `useAction`, `Err`, `Ok`, `friendly`, `when`, `isReviewer`.
- src/pages/PromptAdmin.jsx — prompt pages only (list, editor, preview, review queue, review, history) on `AdminShell`.
- src/pages/AdminPages.jsx (new) — Feedback, Taxonomy, Staff, Features, Insights (usage only) and the Audit log as its
  own page, moved out of PromptAdmin.jsx.
- src/pages/Account.jsx — the knowledge-base admin renders inside `AdminShell` (Owner only, as today).
- src/App.jsx — routes `/admin` (opens Prompts until REQ-039 adds the Overview), `/admin/prompts`, `/admin/prompts/new`,
  `/admin/prompts/:id/edit|preview|history`, `/admin/review`, `/admin/review/:id`, `/admin/feedback`,
  `/admin/taxonomy`, `/admin/knowledge`, `/admin/staff`, `/admin/features`, `/admin/insights`, `/admin/audit`; every
  old `/pw-admin/...` path redirects to its new page.
- src/components/ui.jsx — one **Admin** item right under Home for staff (replaces *Prompt admin* and *Knowledge
  admin*); `Toggle` gets a real `disabled` (review note of #69).
- tests/e2e/navigation.spec.js (new) — TC-038b (one Admin entry; side menu per role; Knowledge base Owner only),
  TC-038c (old links land on the new pages), TC-038d (375 px: drop-down, no sideways scroll).
- tests/e2e/prompt-admin.spec.js, tests/e2e/features.spec.js — new URLs, the "Admin" menu name, the audit log page.

## Steps
1. Write navigation.spec.js and check it fails today.
2. Create AdminShell.jsx and AdminPages.jsx by moving code (no behaviour change), then switch PromptAdmin.jsx and the
   knowledge-base page to the shell.
3. Routes and redirects in App.jsx; sidebar entry in ui.jsx.
4. Update the existing admin tests for the new URLs; `npm test`, `npm run verify`, Compass checks.

## Risks
- **Broken admin links:** every `navigate`/`Link` to `/pw-admin` moves to `/admin` in one pass (grep must find none left
  in src/); old bookmarks redirect (TC-038c); the existing TC-016…TC-024 admin tests run on the new URLs.
- **Access:** the side menu only hides what a role cannot use; data access stays enforced by `firestore.rules`
  (unchanged). The Knowledge base keeps its own Owner check.
- **Big move:** code is moved, not rewritten; the diff is reviewed against this plan.

## Proof
- `npx playwright test -g TC-038`, `npx playwright test tests/e2e/prompt-admin.spec.js tests/e2e/features.spec.js`,
  `npm run verify`, `npm test`, `node compass/check-guardrails.mjs origin/main` (no line-length warning for PromptAdmin.jsx).
- Screenshot compared with Figma F03/F06 (shell and side menu; Overview content comes with REQ-039).
