import styles from './client-showcase.module.css';

const clients = [
  ['AMD', '/images/clients/AMD-Symbol.png'],
  ['Atos', '/images/clients/Logo-Atos.jpg'],
  ['Metso', '/images/clients/metso_logo_0.png'],
  ['Allstate', '/images/clients/OIP%201.jpg'],
  ['PayPal', '/images/clients/OIP.jpg'],
  ['Qualcomm', '/images/clients/qualcomm-logo-3.png'],
  ['Broadcom', '/images/clients/R%201.jpg'],
  ['Deloitte', '/images/clients/R.png'],
  ['Synopsys', ''],
];

export function ClientShowcase() {
  return (
    <section className={styles.section} aria-labelledby="clients-heading">
      <div className="wrap">
        <div className={styles.heading}>
          <div>
            <span className="eyebrow">WORKING TOGETHER</span>
            <h2 id="clients-heading">
              Connections that
              <br />
              <span className="muted">move ideas forward.</span>
            </h2>
          </div>
          <p>Organizations featured on Lakshya’s original client showcase.</p>
        </div>
        <div
          className={styles.viewport}
          tabIndex={0}
          aria-label="Client showcase; scroll to explore"
        >
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <div
                className={styles.group}
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {clients.map(([name, src]) => (
                  <div className={styles.card} key={name}>
                    {src ? (
                      <img src={src} alt={name} />
                    ) : (
                      <span className={styles.wordmark}>{name}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
