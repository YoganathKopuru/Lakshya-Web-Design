import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './home-hero.module.css';
import { HeroVideo } from './hero-video';

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-heading" data-hero>
      <div className={styles.scene} aria-hidden="true" data-hero-media>
        <img
          src="/hero-connected-earth-v2.webp"
          srcSet="/hero-connected-earth-960.webp 960w, /hero-connected-earth-v2.webp 1672w"
          sizes="100vw"
          width={1672}
          height={941}
          alt=""
          fetchPriority="high"
        />
        <HeroVideo />
        <div className={styles.aperture} data-hero-aperture />
        <div className={styles.veil} />
      </div>
      <div className={`wrap ${styles.content}`}>
        <div className={styles.intro}>
          <p className={styles.kicker}>
            <span /> TECHNOLOGY, WITH PURPOSE
          </p>
          <h1 id="home-heading">
            <span className={styles.mask}>
              <span>Big ideas.</span>
            </span>{' '}
            <span className={styles.mask}>
              <span>Real engineering.</span>
            </span>{' '}
            <span className={styles.mask}>
              <em>Lasting impact.</em>
            </span>
          </h1>
          <p className={styles.description}>
            <span className={styles.mask}>
              <span>From intelligent software to connected systems.</span>
            </span>{' '}
            <span className={styles.mask}>
              <span>
                We bring technology and talent together to move your business
                forward.
              </span>
            </span>
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/services/">
              Explore our expertise <ArrowUpRight size={18} />
            </Link>
            <Link className={styles.secondary} href="/contact/">
              Let’s build together <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className={styles.coordinate} aria-hidden="true">
          <span /> CONNECTED THINKING
          <br />
          <b>Limitless possibility.</b>
        </div>
        <a className={styles.discover} href="#solutions">
          DISCOVER LAKSHYA{' '}
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
