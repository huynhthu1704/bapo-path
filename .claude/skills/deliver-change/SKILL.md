---
name: deliver-change
description: Use for any change to BAPO Path (feature, bug fix, process change), from a request in chat to a merged, traceable PR. Covers intent, GitHub issue, REQ/TC in compass/spec.json, design, plan, failing test first, independent review, merge and linking.
---

# Deliver a change the Compass way

Source of truth: `AGENTS.md`, `compass/REVIEW.md`, `compass/agent-knowledge.md`. This is the short checklist.

0. Only implement requirements whose status is **Approved** or **In build**.
1. **Business need → intent** (new requests): write `compass/intent/YYYY-MM-DD-topic.md` from `compass/intent/README.md`:
   the Owner's words under `## Business need`, the measurable intent under `## What we want`. The Owner approves in chat →
   `Status: Approved (by <name>, <date>)`. Bugs skip this: the bug issue is the intent.
2. **Requirement + issue:** `/new-requirement`: REQ with Given/When/Then and `"intent"` in `compass/spec.json`, at least one
   TC, the GitHub issue. A decision made in chat → an ADR. Run `node compass/build-views.mjs`.
3. **Design:** once the REQs are approved, `compass/design/YYYY-MM-DD-topic.md` from `compass/design/README.md` (screens ↔
   REQ ids, Figma frames of the file in `spec.json → designTool`), `"design"` on each REQ (`"none: <reason>"` without UI).
   The Owner approves before any code. Then set the REQs to `In build`.
4. **Branch** from fresh `main`: `compass/REQ-0xx-short-name`; ≤ 12 files; never force push.
5. **Plan:** commit `compass/plans/<REQ-ids>-<name>.md` (Files, Steps, Risks, Proof) first. Check: `node compass/plan-file.mjs origin/main`.
6. **Tests first:** Playwright tests titled `TC-0xx …` (or `#<issue> …` for a bug) that fail before the change.
   Bug fix: commit 1 only adds the failing test; the fix comes later and must not edit it (`/fix-bug`).
7. **Build:** behind a default-off flag if user-facing; 375 px; accessible. Then `npm test`, `npm run verify`,
   `node compass/check-spec.mjs`, `node compass/check-guardrails.mjs origin/main`. Commits start with the REQ id.
8. **PR:** `/ship` (PR from the template, ready for review, `Closes #N`, `## Plan`). Protected paths, deleted files, dependencies and
   `firestore.rules` need the Owner's decision first, then the `human-approved` label.
9. **Independent review:** a fresh reviewer (subagent or `claude-review.yml`) posts `## Independent review (Claude)` with
   `Reviewed commit: <sha>`. CHANGES NEEDED → fix, new review. Any push after an APPROVE needs a new review.
10. **Merge (ADR-006):** APPROVE + CI green → `MERGE_TRAILER="…" node compass/merge-pr.mjs <n>` yourself (checks CI and
    the review, keeps the plan, comments on the issue). Set the REQs to `Done` in the PR before merging. PRs that need a
    person (compass/REVIEW.md) wait for the Owner; never merge over CHANGES NEEDED.
11. **Report** to the Owner in plain English: what changed, which flag to roll out, anything to decide.

## Enforced by
- `compass/check-spec.mjs` (REQ/TC/ADR/intent/design/test ids/handover), `compass/check-guardrails.mjs` in CI (files,
  paths, secrets, PR plan), `compass/plan-file.mjs`, `compass/test-first.mjs` (bug PRs), `compass/merge-pr.mjs` (CI +
  APPROVE for the head commit), the edit hook in `.claude/settings.json`, and `tests/compass/memory.test.mjs`.
