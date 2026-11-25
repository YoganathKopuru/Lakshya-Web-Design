import { pageMetadata } from '@/lib/site-metadata';
import { HomeHero } from '@/components/home-hero';
import { HeroFilm } from '@/components/hero-film';
import { ServicePlacards } from '@/components/service-placards';
import { ContactBand } from '@/components/chrome';
import { DeliveryExperience } from '@/components/delivery-experience';
import { CareersInvitation } from '@/components/careers-invitation';
import { AiWorkflow } from '@/components/ai-workflow';
import { ClientShowcase } from '@/components/client-showcase';
import { DeliveryJourney } from '@/components/delivery-journey';
import { Manifesto } from '@/components/manifesto';

export default function Home() {
  return (
    <main id="main">
      <HomeHero />
      <HeroFilm />
      <Manifesto />
      <section className="section wrap" id="expertise">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow" data-reveal-part>
              01 — OUR EXPERTISE
            </span>
            <h2 data-reveal-part>
              Big-picture thinking.
              <br />
              <span className="muted">Deep technical expertise.</span>
            </h2>
          </div>
          <p data-reveal-part>
            One technology partner. A connected range of capabilities.
            <br />
            Built around where you are—and where you want to go.
          </p>
        </div>
        <ServicePlacards />
      </section>
      <ClientShowcase />
      <AiWorkflow />
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
