// REQ-037 (#57): every feature has its own flag, and a feature that is off is hidden everywhere it appears.
// Demo mode: feature settings live in the browser's demo database (settings/site), like on the live site.
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow, actAs } from './helpers.js';

const onboarded = (page) => page.addInitScript(() => {
  const cur = JSON.parse(localStorage.getItem('bapo-path-v1') || '{}');
  localStorage.setItem('bapo-path-v1', JSON.stringify({ ...cur, onboarded: true, name: 'Hoa' }));
});
// Saves feature settings as the Owner would (Insights → Features), before the page loads.
const setFlags = (page, flags) => page.addInitScript((f) => {
  const db = JSON.parse(localStorage.getItem('bapo-path-local-db') || '{}');
  db['settings/site'] = { flags: f };
  localStorage.setItem('bapo-path-local-db', JSON.stringify(db));
}, flags);

test('TC-037b a feature set to Owner and staff is hidden from learners everywhere it appears @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'learner');
  await onboarded(page);
  await setFlags(page, { story: { audience: 'owner' }, glossary: { audience: 'owner' } });
  await page.goto('#/home');
  await expect(page.getByRole('heading', { name: /Good (morning|afternoon|evening)/ })).toBeVisible();
  // Menu and Home card
  const menu = page.locator('aside[aria-label="Main menu"]');
  await expect(menu.getByRole('link', { name: 'Speed Round', includeHidden: true })).toBeAttached();
  await expect(menu.getByRole('link', { name: 'Story Mode', includeHidden: true })).toHaveCount(0);
  await expect(menu.getByRole('link', { name: 'General Knowledge', includeHidden: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Continue story' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Play' })).toBeVisible();
  // Phone bottom bar and search results
  await expect(page.locator('.mobile-nav').getByRole('link', { name: 'Glossary' })).toHaveCount(0);
  await page.getByRole('textbox', { name: 'Search' }).fill('scrum');
  await expect(page.locator('.search-results')).not.toContainText('Term');
  await expectNoHorizontalOverflow(page);
  // Direct links
  await page.goto('#/story');
  await expect(page.getByRole('heading', { name: 'Coming soon' })).toBeVisible();
  await expect(page.getByText('Story Mode is not available yet.')).toBeVisible();
  await page.goto('#/term/team-scrum');
  await expect(page.getByRole('heading', { name: 'Coming soon' })).toBeVisible();
  noErrors();
});

test('TC-037b staff still see a feature that is set to Owner and staff', async ({ page }) => {
  await actAs(page, 'editor');
  await onboarded(page);
  await setFlags(page, { story: { audience: 'owner' } });
  await page.goto('#/home');
  await expect(page.locator('aside[aria-label="Main menu"]').getByRole('link', { name: 'Story Mode', includeHidden: true })).toBeAttached();
  await expect(page.getByRole('link', { name: 'Continue story' })).toBeVisible();
  await page.goto('#/story');
  await expect(page.getByRole('heading', { name: 'Coming soon' })).toHaveCount(0);
});

const LIVE = ['#/roadmap', '#/general', '#/frameworks', '#/domains', '#/references', '#/practice', '#/saved', '#/story',
  '#/collection', '#/circle', '#/achievements', '#/jobs', '#/library'];

test('TC-037c features that are live today stay visible to everyone with no saved settings', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'learner');
  await onboarded(page);
  await page.goto('#/home');
  const menu = page.locator('aside[aria-label="Main menu"]');
  for (const name of ['Skill Roadmap', 'General Knowledge', 'BABOK & PMBOK', 'Domain Knowledge', 'Practice', 'Saved', 'Story Mode',
    'Speed Round', 'Collection', 'Study Circle', 'My Job Search', 'My Library', 'Achievements', 'References']) {
    await expect(menu.getByRole('link', { name, exact: true, includeHidden: true })).toBeAttached();
  }
  await expect(menu.getByRole('link', { name: 'Prompt Workbench', includeHidden: true })).toHaveCount(0); // still Owner and staff only
  await expect(page.getByText('Daily quests')).toBeVisible();
  for (const route of LIVE) {
    await page.goto(route);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Coming soon' }), route).toHaveCount(0);
  }
  noErrors();
});

test('TC-037d changing a feature audience is written to the audit log', async ({ page }) => {
  await actAs(page, 'owner');
  await onboarded(page);
  await page.goto('#/pw-admin/insights');
  const features = page.locator('section', { has: page.getByRole('heading', { name: 'Features' }) });
  await expect(features.getByLabel('Audience: Story Mode')).toHaveValue('everyone');
  await features.getByLabel('Audience: Story Mode').selectOption('owner');
  await expect(page.getByText('Feature setting saved.')).toBeVisible();
  await page.reload();
  const log = page.locator('section', { has: page.getByRole('heading', { name: 'Audit log' }) });
  await expect(log.getByText('Story Mode: owner')).toBeVisible();
});
