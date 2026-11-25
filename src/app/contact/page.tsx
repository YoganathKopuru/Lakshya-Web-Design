import { pageMetadata } from '@/lib/site-metadata';
import { ArrowUpRight } from 'lucide-react';
import { office } from '@/data/content';
import { EnquiryForm } from '@/components/enquiry-form';
import { OfficeMap } from '@/components/office-map';
import { Curtain } from '@/components/curtain';

export default function Contact() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <span className="eyebrow">LET’S CONNECT</span>
        <h1>
          <Curtain>
            Good things start
            <br />
            <span className="muted">with a conversation.</span>
          </Curtain>
        </h1>
        <p>
          An idea to explore, a system to improve, or a team to build. We’d like
          to hear about it.
        </p>
      </section>
      <section className="section wrap">
        <div className="contact-layout" data-reveal-grid>
          <div className="contact-details" data-reveal>
            <span className="eyebrow">TALK TO OUR TEAM</span>
            <h2>What’s your next move?</h2>
            <div data-reveal-part>
              <h3>Business enquiries</h3>
              <p>Tell us about your technology or delivery needs.</p>
              <a className="text-link" href="mailto:contact@lakshya-soft.com">
                contact@lakshya-soft.com <ArrowUpRight size={16} />
              </a>
            </div>
            <div data-reveal-part>
              <h3>Careers & recruitment</h3>
              <p>Explore opportunities or get in touch with HR.</p>
              <a className="text-link" href="mailto:hr@lakshya-soft.com">
                hr@lakshya-soft.com <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <EnquiryForm />
        </div>
        <section
          className="map-panel"
          aria-labelledby="office-heading"
          data-reveal
        >
          <div className="map-info" data-reveal-part>
            <div>
              <h2 id="office-heading">Find us in Madhapur.</h2>
              <p>{office.building}</p>
              <p>{office.address}</p>
            </div>
            <a
              className="button button-dark"
              href={office.maps}
              target="_blank"
              rel="noreferrer"
            >
              Get directions <ArrowUpRight size={16} />
            </a>
          </div>
          <div data-reveal-part>
            <OfficeMap
              title="Google Maps location of Lakshya’s Madhapur office"
              src={`https://maps.google.com/maps?q=${office.coordinates.latitude}%2C${office.coordinates.longitude}&z=17&output=embed`}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

export const metadata = pageMetadata(
  'Contact us',
  'Discuss your project with Lakshya Software Technologies or find our Hyderabad office and business enquiry details.',
  '/contact/',
);
