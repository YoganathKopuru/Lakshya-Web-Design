import { PeopleStory } from '@/components/people-story';
import { pageMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ContactBand } from '@/components/chrome';

export default function Company() {
  return (
    <main id="main">
      <section className="page-hero wrap story-hero ocean-hero">
        <div className="ocean-waves" aria-hidden="true">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path d="M-300 160Q0 20 300 160T900 160T1500 160V500H-300Z" />
            <path d="M-300 240Q0 90 300 240T900 240T1500 240V500H-300Z" />
            <path d="M-300 310Q0 170 300 310T900 310T1500 310V500H-300Z" />
          </svg>
        </div>
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
      <PeopleStory />
      <ContactBand />
    </main>
  );
}

export const metadata = pageMetadata(
  'Our company',
  'Meet Lakshya Software Technologies, a Hyderabad team connecting software, engineering and talent with business priorities.',
  '/company/',
);
