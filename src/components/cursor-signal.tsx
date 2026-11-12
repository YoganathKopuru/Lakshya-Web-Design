'use client';

import { useEffect, useRef } from 'react';

export function CursorSignal() {
  const signal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = signal.current;
    if (!node) return;
    const preference = matchMedia(
      '(any-pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let frame = 0;
    let idle: ReturnType<typeof setTimeout>;
    const hide = () => {
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      delete node.dataset.active;
    };
    const follow = (event: PointerEvent) => {
      if (!preference.matches || event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      frame = requestAnimationFrame(() => {
        node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        node.dataset.active = '';
      });
      idle = setTimeout(hide, 550);
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('pointerout', leave);
    window.addEventListener('blur', hide);
    preference.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', hide);
      preference.removeEventListener('change', hide);
    };
  }, []);

  return <div ref={signal} className="cursor-signal" aria-hidden="true" />;
}
