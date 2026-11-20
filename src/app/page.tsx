import { pageMetadata } from '@/lib/site-metadata';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { HomeHero } from '@/components/home-hero';
import { ServicePlacards } from '@/components/service-placards';
import { ContactBand } from '@/components/chrome';
import { DeliveryExperience } from '@/components/delivery-experience';
import { CareersInvitation } from '@/components/careers-invitation';
import { AiOrbit } from '@/components/ai-orbit';
import { ClientShowcase } from '@/components/client-showcase';
import { DeliveryJourney } from '@/components/delivery-journey';

export default function Home() {
  return (
    <main id="main">
      <HomeHero />
      <nav aria-label="On this page" className="chapter-nav">
        <div className="wrap">
          <a href="#expertise">
            Our expertise <ArrowDownRight aria-hidden="true" />
          </a>
          <a href="#delivery">
            Project experience <ArrowDownRight aria-hidden="true" />
          </a>
          <a href="#approach">
            How we deliver <ArrowDownRight aria-hidden="true" />
          </a>
        </div>
      </nav>
      <section className="section wrap" id="expertise">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow" data-reveal-part>
              Our expertise
            </span>
            <h2 data-reveal-part>Find your engineering team.</h2>
          </div>
          <p data-reveal-part>
            Explore eight capabilities, from designing silicon to running the
            software your business depends on.
          </p>
        </div>
        <ServicePlacards />
      </section>
      <ClientShowcase />
      <section className="ai-feature" id="ai-in-motion">
        <div className="wrap ai-feature-inner">
          <div className="ai-sticky">
            <AiOrbit />
          </div>
          <div className="ai-copy" data-reveal>
            <span className="eyebrow" data-reveal-part>
              BEYOND THE BUZZWORDS
            </span>
            <h2 data-reveal-part>
              Make AI part of
              <br />
              your everyday.
            </h2>
            <p data-reveal-part>
              We help shape practical AI use cases—from enterprise search and
              document intelligence to agentic automation—with a clear path from
              exploration to integration.
            </p>
            <ol className="ai-outcomes" data-reveal-part>
              <li>
                <span>01 / YOUR KNOWLEDGE</span>
                <strong>Find the answer.</strong>
                <p>Bring relevant documents and business context together.</p>
              </li>
              <li>
                <span>02 / CONNECTED INTELLIGENCE</span>
                <strong>Understand the work.</strong>
                <p>Explore document processing and connected workflows.</p>
              </li>
              <li>
                <span>03 / USEFUL ACTION</span>
                <strong>Help people move forward.</strong>
                <p>Put insights into tools your team can use.</p>
              </li>
            </ol>
            <Link className="button button-light" href="/services/ai-data/">
              Explore AI & data <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <DeliveryExperience />
      <DeliveryJourney />
      <CareersInvitation />
      <ContactBand />
    </main>
  );
}

export const metadata = pageMetadata(
  'Lakshya | Technology, with purpose.',
  'Explore AI, software engineering, enterprise platforms and technology services from Lakshya Software Technologies in Hyderabad.',
  '/',
);
