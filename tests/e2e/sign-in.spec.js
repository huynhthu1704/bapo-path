// REQ-035 (#42): Google is the only way to sign in; browsing stays open.
// Runs in demo mode with the `googleOnly` flag turned on through ?preview=googleOnly.
// Demo mode has no Google, so "Continue with Google" signs in as a demo learner.
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow } from './helpers.js';

const withFlag = (path) => `#${path}?preview=googleOnly`;

test('TC-035a sign-up page offers only Continue with Google @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await page.goto(withFlag('/signup'));
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  await expect(page.getByLabel('Full name')).toHaveCount(0);
  await expect(page.getByText('Email', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Create account' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  noErrors();
});

test('TC-035b a visitor can view pages without signing in @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await page.goto(withFlag('/'));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Learn the BA & PO job');
  for (const path of ['/home', '/roadmap', '/general', '/term/it-api']) {
    await page.goto(`#${path}`);
    await expect(page, `${path} stays open`).toHaveURL(new RegExp(`#${path}$`));
    await expect(page.getByRole('main')).toBeVisible();
  }
  await expectNoHorizontalOverflow(page);
  noErrors();
});

test('TC-035c saving asks a visitor to sign in and saves nothing', async ({ page }) => {
  await page.goto(withFlag('/term/it-api'));
  await page.getByRole('button', { name: 'Save term' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Sign in to save' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Not now' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Save term' }).first()).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('bapo-path-v1') || '{}').saved || []);
  expect(saved).not.toContain('it-api');
});

test('TC-035d after signing in from the prompt, I stay on the page and the save is kept', async ({ page }) => {
  await page.goto(withFlag('/term/it-api'));
  await page.getByRole('button', { name: 'Save term' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Sign in to save' });
  await dialog.getByRole('button', { name: 'Continue with Google' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/#\/term\/it-api(\?|$)/);
  await expect(page.getByRole('button', { name: 'Remove from saved' }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Remove from saved' }).first()).toBeVisible();
});
