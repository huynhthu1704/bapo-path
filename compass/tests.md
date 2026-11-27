# Tests

_Generated from `spec.json`. Process tests: `npm test` (`tests/compass/`). UI tests: `npm run test:e2e` (`tests/e2e/`, Playwright, demo mode; run one with `npx playwright test -g TC-0xx`). Rules: `tests/rules.test.mjs` (CI)._

| ID | Title | Requirements | Type | Status | File |
|---|---|---|---|---|---|
| TC-001 | Browse prompts by phase or category | REQ-001 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-002 | Keyword search | REQ-002 | automated | Passing (partial: title-first order tested; no 300 ms timing check) | tests/e2e/prompt-library.spec.js |
| TC-003 | Filter by role, phase and category | REQ-003 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-004 | Show newly published prompts | REQ-004 | manual | Manual (no automated test yet) | — |
| TC-005 | Prompt detail page | REQ-005 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-006 | One-click copy | REQ-006 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-007 | Fill-in placeholders with live preview | REQ-007 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-008 | Remember filled placeholder values | REQ-008 | automated | Passing (partial: clear not tested) | tests/e2e/prompt-library.spec.js |
| TC-009 | 6-phase workflow view | REQ-009 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-010 | Next prompt suggestion | REQ-010 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-011 | Workflow collections | REQ-011 | automated | Passing (partial: step-through not tested) | tests/e2e/prompt-library.spec.js |
| TC-012 | Favorite prompts | REQ-012 | automated | Passing (partial: cross-device needs live Firebase) | tests/e2e/prompt-library.spec.js |
| TC-013 | Recently used prompts | REQ-013 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-014 | Rate a prompt and send private feedback (Firestore rules) | REQ-014 | automated | Passing (partial: rules only, no e2e) | tests/rules.test.mjs |
| TC-015 | Create and edit prompts | REQ-015 | automated | Passing | tests/e2e/prompt-admin.spec.js |
| TC-016 | Preview before publishing | REQ-016 | automated | Passing | tests/e2e/prompt-admin.spec.js |
| TC-017 | Submit a draft for review | REQ-017 | automated | Passing | tests/e2e/prompt-admin.spec.js |
| TC-018 | Review checklist and publish | REQ-018 | automated | Passing | tests/e2e/prompt-admin.spec.js + tests/rules.test.mjs |
| TC-019 | Unpublish or archive | REQ-019 | automated | Passing (partial: archive not tested) | tests/e2e/prompt-admin.spec.js |
| TC-020 | Version history and rollback | REQ-020 | automated | Passing | tests/e2e/prompt-admin.spec.js |
| TC-021 | Manage categories, phases and collections | REQ-021 | manual | Manual (no automated test yet) | — |
| TC-022 | Assign Editor and Reviewer roles | REQ-022 | automated | Passing | tests/e2e/prompt-admin.spec.js + tests/rules.test.mjs |
| TC-023 | Admin audit log | REQ-023 | automated | Passing | tests/e2e/prompt-admin.spec.js + tests/rules.test.mjs |
| TC-024 | Prompt insights | REQ-024 | manual | Manual (no automated test yet) | — |
| TC-025 | Prompt metadata in VI, KO and FR | REQ-025 | automated | Passing | tests/e2e/prompt-library.spec.js |
| TC-026 | One source of truth for requirements, tests and handover | REQ-026 | automated | Passing | tests/compass/spec.test.mjs |
| TC-027 | Enforce the guardrails automatically | REQ-027 | automated | Passing | tests/compass/guardrails.test.mjs |
| TC-028 | Independent review of every pull request | REQ-028 | automated | Passing | tests/compass/review.test.mjs |
| TC-029 | Capture the business need as an intent before requirements | REQ-029 | automated | Passing | tests/compass/spec.test.mjs |
| TC-030 | Approved design before any code | REQ-030 | automated | Passing | tests/compass/spec.test.mjs |
| TC-031 | A written plan before code | REQ-031 | automated | Passing | tests/compass/plan.test.mjs |
| TC-032 | Failing test committed before every bug fix | REQ-032 | automated | Passing | tests/compass/testFirst.test.mjs |
| TC-033 | Record decisions as ADRs | REQ-033 | automated | Passing | tests/compass/spec.test.mjs |
| TC-034 | Shared memory for agents: lessons learned and working knowledge | REQ-034 | automated | Passing | tests/compass/memory.test.mjs |
| TC-036 | Product Manager role and learning path | REQ-036 | manual | Manual | — |
