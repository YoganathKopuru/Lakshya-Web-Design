import Link from 'next/link';
import {
  Sparkles,
  Code2,
  Layers3,
  Cloud,
  Cpu,
  Radio,
  ShieldCheck,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { services } from '@/data/content';
import styles from './capability-marquee.module.css';

const icons = [Sparkles, Code2, Layers3, Cloud, Cpu, Radio, ShieldCheck, Users];

export function CapabilityMarquee() {
  return (
    <section className={styles.strip} aria-label="Capabilities at Lakshya">
      <div className={styles.heading}>
        <span className={styles.signal} aria-hidden="true" />
        Intelligent
        <br />
        by design
      </div>
      <div className={styles.window}>
        <div className={styles.track} data-capability-track="">
          {[false, true].map((duplicate) => (
            <ul
              key={String(duplicate)}
              className={styles.group}
              aria-hidden={duplicate || undefined}
            >
              {services.map((service, index) => {
                const Icon = icons[index];
                const content = (
                  <>
                    <span className={styles.icon}>
                      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className={styles.copy}>
                      <strong>{service.name}</strong>
                      <small>{service.tags.join(' / ')}</small>
                    </span>
                    <ArrowUpRight
                      className={styles.arrow}
                      size={15}
                      aria-hidden="true"
                    />
                  </>
                );
                return (
                  <li key={service.slug}>
                    {duplicate ? (
                      <span className={styles.item}>{content}</span>
                    ) : (
                      <Link
                        className={styles.item}
                        href={`/services/${service.slug}/`}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
