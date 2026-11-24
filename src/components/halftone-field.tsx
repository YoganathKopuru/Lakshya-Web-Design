'use client';

import { useEffect, useRef } from 'react';

/**
 * A halftone dot screen for the hero. Every dot sits on a fixed grid and only
 * its radius changes: dots swell toward the lower half and the edges, stay
 * quiet behind the headline, and a slow ripple rises from the console below.
 * The pointer lifts the dots around it. One path and one fill per frame,
 * capped at 40 fps, paused offscreen or in a hidden tab, drawn once (static)
 * for reduced motion.
 */
export function HalftoneField({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;

    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0, strength: 0, active: false };
    let width = 0;
    let height = 0;
    let gap = 11;
    let frame = 0;
    let last = 0;
    let visible = true;

    const smooth = (a: number, b: number, v: number) => {
      const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    const resize = () => {
      const box = element.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      gap = width < 700 ? 9 : 11;
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      const t = time / 1000;
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(232, 238, 255, 0.62)';
      context.beginPath();
      const maxRadius = gap * 0.34;
      const originX = width / 2;
      const originY = height * 1.02;
      for (let y = gap / 2; y < height; y += gap) {
        const ny = y / height;
        // Rise through the middle, fade out where the backdrop turns light.
        const band = smooth(0.12, 0.62, ny) * (1 - smooth(0.8, 0.97, ny));
        if (band < 0.02) continue;
        for (let x = gap / 2; x < width; x += gap) {
          const nx = (x - originX) / width;
          // Keep a calm pocket behind the headline.
          const pocket =
            1 -
            0.78 * Math.exp(-(nx * nx) / 0.045) * (1 - smooth(0.5, 0.72, ny));
          const dx = x - originX;
          const dy = y - originY;
          const ripple =
            0.5 + 0.5 * Math.sin(Math.hypot(dx, dy) * 0.03 - t * 1.4);
          let lift = 0;
          if (pointer.strength > 0) {
            const reach = Math.hypot(x - pointer.x, y - pointer.y);
            if (reach < 150) lift = (1 - reach / 150) * 0.7 * pointer.strength;
          }
          const radius =
            maxRadius * band * pocket * (0.45 + 0.55 * ripple + lift);
          if (radius < 0.3) continue;
          context.moveTo(x + radius, y);
          context.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      context.fill();
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < 25) return;
      last = time;
      // The swell around the pointer eases away after it leaves.
      if (!pointer.active)
        pointer.strength = Math.max(0, pointer.strength - 0.05);
      draw(time);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (still.matches) {
        draw(2600);
        return;
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const host = element.parentElement ?? element;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const box = element.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.strength = 1;
      pointer.active = true;
    };
    const leave = () => {
      pointer.active = false;
    };

    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (still.matches) draw(2600);
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    resize();
    sizeObserver.observe(element);
    viewObserver.observe(element);
    host.closest('section')?.addEventListener('pointermove', move, {
      passive: true,
    });
    host.closest('section')?.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', start);
    still.addEventListener('change', start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      viewObserver.disconnect();
      host.closest('section')?.removeEventListener('pointermove', move);
      host.closest('section')?.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', start);
      still.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
