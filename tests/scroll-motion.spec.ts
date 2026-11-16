import { expect, test } from '@playwright/test';

test('the hero scroll cue lands below the sticky header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Discover Lakshya' }).click();
  await expect(page).toHaveURL(/#solutions$/);
  await expect
    .poll(() =>
      page.locator('#solutions').evaluate((section) => {
        const header = document.querySelector('.site-header');
        const gap =
          section.getBoundingClientRect().top -
          (header?.getBoundingClientRect().bottom ?? 0);
        return gap >= 10 && gap <= 24;
      }),
    )
    .toBe(true);
});

test('hero zooms with scroll and editorial cards reveal once', async ({
  page,
}) => {
  await page.goto('/');
  const media = page.locator('[data-hero-media]');
  await expect(media).toHaveCSS(
    'transform',
    /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
  );
  await page.evaluate(() => window.scrollTo({ top: 480, behavior: 'instant' }));
  await expect(media).toHaveCSS('transform', 'matrix(1.08, 0, 0, 1.08, 0, 0)');
  if (page.viewportSize()!.width >= 900) {
    await expect(page.locator('[data-hero-aperture]')).toHaveCSS(
      'opacity',
      '0',
    );
  }
  const progress = page.locator('[data-scroll-progress]');
  await expect(progress).not.toHaveCSS('transform', 'matrix(0, 0, 0, 1, 0, 0)');

  const card = page.locator('#delivery [data-reveal]').first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-revealed', '');
  await expect(card).toHaveCSS('opacity', '1');
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  await expect(progress).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS('opacity', '1');
});

test('solution cards open in place and preserve the service links', async ({
  page,
}) => {
  await page.goto('/#solutions');
  const cards = page.locator('#solutions details');
  await expect(cards).toHaveCount(3);
  await cards.nth(0).locator('summary').press('Enter');
  await expect(cards.nth(0)).toHaveAttribute('open', '');
  const service = cards.nth(1);
  await service.locator('summary').click();
  await expect(cards.nth(0)).not.toHaveAttribute('open');
  await expect(service).toHaveAttribute('open', '');
  await service
    .getByRole('link', { name: 'Explore Embedded Systems & IoT' })
    .click();
  await expect(page).toHaveURL(/\/services\/embedded-iot\/$/);
});

test('metrics count up once and reduced motion shows final values', async ({
  page,
}) => {
  await page.goto('/');
  const metric = page.locator('[data-metric="2015"]');
  const display = metric.locator('[data-metric-display]');
  await metric.scrollIntoViewIfNeeded();
  await expect(metric).toHaveAttribute('data-revealed', '');
  await expect(display).not.toHaveText('2015');
  await expect(display).toHaveText('2015');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await metric.scrollIntoViewIfNeeded();
  await expect(display).toHaveText('2015');
  await expect(metric).not.toHaveAttribute('data-revealed');
  await expect(page.locator('[data-scroll-progress]')).toBeHidden();
  await expect(page.locator('[data-hero-media]')).toHaveCSS(
    'transform',
    'none',
  );
});
