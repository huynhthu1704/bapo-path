// #77: in Admin › Taxonomy › Phases the name and description boxes line up on every row.
import { test, expect } from '@playwright/test';
import { actAs, expectNoHorizontalOverflow } from './helpers.js';

const open = async (page) => {
  await actAs(page, 'owner');
  await page.addInitScript(() => localStorage.setItem('bapo-path-v1', JSON.stringify({ onboarded: true })));
  await page.goto('#/admin/taxonomy');
  await expect(page.getByLabel('discover name')).toBeVisible();
};
const lefts = (page, suffix) => page.locator('section', { has: page.getByRole('heading', { name: 'Phases', exact: true }) })
  .locator(`.tax-row input[aria-label$=" ${suffix}"]`)
  .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().left)));

test('#77 phase name and description boxes start at the same position on every row', async ({ page }) => {
  await open(page);
  test.skip(page.viewportSize().width <= 900, 'desktop layout only');
  for (const suffix of ['name', 'description']) {
    const xs = await lefts(page, suffix);
    expect(xs.length, `${suffix} boxes`).toBeGreaterThan(5);
    expect(new Set(xs).size, `${suffix} box left edges: ${xs.join(', ')}`).toBe(1);
  }
});

test('#77 the Taxonomy page has no horizontal scroll at 375 px @mobile', async ({ page }) => {
  await open(page);
  await expectNoHorizontalOverflow(page);
});
