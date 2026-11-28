// #79: when the Owner switches a feature off, pages that are already open hide it without a reload.
// Demo mode: the Owner saves the feature settings from a second tab of the same browser (shared demo database).
import { test, expect } from '@playwright/test';
import { failOnPageErrors, actAs } from './helpers.js';

test('#79 a feature switched off by the Owner disappears from tabs that are already open', async ({ page, context }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'learner');
  await page.addInitScript(() => {
    const cur = JSON.parse(localStorage.getItem('bapo-path-v1') || '{}');
    localStorage.setItem('bapo-path-v1', JSON.stringify({ ...cur, onboarded: true, name: 'Hoa' }));
  });
  await page.goto('#/library');
  const menu = page.locator('aside[aria-label="Main menu"]');
  await expect(menu.getByRole('link', { name: 'My Library', includeHidden: true })).toBeAttached();
  await expect(menu.getByRole('link', { name: 'My Job Search', includeHidden: true })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'My Library' })).toBeVisible();

  // The Owner switches both features off in another tab (what Admin › Features saves to settings/site).
  const owner = await context.newPage();
  await owner.goto(page.url().replace(/#.*$/, '#/home'));
  await owner.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('bapo-path-local-db') || '{}');
    db['settings/site'] = { flags: { library: { audience: 'owner', beta: [] }, jobs: { audience: 'owner', beta: [] } } };
    localStorage.setItem('bapo-path-local-db', JSON.stringify(db));
  });
  await owner.close();

  // The learner's tab, never reloaded, follows the change.
  await expect(menu.getByRole('link', { name: 'My Library', includeHidden: true })).toHaveCount(0);
  await expect(menu.getByRole('link', { name: 'My Job Search', includeHidden: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Coming soon' })).toBeVisible();
  noErrors();
});
