import { pageMetadata } from '@/lib/site-metadata';
import { ServicePlacards } from '@/components/service-placards';
import { ContactBand } from '@/components/chrome';

export default function Services() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <span className="eyebrow">OUR EXPERTISE</span>
        <h1>Engineering services</h1>
        <p>
          Explore eight practices across software, hardware and technical
          operations. Choose a service to see the scope of work and discuss your
          project.
        </p>
      </section>
      <section className="section wrap">
        <ServicePlacards />
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
