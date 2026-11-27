---
name: new-requirement
description: Use when the user describes a new feature or change before any code is written. Turns an idea, feedback or a Figma note into an approved intent, then BAPO Path requirements (REQ in compass/spec.json + GitHub issue) with Given/When/Then acceptance criteria.
---

# New requirement

1. **Intent first.** Write `compass/intent/YYYY-MM-DD-topic.md` from `compass/intent/README.md`: the user's words verbatim
   under `## Business need`, revised into one measurable outcome under `## What we want`. Show it and ask for approval.
2. Read `compass/requirements.md`, `compass/handover.md` and the open issues so the new REQ does not duplicate one. Take
   the next free REQ and TC numbers from `compass/spec.json`.
3. Draft each REQ with `.github/ISSUE_TEMPLATE/requirement.md`:
   - a user story (role, capability, outcome); MoSCoW priority, sprint, source tag `[USER]`, `[STANDARD]` or
     `[ASSUMPTION]` (an assumption needs the Owner's OK)
   - 1–4 acceptance criteria as **Given / When / Then**, each testable in demo mode if possible
   - the feature flag it ships behind, and "Out of scope"
4. Show the draft and **ask** about anything ambiguous. Don't invent business rules.
5. When the Owner approves: set the intent to Approved and list the REQs in it; add the REQ (`status: Approved`,
   `"intent"`, `"ac"` as `"Given …\nWhen …\nThen …"`) and a TC (`type: automated`, `status: Not run`, the planned test file)
   to `compass/spec.json`; run `node compass/build-views.mjs` and `node compass/check-spec.mjs`; create the issue (labels
   `requirement`, module, `sprint-N`).
6. Reply with the issue link, the TC id the implementation must add, and the next step: the design
   (`compass/design/README.md`), which the Owner approves before any code.

## Enforced by
- `compass/check-spec.mjs` (intent approved and listing the REQ, business need present, every REQ has a TC).
