'use client';

import { useEffect, useState } from 'react';
import styles from './home-hero.module.css';

export function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

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
      className={styles.video}
      data-ready={playing}
      src="/hero-motion.mp4"
      autoPlay
      muted
      playsInline
      loop
      onPlaying={() => setPlaying(true)}
      onError={() => setPlaying(false)}
    />
  );
}
