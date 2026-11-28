# Design: Saved terms need sign-in

Status: Approved (by Christine, 2026-11-28)
Requirements: REQ-040
Design tool: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca (page "03 · Screens", frame S18b next to S18 · Saved Terms)

## Approach
No new components. The Saved page reuses the page header and the sign-in card style of My Library and My Job Search
(`Lock` icon box, heading, one sentence, Google button). The card shows only while the existing **Google-only sign-in**
flag (`googleOnly`) is on and the visitor is not signed in. The bookmark buttons already open the "Sign in to save"
pop-up in that case (REQ-035), so they do not change.

## Screens
### SCR-1 · Saved — not signed in — REQ-040 (TC-040a, TC-040b)
- Purpose: tell a signed-out visitor that saved terms need an account, and let them sign in from here.
- Elements: title "Saved terms"; subtitle "Sign in to keep your saved terms in your account, on every device."; a card
  with the `Lock` icon, heading "Sign in to see your saved terms", the sentence "Saved terms belong to your Google
  account, so they are kept on every device. Sign in with Google to see and add them." and a **Continue with Google**
  button. No term list, no filter chips, no "Practise saved terms" button.
- States: not signed in + flag on → this card · after signing in → the visitor stays on Saved and sees their list (or
  the "No saved terms yet" empty state) · flag off or signed in → the page as today (S18).
- Frame: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca?node-id=110-3468 (S18b · Saved Terms — not signed in)

### SCR-2 · Saved — signed in, or flag off — REQ-040 (TC-040c)
- Unchanged: https://www.figma.com/design/JswcODuAH6xx2QPipDHAca?node-id=5-2449 (S18 · Saved Terms)

## Notes
- 375 px: the card stacks in one column and wraps the text; no horizontal scroll.
- The button is a real `<button>` from `GoogleButton`; in demo mode it signs in as the demo learner.
- Rollout: the Owner switches **Google-only sign-in** to "Released to everyone" in Admin › Features. That also makes
  every other save (XP, quizzes, flashcards) need sign-in, as the Owner chose on 2026-11-28.
