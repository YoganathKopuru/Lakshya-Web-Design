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
