# compass/

BAPO Path follows the **Compass Framework** (the same delivery framework as travel-map). Start with `AGENTS.md`.

| File | What it is |
| --- | --- |
| `spec.json` | **Source of truth:** features, requirements (REQ), test cases (TC), decisions (ADR) |
| `requirements.md`, `tests.md`, `decisions.md`, `handover.md` | Generated views: run `node compass/build-views.mjs`, never edit by hand |
| `intent/` | The Owner's business need → approved intent, before any requirement |
| `design/` | Approved design before any code |
| `plans/` | A plan file before any code change |
| `REVIEW.md` | Independent review of every PR |
| `agent-knowledge.md` | Working knowledge for agents (loaded by CLAUDE.md) |
| `guardrails.json` | Protected / forbidden paths, file limits, secret patterns |
| `check-spec.mjs` | Traceability, intent, design, ADR and handover check (CI) |
| `check-guardrails.mjs`, `guardrails-lib.mjs`, `hooks/guard-edit.mjs` | Guardrails in CI and in Claude Code |
| `plan-file.mjs`, `test-first.mjs`, `merge-pr.mjs` | Plan check, failing-test-first check, safe merge |
