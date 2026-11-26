# BAPO Path — instructions for AI agents

A free learning site for starter Business Analysts, Product Owners and PMs. React 18 + Vite, static hosting on
GitHub Pages, Firebase (Google sign-in + Firestore) as the only backend. The Owner is Christine (GitHub `huynhthu1704`),
a BA/PO, not a full-time developer: write PR descriptions and notes in plain English, no jargon.

How we work (solo and team flows, gates, roles): **docs/WORKFLOW.md**. Read it before starting a feature.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev:demo` | Run locally with **no Firebase** (demo mode). The Prompt admin has an "Act as" bar: Owner / Reviewer / Editor / learner |
| `npm run check:prompts` | Validate the bundled prompts (fields, placeholders, links, translations) |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright tests in `tests/e2e/`. They build in demo mode and need no network |
| `npm run verify` | All three of the above. **Run before every PR.** |
| `npm run test:rules:emulator` | Firestore rules tests (needs Java 21; downloads the emulator; CI always runs it) |

Run one requirement's tests with `npx playwright test -g TC-018`.

## Map

- `src/App.jsx`: routes. **Hash routing** (`#/path`): never use in-page `href="#section"` anchors, which are read as routes (bug #27). Scroll with JS instead.
- `src/store.jsx`: app state, progress, demo identities (`DEMO_PEOPLE`), the role in effect (`owner` / `reviewer` / `editor` / `null`).
- `src/firebase.js`: `LOCAL_MODE` (no config, or `VITE_LOCAL_MODE=1`) means everything stays in localStorage.
- `src/data/`: **all learning content is plain data**. Follow the existing row format (see README). Content edits don't need code changes.
- `src/data/prompts/`: the 90 prompts in files `a-…` to `i-…`, plus `meta.js` (phases, categories, collections). Checked by `scripts/check-prompts.mjs`.
- `src/data/promptApi.js`: the Prompt Workbench data layer, with a Firestore layer and a local layer behind one API. The Firestore layout is at the top of the file.
- `src/data/flags.js`: feature flags. **Every new user-facing feature ships behind a flag, off by default** (audience `owner`).
- `src/i18n.js`, `src/data/i18n/`: VI / KO / FR translations for learning content. Menus and buttons stay English.
- `firestore.rules`: the real access control. `tests/rules.test.mjs`: its tests.
- `docs/requirements/`: requirements and the REQ → TC → test traceability matrix.

## Rules

1. **Requirements first.** Work starts from a REQ issue (or a bug issue) with Given/When/Then criteria. If there is none, write it first with the issue template and ask the Owner to confirm.
2. **Tests prove the criteria.** Each acceptance criterion gets a Playwright test whose title starts with its `TC-0xx` id (bugs: `#<issue>`). Write it so it fails before the change. Update the matrix in `docs/requirements/`.
3. **Security lives in `firestore.rules`.** Hiding something in the UI is not access control. Any rule change needs a test in `tests/rules.test.mjs`. Never weaken a rule to make a feature work; ask instead.
4. **No secrets in the repo.** `src/firebase-config.js` is public by design (Firebase web config). Service-account keys and API keys go only in GitHub secrets.
5. **Keep changes small.** One REQ or one bug per PR when possible, and never more than one sprint per PR. Keep commits small and focused.
6. **Don't touch** `package-lock.json` by hand, the `gh-pages` branch, or `dist/`.
7. **Mobile matters.** Check 375 px with no horizontal scroll (the e2e `@mobile` tests do this).
8. **Accessible by default.** Use real buttons and links, `aria-label` on icon buttons, and `aria-live` for status changes. Tests select by role and label, so this also keeps the tests stable.
9. **Never skip, delete or loosen a test or a CI check to get green.** Fix the cause or report it.

## Definition of done (an agent's checklist before opening a PR)

- [ ] `npm run verify` passes locally; rules tests pass in CI if rules changed
- [ ] TC tests added or updated; traceability matrix updated
- [ ] Behind a flag if user-facing and new
- [ ] `/code-review` run on the diff (and `/security-review` if rules, auth or `promptApi.js` changed); findings fixed or explained
- [ ] PR uses `.github/pull_request_template.md`: what, REQs covered, departures, tested / **not tested**, after-merge steps for the Owner
- [ ] Draft PR unless the Owner asked for ready-for-review

## Style

- Plain JS + JSX (no TypeScript). Function components and hooks. Reuse `src/components/ui.jsx` (Icon, PageHead, Loading, Spinner…) and the CSS classes in `src/styles.css` before adding new ones.
- Async UI: wrap long work in `track()` from `src/busy.js` so the top loading bar shows.
- Copy: short, friendly, British-ish spelling as already used ("favourites").
