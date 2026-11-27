// Prompt Workbench, admin side: the Draft → In review → Published workflow and the role rules in the UI.
// The same rules are enforced server-side by firestore.rules (see tests/rules.test.mjs).
// Runs in demo mode; the demo bar's "Act as" switches between Owner, Reviewer, Editor and learner.
import { test, expect } from '@playwright/test';
import { PROMPTS } from '../../src/data/prompts/index.js';
import { actAs, failOnPageErrors } from './helpers.js';

const TARGET = PROMPTS.find((p) => p.id === 'P-A01');

async function importLaunchPrompts(page) {
  await page.goto('#/pw-admin');
  await page.getByRole('button', { name: `Import the ${PROMPTS.length} launch prompts` }).click();
  await expect(page.getByRole('group', { name: 'Status' }).getByRole('button', { name: `Published · ${PROMPTS.length}` })).toBeVisible();
}

async function actAsInBar(page, who) {
  await page.getByLabel('Act as').selectOption(`demo-${who}`);
  await expect(page.locator('.tab-role')).toContainText(who === 'learner' ? 'Learner' : who[0].toUpperCase() + who.slice(1));
}

async function editAndSubmit(page, newTitle) {
  await page.goto(`#/pw-admin/edit/${TARGET.id}`);
  await page.getByLabel('Title', { exact: true }).fill(newTitle);
  await page.getByRole('button', { name: 'Save draft' }).click();
  await expect(page.getByText(/Saved as draft v\d+/)).toBeVisible();
  await page.getByRole('button', { name: 'Submit for review' }).click();
  await expect(page.getByText('Submitted. Reviewers can see it in their queue.')).toBeVisible();
}

const tickChecklist = async (page) => {
  for (const name of ['Complete', 'Clear', 'Placeholders match', 'Test run']) await page.getByRole('checkbox', { name: new RegExp(`^${name}`) }).check();
};

test.beforeEach(async ({ page }) => { await actAs(page, 'owner'); });

test('TC-015/TC-017/TC-018 an editor submits, a reviewer publishes, learners see the change', async ({ page }) => {
  const noErrors = failOnPageErrors(page);
  await importLaunchPrompts(page);
  await actAsInBar(page, 'editor');
  await editAndSubmit(page, 'Validate a business idea (edited)');

  await page.goto('#/pw-admin');
  await actAsInBar(page, 'reviewer');
  await page.goto('#/pw-admin/review');
  await expect(page.getByRole('main')).toContainText('Validate a business idea (edited)');
  await page.getByRole('main').getByRole('link', { name: 'Review', exact: true }).first().click();
  const publish = page.getByRole('button', { name: 'Publish', exact: true });
  await expect(publish).toBeDisabled(); // checklist not ticked yet
  await tickChecklist(page);
  await expect(publish).toBeEnabled();
  await publish.click();
  await expect(page).toHaveURL(/#\/admin\/review$/);

  await page.goto(`#/prompts/${TARGET.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Validate a business idea (edited)');
  noErrors();
});

test('TC-018 a reviewer cannot publish their own submission', async ({ page }) => {
  await importLaunchPrompts(page);
  await actAsInBar(page, 'reviewer');
  await editAndSubmit(page, 'Reviewer’s own change');
  await page.goto(`#/pw-admin/review/${TARGET.id}`);
  await tickChecklist(page);
  await expect(page.getByRole('button', { name: 'Publish', exact: true })).toBeDisabled();
  await expect(page.getByText('You submitted this prompt, so another Reviewer or the Owner must publish it.')).toBeVisible();
});

test('TC-018 publish is blocked when a required field is empty', async ({ page }) => {
  await importLaunchPrompts(page);
  await page.goto(`#/pw-admin/edit/${TARGET.id}`);
  await page.getByLabel('Short description').fill('');
  await expect(page.getByRole('button', { name: 'Submit for review' })).toBeDisabled();
});

test('TC-019 unpublishing hides a prompt; favourites show "No longer available"', async ({ page }) => {
  await importLaunchPrompts(page);
  await page.goto(`#/prompts/${TARGET.id}`);
  await page.getByRole('button', { name: 'Save' }).click();

  await page.goto(`#/pw-admin/edit/${TARGET.id}`);
  await page.getByRole('button', { name: 'Unpublish' }).click();
  await page.getByRole('button', { name: 'Unpublish' }).last().click(); // confirm
  await expect(page.getByText('Unpublished. Learners no longer see it.')).toBeVisible();

  await page.goto('#/my-prompts');
  await expect(page.getByText('No longer available')).toBeVisible();
});

test('TC-022 only the Owner sees Staff, Taxonomy and Insights', async ({ page }) => {
  await page.goto('#/pw-admin');
  const tabs = page.getByRole('navigation', { name: 'Admin' }); // REQ-038: the Admin side menu
  for (const t of ['Taxonomy', 'Staff', 'Insights']) await expect(tabs.getByRole('link', { name: t })).toBeVisible();
  await actAsInBar(page, 'editor');
  for (const t of ['Taxonomy', 'Staff', 'Insights', 'Feedback']) await expect(tabs.getByRole('link', { name: t })).toHaveCount(0);
});

test('TC-023 admin actions are written to the audit log', async ({ page }) => {
  await importLaunchPrompts(page);
  await page.goto('#/admin/audit'); // REQ-038: the audit log has its own page
  await expect(page.getByRole('main')).toContainText(/import/i);
});

test('TC-016 an editor previews a saved draft as learners will see it', async ({ page }) => {
  await importLaunchPrompts(page);
  await page.goto(`#/pw-admin/edit/${TARGET.id}`);
  await page.getByLabel('Title', { exact: true }).fill('Preview me');
  await page.getByRole('button', { name: 'Save draft' }).click();
  await expect(page.getByText(/Saved as draft v\d+/)).toBeVisible();
  await page.getByRole('button', { name: 'Preview' }).click();
  await expect(page).toHaveURL(new RegExp(`#/admin/prompts/${TARGET.id}/preview`));
  await expect(page.getByRole('heading', { name: 'Fill in your context' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Preview me');
});

test('TC-020 version history lists every save and restore makes a new draft', async ({ page }) => {
  await importLaunchPrompts(page);
  await page.goto(`#/pw-admin/edit/${TARGET.id}`);
  await page.getByLabel('Title', { exact: true }).fill('Second version');
  await page.getByRole('button', { name: 'Save draft' }).click();
  await expect(page.getByText('Saved as draft v2.')).toBeVisible();
  await page.goto(`#/pw-admin/history/${TARGET.id}`);
  await expect(page.getByRole('checkbox', { name: 'Compare version 1' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Compare version 2' })).toBeVisible();
  await page.getByRole('button', { name: 'Restore' }).first().click(); // restores v1
  await expect(page).toHaveURL(new RegExp(`#/admin/prompts/${TARGET.id}/edit$`));
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue(TARGET.title);
  await page.goto(`#/pw-admin/history/${TARGET.id}`);
  await expect(page.getByRole('checkbox', { name: 'Compare version 3' })).toBeVisible();
});
