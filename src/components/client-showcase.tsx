'use client';

import Link from 'next/link';
import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
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
  const [paused, setPaused] = useState(false);

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
          id="client-logos"
          data-paused={paused || undefined}
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
          <button
            type="button"
            className={styles.control}
            aria-controls="client-logos"
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            {paused ? 'Play logo strip' : 'Pause logo strip'}
          </button>
        </div>
      </div>
    </section>
  );
}
