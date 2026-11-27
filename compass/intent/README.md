# Intents (REQ-029)

An **intent** is a short note of *what* the Owner wants, *why*, and under which *constraints*, written before any
requirement. It keeps the reason behind a requirement next to the code instead of in a chat.

**Business need → business intent.** The Owner states a *business need* in their own words. The agent keeps it
verbatim under `## Business need` and revises it into a *business intent* under `## What we want`: one measurable
outcome (who, what changes, baseline → target, by when), not the solution. The Owner approves the intent, not the
wording of the need.

## Flow
1. A new request arrives in chat → the agent writes `compass/intent/YYYY-MM-DD-short-topic.md` from the template below
   (`Status: Draft`) and shows it to the Owner.
2. The Owner approves (or corrects) it in chat → the agent sets `Status: Approved (by <name>, <date>)`.
3. Only then are requirements (REQ-0xx) and their GitHub issues created (`/new-requirement`). Each requirement gets
   `"intent": "compass/intent/<file>.md"` in `compass/spec.json`, and the intent lists its requirements. Once the
   requirements are approved, the design follows (`compass/design/README.md`) and must be approved before any code.

`node compass/check-spec.mjs` fails when a requirement from **REQ-026** on has no intent, points to a missing intent or
to one that is not Approved, or when the intent has no `## Business need`. REQ-001…025 (the Prompt Workbench baseline)
are exempt.

Bugs skip this step: the bug issue is the intent.

## Template
```markdown
# Intent: <short title>

Status: Draft
Requested: <YYYY-MM-DD> by <who>, in <where>

## What we want
<the business intent: who, what changes, baseline → target, by when — not the solution>

## Business need
<the Owner's request, in their own words>

## Why
<the problem or opportunity, with any evidence (Insights, ratings, feedback inbox)>

## Constraints
<free hosting, Firebase only, privacy, flags, things that must not change>

## Success measure
<how we will know it worked>

## Out of scope
<what we are deliberately not doing>

## Requirements
<filled after approval: REQ-0xx — title (#issue)>
```
