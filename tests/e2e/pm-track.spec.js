// REQ-036 (#44): Product Manager role and learning path, behind the `pmTrack` flag.
// Demo mode: acting as the Owner turns the flag on (audience `owner`); acting as a learner leaves it off.
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow, actAs } from './helpers.js';

const saved = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('bapo-path-v1') || '{}'));
const setProgress = (page, patch) => page.addInitScript((p) => {
  const cur = JSON.parse(localStorage.getItem('bapo-path-v1') || '{}');
  localStorage.setItem('bapo-path-v1', JSON.stringify({ ...cur, onboarded: true, ...p }));
}, patch);

test('TC-036a onboarding offers Product Manager and saves PM as my track @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'owner');
  await page.goto('#/onboarding/1');
  for (const role of ['Business Analyst', 'Product Owner', 'Product Manager']) {
    await expect(page.getByRole('button', { name: new RegExp(role) })).toBeVisible();
  }
  await page.getByRole('button', { name: /Product Manager/ }).click();
  await page.getByRole('button', { name: /Intermediate/ }).click();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/#\/onboarding\/2/);
  const s = await saved(page);
  expect(s.track).toBe('PM');
  expect(s.startLevel).toBe(2);
  noErrors();
});

test('TC-036b the roadmap shows the PM track with four levels, lessons and challenges @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'owner');
  await setProgress(page, { track: 'PM', startLevel: 1 });
  await page.goto('#/roadmap?view=list');
  await expect(page.getByRole('button', { name: 'Product Manager', exact: true })).toHaveClass(/on/);
  for (const level of ['Beginner', 'Intermediate', 'Advanced', 'Expert']) {
    await expect(page.getByRole('button', { name: new RegExp(`^${level}`) })).toBeVisible();
  }
  // Beginner is unlocked and has a full lesson; the level ends with a challenge.
  await expect(page.getByRole('link', { name: /Role of a Product Manager/ })).toContainText('Available');
  await expect(page.getByText(/Beginner Challenge/)).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('link', { name: /Role of a Product Manager/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Role of a Product Manager');
  // Every level has challenge scenarios (no "coming soon").
  for (const level of [1, 2, 3, 4]) {
    await page.goto(`#/challenge/PM/${level}`);
    await expect(page.getByText('Scenarios for this level are coming soon.')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Check answer' })).toBeVisible();
  }
  noErrors();
});

test('TC-036c my rank uses PM rank names', async ({ page }) => {
  await actAs(page, 'owner');
  await setProgress(page, { track: 'PM', xp: 1200 });
  await page.goto('#/profile');
  await expect(page.getByRole('main').getByText('Associate PM', { exact: true }).first()).toBeVisible();
});

test('TC-036d without the flag, learners see only BA and PO', async ({ page }) => {
  await actAs(page, 'learner');
  await setProgress(page, {});
  await page.goto('#/onboarding/1');
  await expect(page.getByRole('button', { name: /Business Analyst/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Product Owner/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Product Manager/ })).toHaveCount(0);
  await page.goto('#/roadmap?view=list');
  await expect(page.getByRole('button', { name: 'Product Owner', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Product Manager', exact: true })).toHaveCount(0);
});
