import { expect, test } from '@playwright/test';

test('hero zooms with scroll and editorial cards reveal in view', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready', {
    timeout: 20000,
  });
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
  const metric = page.locator('[data-metric="350+"]');
  const display = metric.locator('[data-metric-display]');
  const year = page.locator('[data-metric="2015"] [data-metric-display]');
  // Record every value the counter shows, so a busy machine cannot race past
  // the intermediate frames before the assertion looks.
  await display.evaluate((element) => {
    const seen = new Set<string>();
    (window as unknown as { __seen: Set<string> }).__seen = seen;
    new MutationObserver(() => seen.add(element.textContent ?? '')).observe(
      element,
      { childList: true, characterData: true, subtree: true },
    );
  });
  await metric.scrollIntoViewIfNeeded();
  await expect(metric).toHaveAttribute('data-revealed', '');
  await expect(display).toHaveText('350+', { timeout: 10000 });
  const seen = await page.evaluate(() => [
    ...(window as unknown as { __seen: Set<string> }).__seen,
  ]);
  expect(seen.some((value) => value !== '350+')).toBe(true);
  // The founding year is a date: it fades in rather than counting up.
  await expect(year).toHaveText('2015');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await metric.scrollIntoViewIfNeeded();
  await expect(display).toHaveText('350+');
  await expect(metric).not.toHaveAttribute('data-revealed');
  await expect(page.locator('[data-scroll-progress]')).toBeHidden();
  await expect(page.locator('[data-hero-media] canvas')).toBeAttached();
  await expect(page.locator('[data-hero-media]')).toHaveCSS(
    'transform',
    'none',
  );
  await expect(page.locator('[data-console]')).toHaveCSS('transform', 'none');
});
