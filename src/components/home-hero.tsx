import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HalftoneField } from './halftone-field';
import { SilkLines } from './silk-lines';
import { DeliveryConsole } from './delivery-console';
import styles from './home-hero.module.css';

/**
 * Homepage hero: a deep indigo-to-blue sky with a pulsing halftone screen and
 * silk threads at the edges, a centred statement with two calls to action,
 * and a delivery console that tilts flat as the page scrolls (see
 * start-scroll-motion.ts). The backdrop fades into the page colour so the
 * console lands on the first light section.
 */
export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-heading" data-hero>
      <div className={styles.backdrop} aria-hidden="true" data-hero-media>
        <HalftoneField className={styles.dots} />
        <SilkLines className={styles.silk} />
      </div>
      <div className={`wrap ${styles.content}`} data-hero-content>
        <p className={styles.badge}>
          <i aria-hidden="true" />
          Lakshya Software Technologies · Hyderabad
        </p>
        <h1 id="home-heading">
          <span className={styles.mask}>
            <span>Software, AI &amp;</span>
          </span>{' '}
          <span className={styles.mask}>
            <em>engineering.</em>
          </span>
        </h1>
        <p className={styles.description}>
          For businesses modernizing operations, building connected products or
          expanding their technical teams.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/contact/">
            Discuss your project <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className={styles.secondary} href="/services/">
            Explore expertise
          </Link>
        </div>
      </div>
      <div className={`wrap ${styles.stage}`}>
        <DeliveryConsole />
      </div>
    </section>
  );
}
