'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Inertial scrolling for mouse-wheel users, the pattern behind most
 * award-winning editorial sites. Lenis drives the native scroll position
 * (sticky elements, find-in-page and anchors keep working) and every
 * ScrollTrigger is updated from the same GSAP ticker, so scrubbed scenes stay
 * in sync. Touch devices and reduced-motion visitors keep native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const query = matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let disposed = false;
    let stop: (() => void) | undefined;

    const start = async () => {
      stop?.();
      stop = undefined;
      if (!query.matches) return;
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
      if (disposed || !query.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--header-height',
          ),
        ) || 80;
      const lenis = new Lenis({
        lerp: 0.11,
        wheelMultiplier: 0.95,
        autoRaf: false,
        anchors: { offset: -(header + 17) },
        // Menus, maps and long drafts keep their own native wheel behaviour.
        prevent: (node) =>
          node.closest?.(
            '[data-lenis-prevent], .mega-menu, .nav.open, iframe, textarea',
          ) != null,
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.dataset.smoothScroll = '';
      window.__lakshyaLenis = lenis;
      stop = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        if (window.__lakshyaLenis === lenis) delete window.__lakshyaLenis;
        delete document.documentElement.dataset.smoothScroll;
      };
    };

    const refresh = () => {
      void start().catch(() => {
        // Native scrolling remains if the enhancement cannot load.
      });
    };
    refresh();
    query.addEventListener('change', refresh);
    return () => {
      disposed = true;
      query.removeEventListener('change', refresh);
      stop?.();
    };
  }, [pathname]);

  return null;
}
