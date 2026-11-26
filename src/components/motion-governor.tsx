'use client';

import { useEffect } from 'react';

/** Event fired on window when the page switches to lighter motion. */
export const LITE_EVENT = 'lakshya:lite';

export function isLite() {
  return document.documentElement.dataset.lite !== undefined;
}

/**
 * Adaptive quality. Shortly after the page settles, it samples the real
 * frame rate for 1.5 s. A device that cannot hold ~20 fps with every layer
 * running (no GPU, a busy or very old machine) gets <html data-lite>: the
 * decorative layers that cost the most to paint (the hero's dot ripple and
 * aurora, the threads, the header's blur, inner-hero line art) settle to
 * still images, while scroll motion, the cursor and every interaction stay.
 * Capable machines run far above the threshold and are never touched.
 */
export function MotionGovernor() {
  useEffect(() => {
    const root = document.documentElement;
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    if (still.matches || isLite()) return;

    let frame = 0;
    let timer = 0;
    let first = 0;
    let last = 0;
    const gaps: number[] = [];

    const decide = () => {
      gaps.sort((a, b) => a - b);
      const median = gaps.length ? gaps[Math.floor(gaps.length / 2)] : Infinity;
      if (gaps.length < 6 || median > 50) {
        root.dataset.lite = '';
        window.dispatchEvent(new Event(LITE_EVENT));
      }
    };
    const sample = (time: number) => {
      if (document.hidden) {
        // A hidden tab does not paint; measure once it is back.
        first = 0;
        gaps.length = 0;
        return;
      }
      if (!first) {
        first = last = time;
      } else {
        gaps.push(time - last);
        last = time;
      }
      if (time - first < 1500) frame = requestAnimationFrame(sample);
      else decide();
    };
    const begin = () => {
      cancelAnimationFrame(frame);
      first = 0;
      gaps.length = 0;
      frame = requestAnimationFrame(sample);
    };
    const resume = () => {
      if (!document.hidden && !isLite() && !gaps.length && !first) begin();
    };
    // Give the first paint, hydration and the motion layer a moment.
    timer = window.setTimeout(begin, 1200);
    document.addEventListener('visibilitychange', resume);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', resume);
    };
  }, []);

  return null;
}
