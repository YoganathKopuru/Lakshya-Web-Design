import { test, expect } from '@playwright/test';
test('draft edits invalidate stale email and trim whitespace', async ({
  page,
}) => {
  await page.goto('/contact/?service=software-engineering');
  await expect(page.getByLabel('I�m interested in')).toHaveValue(
    'software-engineering',
  );
  await page.getByLabel('Your name *').fill('   ');
  await page.getByLabel('Work email *').fill('qa@example.com');
  await page.getByLabel('Company *').fill('QA Company');
  await page
    .getByLabel('Your project or challenge *')
    .fill('A meaningful test enquiry.');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0);
  await expect(
    page.getByText('Please enter your name.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Your name *').fill(' QA Person ');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  await expect(page.getByLabel('Your prepared enquiry')).toHaveValue(
    /Name: QA Person/,
  );
  await page
    .getByLabel('Your project or challenge *')
    .fill('An updated enquiry message.');
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  await expect(page.getByLabel('Your prepared enquiry')).toHaveValue(
    /An updated enquiry message/,
  );
  await page.getByLabel('I�m interested in').selectOption('ai-data');
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0);
});
test('Escape restores focus to the expertise trigger', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile)
    await page.getByRole('button', { name: 'Open navigation' }).click();
  const trigger = page.getByRole('button', { name: 'Expertise', exact: true });
  await trigger.click();
  await page.locator('#expertise-menu a').last().focus();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
test('service walkthrough can be paused and reset', async ({ page }) => {
  await page.goto('/services/software-engineering/');
  await page.getByRole('button', { name: 'Play flow', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Pause flow', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Pause flow', exact: true }).click();
  await page.getByRole('button', { name: 'Reset visual' }).click();
  await expect(
    page
      .getByRole('group', { name: 'Explore the stages' })
      .getByRole('button')
      .first(),
  ).toHaveAttribute('aria-pressed', 'true');
});
