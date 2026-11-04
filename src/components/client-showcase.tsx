'use client';
import { useEffect, useRef } from 'react';
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
  const viewport = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame = 0;
    let last = 0;
    let position = el.scrollLeft;
    const group = el.firstElementChild?.firstElementChild;
    let cycle = group?.getBoundingClientRect().width || 0;
    const resize = new ResizeObserver(() => {
      cycle = group?.getBoundingClientRect().width || 0;
    });
    if (group) resize.observe(group);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);
    const tick = (now: number) => {
      const elapsed = last ? Math.min(now - last, 50) : 0;
      last = now;
      if (visible && !document.hidden && !paused.current && !media.matches) {
        position += elapsed * 0.025;
        if (cycle && position >= cycle) position %= cycle;
        el.scrollLeft = position;
      } else position = el.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
    };
  }, []);
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
          ref={viewport}
          className={styles.viewport}
          role="region"
          onPointerEnter={() => {
            paused.current = true;
          }}
          onPointerLeave={() => {
            paused.current = viewport.current === document.activeElement;
          }}
          onFocus={() => {
            paused.current = true;
          }}
          onBlur={() => {
            paused.current = false;
          }}
          onTouchStart={() => {
            paused.current = true;
          }}
          onKeyDown={(event) => {
            const el = event.currentTarget;
            const distance = Math.min(el.clientWidth * 0.8, 420);
            if (
              ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
            ) {
              event.preventDefault();
              paused.current = true;
              el.scrollLeft =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? el.scrollWidth - el.clientWidth
                    : el.scrollLeft +
                      (event.key === 'ArrowRight' ? distance : -distance);
            }
          }}
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
                      <img
                        src={src}
                        alt={name}
                        width={170}
                        height={76}
                        loading="lazy"
                        decoding="async"
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
      </div>
    </section>
  );
}
