// #84: sign-out on the live site (Google sign-in). Demo mode never takes these code paths, so these tests run the
// site with a fake Google sign-in (tests/e2e/fake/): the test decides when cloud progress arrives and whether
// saving or signing out fails.
import { test, expect } from '@playwright/test';
import { failOnPageErrors } from './helpers.js';
import { startFakeSite } from './fake/server.mjs';

let site; // one dev server per worker
test.beforeAll(async () => { site = await startFakeSite(); });
test.afterAll(async () => { await site?.close(); });

const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('bapo-path-v1') || '{}'));
const CLOUD = { progress: { onboarded: true, name: 'Cloud Person', xp: 500, saved: ['team-scrum'], learned: ['team-scrum'] } };

// This device has been used before (onboarded, no progress of its own), so the page stays open while the cloud loads.
async function openProfile(page, fake = {}) {
  await page.goto(`${site.url}#/profile?preview=googleOnly`);
  await page.evaluate(() => localStorage.setItem('bapo-path-v1', JSON.stringify({ onboarded: true })));
  await page.reload();
  await page.waitForFunction(() => window.__fake && window.__fake.listeners.size > 0);
  await page.evaluate(([cloud, opts]) => { Object.assign(window.__fake, { cloud }, opts); window.__fake.signIn(); }, [CLOUD, fake]);
}

test('#84 signing out while cloud progress is still loading does not bring the data back', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await openProfile(page, { holdLoad: true });
  await expect(page.getByText('Loading your cloud progress…')).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByText('Not signed in')).toBeVisible();

  await page.evaluate(() => window.__fake.releaseLoad()); // the old sign-in finishes after the sign-out
  await page.waitForTimeout(2500); // longer than the 1.5 s save delay
  await expect(page.getByText('Not signed in')).toBeVisible();
  const s = await stored(page);
  expect(s.saved || []).toEqual([]);
  expect(s.xp || 0).toBe(0);
  expect(s.name || '').toBe('');
  expect(await page.evaluate(() => window.__fake.saves)).toEqual([]);
  noErrors();
});

test('#84 a failed sign-out shows a message and keeps the person signed in', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await openProfile(page, { failLogOut: true });
  await expect(page.getByText('Signed in with Google · cloud@fake.local')).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('alert')).toContainText('Could not sign out');
  await expect(page.getByText('Signed in with Google · cloud@fake.local')).toBeVisible();
  expect((await stored(page)).xp).toBe(500);
  noErrors();
});

test('#84 the last save before signing out shows the loading bar', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await openProfile(page);
  await expect(page.getByText('Progress, job search and search history are synced')).toBeVisible();
  await page.evaluate(() => { window.__fake.holdSave = true; });
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.locator('input.input').first().fill('Renamed Person');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Sign out' }).click(); // before the 1.5 s automatic save
  await expect(page.locator('.top-loader.on')).toHaveCount(1);
  expect(await page.evaluate(() => window.__fake.saves.at(-1))).toMatchObject({ name: 'Renamed Person' });
  await page.evaluate(() => window.__fake.releaseSave());
  await expect(page.getByText('Not signed in')).toBeVisible();
  await expect(page.locator('.top-loader.on')).toHaveCount(0);
  noErrors();
});

test('#84 when the last save before signing out fails, the person is told', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await openProfile(page);
  await expect(page.getByText('Progress, job search and search history are synced')).toBeVisible();
  await page.evaluate(() => { window.__fake.failSave = true; });
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.locator('input.input').first().fill('Renamed Person');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByText('Not signed in')).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'could not be saved' })).toBeVisible();
  noErrors();
});
