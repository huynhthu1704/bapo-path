# Plan: REQ-027, REQ-028 — follow-up to the third review of PR #40

Requirements: REQ-027, REQ-028, REQ-032 · Test cases: TC-027, TC-028 · Issue: #41 (follow-up)
Intent: compass/intent/2026-11-26-compass-framework.md · Design: none: process change, no UI
Requested by the Owner in chat on 2026-11-27 ("please also do the follow-up PR for the nits"), which also approves the
edit to the protected file `compass/merge-pr.mjs`.

## Files
- `compass/merge-pr.mjs` — a bug fix's review must say the test "fails at <sha>" / "failed at <sha>", not just mention "fail"
- `tests/compass/review.test.mjs` — TC-028: "does not fail at …" and a line with no commit are refused
- `tests/compass/guardrails.test.mjs` — TC-027: every `compass/*.mjs` file must be in `protectedPaths`
- `compass/REVIEW.md` — the protected scripts are listed by name, and the new test enforces that
- `docs/WORKFLOW.md` — the agent adds `human-approved`, only after the Owner's OK in chat
- `.github/pull_request_template.md` — the bug-fix checkbox mentions the plan file and the `Test-first run:` line
- `compass/agent-knowledge.md` — open items: ADR-005 is already Accepted; the label exists

## Steps
1. Tighten the test-first proof match in merge-pr and add the TC-028 cases.
2. Add the TC-027 test that lists `compass/*.mjs` and checks each one is protected.
3. Fix the four wording nits.

## Risks
- A real reviewer line that says "fails at" without a commit id is now refused. Mitigation: the REVIEW.md format already
  asks for `fails at <sha>`.

## Proof
- `npm test`: TC-027 and TC-028 (33 tests). I removed `merge-pr.mjs` from `protectedPaths` by hand: the new TC-027 test failed.
