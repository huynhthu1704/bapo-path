// #81: signing out removes the person's learning data (saved terms, XP, progress, name) from this device.
// Demo mode with Google-only sign-in on (as on the live site): "Continue with Google" signs in as a demo learner.
import { test, expect } from '@playwright/test';
import { failOnPageErrors } from './helpers.js';

const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('bapo-path-v1') || '{}'));

test('#81 signing out clears saved terms and progress from the device', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await page.goto('#/term/team-scrum?preview=googleOnly');
  await page.getByRole('button', { name: 'Save term' }).first().click();
  await page.getByRole('dialog', { name: 'Sign in to save' }).getByRole('button', { name: 'Continue with Google' }).click();
  await expect(page.getByRole('button', { name: 'Remove from saved' }).first()).toBeVisible();
  expect((await stored(page)).saved).toContain('team-scrum');

  await page.goto('#/profile');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByText('Not signed in')).toBeVisible();

  await page.goto('#/saved');
  await expect(page.getByText('Sign in to see your saved terms')).toBeVisible(); // REQ-041: signed out → sign-in card
  await expect(page.getByRole('banner')).toContainText('0 XP');
  let s = await stored(page);
  expect(s.saved).toEqual([]);
  expect(s.xp).toBe(0);
  expect(s.name || '').toBe('');
  await page.reload();
  await expect(page.getByText('Sign in to see your saved terms')).toBeVisible(); // REQ-041: signed out → sign-in card
  s = await stored(page);
  expect(s.saved).toEqual([]);
  noErrors();
});
