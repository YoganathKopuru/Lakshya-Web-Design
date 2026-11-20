'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useVisibleVideo } from './use-visible-video';
import styles from './home-hero.module.css';

const poster = '/lakshya-intro.webp';

export function HomeHero() {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useVisibleVideo(motionAllowed && !failed);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionAllowed(!preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="home-heading" data-hero>
      <div
        className={`${styles.scene} grain`}
        aria-hidden="true"
        data-hero-media
      >
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
        <div className={styles.veil} />
      </div>
      <div className={`wrap ${styles.content}`}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Lakshya Software Technologies</p>
          <h1 id="home-heading">
            <span className={styles.mask}>
              <span>Software, AI &amp;</span>
            </span>{' '}
            <span className={styles.mask}>
              <em>engineering.</em>
            </span>
          </h1>
          <p className={styles.description}>
            For businesses modernizing operations, building connected products
            or expanding their technical teams.
          </p>
          <Link className={styles.primary} href="/contact/">
            Discuss your project <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.cue} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}
