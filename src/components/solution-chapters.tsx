import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { services } from '@/data/content';
import { IndustryVideo } from './industry-video';
import styles from './solution-chapters.module.css';

const chapters = [
  {
    title: 'Build what’s next',
    detail: 'Software, AI & enterprise platforms',
    slug: 'software-engineering',
    asset: '/engineering-team',
  },
  {
    title: 'Engineer the connection',
    detail: 'Silicon, embedded systems & IoT',
    slug: 'embedded-iot',
    asset: '/industry-factory',
  },
  {
    title: 'Bring the right people',
    detail: 'Specialist talent & delivery teams',
    slug: 'talent-solutions',
    asset: '/company-collaboration',
  },
];

export function SolutionChapters() {
  return (
    <section
      className={styles.section}
      id="solutions"
      aria-labelledby="solutions-heading"
    >
      <div className="wrap">
        <div className={styles.heading} data-reveal>
          <h2 id="solutions-heading">Find your starting point.</h2>
          <a href="#expertise" className={styles.all}>
            View all expertise <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.grid} data-reveal-grid>
          {chapters.map(({ title, detail, slug, asset }) => {
            const service = services.find((item) => item.slug === slug);
            if (!service) return null;
            return (
              <article className={styles.card} key={slug} data-reveal>
                <div className={styles.media}>
                  <IndustryVideo asset={asset} />
                </div>
                <details className={styles.disclosure} name="solution-chapter">
                  <summary className={styles.summary}>
                    <span className={styles.icon} aria-hidden="true">
                      <Plus size={22} />
                    </span>
                    <span className={styles.detail}>{detail}</span>
                    <span className={styles.title}>{title}</span>
                  </summary>
                  <div className={styles.body}>
                    <p>{service.description}</p>
                    <Link href={`/services/${slug}/`} className={styles.link}>
                      Explore {service.name}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
