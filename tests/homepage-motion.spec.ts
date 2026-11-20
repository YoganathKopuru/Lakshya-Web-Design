import { test, expect } from '@playwright/test';

test('homepage expertise gives each service one direct route', async ({
  page,
}) => {
  await page.goto('/#expertise');
  const links = page.locator('#expertise').getByRole('link');
  await expect(links).toHaveCount(8);
  const urls = await links.evaluateAll((items) =>
    items.map((item) => item.getAttribute('href')),
  );
  expect(new Set(urls).size).toBe(8);
  await links.filter({ hasText: 'Embedded Systems & IoT' }).click();
  await expect(page).toHaveURL(/\/services\/embedded-iot\/$/);
});

test('AI placards connect enterprise knowledge to a reviewed support response', async ({
  page,
}) => {
  await page.goto('/#ai-in-motion');
  const section = page.locator('#ai-in-motion');
  const cards = section.getByRole('listitem');
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toContainText('Access guide');
  await cards.nth(1).scrollIntoViewIfNeeded();
  await expect(cards.nth(1)).toContainText('Restore access');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cards.first()).toHaveCSS('position', 'relative');
  await expect(cards.first().locator('[data-workflow-record]')).toHaveCSS(
    'transform',
    'none',
  );
  await section.getByRole('link', { name: 'Explore AI & data' }).click();
  await expect(page).toHaveURL(/ai-data\/$/);
});

test('intro film plays muted and pauses offscreen', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'Video decoding depends on the browser test runtime',
  );
  await page.goto('/');
  const video = page.locator('video#intro-film');
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('loop', true);
  await expect(video).toHaveAttribute('playsinline', '');
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => element.currentTime),
    )
    .toBeGreaterThan(0.1);
  await page.locator('#approach').scrollIntoViewIfNeeded();
  await expect(video).toHaveJSProperty('paused', true);
});

test('intro film keeps its still when the video cannot load', async ({
  page,
}) => {
  await page.goto('/');
  const video = page.locator('video#intro-film');
  await expect(video).toBeAttached();
  await video.dispatchEvent('error');
  await expect(page.locator('[data-hero-media] img')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Software, AI & engineering.',
  );
  await expect(page.locator('video#intro-film')).toHaveCount(0);
});

test('the hero presents one project action', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('[data-hero]');
  await expect(hero.getByRole('button')).toHaveCount(0);
  await expect(hero.locator('iframe')).toHaveCount(0);
  await expect(hero.getByRole('link')).toHaveCount(1);
  await expect(
    hero.getByRole('link', { name: 'Discuss your project' }),
  ).toHaveAttribute('href', '/contact/');
});
