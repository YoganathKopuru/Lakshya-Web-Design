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
    let lastTime = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let idle: ReturnType<typeof setTimeout>;
    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      clearTimeout(idle);
      delete node.dataset.active;
    };
    const render = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 50) : 16;
      lastTime = time;
      const blend = 1 - Math.exp(-elapsed / 48);
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      const settled = Math.hypot(targetX - x, targetY - y) < 0.2;
      if (settled) {
        x = targetX;
        y = targetY;
      }
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = settled ? 0 : requestAnimationFrame(render);
      if (settled) lastTime = 0;
    };
    const follow = (event: PointerEvent) => {
      if (!preference.matches || event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      clearTimeout(idle);
      if (node.dataset.active === undefined) {
        x = targetX;
        y = targetY;
        node.dataset.active = '';
      }
      if (!frame) frame = requestAnimationFrame(render);
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
