// Core site smoke tests: the landing page, the guest path into the app, and mobile layout.
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow } from './helpers.js';

test('landing page loads without errors @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await page.goto('#/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Learn the BA & PO job');
  await expectNoHorizontalOverflow(page);
  noErrors();
});

// Bug #27: menu links used in-page anchors, which hash routing read as routes.
test('#27 landing menu links scroll to their section and keep the route', async ({ page }) => {
  await page.goto('#/');
  for (const name of ['Roadmap', 'Glossary', 'Domains', 'Practice']) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole('button', { name, exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { message: `${name} scrolls` }).toBeGreaterThan(100);
    expect(new URL(page.url()).hash).toBe('#/');
  }
});

test('a guest can onboard and reach Home @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await page.goto('#/home');
  await expect(page).toHaveURL(/#\/signup/);
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await expect(page).toHaveURL(/#\/onboarding\/1/);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/#\/onboarding\/2/);
  // Domains are required: clear the defaults and try to continue.
  const selected = page.locator('.grid.g4').first().locator('button.card.selected');
  while (await selected.count()) await selected.first().click();
  await page.getByRole('button', { name: 'Start learning' }).click();
  await expect(page.getByText('Choose at least one domain.')).toBeVisible();
  await page.getByRole('button', { name: 'Healthcare' }).click();
  await page.getByRole('button', { name: 'Start learning' }).click();
  await expect(page).toHaveURL(/#\/home/);
  await expectNoHorizontalOverflow(page);
  noErrors();
});
