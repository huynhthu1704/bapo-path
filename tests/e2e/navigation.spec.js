// REQ-038 (#59): one Admin entry in the sidebar and one Admin area with its own side menu.
// Demo mode: "Act as" picks the role (Owner, Reviewer, Editor, learner).
import { test, expect } from '@playwright/test';
import { failOnPageErrors, expectNoHorizontalOverflow, actAs } from './helpers.js';

const onboarded = (page) => page.addInitScript(() => {
  const cur = JSON.parse(localStorage.getItem('bapo-path-v1') || '{}');
  localStorage.setItem('bapo-path-v1', JSON.stringify({ ...cur, onboarded: true, name: 'Christine' }));
});
const mainMenu = (page) => page.locator('aside[aria-label="Main menu"]');
const adminMenu = (page) => page.getByRole('navigation', { name: 'Admin' });

const SECTIONS = {
  owner: ['Prompts', 'Review queue', 'Feedback', 'Taxonomy', 'Knowledge base', 'Staff', 'Features', 'Insights', 'Audit log'],
  reviewer: ['Prompts', 'Review queue', 'Feedback'],
  editor: ['Prompts'],
};

test('TC-038b staff see one Admin entry that opens the Admin area', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'owner');
  await onboarded(page);
  await page.goto('#/home');
  const menu = mainMenu(page);
  await expect(menu.getByRole('link', { name: 'Prompt admin', includeHidden: true })).toHaveCount(0);
  await expect(menu.getByRole('link', { name: 'Knowledge admin', includeHidden: true })).toHaveCount(0);
  await menu.getByRole('link', { name: /^Admin/ }).click();
  await expect(page).toHaveURL(/#\/admin/);
  await expect(adminMenu(page)).toBeVisible();
  for (const name of SECTIONS.owner) await expect(adminMenu(page).getByRole('link', { name: new RegExp(`^${name}`) })).toBeVisible();
  await adminMenu(page).getByRole('link', { name: 'Knowledge base' }).click();
  await expect(page.getByRole('heading', { name: 'Knowledge base', level: 1 })).toBeVisible();
  await expect(page.getByText('Admin › Knowledge base')).toBeVisible();
  await adminMenu(page).getByRole('link', { name: 'Audit log' }).click();
  await expect(page.getByRole('heading', { name: 'Audit log', level: 1 })).toBeVisible();
  noErrors();
});

for (const role of ['reviewer', 'editor']) {
  test(`TC-038b the Admin side menu shows only what a ${role} may use`, async ({ page }) => {
    await actAs(page, role);
    await onboarded(page);
    await page.goto('#/admin');
    await expect(adminMenu(page)).toBeVisible();
    const all = SECTIONS.owner;
    for (const name of all) {
      const link = adminMenu(page).getByRole('link', { name: new RegExp(`^${name}`) });
      if (SECTIONS[role].includes(name)) await expect(link).toBeVisible(); else await expect(link).toHaveCount(0);
    }
    await page.goto('#/admin/knowledge');
    await expect(page.getByText('Only the Owner can manage the knowledge base.')).toBeVisible();
  });
}

test('TC-038b learners see no Admin entry', async ({ page }) => {
  await actAs(page, 'learner');
  await onboarded(page);
  await page.goto('#/home');
  await expect(mainMenu(page).getByRole('link', { name: /^Admin/, includeHidden: true })).toHaveCount(0);
});

const OLD = [
  ['#/pw-admin', /#\/admin\/prompts$/],
  ['#/pw-admin/review', /#\/admin\/review$/],
  ['#/pw-admin/feedback', /#\/admin\/feedback$/],
  ['#/pw-admin/taxonomy', /#\/admin\/taxonomy$/],
  ['#/pw-admin/staff', /#\/admin\/staff$/],
  ['#/pw-admin/features', /#\/admin\/features$/],
  ['#/pw-admin/insights', /#\/admin\/insights$/],
  ['#/pw-admin/new', /#\/admin\/prompts\/new$/],
  ['#/pw-admin/edit/P-A01', /#\/admin\/prompts\/P-A01\/edit$/],
  ['#/pw-admin/history/P-A01', /#\/admin\/prompts\/P-A01\/history$/],
];

test('TC-038c old admin links land on the matching page of the Admin area', async ({ page }) => {
  await actAs(page, 'owner');
  await onboarded(page);
  for (const [from, to] of OLD) {
    await page.goto(from);
    await expect(page, from).toHaveURL(to);
    await expect(adminMenu(page)).toBeVisible();
  }
});

test('TC-038d at 375 px the Admin menu is a drop-down and nothing scrolls sideways @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'owner');
  await onboarded(page);
  await page.goto('#/admin/prompts');
  const pick = page.getByRole('combobox', { name: 'Admin section' });
  if (page.viewportSize().width <= 600) {
    await expect(pick).toBeVisible();
    await pick.selectOption({ label: 'Features' });
    await expect(page).toHaveURL(/#\/admin\/features$/);
  } else {
    await expect(adminMenu(page)).toBeVisible();
  }
  for (const path of ['#/admin/prompts', '#/admin/features', '#/admin/insights', '#/admin/audit', '#/admin/knowledge']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
  noErrors();
});
