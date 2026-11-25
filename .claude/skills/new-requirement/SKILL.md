---
name: new-requirement
description: Turn an idea, feedback or a Figma note into a BAPO Path requirement (REQ issue + traceability row) with Given/When/Then acceptance criteria. Use when the user describes a new feature or change before any code is written.
---

# New requirement

1. Read `docs/requirements/` and the open issues so the new REQ does not duplicate one. Take the next free REQ number.
2. Draft with `.github/ISSUE_TEMPLATE/requirement.md`:
   - a user story (role, capability, outcome)
   - MoSCoW priority, sprint, source tag: `[USER]`, `[STANDARD]` or `[ASSUMPTION]`. An assumption needs the Owner's OK.
   - 1–4 acceptance criteria as **Given / When / Then**, each testable in demo mode if possible
   - the feature flag it ships behind
   - "Out of scope"
3. Show the draft to the user and **ask** about anything ambiguous. Don't invent business rules.
4. When the user approves: create the issue (labels `requirement`, module, `sprint-N`), and add a **Planned** row to the matrix in `docs/requirements/<module>.md`.
5. Reply with the issue link and the TC id the implementation must add.
