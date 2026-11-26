# Intent: Run BAPO Path on the Compass Framework, like travel-map

Status: Approved (by Christine, 2026-11-26 — direct request in chat; confirm or correct it in the PR)
Requested: 2026-11-26 by Christine (Owner), in a Claude Code session

## What we want
Every change to BAPO Path follows the same AI-native delivery path as travel-map: business need → intent →
requirements → design → plan → failing test → code → independent review → merge, with the rules checked by
machines rather than remembered by agents. By the end of this PR, a new requirement (REQ-026 on) cannot reach
"In build" without an approved intent and design, a code PR cannot merge through `compass/merge-pr.mjs` without a plan
and an APPROVE review, and `compass/handover.md` always shows where the project stands.

## Business need
"make the ai-native sdlc of this repo similar to travel map with compass framework"

## Why
BAPO Path already had requirements, TC tests, an AI review and branch protection (docs/WORKFLOW.md), but most rules
were text the agent had to remember: nothing checked traceability, the plan, protected files or secrets, and the
requirements lived in a hand-kept Markdown table. travel-map's Compass setup enforces these with scripts, a Claude Code
hook and CI.

## Constraints
- No new paid services and no new dependencies (the checks are plain Node scripts).
- Keep the BAPO Path specifics: Playwright tests titled with their TC id, `npm run check:prompts`, Firestore rules tests,
  feature flags, demo mode, VI/KO/FR content translations.
- Do not rename the existing CI jobs (branch protection may require them).
- Branch protection, secrets and environments are GitHub settings: the Owner changes them, not an agent.

## Success measure
`npm test` and `node compass/check-spec.mjs` pass on main; the next feature PR carries an intent, a design, a plan file
and an `## Independent review (Claude)` comment.

## Out of scope
- travel-map's Compass portal and its spec.json sync.
- Auto-merging by agents (ADR-006 keeps the Owner merging until the Owner decides otherwise).
- Running Playwright tests at the first commit of a bug fix in CI (the reviewer checks those).

## Requirements
- REQ-026 — One source of truth for requirements, tests and handover
- REQ-027 — Enforce the guardrails automatically
- REQ-028 — Independent review of every pull request
- REQ-029 — Capture the business need as an intent before requirements
- REQ-030 — Approved design before any code
- REQ-031 — A written plan before code
- REQ-032 — Failing test committed before every bug fix
- REQ-033 — Record decisions as ADRs
- REQ-034 — Shared memory for agents: lessons learned and working knowledge
