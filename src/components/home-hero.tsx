'use client';

import Link from 'next/link';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useVisibleVideo } from './use-visible-video';
import styles from './home-hero.module.css';

const poster = '/lakshya-intro.webp';

export function HomeHero() {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const video = useVisibleVideo(motionAllowed && !failed && !paused);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionAllowed(!preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="home-heading" data-hero>
      <div className={`wrap ${styles.content}`}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Hyderabad, India · Est. 2015</p>
          <h1 id="home-heading">
            <span className={styles.mask}>
              <span>Software, AI &amp;</span>
            </span>{' '}
            <span className={styles.mask}>
              <em>engineering.</em>
            </span>
          </h1>
          <p className={styles.description}>
            We help teams modernize business software, connect devices and put
            AI to work in everyday operations.
          </p>
          <Link className={styles.primary} href="/contact/">
            Discuss your project <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.aperture}>
          <div className={styles.film}>
            <div className={styles.scene} aria-hidden="true" data-hero-media>
              <img
                src={poster}
                width={1280}
                height={720}
                alt=""
                fetchPriority="high"
              />
              {motionAllowed && !failed && (
                <video
                  ref={video}
                  id="intro-film"
                  className={styles.video}
                  data-has-frame={hasFrame || undefined}
                  src="/lakshya-intro.mp4"
                  poster={poster}
                  width={1280}
                  height={720}
                  preload="none"
                  muted
                  loop
                  playsInline
                  onPlaying={() => setHasFrame(true)}
                  onError={() => setFailed(true)}
                />
              )}
            </div>
          </div>
          {motionAllowed && hasFrame && !failed && (
            <button
              type="button"
              className={styles.playback}
              aria-controls="intro-film"
              aria-label={paused ? 'Resume intro film' : 'Pause intro film'}
              onClick={() => setPaused(!paused)}
            >
              {paused ? (
                <Play size={16} aria-hidden="true" />
              ) : (
                <Pause size={16} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
