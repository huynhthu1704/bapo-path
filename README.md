# BAPO Path

A free learning platform for starter **Business Analysts (BA)** and **Product Owners (PO)**.

- **Skill Roadmap** — BA and PO tracks, Beginner → Expert, with a list view and a skill-tree map
- **General Knowledge** — IT industry glossary, team collaboration, corporate language
- **Domain Knowledge** — 8 business domains with overviews, key processes and glossaries
- **Practice** — flashcards with spaced repetition, multiple choice and mixed tests
- **Gamification** — XP and career ranks, daily quests, streaks with freezes, badges, term collection, level-up challenges, Story Mode, Speed Round and a study circle

Design file: [Figma — BAPO Path](https://www.figma.com/design/JswcODuAH6xx2QPipDHAca)

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the link it prints (usually http://localhost:5173).

## Publish

Every push to `main` builds the site and publishes it to the `gh-pages` branch (see `.github/workflows/deploy.yml`).
The live site is at **https://huynhthu1704.github.io/bapo-path/** once GitHub Pages is set to *Deploy from a branch → gh-pages*.

## Edit the learning content

All content is plain data — no coding needed beyond following the existing pattern:

| What | File |
| --- | --- |
| Glossary terms (IT, team, corporate, domains) | `src/data/terms.js` |
| Skills for BA and PO | `src/data/skills.js` |
| Domain overviews and processes | `src/data/domains.js` |
| Level-up challenge scenarios | `src/data/challenges.js` |
| Story Mode chapters | `src/data/story.js` |

Each glossary line looks like this:

```js
['it', 'Testing', 1, 'UAT', 'User Acceptance Testing', 'Plain-English definition.', 'Example sentence at work.', 'Vietnamese hint'],
// category, sub-category, level (1-3), term, full name, definition, example, Vietnamese hint
```

## Backend: Firebase (Google sign-in + knowledge base)

The backend is [Firebase](https://firebase.google.com) (free Spark plan): **Firebase Auth** for Google sign-in and **Cloud Firestore** as the database.
Until it is configured, the site runs in *local mode* — everything works, progress stays in the browser, and Google sign-in shows a “not switched on yet” note.

### What is stored where

| Firestore path | What | Who can read / write |
| --- | --- | --- |
| `kb_terms`, `kb_skills`, `kb_domains`, `kb_challenges`, `kb_story`, `kb_meta` | Public knowledge base (glossary, roadmap, domains, challenges, story) | Everyone reads · admins write |
| `admins/{uid}` | Who may edit the knowledge base | Created by hand in the console |
| `users/{uid}` | Learner profile + progress (XP, streak, flashcards…) | Only that user |
| `users/{uid}/jobs` | Private job search tracker | Only that user |
| `users/{uid}/searches` | Private search history (My Library) | Only that user |

The rules are in `firestore.rules`. The app loads the knowledge base from Firestore at startup and falls back to the bundled content in `src/data/` if nothing is published yet.

### One-time setup (about 15 minutes)

1. Go to https://console.firebase.google.com → **Add project** (e.g. `bapo-path`). Google Analytics is optional.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**, choose a support email, **Save**.
3. **Authentication → Settings → Authorized domains → Add domain**: `huynhthu1704.github.io`.
4. **Build → Firestore Database → Create database** → choose a location (e.g. `asia-southeast1`) → **Production mode**.
5. **Firestore → Rules**: replace everything with the contents of `firestore.rules` → **Publish**.
6. **Project settings (gear) → Your apps → Web (`</>`)** → register an app → copy the `firebaseConfig` values into `src/firebase-config.js`, commit and push.
7. Open the site, **sign in with Google**, open `#/admin` (the page shows your user ID while you have no role yet), copy it, then in **Firestore → Start collection** `admins` → Document ID = your user ID → Save (no fields needed). Reload.
8. In **Admin › Knowledge base**, click **Publish to Firestore** once. From now on you can add or edit terms there without touching code.
9. Go to **My Job Search → Import CSV / JSON** and import your jobs (the Pipeline tab of the Job Search Tracker downloaded as CSV works too).

## Prompt Workbench (BA/PO/PM prompt library)

Learners browse, fill in and copy prompts at `#/prompts`; staff manage them in **Admin** (`#/admin`).
Every feature has its own flag (`src/data/flags.js`); the Prompt Workbench is `prompts`. The Owner changes who sees each
feature in **Admin › Features** (Owner and staff only / beta testers / everyone).

**Roles**
- **Owner**: has an `admins/{uid}` document (created by hand in the console). Everything, including taxonomy, staff, insights and features.
- **Reviewer**: `staff/{uid}.role = 'reviewer'`. Edits, publishes, returns, unpublishes, archives, and reads feedback. Can't publish their own submission.
- **Editor**: `staff/{uid}.role = 'editor'`. Creates and edits drafts, then submits them for review.

The Owner assigns roles on the **Staff** page. People appear there after they sign in once.

**Workflow:** Draft → In review → Published (or returned to Draft with a comment). Each save is a new version
(`prompts/{id}/versions/{n}`). Restoring an old version creates a new draft. Learners read one document,
`prompt_bundles/published`, which is rebuilt on every publish or take-down. Until the Owner clicks **Import the launch prompts**,
the library shows the prompts bundled in `src/data/prompts/`.

The full Firestore layout and access rules are at the top of `src/data/promptApi.js` and in `firestore.rules`.

**Demo mode:** `VITE_LOCAL_MODE=1 npm run dev` runs without Firebase. Data stays in the browser, and a bar at the top of the admin area lets you act as the Owner, a Reviewer, an Editor or a learner.

**Checks**
- `npm run verify` runs the prompt check, the production build and the end-to-end tests. Run it before every PR. CI (`ci.yml`) runs it on every pull request.
- `npm run test:e2e` runs the Playwright tests in `tests/e2e/` against a demo-mode build, with no Firebase needed. Test titles start with their requirement's TC id, e.g. `npx playwright test -g TC-018`.
- `npm run test:rules:emulator` tests `firestore.rules` against the Firestore emulator (needs Java 21). CI runs it on every pull request (`rules-test.yml`), and `deploy-rules.yml` re-runs it before publishing the rules.

## How we work

The project follows an AI-native workflow: requirements as issues with Given/When/Then criteria, tests named after them,
AI agents doing the build, an independent AI review and the merge, and the Owner deciding scope, risky changes and releases.

- **[docs/WORKFLOW.md](docs/WORKFLOW.md)**: the working flow for one engineer and for a team, the gates, and the one-time GitHub setup
- **[CLAUDE.md](CLAUDE.md)**: instructions every AI agent session follows
- **[AGENTS.md](AGENTS.md)** and **[compass/](compass/)**: the Compass delivery framework — requirements, tests and decisions in `compass/spec.json`, status in [compass/handover.md](compass/handover.md)

## Tech

React 18 + Vite, React Router (hash routing so it works on any static host), lucide icons, Firebase (Auth + Firestore).
