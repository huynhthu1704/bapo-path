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
  owner: ['Overview', 'Prompts', 'Review queue', 'Feedback', 'Taxonomy', 'Knowledge base', 'Staff', 'Features', 'Insights', 'Audit log'],
  reviewer: ['Overview', 'Prompts', 'Review queue', 'Feedback'],
  editor: ['Overview', 'Prompts'],
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
  ['#/pw-admin/preview/P-A01', /#\/admin\/prompts\/P-A01\/preview$/, 'no menu'], // the preview shows the prompt as learners see it
  ['#/pw-admin/review/P-A01', /#\/admin\/review\/P-A01$/, 'no menu'], // P-A01 is not imported in this test
  ['#/pw-admin/history/P-A01?a=1&b=2', /#\/admin\/prompts\/P-A01\/history\?a=1&b=2$/], // query string kept
  ['#/admin', /#\/admin$/], // the old Knowledge admin link opens the Admin overview (REQ-039)
];

test('TC-038c old admin links land on the matching page of the Admin area', async ({ page }) => {
  await actAs(page, 'owner');
  await onboarded(page);
  for (const [from, to, noMenu] of OLD) {
    await page.goto(from);
    await expect(page, from).toHaveURL(to);
    if (!noMenu) await expect(adminMenu(page), from).toBeVisible();
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

const GROUPS = [
  [null, ['Home']],
  ['LEARN', ['Skill Roadmap', 'Glossary', 'BABOK & PMBOK', 'Domain Knowledge', 'References']],
  ['PRACTISE', ['Practice', 'Speed Round', 'Story Mode']],
  ['PROGRESS', ['Achievements', 'Collection', 'Study Circle']],
  ['MY STUFF', ['Saved', 'My Library', 'My Job Search', 'Progress & Profile']],
];
const menuLinks = (page) => mainMenu(page).locator('a.nav-item');
const menuGroups = (page) => mainMenu(page).locator('.nav-sec');

test('TC-038a learners see the sidebar grouped as Learn, Practise, Progress and My stuff @mobile', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await actAs(page, 'learner');
  await onboarded(page);
  await page.goto('#/home');
  await expect(menuGroups(page)).toHaveText(GROUPS.slice(1).map(([g]) => g));
  await expect(menuLinks(page)).toHaveText(GROUPS.flatMap(([, items]) => items)); // Prompt Workbench not released yet
  if (page.viewportSize().width <= 900) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(mainMenu(page).getByRole('link', { name: 'Story Mode' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
  noErrors();
});

test('TC-038a a group with no released feature is hidden', async ({ page }) => {
  await actAs(page, 'learner');
  await onboarded(page);
  await page.addInitScript(() => {
    const db = JSON.parse(localStorage.getItem('bapo-path-local-db') || '{}');
    db['settings/site'] = { flags: { achievements: { audience: 'owner' }, collection: { audience: 'owner' }, circle: { audience: 'owner' } } };
    localStorage.setItem('bapo-path-local-db', JSON.stringify(db));
  });
  await page.goto('#/home');
  await expect(menuGroups(page)).toHaveText(['LEARN', 'PRACTISE', 'MY STUFF']);
});

test('TC-038a staff see Admin right under Home and every group', async ({ page }) => {
  await actAs(page, 'owner');
  await onboarded(page);
  await page.goto('#/home');
  await expect(menuLinks(page).nth(0)).toHaveText('Home');
  await expect(menuLinks(page).nth(1)).toHaveText('Admin');
  await expect(menuGroups(page)).toHaveText(['LEARN', 'PRACTISE', 'PROGRESS', 'MY STUFF']);
  await expect(mainMenu(page).getByRole('link', { name: 'Prompt Workbench', includeHidden: true })).toBeAttached();
});
