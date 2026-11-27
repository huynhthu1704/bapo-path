# BAPO Path — working knowledge for Claude

Reference for any Claude session working on BAPO Path. Last updated 2026-11-27. Loaded automatically through
`CLAUDE.md` (REQ-034). Keep it current: when a standing instruction, decision or open item changes, update this file in
the same PR. It is written by hand (not generated).

## 1. People and how to work with Christine
- Christine (GitHub `huynhthu1704`) is the **Owner**: a BA/PO, not a full-time developer. Write PR descriptions, issues
  and notes in plain English, no jargon; give "how to check it yourself" steps when useful.
- Everything written into the repo (code comments, commits, PRs, issues, spec) is in **English**.
- **Merging (standing instruction from the Owner, 2026-11-26, ADR-006):** once CI is green and the independent review
  says APPROVE for the head commit, **merge the PR yourself** with `node compass/merge-pr.mjs <n>`, then report to the
  Owner in plain English (what changed, which flag to roll out, anything to decide). PRs under *What a person still
  decides* in `compass/REVIEW.md` (protected paths, `firestore.rules`, deletions, dependencies, learner data, sign-in or
  roles) need the Owner's explicit OK in chat first; then quote it in a PR comment, add `human-approved` and merge. Never
  add that label without such an OK. CHANGES NEEDED twice in a row → stop and ask.
- **Bug fixes** need an in-session reviewer who runs the failing test at the first commit and writes `Test-first run: …`
  in the review (`merge-pr.mjs` checks it); the CI reviewer cannot run Playwright.
- Ask before anything hard to undo: deleting files, CI/deploy workflows, protected paths, branch protection, Firestore
  rules, new paid services or dependencies.

## 2. The product
- **BAPO Path**: a free learning site for starter BAs, POs and PMs: skill roadmap, glossaries, domains, practice and
  gamification, and the **Prompt Workbench** (90 prompts, admin with Editor → Reviewer publishing, behind flag `prompts`).
- Live: https://huynhthu1704.github.io/bapo-path/ (GitHub Pages, `gh-pages` branch built by `deploy.yml`).
- Stack: React 18 + Vite, Firebase (Google sign-in + Firestore) as the only backend. `LOCAL_MODE` (no config or
  `VITE_LOCAL_MODE=1`) keeps everything in localStorage; `npm run dev:demo` has an "Act as" bar (Owner / Reviewer /
  Editor / learner).
- Design file (Figma): `compass/spec.json → designTool`. Menus and buttons stay English; learning content has VI / KO / FR.

