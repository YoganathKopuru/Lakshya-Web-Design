'use client';

import { useEffect, useState } from 'react';
import styles from './home-hero.module.css';
import { useVisibleVideo } from './use-visible-video';

export function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const video = useVisibleVideo(enabled);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setEnabled(!preference.matches);
      setPlaying(false);
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  if (!enabled) return null;

  return (
    <video
      ref={video}
      className={styles.video}
      data-ready={playing}
      src="/hero-motion.mp4"
      preload="none"
      muted
      playsInline
      loop
      onPlaying={() => setPlaying(true)}
      onError={() => setPlaying(false)}
    />
  );
}
