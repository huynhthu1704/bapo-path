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
7. Open the site, **sign in with Google**, go to **Knowledge admin** (or `#/admin`), copy your user ID, then in **Firestore → Start collection** `admins` → Document ID = your user ID → Save (no fields needed). Reload.
8. On **Knowledge admin**, click **Publish to Firestore** once. From now on you can add or edit terms there without touching code.
9. Go to **My Job Search → Import CSV / JSON** and import your jobs (the Pipeline tab of the Job Search Tracker downloaded as CSV works too).

## Tech

React 18 + Vite, React Router (hash routing so it works on any static host), lucide icons, Firebase (Auth + Firestore).
