// #58: the onboarding role cards are compact rows (icon left, text, radio right), as in Figma S03 (node 5-477).
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow, actAs } from './helpers.js';

const box = (loc) => loc.boundingBox();

async function checkRows(page, maxHeight) {
  const cards = page.getByRole('button', { name: /Business Analyst|Product Owner|Product Manager/ });
  const n = await cards.count();
  expect(n, 'role cards').toBeGreaterThanOrEqual(2);
  for (let i = 0; i < n; i++) {
    const card = cards.nth(i);
    const [c, icon, title, radio] = await Promise.all([box(card), box(card.locator('.badge-ic')), box(card.locator('.h3')), box(card.locator('.box'))]);
    const name = await card.locator('.h3').innerText();
    expect(icon.x + icon.width, `${name}: icon is left of the title`).toBeLessThanOrEqual(title.x);
    expect(radio.x, `${name}: radio is right of the title`).toBeGreaterThanOrEqual(title.x + title.width);
    expect(icon.y, `${name}: icon and title share a row`).toBeLessThan(title.y + title.height);
    if (maxHeight) expect(c.height, `${name}: card height`).toBeLessThanOrEqual(maxHeight);
  }
}

test('#58 onboarding role cards are compact rows (BA, PO and PM)', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'owner');
  await page.goto('#/onboarding/1');
  await expect(page.getByRole('button', { name: /Product Manager/ })).toBeVisible();
  await checkRows(page, 110);
  noErrors();
});

test('#58 role cards stay rows at 375 px with no sideways scroll @mobile', async ({ page }) => {
  await actAs(page, 'learner');
  await page.goto('#/onboarding/1');
  await expect(page.getByRole('button', { name: /Business Analyst/ })).toBeVisible();
  await checkRows(page);
  await expectNoHorizontalOverflow(page);
});
