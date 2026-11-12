import { test, expect } from '@playwright/test';

test('service pages suggest the next three services, not a fixed set', async ({
  page,
}) => {
  const related = async (slug: string) => {
    await page.goto(`/services/${slug}/`);
    return page
      .locator('.related-link')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
  };
  const first = await related('ai-data');
  expect(first).toHaveLength(3);
  expect(first).not.toContain('/services/ai-data/');
  const second = await related('software-engineering');
  expect(second).toHaveLength(3);
  expect(second).not.toContain('/services/software-engineering/');
  expect(second).not.toEqual(first);
});

test('service breadcrumb is a labelled navigation landmark', async ({
  page,
}) => {
  await page.goto('/services/ai-data/');
  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(crumbs.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText(
    'AI & Data Engineering',
  );
});

test('footer links to every main section', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  for (const name of ['Industries', 'Why Lakshya'])
    await expect(footer.getByRole('link', { name })).toBeVisible();
});

test('an invalid email shows an inline, linked error', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByLabel('Your name *').fill('QA Person');
  const email = page.getByLabel('Work email *');
  await email.fill('not-an-email');
  await page.getByLabel('Company *').fill('QA Company');
  await page
    .getByLabel('Your project or challenge *')
    .fill('A meaningful test enquiry.');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAttribute('aria-describedby', 'error-email');
  await expect(page.locator('#error-email')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0);
  await email.fill('qa@example.com');
  await expect(email).toHaveAttribute('aria-invalid', 'false');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  await expect(page.getByLabel('Your prepared enquiry')).toHaveValue(
    /Email: qa@example.com/,
  );
});

test('clicking outside the Expertise menu closes it', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The overlay is a desktop affordance.');
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Expertise', exact: true });
  await trigger.click();
  await expect(page.locator('#expertise-menu')).toBeVisible();
  // The phone-only "All services" link must stay out of the desktop grid.
  await expect(page.locator('#expertise-menu .mega-all')).toBeHidden();
  await expect(
    page.locator('#expertise-menu .mega-links a:visible'),
  ).toHaveCount(8);
  const viewport = page.viewportSize()!;
  const scrim = await page.locator('.menu-scrim').boundingBox();
  expect(scrim!.height).toBeGreaterThan(viewport.height / 2);
  await page.mouse.click(viewport.width / 2, viewport.height - 40);
  await expect(page.locator('#expertise-menu')).toHaveCount(0);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/\/$/);
});

test('the mobile menu offers a link to all services', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Desktop shows “Explore all services” instead.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Expertise', exact: true }).click();
  const all = page.getByRole('link', { name: 'All services' });
  await expect(all).toBeVisible();
  await all.click();
  await expect(page).toHaveURL(/\/services\/$/);
});

test('an email without a dotted domain is rejected', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByLabel('Your name *').fill('QA Person');
  await page.getByLabel('Work email *').fill('qa@example');
  await page.getByLabel('Company *').fill('QA Company');
  await page
    .getByLabel('Your project or challenge *')
    .fill('A meaningful test enquiry.');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  await expect(page.locator('#error-email')).toContainText(
    'complete email address',
  );
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0);
});

test('the 404 page has its own title and no heading gaps on listings', async ({
  page,
}) => {
  await page.goto('/no-such-page/');
  await expect(page).toHaveTitle(/Page not found/);
  for (const path of ['/services/', '/industries/']) {
    await page.goto(path);
    const levels = await page
      .locator('main :is(h1,h2,h3,h4)')
      .evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
    for (let i = 1; i < levels.length; i++)
      expect(levels[i]).toBeLessThanOrEqual(levels[i - 1] + 1);
  }
});
