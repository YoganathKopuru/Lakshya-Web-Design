'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Sparkles, Code2, Layers3, Cloud, Cpu, Radio, ShieldCheck, Users } from 'lucide-react';
import { services } from '@/data/content';
import { DomainScene } from './service-scenes';
import styles from './service-placards.module.css';

const icons = [Sparkles, Code2, Layers3, Cloud, Cpu, Radio, ShieldCheck, Users];
// The reference follows the logo spectrum across columns, repeated on row two.
const palettes = [
  ['#120C5A', '#112266', '#EBEEF7'],
  ['#0E3B68', '#0B5269', '#EAF2F6'],
  ['#0A6268', '#097065', '#E9F4F1'],
  ['#097065', '#077D63', '#E5F4F0'],
];
const labels = ['AGENTIC RAG PIPELINE', 'FULL-STACK COMPILER', 'ENTERPRISE BUS SYNC', 'CLOUD DELIVERY PIPELINE', 'SILICON DESIGN & VERIFICATION', 'MCU & RF TELEMETRY', 'SYSTEM ASSURANCE', 'TECHNICAL TEAM ASSEMBLY'];

export function ServicePlacards() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const active = focused ?? hovered ?? 0;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    if (grid.current) observer.observe(grid.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={grid} className={styles.grid} data-visible={visible} onPointerLeave={() => setHovered(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }}>
    {services.map((service, index) => {
      const Icon = icons[index];
      const [primary, secondary, tint] = palettes[index % 4];
      const isActive = index === active;
      const variables = { '--placard-primary': primary, '--placard-secondary': secondary, '--placard-tint': tint, '--placard-delay': `${index * 70}ms` } as CSSProperties;
      return <Link href={`/services/${service.slug}/`} key={service.slug} style={variables} className={styles.card} data-active={isActive} aria-labelledby={`expertise-title-${service.slug}`} onPointerEnter={event => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') setHovered(index); }} onFocus={() => setFocused(index)}>
        <span className={styles.sweep} aria-hidden="true"/>
        <span className={styles.accent} aria-hidden="true"/>
        <span className={styles.watermark} aria-hidden="true"><Icon size={130} strokeWidth={0.6}/></span>
        <div className={styles.top}><Icon size={28} strokeWidth={1.4}/><span>0{index + 1}</span></div>
        <div className={styles.content}>
          <h3 id={`expertise-title-${service.slug}`}>{service.name}</h3>
          <p>{service.description}</p>
          <div className={styles.reveal}>
            <div className={styles.revealInner}>
              <div className={styles.scene} aria-hidden="true"><div className={styles.sceneHeader}><span className={styles.indicator}/><span>{labels[index]}</span><span className={styles.demo}>CONCEPT</span></div><DomainScene index={index}/></div>
              <div className={styles.tags}>{service.areas.slice(0, 3).map(area => <span key={area}>{area}</span>)}</div>
            </div>
          </div>
        </div>
        <div className={styles.bottom}><span>{service.tags[0]}</span><span className={styles.explore}><span>Explore</span><span className={styles.arrow}><ArrowUpRight size={17}/></span></span></div>
      </Link>;
    })}
  </div>;
}
