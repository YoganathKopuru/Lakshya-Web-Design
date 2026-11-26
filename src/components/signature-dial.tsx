'use client';

import { useEffect, useRef } from 'react';
import { currentTheme, observeTheme, type ThemeId } from '@/lib/theme';
import styles from './manifesto.module.css';

/** Three arcs, one per discipline, that close into a single ring. */
const STAGES = ['Software', 'AI', 'Engineering', 'Together.'] as const;
const TICKS = 120;
const GAP_TICKS = 2;

type Palette = {
  idle: string;
  stops: Array<[number, number, number]>;
  glow: string;
  spark: [number, number, number];
};

const palettes: Record<ThemeId, Palette> = {
  midnight: {
    idle: 'rgba(255, 255, 255, 0.09)',
    stops: [
      [111, 123, 255],
      [47, 143, 216],
      [70, 211, 179],
    ],
    glow: 'rgba(70, 211, 179, 0.35)',
    spark: [158, 230, 211],
  },
  clean: {
    idle: 'rgba(15, 12, 89, 0.1)',
    stops: [
      [26, 42, 156],
      [47, 85, 216],
      [10, 119, 106],
    ],
    glow: 'rgba(47, 85, 216, 0.22)',
    spark: [10, 119, 106],
  },
};

type Spark = { x: number; y: number; vx: number; vy: number; life: number };

function colourAt(palette: Palette, t: number, alpha: number) {
  const scaled = Math.min(0.999, Math.max(0, t)) * (palette.stops.length - 1);
  const index = Math.floor(scaled);
  const local = scaled - index;
  const [r, g, b] = palette.stops[index].map((value, channel) =>
    Math.round(value + (palette.stops[index + 1][channel] - value) * local),
  );
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * The manifesto's dial (inspired by scroll-driven gauges on editorial
 * health sites): as the statement lights up word by word, three arcs —
 * software, AI, engineering — fill in step with it and close into one ring
 * at "together". The centre names the arc being drawn. Decorative only
 * (aria-hidden); the statement itself carries the meaning. Reduced motion
 * shows the closed ring.
 */
