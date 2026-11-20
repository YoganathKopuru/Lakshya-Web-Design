import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/data/content';
import styles from './manifesto.module.css';

/**
 * A statement that lights up word by word as it scrolls through the
 * viewport (see `data-manifesto` in start-scroll-motion). Without motion
 * every word is simply shown at full strength.
 */
const statement: Array<[string, boolean?]> = [
  ['We bring'],
  ['software, AI and engineering', true],
  ['together, so businesses can'],
  ['modernize operations,', true],
  ['build'],
  ['connected products', true],
  ['and grow the'],
  ['teams behind them.', true],
];

export function Manifesto() {
  return (
    <section className={styles.section} aria-labelledby="manifesto-label">
      <div className={`wrap ${styles.inner}`}>
        <span className="eyebrow" id="manifesto-label">
          WHO WE ARE
        </span>
        <p className={styles.statement} data-manifesto>
          {statement.map(([phrase, accent], i) => (
            <span key={i} className={accent ? styles.accent : undefined}>
              {phrase.split(' ').map((word, j) => (
                <span key={j} data-word>
                  {word}{' '}
                </span>
              ))}
            </span>
          ))}
        </p>
        <div className={styles.facts} data-reveal>
          <dl data-reveal-part>
            <div>
              <dt>Established</dt>
              <dd>2015</dd>
            </div>
            <div>
              <dt>Practices</dt>
              <dd>{services.length} connected</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Hyderabad, India</dd>
            </div>
          </dl>
          <Link href="/company/" className={styles.link} data-reveal-part>
            Get to know Lakshya <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
