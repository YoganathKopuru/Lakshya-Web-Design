'use client';

import { useEffect, useRef } from 'react';

export function useVisibleVideo(enabled: boolean) {
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
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [enabled]);

  return ref;
}
