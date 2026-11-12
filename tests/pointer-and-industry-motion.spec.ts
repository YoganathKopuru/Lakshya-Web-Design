import { expect, test } from '@playwright/test';

test('cursor signal follows a mouse and respects reduced motion', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'A fine pointer is required');
  await page.goto('/industries/');
  const signal = page.locator('.cursor-signal');
  await page.mouse.move(160, 180);
  await expect(signal).toHaveAttribute('data-active', '');
  await expect(signal).toHaveAttribute('style', /translate3d\(160px, 180px/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(signal).toBeHidden();
});

test('industry cards show video in view and posters in reduced motion', async ({
  page,
}) => {
  await page.goto('/industries/');
  const card = page.locator('.industry-card').first();
  await card.scrollIntoViewIfNeeded();
  const video = card.locator('video');
  await expect(video).toHaveAttribute('src', '/industry-factory.mp4');
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('loop', true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(video).toHaveCount(0);
  await expect(card.locator('img')).toHaveAttribute(
    'src',
    '/industry-factory.webp',
  );
});
