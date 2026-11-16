'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('main');
    if (!root) return;

    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const update = async () => {
      cleanup?.();
      cleanup = undefined;
      if (preference.matches) return;
      const { startScrollMotion } = await import('./start-scroll-motion');
      if (!disposed && !preference.matches && !cleanup)
        cleanup = startScrollMotion(root);
    };
    const refresh = () => {
      void update().catch(() => {
        // Content is rendered in its final state if the enhancement cannot load.
      });
    };
    refresh();
    preference.addEventListener('change', refresh);
    return () => {
      disposed = true;
      cleanup?.();
      preference.removeEventListener('change', refresh);
    };
  }, [pathname]);

  return (
    <div
      className="page-scroll-progress"
      data-scroll-progress
      aria-hidden="true"
    />
  );
}
