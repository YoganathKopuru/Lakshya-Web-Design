import Link from 'next/link';
import styles from './client-showcase.module.css';

const clients = [
  'AMD',
  'Atos',
  'Metso',
  'Allstate',
  'PayPal',
  'Qualcomm',
  'Broadcom',
  'Deloitte',
  'Synopsys',
];

export function ClientShowcase() {
  return (
    <section className={styles.section} aria-labelledby="client-heading">
      <div className="wrap">
        <div className={styles.heading} data-reveal>
          <span className={styles.kicker}>Working together</span>
          <h2 id="client-heading">Connections that move ideas forward.</h2>
          <p>Organizations featured on the original Lakshya client showcase.</p>
        </div>
        <div
          className={styles.viewport}
          aria-label="Client showcase"
          role="region"
          tabIndex={0}
        >
          <div className={styles.track}>
            {[false, true].map((duplicate) => (
              <ul
                className={styles.group}
                aria-hidden={duplicate || undefined}
                key={String(duplicate)}
                role="list"
              >
                {clients.map((name) => (
                  <li className={styles.item} key={name}>
                    <img
                      src={`/images/clients/white/${name.toLowerCase()}.png`}
                      alt={duplicate ? '' : name}
                      width={400}
                      height={176}
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className={styles.followup}>
          <Link href="/services/quality-managed-services/">
            Explore our quality framework ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
