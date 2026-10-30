import { pageMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ContactBand } from '@/components/chrome';

export default function Company() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <span className="eyebrow">WE ARE LAKSHYA</span>
        <h1>
          Human ingenuity.
          <br />
          <span className="muted">Technical possibility.</span>
        </h1>
        <p>
          Lakshya Software Technologies brings IT services, engineering and
          talent together to help organizations turn their ambitions into
          working solutions.
        </p>
      </section>
      <section className="section wrap">
        <div className="detail-layout">
          <div>
            <span className="eyebrow">TECHNOLOGY, WITH PURPOSE</span>
            <h2>
              From concept to code.
              <br />
              And everything beyond.
            </h2>
          </div>
          <div>
            <p>
              We work across custom software, enterprise platforms, cloud, AI
              and engineering services. Our focus starts with the business
              problem and extends through implementation, integration and
              support.
            </p>
            <p style={{ marginTop: 20 }}>
              Based in Hyderabad, we bring connected capabilities to operational
              challenges—from manufacturing ERP and government workflows to
              healthcare monitoring and people management systems.
            </p>
            <Link className="text-link" href="/work/" style={{ marginTop: 25 }}>
              Explore our delivery areas <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="company-values">
          {[
            [
              'Understand first',
              'Start with the people, processes and priorities behind the technology.',
            ],
            [
              'Build together',
              'Keep requirements, design and engineering connected throughout delivery.',
            ],
            [
              'Keep evolving',
              'Plan for adoption, maintainability and the next stage of your business.',
            ],
          ].map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <ContactBand />
    </main>
  );
}

export const metadata = pageMetadata(
  'Our company',
  'Meet Lakshya Software Technologies, a Hyderabad team connecting software, engineering and talent with business priorities.',
  '/company/',
);
