// #71 (follow-up): after answering, the explanation card is a row: the lightbulb icon sits beside the explanation,
// not above it. Covers the quiz, the level challenge and Story Mode.
import { test, expect } from '@playwright/test';
import { actAs, failOnPageErrors, expectNoHorizontalOverflow } from './helpers.js';

const setup = async (page) => {
  await actAs(page, 'owner');
  await page.addInitScript(() => localStorage.setItem('bapo-path-v1', JSON.stringify({ onboarded: true })));
};

async function expectRow(page) {
  const card = page.locator('.card.row').filter({ has: page.locator('.badge-ic') }).last();
  await expect(card).toBeVisible();
  expect(await card.evaluate((el) => getComputedStyle(el).flexDirection), 'explanation card direction').toBe('row');
  const [icon, text] = await Promise.all([card.locator('.badge-ic').first().boundingBox(), card.locator('.col').first().boundingBox()]);
  expect(icon.x + icon.width, 'icon is left of the explanation').toBeLessThanOrEqual(text.x);
  expect(icon.y, 'icon is beside the explanation, not above it').toBeLessThan(text.y + text.height);
  await expectNoHorizontalOverflow(page);
}

test('#71 quiz: the answer explanation is a row @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await setup(page);
  await page.goto('#/quiz?mode=mcq&n=5');
  await page.locator('button.option').first().click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expectRow(page);
  noErrors();
});

test('#71 level challenge: the answer explanation is a row @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await setup(page);
  await page.goto('#/challenge/BA/1');
  await page.locator('button.option').first().click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expectRow(page);
  noErrors();
});

test('#71 Story Mode: the choice feedback is a row @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await setup(page);
  await page.goto('#/story');
  await page.locator('button.option').first().click();
  await expectRow(page);
  noErrors();
});
