import { test, expect } from '@playwright/test';

test('journey stages disclose useful detail with keyboard and pointer', async ({
  page,
}) => {
  await page.goto('/#approach');
  const stage = page.locator('#approach details').first();
  const summary = stage.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(stage).toHaveAttribute('open', '');
  await expect(
    stage.getByText(
      'Agree on the problem, stakeholders and what success should look like.',
    ),
  ).toBeVisible();
  await summary.click();
  await expect(stage).not.toHaveAttribute('open', '');
});

test('client showcase supports manual keyboard scrolling and reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  const region = page.getByRole('region', {
    name: 'Client showcase; scroll to explore',
  });
  await region.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect
    .poll(() => region.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(50);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('Home');
  await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBe(0);
  await expect(region.getByRole('img')).toHaveCount(8);
});
