import { test, expect } from '@playwright/test';

test('journey stages disclose useful detail with keyboard and pointer', async ({
  page,
}) => {
  await page.goto('/#approach');
  const stage = page.locator('#approach details').first();
  const summary = stage.locator('summary');
  await summary.focus();
  await expect(stage).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(stage).toHaveAttribute('open', '');
  await expect(
    stage.getByText(
      'Agree on the problem, stakeholders and what success should look like.',
    ),
  ).toBeVisible();
  await summary.click();
  await expect(stage).not.toHaveAttribute('open', '');
});

test('journey connectors follow the stage order at each layout breakpoint', async ({
  page,
}) => {
  await page.goto('/#approach');
  const stages = page.locator('#approach ol > li');
  for (const [width, expected] of [
    [600, '↓↓↓↓↓↓'],
    [601, '→↓←↓→↓'],
    [850, '→↓←↓→↓'],
    [851, '→→→↓←←'],
    [1149, '→→→↓←←'],
    [1150, '→→→→→→'],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        stages.evaluateAll((items) =>
          items
            .slice(0, -1)
            .map((item) =>
              getComputedStyle(item, '::after').content.slice(1, -1),
            )
            .join(''),
        ),
      )
      .toBe(expected);
  }
});

test('client logos remain browsable without playback controls', async ({
  page,
  hasTouch,
}) => {
  await page.goto('/');
  const wall = page.locator('[aria-label="Client showcase"]');
  await wall.scrollIntoViewIfNeeded();
  await expect(wall.getByRole('img')).toHaveCount(9);
  const names = wall.getByRole('img');
  await expect(names.last()).toHaveAttribute(
    'src',
    '/images/clients/white/synopsys.png',
  );
  expect(
    await names.evaluateAll((images) =>
      images.every(
        (image) =>
          image instanceof HTMLImageElement &&
          image.complete &&
          image.naturalWidth > 0 &&
          image.src.endsWith('.png'),
      ),
    ),
  ).toBe(true);
  const track = wall.locator(':scope > div');
  expect(await wall.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(
    true,
  );
  await expect(page.getByRole('button', { name: /logo strip/i })).toHaveCount(
    0,
  );
  if (hasTouch) {
    await expect(track).toHaveCSS('animation-name', 'none');
    await expect(wall).toHaveCSS('overflow-x', 'auto');
  } else {
    await expect(track).toHaveCSS('animation-iteration-count', 'infinite');
    await wall.hover();
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    await page
      .getByRole('link', { name: /explore our quality framework/i })
      .focus();
    await page.keyboard.press('Shift+Tab');
    await expect(wall).toBeFocused();
    await expect(track).toHaveCSS('animation-name', 'none');
    await expect(wall).toHaveCSS('overflow-x', 'auto');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(track).toHaveCSS('animation-name', 'none');
  await expect(wall.getByRole('list')).toHaveCSS('display', 'grid');
});
test('audience routes are visible and keyboard accessible', async ({
  page,
}) => {
  await page.goto('/why-lakshya/');
  const routes = page.locator('.audience-route');
  await expect(routes).toHaveCount(4);
  const careers = routes.nth(1).getByRole('link', { name: 'Explore careers' });
  await careers.focus();
  await expect(careers).toBeFocused();
  await careers.press('Enter');
  await expect(page).toHaveURL(/\/careers\/$/);
});
