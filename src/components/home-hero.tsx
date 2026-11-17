'use client';

import Link from 'next/link';
import { ArrowUpRight, Pause, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useVisibleVideo } from './use-visible-video';
import styles from './home-hero.module.css';

const poster = '/lakshya-intro.webp';
const youtubeVideo = 'P90X9xxm1gc';

export function HomeHero() {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const openPlayer = useRef<HTMLButtonElement>(null);
  const closePlayer = useRef<HTMLButtonElement>(null);
  const video = useVisibleVideo(
    motionAllowed && !paused && !failed && !showPlayer,
  );

  useEffect(() => {
    if (showPlayer) closePlayer.current?.focus();
  }, [showPlayer]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionAllowed(!preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  function togglePlayback() {
    const media = video.current;
    if (!media) return;
    if (!playing) {
      setPaused(false);
      void media.play().catch(() => setPlaying(false));
    } else {
      setPaused(true);
      media.pause();
    }
  }

  return (
    <section className={styles.hero} aria-labelledby="home-heading" data-hero>
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
            onPlaying={() => {
              setHasFrame(true);
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onError={() => {
              setPlaying(false);
              setFailed(true);
            }}
          />
        )}
        <div className={styles.veil} />
      </div>
      <div
        className={`wrap ${styles.content}`}
        data-player-open={showPlayer || undefined}
      >
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
        {showPlayer && (
          <section
            className={styles.player}
            aria-label="Technology intro video"
          >
            <div className={styles.playerHeader}>
              <h2>Technology intro</h2>
              <button
                ref={closePlayer}
                type="button"
                className={styles.control}
                onClick={() => {
                  setShowPlayer(false);
                  openPlayer.current?.focus();
                }}
              >
                <X size={16} aria-hidden="true" /> Close video
              </button>
            </div>
            <iframe
              title="Technology Background Template by Ziii Tech"
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideo}?autoplay=1&playsinline=1&rel=0`}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
            <a
              href={`https://www.youtube.com/watch?v=${youtubeVideo}`}
              target="_blank"
              rel="noreferrer"
            >
              Watch on YouTube <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </section>
        )}
        <div className={styles.footer}>
          <a className={styles.discover} href="#expertise">
            Discover Lakshya
            <span className={styles.scrollLine} aria-hidden="true" />
          </a>
          <div className={styles.footerControls}>
            <button
              ref={openPlayer}
              className={styles.control}
              type="button"
              aria-expanded={showPlayer}
              onClick={() => setShowPlayer((open) => !open)}
            >
              {showPlayer ? (
                <X size={16} aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )}
              {showPlayer ? 'Hide technology intro' : 'Watch technology intro'}
            </button>
            {motionAllowed && !failed && !showPlayer && (
              <button
                className={styles.control}
                type="button"
                aria-controls="intro-film"
                onClick={togglePlayback}
              >
                {playing ? (
                  <Pause size={16} aria-hidden="true" />
                ) : (
                  <Play size={16} aria-hidden="true" />
                )}
                {playing ? 'Pause intro' : 'Play intro'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
