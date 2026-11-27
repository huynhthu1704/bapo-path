# Intent: Product Manager role and learning path

Status: Approved (by Christine, 2026-11-27)
Requested: 2026-11-27 by Christine (Owner), in a Claude Code chat

## What we want
Starter Product Managers can pick their own role when they join BAPO Path and follow a Product Manager skill roadmap
(Beginner → Expert, with lessons, level challenges and ranks), instead of only a BA or PO path. Today 0 of the
roadmap's tracks are for PMs; target: a complete PM track ready for the Owner to roll out behind a flag, at the same
depth as the BA and PO tracks.

## Business need
"add PM role and path to become PM in this portal" (with a screenshot of onboarding step 1, which offers only Business
Analyst and Product Owner). In follow-up questions the Owner chose: PM means **Product Manager**; the same depth as the
BA and PO paths; behind a feature flag.

## Why
The site is for starter BAs, POs and PMs, and the Prompt Workbench already has PM prompts, but the learning roadmap,
onboarding and ranks only cover BA and PO.

## Constraints
- Static hosting and Firebase only; no new services or dependencies.
- Learning content is plain data in `src/data/`.
- Ships behind a default-off flag (`pmTrack`, audience `owner`); learners see BA and PO exactly as today until rollout.
- 375 px with no horizontal scroll; real buttons with labels.

## Success measure
With the flag on, a new learner can choose Product Manager in onboarding, see the PM roadmap with all four levels and a
challenge for each level, and get PM rank names. With the flag off, nothing changes for learners. All tested in e2e.

## Out of scope
- VI / KO / FR translations of the PM lessons.
- New PM glossary terms or a PM domain page.
- Changes to the Prompt Workbench "PM" role filter, XP or level unlocking.
- The landing page headline (changed at rollout).

## Requirements
REQ-036 — Product Manager role and learning path (#44)
