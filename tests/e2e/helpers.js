import { expect } from '@playwright/test';

/** Fails the test if the page throws an uncaught error. Call before page.goto. */
export function failOnPageErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return () => expect(errors, 'uncaught page errors').toEqual([]);
}

/** In demo mode, picks who the browser acts as: 'owner' | 'reviewer' | 'editor' | 'learner'. */
export async function actAs(page, who) {
  await page.addInitScript((uid) => {
    try { localStorage.setItem('bapo-path-demo-identity', uid); } catch (e) { /* ignore */ }
  }, `demo-${who}`);
}

/** Asserts the page does not scroll sideways (mobile layout). */
export async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
}
