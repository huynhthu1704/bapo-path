---
name: Requirement (REQ)
about: A user story with testable acceptance criteria. One issue = one REQ = one TC.
title: "REQ-0xx: "
labels: requirement
---

**Module:**
**Feature:** F-xx
**Priority (MoSCoW):** Must / Should / Could / Won't
**Sprint:**
**Source:** [USER] / [STANDARD] / [ASSUMPTION (approved)]
**Feature flag:** `<flag>` (off by default)
**Intent:** `compass/intent/<file>.md` (approved by the Owner)
**Design:** `compass/design/<file>.md` or none: <reason>

### User story
As a <role> I want <capability>, so that <outcome>.

### Acceptance criteria
- [ ] Given <context>, when <action>, then <result>.

### Out of scope

### Traceability
Test case: TC-0xx → `tests/e2e/<file>.spec.js` (test title starts with `TC-0xx`)
Spec: `compass/spec.json` (REQ and TC entries; run `node compass/build-views.mjs`)
