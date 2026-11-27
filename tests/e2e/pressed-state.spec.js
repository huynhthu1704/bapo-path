// #65: onboarding level and domain cards tell screen readers whether they are selected (aria-pressed).
import { test, expect } from '@playwright/test';
import { actAs } from './helpers.js';

test('#65 level cards expose which level is selected', async ({ page }) => {
  await actAs(page, 'learner');
  await page.goto('#/onboarding/1');
  const beginner = page.getByRole('button', { name: /^Beginner/ });
  const advanced = page.getByRole('button', { name: /^Advanced/ });
  await expect(beginner).toHaveAttribute('aria-pressed', 'true');
  await expect(advanced).toHaveAttribute('aria-pressed', 'false');
  await advanced.click();
  await expect(advanced).toHaveAttribute('aria-pressed', 'true');
  await expect(beginner).toHaveAttribute('aria-pressed', 'false');
});

test('#65 domain cards expose which domains are selected', async ({ page }) => {
  await actAs(page, 'learner');
  await page.goto('#/onboarding/2');
  const banking = page.getByRole('button', { name: /Banking/ });
  const telecom = page.getByRole('button', { name: /Telecom/ });
  await expect(banking).toHaveAttribute('aria-pressed', 'true');
  await expect(telecom).toHaveAttribute('aria-pressed', 'false');
  await telecom.click();
  await expect(telecom).toHaveAttribute('aria-pressed', 'true');
  await banking.click();
  await expect(banking).toHaveAttribute('aria-pressed', 'false');
});
