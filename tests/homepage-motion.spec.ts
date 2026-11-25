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

test('AI placards connect enterprise knowledge to a reviewed support response', async ({
  page,
}) => {
  await page.goto('/#ai-in-motion');
  const section = page.locator('#ai-in-motion');
  const cards = section.getByRole('listitem');
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toContainText('Access guide');
  await cards.nth(1).scrollIntoViewIfNeeded();
  await expect(cards.nth(1)).toContainText('Restore access');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cards.first()).toHaveCSS('position', 'relative');
  await expect(cards.first().locator('[data-workflow-record]')).toHaveCSS(
    'transform',
    'none',
  );
  await section.getByRole('link', { name: 'Explore AI & data' }).click();
  await expect(page).toHaveURL(/ai-data\/$/);
});

test('hero draws its halftone screen behind the headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Software, AI & engineering.',
  );
  const canvas = page.locator('[data-hero-media] canvas');
  await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  await expect
    .poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.width))
    .toBeGreaterThan(0);
  await expect(page.locator('[data-hero] video')).toHaveCount(0);
});

test('the hero offers a project action and a route to expertise', async ({
  page,
}) => {
  await page.goto('/');
  const hero = page.locator('[data-hero]');
  await expect(hero.getByRole('button')).toHaveCount(0);
  await expect(hero.locator('iframe')).toHaveCount(0);
  await expect(hero.getByRole('link')).toHaveCount(2);
  await expect(
    hero.getByRole('link', { name: 'Discuss your project' }),
  ).toHaveAttribute('href', '/contact/');
  await expect(
    hero.getByRole('link', { name: 'Explore expertise' }),
  ).toHaveAttribute('href', '/services/');
});

test('hero console moves the journey focus with each practice tab', async ({
  page,
}) => {
  await page.goto('/');
  const panel = page.locator('[data-console]');
  const tabs = panel.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await tabs.filter({ hasText: 'AI & data' }).click();
  await expect(tabs.filter({ hasText: 'AI & data' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(panel.getByRole('tabpanel')).toContainText(
    'Enterprise knowledge & RAG',
  );
  await expect(panel.locator('[aria-current="step"]')).toHaveText('Plan');
  await page.keyboard.press('ArrowRight');
  await expect(tabs.filter({ hasText: 'Platforms' })).toBeFocused();
  await expect(panel.locator('[aria-current="step"]')).toHaveText('Deploy');
});

test('hero console lies flat once scrolled into view', async ({ page }) => {
  await page.goto('/');
  // Scroll only once the motion layer is live (it loads after hydration,
  // which a busy CI runner can take several seconds to finish).
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready', {
    timeout: 20000,
  });
  const panel = page.locator('[data-console]');
  // Bring the panel's top edge up to the upper fifth of the viewport.
  await panel.evaluate((element) =>
    window.scrollTo({
      top:
        element.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight * 0.15,
      behavior: 'instant',
    }),
  );
  await expect
    .poll(() =>
      panel.evaluate((element) => {
        const m = new DOMMatrix(getComputedStyle(element).transform);
        return Math.abs(m.m23) < 0.002 && Math.abs(m.a - 1) < 0.01;
      }),
    )
    .toBe(true);
});
