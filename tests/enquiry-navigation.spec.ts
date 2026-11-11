import { test, expect } from '@playwright/test';
test('Other is preserved in prepared enquiries and query preselection', async ({
  page,
}) => {
  await page.goto('/contact/?service=other');
  const services = page.getByRole('combobox', { name: /interested in/ });
  await expect(services).toHaveValue('other');
  await expect(services.locator('option[value="other"]')).toHaveText('Other');
  await page.getByLabel('Your name *').fill('QA Person');
  await page.getByLabel('Work email *').fill('qa@example.com');
  await page.getByLabel('Company *').fill('QA Company');
  await page
    .getByLabel('Your project or challenge *')
    .fill('An enquiry outside the listed service categories.');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  await expect(page.getByLabel('Your prepared enquiry')).toHaveValue(
    /Subject: Website enquiry \| Other[\s\S]*Service: Other/,
  );
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveAttribute('href', /Service%3A%20Other/);
  await services.selectOption('ai-data');
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0);
});
test('draft edits invalidate stale email and trim whitespace', async ({
  page,
}) => {
  await page.goto('/contact/?service=software-engineering');
  await expect(
    page.getByRole('combobox', { name: /interested in/ }),
  ).toHaveValue('software-engineering');
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
  await page
    .getByRole('combobox', { name: /interested in/ })
    .selectOption('ai-data');
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
test('service diagrams autoplay without controls and respect reduced motion', async ({
  page,
}) => {
  await page.goto('/services/software-engineering/');
  const panel = page.locator('section[data-step]');
  await panel.scrollIntoViewIfNeeded();
  await expect(panel.getByRole('button')).toHaveCount(0);
  await expect(panel).toHaveAttribute('data-playing', 'true');
  const initial = await panel.getAttribute('data-step');
  await expect
    .poll(() => panel.getAttribute('data-step'), { timeout: 6000 })
    .not.toBe(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(panel).toHaveAttribute('data-playing', 'false');
});
