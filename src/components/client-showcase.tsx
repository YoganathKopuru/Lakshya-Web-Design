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
        <div className={styles.wall} aria-label="Client showcase">
          {clients.map(([name, src], i) => (
            <div
              className={styles.tile}
              key={name}
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              {src ? (
                <img
                  src={src}
                  alt={name}
                  width={170}
                  height={76}
                  loading="lazy"
                />
              ) : (
                <span className={styles.wordmark}>{name}</span>
              )}
              <span className={styles.tileIndex}>0{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