## 3. Map of the code
- `src/App.jsx`: routes. **Hash routing** (`#/path`): never use in-page `href="#section"` anchors (bug #27, ADR-004).
- `src/store.jsx`: app state, progress, demo identities (`DEMO_PEOPLE`), the role in effect.
- `src/firebase.js`: `LOCAL_MODE`. `src/firebase-config.js` is public by design (Firebase web config).
- `src/data/`: **all learning content is plain data** (README row formats). Content edits need no plan file.
- `src/data/prompts/`: the 90 prompts (`a-…` to `i-…`) and `meta.js`; checked by `scripts/check-prompts.mjs`.
- Admin area (REQ-038): `#/admin/...`, `src/pages/AdminShell.jsx` (side menu per role, shared helpers), `AdminPages.jsx`,
  `PromptAdmin.jsx` (prompt pages); old `#/pw-admin/...` links redirect (`MOVED` in `src/App.jsx`).
- `src/data/promptApi.js`: Prompt Workbench data layer (Firestore + local behind one API; layout at the top).
- `src/i18n.js`, `src/data/i18n/`: translations. `firestore.rules` + `tests/rules.test.mjs`: access control and its tests.
- Style: plain JS + JSX, function components and hooks; reuse `src/components/ui.jsx` and `src/styles.css`; wrap long
  async work in `track()` from `src/busy.js`; British-ish spelling ("favourites").

## 4. Delivery contract (AGENTS.md / Compass)
- Every change has a **REQ** (Given/When/Then) and at least one **TC** in `compass/spec.json`;
  `node compass/check-spec.mjs` must pass. The `.md` views are generated: run `node compass/build-views.mjs` after
  editing the spec; CI fails while `handover.md` is stale.
- From REQ-026 on: an **approved intent** (REQ-029), an **approved design** before code (REQ-030; Figma frame from
  REQ-035), a **plan file** for code changes (REQ-031). REQ-001…025 are the Prompt Workbench baseline, exempt.
- Branch `compass/REQ-0xx-short-name` (bugs: `compass/fix-<issue>-short-name`); **≤ 12 files per change**; never force
  push; squash merge.
- **Protected paths — never change without explicit approval:** `.github/workflows/`, `.github/CODEOWNERS`,
  `compass/guardrails.json`, the check scripts (`compass/check-guardrails.mjs`, `guardrails-lib.mjs`, `check-spec.mjs`,
  `build-views.mjs`, `plan-file.mjs`, `test-first.mjs`, `merge-pr.mjs`), `compass/hooks/`,
  `.claude/settings.json`, `.claude/settings.local.json`, `firebase.json`, `.env`. Never commit secrets or build output.
- **Guardrails are enforced (REQ-027):** the edit hook stops edits to protected/forbidden paths and secrets (approval
  route: the Owner approves in chat → add the path to `.claude/approved-paths.local.json`, git-ignored). The hook is a
  reminder, not a lock — nothing stops an agent writing that file, so never do it without the Owner's OK. The CI guardrails check
  runs main's copy of the rules and fails PRs over 12 files, with forbidden paths or secrets, or — without the
  `human-approved` label — with protected paths, deletions or dependency changes.
- Commit messages: English, start with the REQ id (`REQ-035: …`; bugs `#<issue>: …`).

## 5. Requirements, bugs and traceability (GitHub)
- **Intent first:** a new request becomes `compass/intent/YYYY-MM-DD-topic.md`; the Owner approves it in chat; then
  REQs and issues (`/new-requirement`, label `requirement`, module label, `sprint-N`).
- **Tests prove the criteria:** each acceptance criterion gets a test whose title starts with its `TC-0xx` id
  (`npx playwright test -g TC-018`); check-spec fails when an automated TC's file does not carry its id.
- **Bugs:** issue with the bug template; fix PR has label `bug`; **commit 1 holds only the failing test** (title `#<issue> …`) and the plan file,
  later commits must not edit it (REQ-032, `compass/test-first.mjs`).
- **Linking:** PR body has `Closes #N`; after merging, comment on the issue with the branch, PR and merge commit
  (`merge-pr.mjs` does this).

## 6. Feature flags
- **One flag per feature** (REQ-037, as on Bee There): `src/data/flags.js` lists every feature (name, icon, where it
  appears, since, audience). A new feature gets audience `owner`; features live before flags default to `everyone`.
- Check a feature with `useFeature('<key>')` / `useFeatures()` from `src/components/ui.jsx` in **every** place it shows
  (menu, Home, search, buttons) and map its routes in `ROUTE_FLAGS`; routes are wrapped in `FlagGate` ("Coming soon").
- The Owner rolls features out in **Admin › Features** (`#/admin/features`, Owner only): switch "Released to everyone", or keep it off and tick beta testers. Preview any flag with `?preview=<flag>`.
- Flags still at `owner`: `prompts`, `pmTrack` (Product Manager track, REQ-036; roll out after the Owner has read the lessons).

## 7. Tests and CI/CD
- `npm test`: process tests (`tests/compass/`, node:test). `npm run test:first`: the failing-test-first check on a bug branch.
- `npm run verify`: prompt check, build, Playwright e2e (`tests/e2e/`, demo mode, `@mobile` tests at 375 px).
- `npm run test:rules:emulator`: Firestore rules tests (Java 21; CI always runs them).
- CI: `ci.yml` (job *Content, build and end-to-end tests*), `rules-test.yml` (*rules*), `compass.yml` (*Compass checks*:
  spec, guardrails, plan, test-first, process tests), `claude-review.yml` (independent review on ready PRs),
  `deploy.yml` (site on merge), `deploy-rules.yml` (rules after the `production` approval).

## 8. Open items
- Done 2026-11-27: *Compass checks*, *Content, build and end-to-end tests* and *rules* are required checks on `main`;
  ADR-007 accepted.
- Optional small fixes from the PR #48 review: catch the curly apostrophe ("hasn’t failed at …") in
  `testFirstProven()`, and say in REVIEW.md that one word may sit between the negation and "fails at".
- Gaps from the baseline: REQ-004, REQ-021 and REQ-024 have no automated test; REQ-014 has no e2e test.
