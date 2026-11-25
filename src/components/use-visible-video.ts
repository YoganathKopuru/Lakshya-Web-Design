'use client';

import { useEffect, useRef } from 'react';

/**
 * Plays a muted, looping video only while it is on screen (and the tab is
 * visible), pausing it otherwise. `threshold` is how much of the video must
 * be in view before it plays: 0 (any part) by default; a large stage can ask
 * for more so it does not start decoding while only its edge is showing.
 */
export function useVisibleVideo(enabled: boolean, threshold = 0) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!enabled || !video) return;

    let inView = false;
    const sync = () => {
      if (inView && !document.hidden) {
        void video.play().catch(() => {
          // A blocked autoplay keeps the poster available.
        });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= threshold;
        sync();
      },
      { threshold: threshold > 0 ? [0, threshold] : 0 },
    );
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [enabled, threshold]);

  return ref;
}
