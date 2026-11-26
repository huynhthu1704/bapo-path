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

### User story
As a <role> I want <capability>, so that <outcome>.

### Acceptance criteria
- [ ] Given <context>, when <action>, then <result>.

### Out of scope

### Traceability
Test case: TC-0xx → `tests/e2e/<file>.spec.js` (test title starts with `TC-0xx`)
Requirements doc: `docs/requirements/<module>.md`
