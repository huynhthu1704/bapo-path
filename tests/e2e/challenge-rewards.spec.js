// Bug #87: the challenge Rewards card promised "Badge: Beginner Graduate" on every level, but only a level-1
// (Beginner) challenge earns it (BADGES 'graduate' in src/store.jsx). Demo mode: acting as the Owner turns on the
// `pmTrack` flag, so the PM level 2–4 challenges exist.
import { test, expect } from '@playwright/test';
import { failOnPageErrors, actAs } from './helpers.js';

const onboarded = (page, track) => page.addInitScript((t) => {
  const cur = JSON.parse(localStorage.getItem('bapo-path-v1') || '{}');
  localStorage.setItem('bapo-path-v1', JSON.stringify({ ...cur, onboarded: true, track: t }));
}, track);

const rewards = (page) => page.locator('.card').filter({ has: page.getByText('Rewards', { exact: true }) });

for (const level of [2, 4]) {
  test(`#87 a level-${level} challenge does not promise the Beginner Graduate badge`, async ({ page }) => {
    const noErrors = failOnPageErrors(page);
    await actAs(page, 'owner');
    await onboarded(page, 'PM');
    await page.goto(`#/challenge/PM/${level}`);
    await expect(rewards(page)).toContainText('+300 XP');
    await expect(rewards(page)).not.toContainText('Beginner Graduate');
    noErrors();
  });
}

test('#87 a level-1 challenge still promises the Beginner Graduate badge', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await onboarded(page, 'BA');
  await page.goto('#/challenge/BA/1');
  await expect(rewards(page)).toContainText('Badge: Beginner Graduate');
  noErrors();
});
