// Prompt Workbench, learner side. Test ids TC-xxx match the requirements in docs/requirements/prompt-workbench.md.
// Runs in demo mode as the Owner (the `prompts` flag is on for staff) unless a test says otherwise.
import { test, expect } from '@playwright/test';
import { PROMPTS } from '../../src/data/prompts/index.js';
import { actAs, failOnPageErrors, expectNoHorizontalOverflow } from './helpers.js';

const count = (fn) => PROMPTS.filter(fn).length;

test.describe('feature flag', () => {
  test('learners do not see the Workbench until the flag is on for them', async ({ page }) => {
    await actAs(page, 'learner');
    await page.goto('#/prompts');
    await expect(page.getByRole('heading', { name: 'Prompt Workbench', level: 1 })).toHaveCount(0);
  });

  test('?preview=prompts shows the UI in that browser', async ({ page }) => {
    await actAs(page, 'learner');
    await page.goto('#/prompts?preview=prompts');
    await expect(page.getByRole('heading', { name: 'Prompt Workbench', level: 1 })).toBeVisible();
  });
});

test.describe('library', () => {
  test.beforeEach(async ({ page }) => { await actAs(page, 'owner'); });

  test('TC-001 picking a phase shows only that phase, with a count', async ({ page }) => {
    const n = count((p) => p.phase === 'define');
    await page.goto('#/prompts');
    await page.getByRole('group', { name: 'Phase' }).getByRole('button', { name: `Define · ${n}` }).click();
    await expect(page).toHaveURL(/phase=define/);
    await expect(page.getByRole('heading', { name: `Define · ${n} prompts` })).toBeVisible();
    await expect(page.locator('main article')).toHaveCount(n);
  });

  test('TC-002 keyword search puts title matches first', async ({ page }) => {
    await page.goto('#/prompts');
    await page.getByRole('searchbox', { name: 'Search prompts' }).fill('gherkin');
    await expect(page).toHaveURL(/q=gherkin/);
    await expect(page.locator('main article').first()).toContainText(/gherkin/i);
  });

  test('TC-003 role and phase filters combine and survive a reload', async ({ page }) => {
    const n = count((p) => p.phase === 'build' && p.roles.includes('PO'));
    await page.goto('#/prompts');
    await page.getByRole('group', { name: 'Role' }).getByRole('button', { name: 'PO', exact: true }).click();
    await page.getByRole('group', { name: 'Phase' }).getByRole('button', { name: /^Build · / }).click();
    await expect(page).toHaveURL(/role=PO/);
    await expect(page).toHaveURL(/phase=build/);
    await page.reload();
    await expect(page.getByRole('group', { name: 'Role' }).getByRole('button', { name: 'PO', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('heading', { name: `Build · ${n} prompts` })).toBeVisible();
  });

  test('library has no horizontal scroll on a phone @mobile', async ({ page }) => {
    const noErrors = failOnPageErrors(page);
    await page.goto('#/prompts');
    await expect(page.locator('main article').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
    noErrors();
  });
});

test.describe('prompt detail', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await actAs(page, 'owner');
  });

  test('TC-005 detail page shows the sections a learner needs', async ({ page }) => {
    await page.goto('#/prompts/P-A01');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(PROMPTS.find((p) => p.id === 'P-A01').title);
    for (const h of ['When to use', 'Prepare first', 'Expected output', 'Fill in your context', 'Your prompt', 'Tips']) {
      await expect(page.getByRole('heading', { name: h, level: 2 })).toBeVisible();
    }
  });

  test('TC-006/TC-007 filled values go into the copied prompt; empty ones stay in [brackets]', async ({ page }) => {
    await page.goto('#/prompts/P-A01');
    await page.getByRole('textbox', { name: '[Idea] What is the idea?' }).fill('A stock-ordering app');
    const preview = page.getByRole('region', { name: 'Your prompt' });
    await expect(preview).toContainText('A stock-ordering app');
    await expect(preview.locator('mark', { hasText: '[Target Customer]' })).toBeVisible();

    await page.getByRole('button', { name: 'Copy prompt' }).click();
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
    await expect(page.locator('[aria-live="polite"]', { hasText: 'Copied' })).toHaveCount(1);
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('A stock-ordering app');
    expect(copied).toContain('[Target Customer]');
    // The "Copied" state lasts about 2 seconds.
    await expect(page.getByRole('button', { name: 'Copy prompt' })).toBeVisible({ timeout: 4000 });
  });

  test('TC-006 copy works from the keyboard', async ({ page }) => {
    await page.goto('#/prompts/P-A01');
    await page.getByRole('button', { name: 'Copy prompt' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  });

  test('TC-008 filled values are remembered for the same placeholder', async ({ page }) => {
    const [a, b] = PROMPTS.filter((p) => p.ph.some((x) => x[0] === 'Business Context')).slice(0, 2);
    test.skip(!b, 'needs two prompts that share [Business Context]');
    await page.goto(`#/prompts/${a.id}`);
    await page.getByRole('textbox', { name: /^\[Business Context\]/ }).fill('Retail bank, 2M customers');
    await page.goto(`#/prompts/${b.id}`);
    await expect(page.getByRole('textbox', { name: /^\[Business Context\]/ })).toHaveValue('Retail bank, 2M customers');
  });

  test('TC-010 Next step suggests linked prompts, first one Recommended', async ({ page }) => {
    const p = PROMPTS.find((x) => x.id === 'P-A01');
    await page.goto('#/prompts/P-A01');
    const next = page.getByRole('region', { name: 'Next step' });
    await expect(next.getByRole('link')).toHaveCount(p.next.length);
    await expect(next.getByRole('link').first()).toContainText('Recommended');
  });

  test('TC-012/TC-013 favourites and recently used show in My prompts', async ({ page }) => {
    await page.goto('#/prompts/P-A01');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Copy prompt' }).click();
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
    await page.goto('#/my-prompts');
    const title = PROMPTS.find((x) => x.id === 'P-A01').title;
    await expect(page.getByRole('main')).toContainText(title);
  });
});

test('TC-009 Workbench shows the six phases in order and ticks used prompts', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await actAs(page, 'owner');
  await page.goto('#/workbench');
  const tabs = page.getByRole('tablist', { name: 'Workflow phases' }).getByRole('tab');
  await expect(tabs).toHaveText(['Discover', 'Define', 'Design', 'Build', 'Release', 'Monitor'].map((n) => new RegExp(`^${n}`)));
  const n = count((p) => p.phase === 'discover');
  await expect(tabs.first()).toContainText(`0 of ${n} used`);
  await page.getByRole('button', { name: 'Copy', exact: true }).first().click();
  await expect(tabs.first()).toContainText(`1 of ${n} used`);
});

test('TC-011 the six launch collections are listed', async ({ page }) => {
  await actAs(page, 'owner');
  await page.goto('#/collections');
  for (const name of ['New Product Discovery', 'Feature Development', 'Sprint Management', 'UAT and Release', 'Project Kickoff', 'Post-launch Review']) {
    await expect(page.getByRole('main')).toContainText(name);
  }
});

test('TC-025 Korean title and description show under the English; the prompt stays English', async ({ page }) => {
  const p = PROMPTS.find((x) => x.id === 'P-A01');
  await page.addInitScript(() => {
    try { localStorage.setItem('bapo-path-v1', JSON.stringify({ langs: ['ko'] })); } catch (e) { /* ignore */ }
  });
  await actAs(page, 'owner');
  await page.goto(`#/prompts/${p.id}`);
  const main = page.getByRole('main');
  await expect(main).toContainText(p.tr.ko[0]);
  await expect(main).toContainText(p.tr.ko[1]);
  await expect(main).not.toContainText(p.tr.vi[0]);
  await expect(page.getByRole('region', { name: 'Your prompt' })).toContainText(p.body.slice(0, 40));
});
