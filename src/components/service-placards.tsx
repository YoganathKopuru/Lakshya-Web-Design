'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/data/content';
import { DomainScene } from './service-scenes';
import styles from './service-placards.module.css';

const practices = {
  'ai-data': ['Digital platforms', 'Retrieval pipeline'],
  'software-engineering': ['Digital platforms', 'Application stack'],
  'enterprise-platforms': ['Digital platforms', 'System integration'],
  'cloud-devops': ['Delivery & operations', 'Deployment pipeline'],
  'semiconductor-vlsi': ['Hardware & devices', 'Silicon verification'],
  'embedded-iot': ['Hardware & devices', 'Device telemetry'],
  'quality-managed-services': ['Delivery & operations', 'System assurance'],
  'talent-solutions': ['Delivery & operations', 'Team composition'],
} as const;
const filters = [
  'All services',
  'Digital platforms',
  'Hardware & devices',
  'Delivery & operations',
] as const;

export function ServicePlacards() {
  const [filter, setFilter] =
    useState<(typeof filters)[number]>('All services');
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const matches = (slug: keyof typeof practices) =>
    filter === 'All services' || practices[slug][0] === filter;
  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter services">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            disabled={!interactive}
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
        <span className={styles.count} role="status">
          {services.filter((s) => matches(s.slug)).length} services
        </span>
      </div>
      <div className={styles.grid} data-reveal-grid>
        {services.map((service, index) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}/`}
            hidden={!matches(service.slug)}
            className={styles.card}
            data-group={practices[service.slug][0]}
            data-reveal="pillar"
            aria-labelledby={`expertise-title-${service.slug}`}
          >
            <div aria-hidden="true" className={styles.scene}>
              <div className={styles.sceneHeader}>
                <span>Concept</span>
                {practices[service.slug][1]}
              </div>
              <DomainScene index={index} />
            </div>
            <h3 id={`expertise-title-${service.slug}`}>{service.name}</h3>
            <p>{service.description}</p>
            <div className={styles.bottom}>
              <span>{service.tags[0]}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
