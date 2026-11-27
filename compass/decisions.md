# Decisions (ADR log)

_Generated from `spec.json` → `decisions`. Add an ADR in the same PR whenever a decision is made in chat (REQ-033)._

| ID | Date | Decision | Status | Requirements |
|---|---|---|---|---|
| ADR-001 | 2026-11-23 | Static site on GitHub Pages with Firebase as the only backend | Accepted | — |
| ADR-002 | 2026-11-23 | New user-facing features ship behind default-off feature flags | Accepted | REQ-026 |
| ADR-003 | 2026-11-23 | Security lives in firestore.rules, with a test for every rule change | Accepted | REQ-022 |
| ADR-004 | 2026-11-24 | Hash routing, so no in-page #anchors | Accepted | — |
| ADR-005 | 2026-11-26 | Adopt the Compass Framework, as used in travel-map | Accepted | REQ-026, REQ-027, REQ-028, REQ-029, REQ-030, REQ-031, REQ-032, REQ-033, REQ-034 |
| ADR-006 | 2026-11-26 | Agents merge their own PRs once CI is green and the independent review approves | Accepted | REQ-028 |
| ADR-007 | 2026-11-26 | Compass checks run as a separate CI workflow; existing job names stay | Proposed | REQ-026, REQ-027 |

## ADR-001 — Static site on GitHub Pages with Firebase as the only backend

**Status:** Accepted · **Date:** 2026-11-23

**Context.** BAPO Path is a free learning site run by one person. Decided before Compass; recorded in the 2026-11-26 back-fill.

**Decision.** Host the React/Vite build on GitHub Pages and use Firebase (Google sign-in + Firestore). No server code.

**Consequences.** Anything needing a server needs another free option. Access control must live in firestore.rules.

## ADR-002 — New user-facing features ship behind default-off feature flags

**Status:** Accepted · **Date:** 2026-11-23 · **Requirements:** REQ-026

**Context.** Changes reach learners as soon as they merge; the Owner wants to try them first. Recorded from CLAUDE.md.

**Decision.** Every new user-facing feature gets a flag in src/data/flags.js, off by default with audience owner, then moves owner → beta → everyone.

**Consequences.** Every feature PR adds a flag; the Owner moves audiences in Prompt admin → Insights → Features.

## ADR-003 — Security lives in firestore.rules, with a test for every rule change

**Status:** Accepted · **Date:** 2026-11-23 · **Requirements:** REQ-022

**Context.** Hiding something in the UI is not access control. Recorded from CLAUDE.md.

**Decision.** Every permission is enforced in firestore.rules and tested in tests/rules.test.mjs; a rule is never weakened to make a feature work.

**Consequences.** Rules changes need the Owner to approve (compass/REVIEW.md) and the production deploy approval.

## ADR-004 — Hash routing, so no in-page #anchors

**Status:** Accepted · **Date:** 2026-11-24

**Context.** Bug #27: landing page links like href="#roadmap" were read as routes and bounced to the top.

**Decision.** Keep hash routing (#/path) for GitHub Pages; scroll to sections with JavaScript instead of #section anchors.

**Consequences.** Reviewers flag any href="#…" that is not a route.

## ADR-005 — Adopt the Compass Framework, as used in travel-map

**Status:** Accepted · **Date:** 2026-11-26 · **Requirements:** REQ-026, REQ-027, REQ-028, REQ-029, REQ-030, REQ-031, REQ-032, REQ-033, REQ-034

**Context.** The Owner asked to make the AI-native SDLC of this repo similar to travel-map, which uses Compass: intent, requirements, design, plan, enforced guardrails, independent review and an always-current handover.

**Decision.** Add compass/ (spec.json as source of truth, generated views, checks, guardrails, edit hook, plans, intents, designs, REVIEW.md) and AGENTS.md, adapted to BAPO Path: Playwright TC titles, the prompts check, firestore.rules tests and the existing CI jobs.

**Consequences.** Requirements move from docs/requirements/ to compass/spec.json. From REQ-026 on, every requirement needs an approved intent and design, and every code PR a plan file and an independent review.

## ADR-006 — Agents merge their own PRs once CI is green and the independent review approves

**Status:** Accepted · **Date:** 2026-11-26 · **Requirements:** REQ-028

**Context.** travel-map lets the agent merge once CI is green and the independent review says APPROVE. The Owner chose the same for BAPO Path in chat on 2026-11-26 ("please let the agent merge"), replacing the earlier rule that the Owner merges every PR.

**Decision.** After CI is green and a fresh reviewer posts APPROVE for the head commit, the author agent squash-merges with node compass/merge-pr.mjs <n> and then reports to the Owner. PRs listed under "What a person still decides" in compass/REVIEW.md (protected paths, firestore.rules, deletions, dependencies, learner data, sign-in or roles) need the Owner's explicit OK in chat first; the agent quotes it in a PR comment, adds the human-approved label and then merges (confirmed by the Owner on 2026-11-26). CHANGES NEEDED is never merged.

**Consequences.** The Owner is told about changes after the merge and rolls flags out as before. Agents open PRs as ready for review (a draft cannot be merged). merge-pr refuses protected paths, rules changes and deletions without the label, and bug fixes without a reviewer's test-first run. The label cannot prove the Owner said yes: agents add it only after an explicit OK in chat. A session without an authenticated gh CLI checks the same conditions by hand and merges with the GitHub tool pinned to the reviewed head commit.

## ADR-007 — Compass checks run as a separate CI workflow; existing job names stay

**Status:** Proposed · **Date:** 2026-11-26 · **Requirements:** REQ-026, REQ-027

**Context.** Branch protection may already require the checks "Content, build and end-to-end tests" and "rules"; renaming them would block every PR.

**Decision.** Add .github/workflows/compass.yml with a job named "Compass checks" (spec, guardrails, plan, test-first, process tests) and leave ci.yml and rules-test.yml as they are.

**Consequences.** The Owner adds "Compass checks" to the required checks in branch protection. merge-pr requires all three.
