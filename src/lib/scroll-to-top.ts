import type Lenis from 'lenis';

declare global {
  interface Window {
    /** Set by smooth-scroll.tsx while inertial scrolling is active. */
    __lakshyaLenis?: Lenis;
  }
}

const easeInOutExpo = (t: number) =>
  t === 0
    ? 0
    : t === 1
      ? 1
      : t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;

/**
 * Returns to the top of the page: a long eased glide through Lenis when
 * inertial scrolling is on, the browser's smooth scroll otherwise, and an
 * instant jump for reduced motion. Focus moves to the logo link so the next
 * Tab continues from the top of the page, not from the footer.
 */
export function scrollToTop() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = window.__lakshyaLenis;
  const distance = window.scrollY;
  if (lenis && !reduce) {
    lenis.scrollTo(0, {
      duration: Math.min(2.2, 0.9 + distance / 9000),
      easing: easeInOutExpo,
      force: true,
    });
  } else {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
  document
    .querySelector<HTMLElement>('.site-header .brand')
    ?.focus({ preventScroll: true });
}
