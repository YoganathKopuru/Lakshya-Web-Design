import { expect, test } from '@playwright/test';

test('Midnight is the default and a chosen theme persists', async ({
  page,
}) => {
  // Two full page loads plus a theme transition: allow for slow CI hosts.
  test.slow();
  await page.goto('/');
  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'midnight');
  // Each theme shows its own logo artwork, exactly one at a time.
  await expect(page.locator('.brand-logo-midnight')).toBeVisible();
  await expect(page.locator('.brand-logo-midnight')).toHaveAttribute(
    'src',
    '/logo.png',
  );
  await expect(page.locator('.brand-logo-clean')).toBeHidden();

  const themes = page.getByRole('radiogroup', { name: 'Colour theme' });
  await themes.getByRole('radio', { name: 'Clean theme' }).click();
  await expect(root).toHaveAttribute('data-theme', 'clean');
  await expect(page.locator('.brand-logo-clean')).toBeVisible();

  await page.reload();
  await expect(root).toHaveAttribute('data-theme', 'clean');
  const clean = themes.getByRole('radio', { name: 'Clean theme' });
  await expect(clean).toHaveAttribute('aria-checked', 'true');

  // Arrow keys move through the radio group and apply the theme.
  await clean.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(root).toHaveAttribute('data-theme', 'midnight');
  await expect(
    themes.getByRole('radio', { name: 'Midnight theme' }),
  ).toBeFocused();
});

test('back to top returns to the start and hands focus to the logo', async ({
  page,
}) => {
  await page.goto('/work/');
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  await page.getByRole('button', { name: 'Back to top' }).click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 8000 })
    .toBe(0);
  await expect(page.getByRole('link', { name: 'Lakshya home' })).toBeFocused();
});

test('headlines rise word by word and still read as one heading', async ({
  page,
}) => {
  await page.goto('/company/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toHaveText(
    /^Human ingenuity\.\s*Technical possibility\.$/,
  );
  const words = heading.locator('.curtain-word');
  await expect(words).toHaveCount(4);
  await expect(words.first().locator('span')).toHaveCSS(
    'animation-name',
    'curtain-up',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(words.first().locator('span')).toHaveCSS(
    'animation-name',
    'none',
  );
});

test('magnet lines answer the pointer in the field notes section', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'A fine pointer is required');
  await page.goto('/');
  const field = page.locator('#delivery canvas');
  await expect(field).toHaveCount(1);
  await field.scrollIntoViewIfNeeded();
  const fingerprint = () =>
    field.evaluate((canvas: HTMLCanvasElement) => {
      const data = canvas
        .getContext('2d')!
        .getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 16) sum += data[i];
      return sum;
    });
  const resting = await fingerprint();
  expect(resting).toBeGreaterThan(0);
  const box = (await page.locator('#delivery .section-head').boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.6, box.y + 10);
  await page.mouse.move(box.x + box.width * 0.62, box.y + 14);
  await expect.poll(fingerprint).not.toBe(resting);
});

test('the manifesto dial closes its ring once the statement is read', async ({
  page,
}) => {
  // Two full page loads: allow for slow CI hosts.
  test.slow();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const dial = page.locator('[data-stage]');
  await expect(dial).toHaveAttribute('data-stage', '0');
  await page.locator('[data-manifesto]').evaluate((statement) =>
    window.scrollTo({
      top:
        statement.getBoundingClientRect().bottom +
        window.scrollY -
        window.innerHeight * 0.3,
      behavior: 'instant',
    }),
  );
  await expect(dial).toHaveAttribute('data-stage', '3', { timeout: 8000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(dial).toHaveAttribute('data-stage', '3');
});