export function SignatureDial() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = root.current;
    const element = canvas.current;
    const context = element?.getContext('2d');
    const statement = host
      ?.closest('section')
      ?.querySelector<HTMLElement>('[data-manifesto]');
    if (!host || !element || !context || !statement) return;

    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let palette = palettes[currentTheme()];
    let size = 0;
    let target = 0;
    let shown = 0;
    let frame = 0;
    let last = 0;
    let visible = false;
    const sparks: Spark[] = [];

    const resize = () => {
      const box = element.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      size = box.width;
      element.width = Math.round(size * ratio);
      element.height = Math.round(size * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    // Same window as the statement's word-by-word light (start-scroll-motion:
    // from its top at 82 % of the viewport to its bottom at 48 %).
    const measure = () => {
      const box = statement.getBoundingClientRect();
      const height = window.innerHeight;
      const progress = (height * 0.82 - box.top) / (height * 0.34 + box.height);
      return Math.min(1, Math.max(0, progress));
    };

    const setStage = (progress: number) => {
      const stage =
        progress >= 0.985 ? 3 : Math.min(2, Math.floor(progress * 3));
      if (host.dataset.stage !== String(stage))
        host.dataset.stage = String(stage);
    };

    const draw = () => {
      const centre = size / 2;
      const radius = size * 0.4;
      context.clearRect(0, 0, size, size);
      const lit = shown * TICKS;
      const head = Math.min(TICKS - 0.001, lit);
      context.lineCap = 'round';

      for (let tick = 0; tick < TICKS; tick++) {
        // Leave a small gap where one discipline's arc meets the next.
        const inGap = tick % (TICKS / 3) >= TICKS / 3 - GAP_TICKS;
        if (inGap && shown < 0.985) continue;
        const angle = -Math.PI / 2 + (tick / TICKS) * Math.PI * 2;
        const on = tick < lit;
        const near = on ? Math.exp(-((head - tick) ** 2) / 10) : 0;
        const inner = radius - 9 - near * 5;
        const outer = radius + 9 + near * 9;
        context.strokeStyle = on
          ? colourAt(palette, tick / TICKS, 0.55 + near * 0.45)
          : palette.idle;
        context.lineWidth = on ? 1.6 + near * 0.8 : 1.2;
        context.beginPath();
        context.moveTo(
          centre + Math.cos(angle) * inner,
          centre + Math.sin(angle) * inner,
        );
        context.lineTo(
          centre + Math.cos(angle) * outer,
          centre + Math.sin(angle) * outer,
        );
        context.stroke();
      }

      if (shown > 0.002 && shown < 0.999) {
        const angle = -Math.PI / 2 + (head / TICKS) * Math.PI * 2;
        const x = centre + Math.cos(angle) * radius;
        const y = centre + Math.sin(angle) * radius;
        const glow = context.createRadialGradient(x, y, 0, x, y, 46);
        glow.addColorStop(0, palette.glow);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = glow;
        context.fillRect(x - 46, y - 46, 92, 92);
      }

      const [r, g, b] = palette.spark;
      for (const spark of sparks) {
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${spark.life * 0.85})`;
        context.beginPath();
        context.arc(spark.x, spark.y, 0.6 + spark.life * 1.1, 0, Math.PI * 2);
        context.fill();
      }
    };

    const shed = (amount: number) => {
      const centre = size / 2;
      const radius = size * 0.4;
      const angle = -Math.PI / 2 + shown * Math.PI * 2;
      for (let i = 0; i < amount; i++) {
        const spread = (Math.random() - 0.5) * 0.12;
        const outward = 0.25 + Math.random() * 0.9;
        const along = (Math.random() - 0.3) * 0.7;
        sparks.push({
          x:
            centre +
            Math.cos(angle + spread) * (radius + (Math.random() - 0.5) * 16),
          y:
            centre +
            Math.sin(angle + spread) * (radius + (Math.random() - 0.5) * 16),
          vx: Math.cos(angle) * outward - Math.sin(angle) * along,
          vy: Math.sin(angle) * outward + Math.cos(angle) * along,
          life: 1,
        });
      }
      if (sparks.length > 140) sparks.splice(0, sparks.length - 140);
    };

    const tick = (time: number) => {
      const elapsed = last ? Math.min(64, time - last) : 16.67;
      last = time;
      const before = shown;
      shown += (target - shown) * (1 - Math.pow(0.86, elapsed / 16.67));
      if (Math.abs(target - shown) < 0.0005) shown = target;
      const travel = Math.abs(shown - before);
      if (travel > 0.0004 && shown < 0.995)
        shed(Math.min(6, Math.ceil(travel * 900)));
      for (const spark of sparks) {
        spark.x += spark.vx * (elapsed / 16.67);
        spark.y += spark.vy * (elapsed / 16.67);
        spark.life -= elapsed / 900;
      }
      for (let i = sparks.length - 1; i >= 0; i--)
        if (sparks[i].life <= 0) sparks.splice(i, 1);
      draw();
      const busy = shown !== target || sparks.length > 0;
      frame = busy && visible ? requestAnimationFrame(tick) : 0;
      if (!frame) last = 0;
    };

    // The centre names where the reader is (the scroll position); the ring
    // eases after it.
    const wake = () => {
      if (still.matches) return;
      target = measure();
      setStage(target);
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const settle = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      sparks.length = 0;
      shown = target = still.matches ? 1 : measure();
      setStage(shown);
      draw();
    };

    const sizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    const stopTheme = observeTheme((theme) => {
      palette = palettes[theme];
      draw();
    });

    resize();
    settle();
    sizeObserver.observe(element);
    viewObserver.observe(host);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake, { passive: true });
    still.addEventListener('change', settle);

    return () => {
      cancelAnimationFrame(frame);
      stopTheme();
      sizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      still.removeEventListener('change', settle);
    };
  }, []);

  return (
    <div ref={root} className={styles.dial} aria-hidden="true" data-stage="0">
      <canvas ref={canvas} />
      <div className={styles.dialCore}>
        <span className={styles.dialStep}>
          {STAGES.map((stage, index) => (
            <span key={stage} data-step={index}>
              {index < 3 ? `0${index + 1} / 03` : 'One partner'}
            </span>
          ))}
        </span>
        <span className={styles.dialWord}>
          {STAGES.map((stage, index) => (
            <span key={stage} data-step={index}>
              {stage}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
