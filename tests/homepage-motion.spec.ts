import { test, expect } from '@playwright/test';

test('capability strip moves left and exposes all eight service links', async ({
  page,
}) => {
  await page.goto('/');
  const strip = page.getByRole('region', { name: 'Capabilities at Lakshya' });
  await strip.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(strip.getByRole('link')).toHaveCount(8);
  const track = strip.locator('[data-capability-track]');
  const x = () =>
    track.evaluate(
      (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
    );
  const initial = await x();
  await expect.poll(x).toBeLessThan(initial - 5);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => track.evaluate((el) => getComputedStyle(el).animationName))
    .toBe('none');
  await expect(strip.getByRole('link')).toHaveCount(8);
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
