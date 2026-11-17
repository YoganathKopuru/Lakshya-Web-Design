import { expect, test } from '@playwright/test';

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

test('metrics count up once and reduced motion shows final values', async ({
  page,
}) => {
  await page.goto('/');
  const metric = page.locator('[data-metric="2015"]');
  const display = metric.locator('[data-metric-display]');
  await metric.scrollIntoViewIfNeeded();
  await expect(metric).toHaveAttribute('data-revealed', '');
  await expect(display).not.toHaveText('2015');
  await expect(display).toHaveText('2015', { timeout: 10000 });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await metric.scrollIntoViewIfNeeded();
  await expect(display).toHaveText('2015');
  await expect(metric).not.toHaveAttribute('data-revealed');
  await expect(page.locator('[data-scroll-progress]')).toBeHidden();
  await expect(page.locator('video#intro-film')).toHaveCount(0);
  await expect(page.locator('[data-hero-media] img')).toHaveAttribute(
    'src',
    '/lakshya-intro.webp',
  );
  await expect(page.locator('[data-hero-media]')).toHaveCSS(
    'transform',
    'none',
  );
});
