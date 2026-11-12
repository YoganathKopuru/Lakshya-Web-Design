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

test('client logo loop exposes each brand once and respects reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  const wall = page.locator('[aria-label="Client showcase"]');
  await wall.scrollIntoViewIfNeeded();
  await expect(wall.getByRole('img')).toHaveCount(8);
  const track = wall.locator(':scope > div');
  await expect(track).toHaveCSS('animation-timing-function', 'linear');
  await expect(track).toHaveCSS('animation-iteration-count', 'infinite');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(track).toHaveCSS('animation-name', 'none');
});
test('audience cards expand on pointer and keyboard', async ({
  page,
  isMobile,
}) => {
  await page.goto('/why-lakshya/');
  const cards = page.locator('.audience-card');
  if (!isMobile) {
    await cards.first().hover();
    await expect(cards.first()).toHaveAttribute('open', '');
  }
  const summary = cards.nth(1).locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(cards.nth(1)).toHaveAttribute('open', '');
  await expect(cards.nth(1).getByRole('link')).toBeVisible();
});
