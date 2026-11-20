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

test('AI signals remain on their rails as they move, without a pause control', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('#ai-in-motion');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('button')).toHaveCount(0);
  await expect(section.locator('[data-motion]')).toHaveAttribute(
    'data-motion',
    'running',
  );
  const positions = () =>
    section.locator('[data-orbit]').evaluateAll((orbits) =>
      orbits.map((orbit) => {
        const rail = orbit.querySelector('[data-orbit-path]') as SVGPathElement;
        const signal = orbit.querySelector(
          '[data-orbit-signal]',
        ) as SVGGElement;
        const dot = new DOMPoint(0, 0).matrixTransform(signal.getScreenCTM()!);
        const matrix = rail.getScreenCTM()!;
        const length = rail.getTotalLength();
        let distance = Infinity;
        for (let i = 0; i <= 600; i++) {
          const p = rail
            .getPointAtLength((length * i) / 600)
            .matrixTransform(matrix);
          distance = Math.min(distance, Math.hypot(p.x - dot.x, p.y - dot.y));
        }
        return { x: dot.x, y: dot.y, distance };
      }),
    );
  const start = await positions();
  for (const dot of start) expect(dot.distance).toBeLessThan(2);
  await expect
    .poll(async () => {
      const current = await positions();
      return Math.min(
        ...current.map((dot, i) =>
          Math.hypot(dot.x - start[i].x, dot.y - start[i].y),
        ),
      );
    })
    .toBeGreaterThan(5);
  for (const dot of await positions()) expect(dot.distance).toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(section.locator('[data-motion]')).toHaveAttribute(
    'data-motion',
    'resting',
  );
  await expect(section.locator('animateMotion')).toHaveCount(0);
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
