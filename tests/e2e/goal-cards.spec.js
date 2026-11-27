// #63: the onboarding "Daily goal" cards are compact rows (icon left of the text), as in Figma S04 (node 5-544).
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow, actAs } from './helpers.js';

async function checkRows(page) {
  const cards = page.getByRole('button', { name: /^(Casual|Regular|Serious)\b/ });
  await expect(cards).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const card = cards.nth(i);
    const [icon, label, caption] = await Promise.all([card.locator('svg').first().boundingBox(), card.locator('.label').boundingBox(), card.locator('.caption').boundingBox()]);
    const name = await card.locator('.label').innerText();
    expect(icon.x + icon.width, `${name}: icon is left of the text`).toBeLessThanOrEqual(label.x);
    expect(icon.y + icon.height, `${name}: icon is beside the text, not above it`).toBeGreaterThan(label.y);
    expect(icon.y, `${name}: icon is beside the text, not above it`).toBeLessThan(caption.y + caption.height);
  }
}

test('#63 daily goal cards are compact rows', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'learner');
  await page.goto('#/onboarding/2');
  await checkRows(page);
  noErrors();
});

test('#63 daily goal cards stay rows at 375 px with no sideways scroll @mobile', async ({ page }) => {
  await actAs(page, 'learner');
  await page.goto('#/onboarding/2');
  await checkRows(page);
  await expectNoHorizontalOverflow(page);
});
