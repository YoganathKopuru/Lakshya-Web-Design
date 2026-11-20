'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  Code2,
  Layers3,
  Cloud,
  Cpu,
  Radio,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { services } from '@/data/content';
import { DomainScene } from './service-scenes';
import styles from './service-placards.module.css';

const icons = [Sparkles, Code2, Layers3, Cloud, Cpu, Radio, ShieldCheck, Users];
// The columns follow the logo spectrum (indigo -> blue -> teal), repeated on
// row two: [light ink for text, saturated accent, deep wash for the active card].
const palettes = [
  ['#D3D4FF', '#4B45D1', '#1D1A8ACC'],
  ['#C4DDF5', '#2F78B5', '#0D3D61CC'],
  ['#B7E8EA', '#1B8E98', '#0A6268B3'],
  ['#B2ECDC', '#1AA68C', '#0A796BB3'],
];
const labels = [
  'AGENTIC RAG PIPELINE',
  'FULL-STACK COMPILER',
  'ENTERPRISE BUS SYNC',
  'CLOUD DELIVERY PIPELINE',
  'SILICON DESIGN & VERIFICATION',
  'MCU & RF TELEMETRY',
  'SYSTEM ASSURANCE',
  'TECHNICAL TEAM ASSEMBLY',
];

export function ServicePlacards() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const active = focused ?? hovered ?? 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (grid.current) observer.observe(grid.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={grid}
      className={styles.grid}
      data-visible={visible}
      data-reveal-grid
      onPointerLeave={() => setHovered(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(null);
      }}
    >
      {services.map((service, index) => {
        const Icon = icons[index];
        const [primary, secondary, tint] = palettes[index % 4];
        const isActive = index === active;
        const variables = {
          '--placard-primary': primary,
          '--placard-secondary': secondary,
          '--placard-tint': tint,
        } as CSSProperties;
        return (
          <Link
            href={`/services/${service.slug}/`}
            key={service.slug}
            style={variables}
            className={styles.card}
            data-active={isActive}
            data-reveal="pillar"
            aria-labelledby={`expertise-title-${service.slug}`}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse' || event.pointerType === 'pen')
                setHovered(index);
            }}
            onFocus={() => setFocused(index)}
          >
            <span className={styles.sweep} aria-hidden="true" />
            <span className={styles.accent} aria-hidden="true" />
            <span className={styles.watermark} aria-hidden="true">
              <Icon size={130} strokeWidth={0.6} />
            </span>
            <div className={styles.top} data-reveal-part>
              <Icon size={28} strokeWidth={1.4} />
              <span>0{index + 1}</span>
            </div>
            <div className={styles.content}>
              <h3 id={`expertise-title-${service.slug}`} data-reveal-part>
                {service.name}
              </h3>
              <p data-reveal-part>{service.description}</p>
              <div className={styles.reveal}>
                <div className={styles.revealInner}>
                  <div
                    className={styles.scene}
                    aria-hidden="true"
                    data-reveal-part
                  >
                    <div className={styles.sceneHeader}>
                      <span className={styles.indicator} />
                      <span>{labels[index]}</span>
                      <span className={styles.demo}>CONCEPT</span>
                    </div>
                    <DomainScene index={index} />
                  </div>
                  <div className={styles.tags}>
                    {service.areas.slice(0, 3).map((area) => (
                      <span key={area}>{area}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.bottom}>
              <span>{service.tags[0]}</span>
              <span className={styles.explore}>
                <span>Explore</span>
                <span className={styles.arrow}>
                  <ArrowUpRight size={17} />
                </span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
