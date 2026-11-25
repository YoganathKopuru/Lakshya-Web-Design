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
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready', {
    timeout: 20000,
  });
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

test('the custom cursor replaces the arrow and names card actions', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'A fine pointer is required');
  await page.goto('/#expertise');
  const ring = page.locator('.cursor-signal');
  const card = page.locator('#expertise a[data-cursor="Explore"]').first();
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  await expect
    .poll(async () => {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.move(box.x + box.width / 2 + 3, box.y + box.height / 2);
      return page.locator('html').getAttribute('data-cursor-ready');
    })
    .toBe('');
  await expect(page.locator('.cursor-dot')).toHaveAttribute('data-active', '');
  await expect(ring).toHaveAttribute('data-label', '');
  await expect(ring.locator('.cursor-label')).toHaveText('Explore');
  await expect(page.locator('body')).toHaveCSS('cursor', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveAttribute('data-cursor-ready');
});

test('the film aperture opens with scroll and closes on the way back', async ({
  page,
}) => {
  test.slow();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready', {
    timeout: 20000,
  });
  const film = page.locator('[data-film]');
  const open = () =>
    film.evaluate(
      (element) =>
        parseFloat(getComputedStyle(element).getPropertyValue('--open')) || 0,
    );
  await expect(film.getByRole('heading', { level: 2 })).toHaveText(
    'Technology, with purpose.',
  );
  await film.evaluate((element: HTMLElement) =>
    window.scrollTo({
      top:
        element.offsetTop + (element.offsetHeight - window.innerHeight) * 0.95,
      behavior: 'instant',
    }),
  );
  await expect.poll(open, { timeout: 10000 }).toBeGreaterThan(0.98);
  await film.evaluate((element: HTMLElement) =>
    window.scrollTo({
      top: element.offsetTop - window.innerHeight,
      behavior: 'instant',
    }),
  );
  await expect.poll(open, { timeout: 10000 }).toBeLessThan(0.02);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(film.locator('video')).toHaveCount(0);
  await expect.poll(open).toBe(1);
});

test('content reveals again when scrolling back up', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready', {
    timeout: 20000,
  });
  const card = page.locator('#delivery [data-reveal]').first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS('opacity', '1');
  // Well past it, it resets above the viewport...
  await card.evaluate((element) =>
    window.scrollTo({
      top:
        element.getBoundingClientRect().bottom +
        window.scrollY +
        window.innerHeight,
      behavior: 'instant',
    }),
  );
  await expect(card).toHaveCSS('opacity', '0');
  // ...and drops back in when the page scrolls up to it again.
  await card.evaluate((element) =>
    window.scrollTo({
      top:
        element.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight * 0.3,
      behavior: 'instant',
    }),
  );
  await expect(card).toHaveCSS('opacity', '1');
});

test('inner heroes carry their own line art in Midnight only', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The line art steps aside on phones');
  await page.goto('/why-lakshya/');
  const art = page.locator('.signal-art');
  await expect(art).toHaveAttribute('data-signal-art', 'converge');
  await expect(art).toBeVisible();
  await page.getByRole('radio', { name: 'Clean theme' }).click();
  await expect(art).toBeHidden();
});
