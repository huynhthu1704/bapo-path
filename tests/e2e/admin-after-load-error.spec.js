// #93: the Owner lost the Admin menu when the site could not load their progress at sign-in, and nothing tried
// again. Demo mode never runs the Google sign-in code, so these tests use the fake sign-in (tests/e2e/fake/), which
// lets the test make the database reads fail.
import { test, expect } from '@playwright/test';
import { failOnPageErrors } from './helpers.js';
import { startFakeSite } from './fake/server.mjs';

let site; // one dev server per worker
test.beforeAll(async () => { site = await startFakeSite(); });
test.afterAll(async () => { await site?.close(); });

const CLOUD = { progress: { onboarded: true, name: 'Cloud Person', xp: 500 } };

async function signInAsOwner(page, fake) {
  await page.goto(`${site.url}#/profile?preview=googleOnly`);
  await page.evaluate(() => localStorage.setItem('bapo-path-v1', JSON.stringify({ onboarded: true })));
  await page.reload();
  await page.waitForFunction(() => window.__fake && window.__fake.listeners.size > 0);
  await page.evaluate(([cloud, opts]) => { Object.assign(window.__fake, { cloud, admin: true }, opts); window.__fake.signIn(); }, [CLOUD, fake]);
}
const adminLink = (page) => page.getByRole('link', { name: 'Admin', exact: true });

test('#93 the Owner keeps the Admin menu when their progress cannot be loaded', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await signInAsOwner(page, { failLoad: 99 });
  await expect(page.getByText('Could not reach the server')).toBeVisible({ timeout: 20000 });
  await expect(adminLink(page)).toBeVisible();
  noErrors();
});

test('#93 the site tries again and syncs once the server answers', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await signInAsOwner(page, { failLoad: 1, failAdmin: 1 });
  await expect(page.getByText('Progress, job search and search history are synced')).toBeVisible({ timeout: 15000 });
  await expect(adminLink(page)).toBeVisible();
  expect(await page.evaluate(() => window.__fake.loadCalls)).toBe(2);
  expect((await page.evaluate(() => JSON.parse(localStorage.getItem('bapo-path-v1')))).xp).toBe(500);
  noErrors();
});
