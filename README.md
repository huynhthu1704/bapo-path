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

## How progress is saved

This review version has no server: each learner’s progress is saved in their own browser (localStorage).
Sign-in and syncing across devices are planned for v2. In **Progress & Profile** you can load demo progress or reset everything.

## Tech

React 18 + Vite, React Router (hash routing so it works on any static host), lucide icons. No backend.
