'use client';

import { useEffect, useRef } from 'react';
import { currentTheme, observeTheme, type ThemeId } from '@/lib/theme';

/** Grid spacing, pointer reach, resting line length and easing per frame. */
const GAP = 34;
const REACH = 190;
const LENGTH = 9;
const STRETCH = 9;
const EASE = 0.12;
const REST = -Math.PI / 4;

type Palette = {
  rest: string;
  restAlpha: number;
  from: [number, number, number];
  to: [number, number, number];
  peakAlpha: number;
  glow: string;
};

const palettes: Record<ThemeId, Palette> = {
  midnight: {
    rest: '#8e9bff',
    restAlpha: 0.17,
    from: [142, 155, 255],
    to: [70, 211, 179],
    peakAlpha: 0.95,
    glow: 'rgba(70, 211, 179, 0.075)',
  },
  clean: {
    rest: '#0f0c59',
    restAlpha: 0.13,
    from: [47, 85, 216],
    to: [10, 119, 106],
    peakAlpha: 0.85,
    glow: 'rgba(47, 85, 216, 0.05)',
  },
};

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Magnet lines: a field of short strokes that turn to face the pointer and
 * brighten as it comes near, then drift back to rest when it leaves. It
 * sits behind the section's cards (pointer-events: none), draws only while
 * something is moving, pauses offscreen, and stays a still pattern on touch
 * screens and for reduced motion.
 */
export function MagnetField({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    const host = element?.closest('section');
    if (!element || !context || !host) return;

    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
    let palette = palettes[currentTheme()];
    let shades: string[] = [];
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let originX = 0;
    let originY = 0;
    let angles = new Float32Array(0);
    let powers = new Float32Array(0);
    let fade: CanvasGradient | null = null;
    let frame = 0;
    let last = 0;
    let visible = false;

    const buildShades = () => {
      shades = Array.from({ length: 17 }, (_, step) => {
        const t = step / 16;
        const [r, g, b] = palette.from.map((value, channel) =>
          Math.round(value + (palette.to[channel] - value) * t),
        );
        return `rgb(${r}, ${g}, ${b})`;
      });
    };

    const layout = () => {
      const box = element.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cols = Math.max(1, Math.ceil(width / GAP));
      rows = Math.max(1, Math.ceil(height / GAP));
      originX = (width - (cols - 1) * GAP) / 2;
      originY = (height - (rows - 1) * GAP) / 2;
      angles = new Float32Array(cols * rows).fill(REST);
      powers = new Float32Array(cols * rows);
      fade = context.createLinearGradient(0, 0, 0, height);
      fade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      fade.addColorStop(0.14, 'rgba(0, 0, 0, 1)');
      fade.addColorStop(0.86, 'rgba(0, 0, 0, 1)');
      fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
    };

    /** Draws one frame; returns true while any line is still settling. */
    const draw = (elapsed: number) => {
      const blend = 1 - Math.pow(1 - EASE, elapsed / 16.67);
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, blend * 2.2);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, blend * 2.2);
      context.clearRect(0, 0, width, height);

      if (pointer.inside) {
        const glow = context.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          REACH * 1.3,
        );
        glow.addColorStop(0, palette.glow);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);
      }

      context.lineCap = 'round';
      context.lineWidth = 1.25;
      let moving = false;
      const resting = new Path2D();
      const restX = (Math.cos(REST) * LENGTH) / 2;
      const restY = (Math.sin(REST) * LENGTH) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          const x = originX + col * GAP;
          const y = originY + row * GAP;
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const distance = Math.hypot(dx, dy);
          const pull =
            pointer.inside && distance < REACH
              ? smooth(1 - distance / REACH)
              : 0;
          const target = pull > 0 ? Math.atan2(dy, dx) : REST;
          // A stroke looks the same turned half a circle, so rotate the
          // short way round on a 180° period.
          let turn = (target - angles[index]) % Math.PI;
          if (turn > Math.PI / 2) turn -= Math.PI;
          if (turn < -Math.PI / 2) turn += Math.PI;
          angles[index] += turn * blend;
          powers[index] += (pull - powers[index]) * blend;
          const power = powers[index];
          if (Math.abs(turn) > 0.003 || Math.abs(pull - power) > 0.003)
            moving = true;

          if (power < 0.02 && Math.abs(turn) < 0.003) {
            resting.moveTo(x - restX, y - restY);
            resting.lineTo(x + restX, y + restY);
            continue;
          }
          const half = (LENGTH + power * STRETCH) / 2;
          const cos = Math.cos(angles[index]) * half;
          const sin = Math.sin(angles[index]) * half;
          context.globalAlpha =
            palette.restAlpha + power * (palette.peakAlpha - palette.restAlpha);
          context.strokeStyle = shades[Math.round(power * 16)];
          context.beginPath();
          context.moveTo(x - cos, y - sin);
          context.lineTo(x + cos, y + sin);
          context.stroke();
        }
      }
      context.globalAlpha = palette.restAlpha;
      context.strokeStyle = palette.rest;
      context.stroke(resting);
      context.globalAlpha = 1;
      // Fade the field out at its top and bottom edges on the canvas itself
      // (a CSS mask would cost a compositing pass on every frame).
      if (fade) {
        context.globalCompositeOperation = 'destination-in';
        context.fillStyle = fade;
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = 'source-over';
      }
      return moving;
    };

    const tick = (time: number) => {
      const elapsed = last ? Math.min(64, time - last) : 16.67;
      last = time;
      const moving = draw(elapsed);
      frame = moving || pointer.inside ? requestAnimationFrame(tick) : 0;
      if (!frame) last = 0;
    };

    const wake = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    };

    // Mouse and pen drive the field; a finger dragging the page does not.
    const move = (event: PointerEvent) => {
      if (still.matches || event.pointerType === 'touch') return;
      const box = element.getBoundingClientRect();
      pointer.tx = event.clientX - box.left;
      pointer.ty = event.clientY - box.top;
      if (!pointer.inside) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.inside = true;
      }
      wake();
    };
    const leave = () => {
      pointer.inside = false;
      wake();
    };

    const redraw = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      draw(1000);
    };

    const sizeObserver = new ResizeObserver(() => {
      layout();
      redraw();
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    });
    const stopTheme = observeTheme((theme) => {
      palette = palettes[theme];
      buildShades();
      redraw();
    });

    buildShades();
    layout();
    redraw();
    sizeObserver.observe(element);
    viewObserver.observe(element);
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    still.addEventListener('change', leave);

    return () => {
      cancelAnimationFrame(frame);
      stopTheme();
      sizeObserver.disconnect();
      viewObserver.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      still.removeEventListener('change', leave);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
