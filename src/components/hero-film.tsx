'use client';

import { useEffect, useState } from 'react';
import { useVisibleVideo } from './use-visible-video';
import styles from './hero-film.module.css';

/**
 * The film aperture that follows the hero. A sticky stage holds a small
 * capsule of film with the brand line split around it; scrolling opens the
 * capsule into a near-full-screen frame and draws the two halves of the
 * line together over the footage. The opening is tied to scroll position
 * (start-scroll-motion.ts drives --open), so scrolling back up closes it
 * again. Reduced motion shows the open frame with a still image.
 */
export function HeroFilm() {
  const [allowMotion, setAllowMotion] = useState(false);
  // The stage is a full screen tall: wait until a good part of it is in
  // view before decoding the film.
  const video = useVisibleVideo(allowMotion, 0.35);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowMotion(!preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return (
    <section className={styles.film} aria-labelledby="film-heading" data-film>
      <div className={styles.stage}>
        <div className={styles.aperture} aria-hidden="true">
          {allowMotion ? (
            <video
              ref={video}
              className={styles.media}
              src="/lakshya-intro.mp4"
              poster="/lakshya-intro.webp"
              preload="none"
              muted
              loop
              playsInline
            />
          ) : (
            <img
              className={styles.media}
              src="/lakshya-intro.webp"
              alt=""
              width={1280}
              height={720}
              loading="lazy"
            />
          )}
          <span className={styles.shade} />
          <span className={styles.credit}>Stock footage</span>
        </div>
        <h2 id="film-heading" className={styles.line} data-curtain-skip>
          <span className={styles.before}>Technology,</span>{' '}
          <span className={styles.after}>with purpose.</span>
        </h2>
        <p className={styles.caption}>
          Built around people. Powered by technology.
        </p>
      </div>
    </section>
  );
}
