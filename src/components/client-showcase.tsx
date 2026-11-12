import Link from 'next/link';
import styles from './client-showcase.module.css';
const clients = [
  ['AMD', '/images/clients/AMD-Symbol.webp'],
  ['Atos', '/images/clients/Logo-Atos.webp'],
  ['Metso', '/images/clients/metso_logo_0.webp'],
  ['Allstate', '/images/clients/OIP%201.webp'],
  ['PayPal', '/images/clients/OIP.webp'],
  ['Qualcomm', '/images/clients/qualcomm-logo-3.webp'],
  ['Broadcom', '/images/clients/R%201.webp'],
  ['Deloitte', '/images/clients/R.webp'],
  ['Synopsys', ''],
];

export function ClientShowcase() {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.heading}>
          <div>
            <span className="eyebrow">WORKING TOGETHER</span>
            <h2>
              Connections that
              <br />
              move ideas forward.
            </h2>
          </div>
          <p>Organizations featured on the original Lakshya client showcase.</p>
        </div>
        <div
          className={styles.viewport}
          aria-label="Client showcase"
          tabIndex={0}
        >
          <div className={styles.track}>
            {[false, true].map((duplicate) => (
              <div
                className={styles.group}
                aria-hidden={duplicate || undefined}
                key={String(duplicate)}
              >
                {clients.map(([name, src]) => (
                  <div className={styles.card} key={name}>
                    {src ? (
                      <img
                        src={src}
                        alt={duplicate ? '' : name}
                        width={170}
                        height={76}
                      />
                    ) : (
                      <span className={styles.wordmark}>{name}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="trust-followup">
          <span>Quality, security and dependable delivery.</span>
          <Link href="/services/quality-managed-services/">
            Explore our quality framework ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
