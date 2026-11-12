import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import styles from './home-hero.module.css';
import { HeroVideo } from './hero-video';

const pathways = [
  {
    number: '01',
    title: 'Build what’s next',
    detail: 'Software, AI & enterprise platforms',
    href: '/services/software-engineering/',
  },
  {
    number: '02',
    title: 'Engineer the connection',
    detail: 'Silicon, embedded systems & IoT',
    href: '/services/embedded-iot/',
  },
  {
    number: '03',
    title: 'Bring the right people',
    detail: 'Specialist talent & delivery teams',
    href: '/services/talent-solutions/',
  },
];

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.scene} aria-hidden="true">
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
        <div className={styles.veil} />
      </div>
      <div className={`wrap ${styles.content}`}>
        <div className={styles.intro}>
          <p className={styles.kicker}>
            <span /> TECHNOLOGY, WITH PURPOSE
          </p>
          <h1 id="home-heading">
            Big ideas.
            <br />
            Real engineering.
            <br />
            <em>Lasting impact.</em>
          </h1>
          <p className={styles.description}>
            From intelligent software to connected systems.
            <br />
            We bring technology and talent together to move your business
            forward.
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
        <a className={styles.discover} href="#expertise">
          DISCOVER LAKSHYA <ArrowDown size={14} />
        </a>
      </div>
      <div className={styles.pathways}>
        <div className={`wrap ${styles.pathwayGrid}`}>
          {pathways.map((path) => (
            <Link key={path.number} href={path.href} className={styles.pathway}>
              <span className={styles.number}>{path.number}</span>
              <span>
                <strong>{path.title}</strong>
                <small>{path.detail}</small>
              </span>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
