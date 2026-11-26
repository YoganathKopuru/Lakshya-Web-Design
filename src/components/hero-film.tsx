'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './hero-film.module.css';

/**
 * The film that follows the hero. The footage is hidden between the words
 * of "Technology, with purpose.": scrolling parts the words around a capsule
 * of film, opens the capsule into a near-full-screen frame as the two halves
 * meet again over the footage, then closes it all back into the line before
 * the page moves on. The scene is tied to scroll position
 * (start-scroll-motion.ts drives --reveal and --grow), so scrolling back up
 * plays it the same way: from either side, the line comes first. The
 * footage plays only while it shows. Reduced motion shows the open frame
 * with a still image.
 */
export function HeroFilm() {
  const [allowMotion, setAllowMotion] = useState(false);
  const film = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowMotion(!preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = film.current;
    const media = video.current;
    if (!allowMotion || !section || !media) return;

    // The scroll scene marks the section data-showing while any of the film
    // is open between the words.
    const sync = () => {
      if (section.hasAttribute('data-showing') && !document.hidden) {
        void media.play().catch(() => {
          // A blocked autoplay keeps the poster available.
        });
      } else {
        media.pause();
      }
    };
    // Fetch the footage as the section approaches, so the capsule opens on
    // moving film rather than its poster.
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        media.preload = 'auto';
        approach.disconnect();
      },
      { rootMargin: '100% 0px' },
    );
    approach.observe(section);
    const showing = new MutationObserver(sync);
    showing.observe(section, {
      attributes: true,
      attributeFilter: ['data-showing'],
    });
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      approach.disconnect();
      showing.disconnect();
      document.removeEventListener('visibilitychange', sync);
      media.pause();
    };
  }, [allowMotion]);

  return (
    <section
      ref={film}
      className={styles.film}
      aria-labelledby="film-heading"
      data-film
    >
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
