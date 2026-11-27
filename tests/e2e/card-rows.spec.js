// #71: a card that is also a row lays out as a row (icon or button beside the text), as in the original Figma screens.
import { test, expect } from '@playwright/test';
import { actAs, expectNoHorizontalOverflow } from './helpers.js';

const setup = async (page) => {
  await actAs(page, 'owner');
  await page.addInitScript(() => localStorage.setItem('bapo-path-v1', JSON.stringify({ onboarded: true })));
};
const direction = (loc) => loc.evaluate((el) => getComputedStyle(el).flexDirection);

for (const [path, text] of [['/domains', 'Missing your industry?'], ['/frameworks', 'How BA, PO and PM work together']]) {
  test(`#71 ${path}: the "${text}" card is a row on desktop`, async ({ page }) => {
    await setup(page);
    await page.goto(`#${path}`);
    const card = page.locator('.card.row', { hasText: text }).first();
    await expect(card).toBeVisible();
    expect(await direction(card)).toBe('row');
  });
}

test('#71 cards that stack on small screens still stack at 375 px @mobile', async ({ page }) => {
  await setup(page);
  await page.goto('#/domains');
  const card = page.locator('.card.row', { hasText: 'Missing your industry?' }).first();
  await expect(card).toBeVisible();
  if (page.viewportSize().width <= 900) expect(await direction(card)).toBe('column');
  await expectNoHorizontalOverflow(page);
});
