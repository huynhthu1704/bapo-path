# Plan: REQ-026…034 — adopt the Compass Framework (as in travel-map)

Requirements: REQ-026 to REQ-034 · Test cases: TC-026 to TC-034 · Issue: #41
Intent: compass/intent/2026-11-26-compass-framework.md · Design: none: process change, no UI

## Files
- `compass/spec.json` (new) — REQ-001…025 moved from `docs/requirements/prompt-workbench.md`, REQ-026…034, TC-001…034, ADR-001…007
- `compass/requirements.md`, `tests.md`, `decisions.md`, `handover.md` (generated) — views of the spec
- `compass/build-views.mjs`, `check-spec.mjs` — views and the traceability check, ported from travel-map; adds the
  "automated TC file carries its TC id" check (BAPO Path names Playwright tests after their TC)
- `compass/guardrails.json`, `guardrails-lib.mjs`, `check-guardrails.mjs`, `hooks/guard-edit.mjs` — guardrails; adds
  `secretAllowedPaths` for the public Firebase web config
- `compass/plan-file.mjs`, `test-first.mjs`, `merge-pr.mjs` — plan, failing-test-first and safe-merge checks, with
  BAPO Path's code paths, test folders and CI job names
- `compass/intent/`, `design/`, `plans/` READMEs, `REVIEW.md`, `agent-knowledge.md`, `README.md`
- `AGENTS.md` (new), `CLAUDE.md` (slimmed, lessons learned, imports agent-knowledge), `docs/WORKFLOW.md`
- `.claude/settings.json` (edit hook), `.claude/skills/` (new `deliver-change`; `new-requirement`, `ship`, `fix-bug` updated)
- `.github/workflows/compass.yml` (new), `claude-review.yml` (posts the REVIEW.md comment), PR and REQ issue templates
- `tests/compass/*.test.mjs` (new) — TC-026…034; `package.json` — `npm test`; `.gitignore`

## Steps
1. Port the travel-map scripts and change their thresholds: REQ-001…025 are the baseline; intent and design from REQ-026;
   Figma frames from REQ-035 against `designTool`.
2. Migrate the requirements table into `compass/spec.json`; generate the views; replace the old file with a pointer.
3. Write the Compass docs, AGENTS.md, CLAUDE.md, skills and templates for BAPO Path.
4. Add the `Compass checks` workflow (existing job names unchanged) and point the AI review at REVIEW.md.
5. Add the process tests; run `npm test`, `node compass/check-spec.mjs` and `npm run verify`.

## Risks
- This PR is larger than the 12-file guardrail it introduces: it bootstraps the framework, and main has no guardrails
  check yet, so CI only prints a notice. Later PRs are held to 12 files.
- The edit hook blocks agents from editing protected paths; the approval route is documented in AGENTS.md and the hook
  message.
- Branch protection does not yet require `Compass checks`: until the Owner adds it, the checks advise but do not block.
- Review of PR #40 (CHANGES NEEDED): `story`/`ac` were swapped on REQ-026…034 → fixed, and check-spec now rejects it;
  bug-fix commit 1 may hold the plan file with the failing test; the TC-id check reads test titles, not comments.
  The remaining check scripts are now protected and CI runs main's copies of the plan and test-first checks
  (protected files, approved by the Owner in chat on 2026-11-26).
- Second review (CHANGES NEEDED): one merge rule everywhere (the agent merges a PR that needs a person only after the
  Owner's OK in chat, recorded with `human-approved`; merge-pr enforces the label); bug fixes need a reviewer's
  `Test-first run:`; the test-first proof itself is now tested. Approved by the Owner in chat on 2026-11-27.
- Agents now merge their own PRs (ADR-006, the Owner's decision). Guard: `merge-pr.mjs` refuses without green CI and an
  APPROVE for the head commit, and PRs touching protected paths, rules, deletions or dependencies still wait for the Owner.
  `merge-pr.mjs` needs an authenticated `gh` CLI; without it the agent checks the same conditions and merges pinned to the head.

## Proof
- `npm test`: TC-026…034 in `tests/compass/` (views match the spec, check-spec passes, intent/design/ADR/test-id rules,
  guardrails and the hook, plan checks, test-first rules, merge blockers, CLAUDE.md and skills).
- `node compass/check-spec.mjs` passes; `npm run verify` still passes (no app code changed).
