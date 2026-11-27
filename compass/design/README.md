# compass/design/ — an approved design before any code (REQ-030)

The design shows **how** the approved requirements will look and behave, before anyone writes code. Draw it in the
project's design tool (Figma; set its link in `compass/spec.json → designTool`) and describe it here so agents and
reviewers can read it without opening the tool.

## Flow
1. Every requirement of the change is **Approved** → draft `compass/design/YYYY-MM-DD-short-topic.md` from the template
   (`Status: Draft`): one section per screen, each listing the REQ ids it delivers, its elements and its states
   (empty, loading, error, success, guest vs signed in, each role in "Act as").
2. Draw it (Figma, or annotated screenshots from `npm run dev:demo` for a small change) and link each frame. Show it to
   the Owner. Once `designTool` is set in spec.json, a UI design for **REQ-035 on** must link at least one frame of that
   Figma file (`…?node-id=…`), or check-spec fails when the requirement is In build.
3. The Owner approves → `Status: Approved (by <name>, <date>)`. **Only then may code start.**
   `node compass/check-spec.mjs` fails when a requirement is In build or Done while its design is not Approved, and when a
   requirement from **REQ-026** on (not Draft) has no `design` at all.
4. A change without UI says so on the requirement: `"design": "none: <reason>"`.
5. If the design must change during the build, set it back to Draft, update it and get it approved again.

BAPO Path specifics: design for 375 px first (no horizontal scroll), reuse `src/components/ui.jsx` and the classes in
`src/styles.css`, menus and buttons stay English (learning content gets VI / KO / FR), real buttons and links with
labels, and a new user-facing screen goes behind a default-off flag.

## Template
```markdown
# Design: <short title>

Status: Draft
Requirements: REQ-0xx, REQ-0yy
Design tool: <link to the Figma file or page>

## Approach
<layout, navigation, components and styles reused>

## Screens
### SCR-1 · <name> — REQ-0xx
- Purpose: <what the user does here>
- Elements: <key components and content>
- States: <empty · loading · error · success · guest · roles>
- Frame: <link>

## Notes
<accessibility, 375 px layout, translations, open questions>
```
