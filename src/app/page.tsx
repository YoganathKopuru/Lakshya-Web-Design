import { pageMetadata } from '@/lib/site-metadata';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomeHero } from '@/components/home-hero';
import { ServicePlacards } from '@/components/service-placards';
import { ContactBand } from '@/components/chrome';
import { DeliveryExperience } from '@/components/delivery-experience';
import { CareersInvitation } from '@/components/careers-invitation';
import { AiOrbit } from '@/components/ai-orbit';
import { EmployeeVoices } from '@/components/employee-voices';
import { CapabilityMarquee } from '@/components/capability-marquee';
import { ClientShowcase } from '@/components/client-showcase';
import { DeliveryJourney } from '@/components/delivery-journey';

export default function Home() {
  return (
    <main id="main">
      <HomeHero />
      <CapabilityMarquee />
      <section className="section wrap" id="expertise">
        <div className="section-head">
          <div>
            <span className="eyebrow">01 — OUR EXPERTISE</span>
            <h2>
              Big-picture thinking.
              <br />
              <span className="muted">Deep technical expertise.</span>
            </h2>
          </div>
          <p>
            One technology partner. A connected range of capabilities.
            <br />
            Built around where you are—and where you want to go.
          </p>
        </div>
        <ServicePlacards />
      </section>
      <section className="ai-feature" id="ai-in-motion">
        <div className="wrap ai-feature-inner">
          <AiOrbit />
          <div className="ai-copy">
            <span className="eyebrow">BEYOND THE BUZZWORDS</span>
            <h2>
              Make AI part of
              <br />
              your everyday.
            </h2>
            <p>
              Put your knowledge to work. Connect your workflows. Give your
              people room to do more.
            </p>
            <p>
              We help shape practical AI use cases—from enterprise search and
              document intelligence to agentic automation—with a clear path from
              exploration to integration.
            </p>
            <Link className="button button-light" href="/services/ai-data/">
              Explore AI & data <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <ClientShowcase />
      <DeliveryExperience />
      <DeliveryJourney />
      <CareersInvitation />
      <EmployeeVoices />
      <ContactBand />
    </main>
  );
}

export const metadata = pageMetadata(
  'Lakshya | Technology, with purpose.',
  'Explore AI, software engineering, enterprise platforms and technology services from Lakshya Software Technologies in Hyderabad.',
  '/',
);
