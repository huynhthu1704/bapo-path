// REQ-039 (#60): Admin › Overview shows what needs attention, as count cards that link to their page.
// Demo mode: the demo database (localStorage) is seeded with prompts, feedback and feature settings.
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow, actAs } from './helpers.js';

const seed = (page, docs) => page.addInitScript((d) => {
  const cur = JSON.parse(localStorage.getItem('bapo-path-v1') || '{}');
  localStorage.setItem('bapo-path-v1', JSON.stringify({ ...cur, onboarded: true, name: 'Christine' }));
  const db = JSON.parse(localStorage.getItem('bapo-path-local-db') || '{}');
  localStorage.setItem('bapo-path-local-db', JSON.stringify({ ...db, ...d }));
}, docs);

const editor = { uid: 'demo-editor', name: 'Lan (Editor)' };
const prompt = (id, status, extra = {}) => [`prompts/${id}`, { id, title: `Prompt ${id}`, status, cat: 'A', phase: 'discover', step: 1, version: 1, updatedAt: '2026-11-27T10:00:00.000Z', createdBy: { uid: 'demo-owner', name: 'Christine' }, ...extra }];
const BUSY = Object.fromEntries([
  prompt('X-01', 'review'), prompt('X-02', 'review'), prompt('X-03', 'published'),
  prompt('X-04', 'draft', { createdBy: editor }), prompt('X-05', 'draft', { createdBy: editor, reviewNote: 'Shorten the steps.' }),
  prompt('X-06', 'draft'),
  ['prompt_feedback/f1', { promptId: 'X-03', title: 'Prompt X-03', text: 'Typo', status: 'new', at: '2026-11-27T09:00:00.000Z', name: 'Hoa' }],
  ['prompt_feedback/f2', { promptId: 'X-03', title: 'Prompt X-03', text: 'Old', status: 'done', at: '2026-11-26T09:00:00.000Z', name: 'Hoa' }],
]);
const card = (page, name) => page.getByRole('main').getByRole('link', { name: new RegExp(name) });

test('TC-039a the Owner sees count cards that link to their pages @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'owner');
  await seed(page, BUSY);
  await page.goto('#/admin');
  await expect(page).toHaveURL(/#\/admin$/);
  await expect(page.getByRole('heading', { name: 'Admin', level: 1 })).toBeVisible();
  await expect(card(page, 'Prompts waiting for review')).toContainText('2');
  await expect(card(page, 'New feedback')).toContainText('1');
  await expect(card(page, 'Features not released to everyone')).toContainText('3'); // prompts, googleOnly, pmTrack
  await expectNoHorizontalOverflow(page);
  await card(page, 'Prompts waiting for review').click();
  await expect(page).toHaveURL(/#\/admin\/review$/);
  await page.goto('#/admin');
  await card(page, 'New feedback').click();
  await expect(page).toHaveURL(/#\/admin\/feedback$/);
  await page.goto('#/admin');
  await card(page, 'Features not released to everyone').click();
  await expect(page).toHaveURL(/#\/admin\/features$/);
  noErrors();
});

test('TC-039b a Reviewer sees review and feedback cards only', async ({ page }) => {
  await actAs(page, 'reviewer');
  await seed(page, BUSY);
  await page.goto('#/admin');
  await expect(card(page, 'Prompts waiting for review')).toContainText('2');
  await expect(card(page, 'New feedback')).toContainText('1');
  await expect(card(page, 'Features not released')).toHaveCount(0);
  await expect(card(page, 'Your drafts')).toHaveCount(0);
});

test('TC-039b an Editor sees their drafts and what was sent back', async ({ page }) => {
  await actAs(page, 'editor');
  await seed(page, BUSY);
  await page.goto('#/admin');
  await expect(card(page, 'Your drafts')).toContainText('2');
  await expect(card(page, 'Sent back for changes')).toContainText('1');
  await expect(card(page, 'Prompts waiting for review')).toHaveCount(0);
  await expect(card(page, 'New feedback')).toHaveCount(0);
  await expect(card(page, 'Features not released')).toHaveCount(0);
  await card(page, 'Sent back for changes').click();
  await expect(page).toHaveURL(/#\/admin\/prompts$/);
});

test('TC-039a a feature with beta testers counts as not released', async ({ page }) => {
  await actAs(page, 'owner');
  await seed(page, { 'settings/site': { flags: { story: { audience: 'beta', beta: ['demo-learner'] } } } });
  await page.goto('#/admin');
  await expect(card(page, 'Features not released to everyone')).toContainText('4');
});

test('TC-039c an Editor with nothing pending sees "Nothing to do right now"', async ({ page }) => {
  await actAs(page, 'editor');
  await seed(page, Object.fromEntries([prompt('X-01', 'review')]));
  await page.goto('#/admin');
  await expect(page.getByText('Nothing to do right now')).toBeVisible();
  await expect(page.getByText('No drafts waiting and nothing sent back to you.')).toBeVisible();
});

test('TC-039c with nothing pending the Overview says "Nothing to do right now"', async ({ page }) => {
  await actAs(page, 'owner');
  await seed(page, { 'settings/site': { flags: { prompts: { audience: 'everyone' }, googleOnly: { audience: 'everyone' }, pmTrack: { audience: 'everyone' } } } });
  await page.goto('#/admin');
  await expect(page.getByText('Nothing to do right now')).toBeVisible();
  await expect(card(page, 'Prompts waiting for review')).toHaveCount(0);
});
