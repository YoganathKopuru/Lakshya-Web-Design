import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './home-hero.module.css';

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-heading" data-hero>
      <div className={styles.scene} aria-hidden="true" data-hero-media>
        <img
          src="/hero-connected-earth-v2.webp"
          srcSet="/hero-connected-earth-640.webp 640w, /hero-connected-earth-960.webp 960w, /hero-connected-earth-v2.webp 1672w"
          sizes="100vw"
          width={1672}
          height={941}
          alt=""
          fetchPriority="high"
        />
        <canvas className={styles.globe} data-scroll-globe />
        <div className={styles.veil} />
      </div>
      <div className={`wrap ${styles.content}`}>
        <div className={styles.intro}>
          <p className={styles.kicker}>
            <span /> TECHNOLOGY, WITH PURPOSE
          </p>
          <h1 id="home-heading">
            <span className={styles.mask}>
              <span>Software. AI.</span>
            </span>{' '}
            <span className={styles.mask}>
              <em>Engineering services.</em>
            </span>
          </h1>
          <p className={styles.description}>
            <span className={styles.mask}>
              <span>
                For businesses modernizing operations, building connected
                products or expanding their technical teams.
              </span>
            </span>
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/contact/">
              Discuss your project <ArrowUpRight size={18} />
            </Link>
            <Link className={styles.secondary} href="/services/">
              Explore our expertise <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <a className={styles.discover} href="#expertise">
          DISCOVER LAKSHYA{' '}
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
