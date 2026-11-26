'use client';

import { useEffect, useRef } from 'react';
import { currentTheme, observeTheme, type ThemeId } from '@/lib/theme';
import { isLite, LITE_EVENT } from './motion-governor';

/** Left, middle and right of each theme's dot spectrum. */
const SPECTRA: Record<ThemeId, [string, string, string]> = {
  midnight: [
    'rgba(120, 132, 255, 0.78)',
    'rgba(150, 178, 255, 0.62)',
    'rgba(70, 211, 179, 0.8)',
  ],
  clean: [
    'rgba(186, 194, 255, 0.76)',
    'rgba(226, 234, 255, 0.64)',
    'rgba(158, 230, 211, 0.82)',
  ],
};

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
      spectrum = '';
    };

    // The dots carry the logo spectrum, indigo on the left to teal on the
    // right: deep tones on Midnight's night sky, pale tints that read on
    // Clean's blue one.
    let spectrum: CanvasGradient | '' = '';
    let spectrumTheme = '';
    const paint = () => {
      const theme = currentTheme();
      if (!spectrum || spectrumTheme !== theme) {
        const stops = SPECTRA[theme];
        spectrum = context.createLinearGradient(0, 0, width, 0);
        spectrum.addColorStop(0, stops[0]);
        spectrum.addColorStop(0.5, stops[1]);
        spectrum.addColorStop(1, stops[2]);
        spectrumTheme = theme;
      }
      return spectrum;
    };

    const draw = (time: number) => {
      const t = time / 1000;
      context.clearRect(0, 0, width, height);
      context.fillStyle = paint();
      context.beginPath();
      const maxRadius = gap * 0.34;
      const originX = width / 2;
      const originY = height * 1.02;
      // Clean fades the dots where its sky turns light; Midnight's sky stays
      // dark to the edge, so the dots dissolve over a longer distance.
      const night = currentTheme() === 'midnight';
      const fadeFrom = night ? 0.66 : 0.8;
      const fadeTo = night ? 0.99 : 0.97;
      for (let y = gap / 2; y < height; y += gap) {
        const ny = y / height;
        // Rise through the middle, fade out towards the bottom edge.
        const band =
          smooth(0.12, 0.62, ny) * (1 - smooth(fadeFrom, fadeTo, ny));
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

    // Frame budget: 40 fps normally; a device that needs more than ~12 ms to
    // draw a frame drops to ~15 fps so the screen never crowds out the page.
    let interval = 25;
    let cost = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < interval) return;
      last = time;
      // The swell around the pointer eases away after it leaves.
      if (!pointer.active)
        pointer.strength = Math.max(0, pointer.strength - 0.05);
      const began = performance.now();
      draw(time);
      const spent = performance.now() - began;
      cost = cost ? cost * 0.85 + spent * 0.15 : spent;
      if (cost > 12) interval = 66;
    };

    // Reduced motion and lite mode (motion-governor.tsx) keep a still frame.
    const calm = () => still.matches || isLite();

    const start = () => {
      cancelAnimationFrame(frame);
      if (calm()) {
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
      if (calm()) draw(2600);
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
    const stopTheme = observeTheme(() => {
      if (calm()) draw(2600);
    });
    window.addEventListener(LITE_EVENT, start);
    start();

    return () => {
      window.removeEventListener(LITE_EVENT, start);
      stopTheme();
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
