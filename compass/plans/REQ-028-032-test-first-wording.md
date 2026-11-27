# Plan: REQ-028, REQ-032 — clearer test-first proof rule (review of PR #47)

Requirements: REQ-028, REQ-032 · Test cases: TC-028 · Issue: #41 (follow-up)
Intent: compass/intent/2026-11-26-compass-framework.md · Design: none: process change, no UI
Requested by the Owner in chat on 2026-11-27 ("yes please do the small PR"), which covers the edit to the protected file
`compass/merge-pr.mjs`.

## Files
- `compass/merge-pr.mjs` — `testFirstProven()`: "fails at <sha>" / "failed at <sha>", refusing "not", "no longer",
  "never" and "n't" before "fail"; the blocked message and the comment show the exact format
- `compass/REVIEW.md` — says the line must name the commit, and what is refused
- `tests/compass/review.test.mjs` — TC-028 cases for the new wording rules and the message

## Steps
1. Move the check into `testFirstProven()` and add the negation rule.
2. Update the message, the comment and REVIEW.md.
3. Add the TC-028 cases; run `npm test`, check-spec and plan-file.

Review of PR #48 (CHANGES NEEDED): the negation rule looked at the whole line → now only directly in front of each
"fails at <sha>", so an honest line that also describes the result after the fix is accepted.

## Risks
- An unusual but honest wording could be refused. Mitigation: the message shows the exact format to use.

## Proof
- `npm test`: the new TC-028 cases. "no longer fails at …" and "never failed at …" were accepted before this change.
