// #77 (review): a phase renamed to a longer name still shows its whole label in Admin › Taxonomy.
import { test, expect } from '@playwright/test';
import { actAs } from './helpers.js';

test('#77 a renamed, longer phase label is not cut off', async ({ page }) => {
  await actAs(page, 'owner');
  await page.addInitScript(() => localStorage.setItem('bapo-path-v1', JSON.stringify({ onboarded: true })));
  await page.goto('#/admin/taxonomy');
  await page.getByLabel('every name').fill('Meetings and communication');
  await page.getByRole('button', { name: 'Save changes' }).click();
  const chip = page.locator('.tax-row .phase-chip', { hasText: 'Meetings and communication' });
  await expect(chip).toBeVisible();
  const { scroll, client } = await chip.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
  expect(scroll, 'label text width vs label width').toBeLessThanOrEqual(client);
});
