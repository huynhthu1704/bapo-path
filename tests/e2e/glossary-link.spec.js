// REQ-040: the Glossary item in the side menu and the phone bottom bar opens Learn IT Vocab in a new tab.
import { test, expect } from '@playwright/test';
import { failOnPageErrors, actAs, expectNoHorizontalOverflow } from './helpers.js';

const VOCAB = 'https://huynhthu1704.github.io/learn-it-vocab/#home';
const NAME = 'Glossary (opens Learn IT Vocab in a new tab)';

const onboarded = (page) => page.addInitScript(() => {
  const cur = JSON.parse(localStorage.getItem('bapo-path-v1') || '{}');
  localStorage.setItem('bapo-path-v1', JSON.stringify({ ...cur, onboarded: true, name: 'Christine' }));
});

/** Checks one Glossary link and that clicking it opens Learn IT Vocab in a new tab while BAPO Path stays. */
async function opensVocab(page, link) {
  await expect(link).toHaveAttribute('href', VOCAB);
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noreferrer/);
  // Do not load the real site in tests: answer the request with an empty page.
  await page.context().route('https://huynhthu1704.github.io/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Learn IT Vocab</title>' }));
  const [tab] = await Promise.all([page.context().waitForEvent('page'), link.click()]);
  await tab.waitForLoadState();
  expect(tab.url()).toBe(VOCAB);
  await tab.close();
  await expect(page).toHaveURL(/#\/home/); // BAPO Path stays open on the same page
}

test('TC-040 the Glossary menu item opens Learn IT Vocab in a new tab @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'learner');
  await onboarded(page);
  await page.goto('#/home');
  const menu = page.locator('aside[aria-label="Main menu"]');
  if (page.viewportSize().width <= 900) {
    // Phone: the bottom bar tab, then the same item in the slide-in menu.
    await opensVocab(page, page.locator('.mobile-nav').getByRole('link', { name: NAME }));
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  const item = menu.getByRole('link', { name: NAME });
  await expect(item).toHaveText('Glossary'); // same label as before
  await opensVocab(page, item);
  await expectNoHorizontalOverflow(page);
  // Old links to the in-site Glossary page keep working.
  await page.goto('#/general');
  await expect(page.getByRole('heading', { name: 'Glossary', level: 1 })).toBeVisible();
  noErrors();
});
