import { pageMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';
import { ServiceGrid } from '@/components/service-grid';
import { ContactBand } from '@/components/chrome';
import { Curtain } from '@/components/curtain';

export default function Services() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <span className="eyebrow">OUR EXPERTISE</span>
        <h1>
          <Curtain>
            Connected capabilities.
            <br />
            <span className="muted">Countless possibilities.</span>
          </Curtain>
        </h1>
        <p>
          From emerging AI to the systems your business relies on. Find the
          expertise to move your next idea forward.
        </p>
      </section>
      <section className="section wrap" aria-labelledby="services-list">
        <h2 id="services-list" className="visually-hidden">
          All expertise areas
        </h2>
        <ServiceGrid />
      </section>
      <ContactBand />
    </main>
  );
}

export const metadata = pageMetadata(
  'Our expertise',
  'Explore eight connected capabilities across AI, software, enterprise platforms, cloud, semiconductor, IoT, quality and talent.',
  '/services/',
);
