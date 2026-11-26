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
  // Bring the section heading (inside the field) into view: the canvas is
  // taller than the screen, so scrolling to it can leave the heading out.
  const head = page.locator('#delivery .section-head');
  await head.scrollIntoViewIfNeeded();
  const fingerprint = () =>
    field.evaluate((canvas: HTMLCanvasElement) => {
      const data = canvas
        .getContext('2d')!
        .getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 16) sum += data[i];
      return sum;
    });
  await expect.poll(fingerprint).toBeGreaterThan(0);
  const resting = await fingerprint();
  const box = (await head.boundingBox())!;
  // A few steps across the heading, so the field sees a moving pointer.
  for (const step of [0.5, 0.55, 0.6, 0.65])
    await page.mouse.move(box.x + box.width * step, box.y + box.height / 2);
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

test('the film stays hidden between the words at both ends of its scroll', async ({
  page,
}) => {
  test.slow();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready', {
    timeout: 20000,
  });
  const film = page.locator('[data-film]');
  const scene = () =>
    film.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        reveal: parseFloat(style.getPropertyValue('--reveal')),
        grow: parseFloat(style.getPropertyValue('--grow')),
        showing: element.hasAttribute('data-showing'),
      };
    });
  // Scrolls to a point along the film's runway (0 start, 1 end).
  const scrollAlong = (at: number) =>
    film.evaluate(
      (element: HTMLElement, at) =>
        window.scrollTo({
          top:
            element.offsetTop +
            (element.offsetHeight - window.innerHeight) * at,
          behavior: 'instant',
        }),
      at,
    );
  const hidden = { reveal: 0, grow: 0, showing: false };
  await expect(film.getByRole('heading', { level: 2 })).toHaveText(
    'Technology, with purpose.',
  );
  // Arriving from above, the line comes first and the film is hidden.
  await scrollAlong(0);
  await expect.poll(scene, { timeout: 10000 }).toEqual(hidden);
  // Mid-runway the frame is fully open.
  await scrollAlong(0.5);
  await expect
    .poll(scene, { timeout: 10000 })
    .toEqual({ reveal: 1, grow: 1, showing: true });
  // At the far end it has closed back into the line, so arriving from
  // below (scrolling back up) the line comes first as well.
  await scrollAlong(1);
  await expect.poll(scene, { timeout: 10000 }).toEqual(hidden);
  // A little way back up, the words have parted around a capsule of film.
  await scrollAlong(0.8);
  await expect
    .poll(async () => (await scene()).reveal, { timeout: 10000 })
    .toBeGreaterThan(0.7);
  expect((await scene()).grow).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(film.locator('video')).toHaveCount(0);
  await expect.poll(scene).toEqual({ reveal: 1, grow: 1, showing: false });
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

test('inner heroes carry their own line art in both themes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The line art steps aside on phones');
  await page.goto('/why-lakshya/');
  const art = page.locator('.signal-art');
  await expect(art).toHaveAttribute('data-signal-art', 'converge');
  await expect(art).toBeVisible();
  await page.getByRole('radio', { name: 'Clean theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'clean');
  await expect(art).toBeVisible();
  // The card keeps its own indigo sky: the page's light wash, which would
  // paint over it inside the card's layer, stays out.
  const card = page.locator('.story-hero');
  await expect(card).toHaveCSS('isolation', 'isolate');
  expect(
    await card.evaluate(
      (element) => getComputedStyle(element, '::before').display,
    ),
  ).toBe('none');
});
