import Link from 'next/link';
import { pageMetadata } from '@/lib/site-metadata';
import { ContactBand } from '@/components/chrome';
import { PeopleStory } from '@/components/people-story';
export const metadata = pageMetadata(
  'Why Lakshya',
  'Find your starting point with Lakshya: technology, careers and collaboration.',
  '/why-lakshya/',
);
const audiences = [
  [
    'For clients',
    'A partner from idea to operation.',
    'Connect software, enterprise platforms and engineering around your business challenge. Explore our capabilities and discuss a practical starting point.',
    'Explore expertise',
    '/services/',
  ],
  [
    'For students & early careers',
    'Turn curiosity into a direction.',
    'Explore our technical disciplines, identify the skills you want to deepen, and ask our HR team about suitable opportunities and eligibility.',
    'Explore careers',
    '/careers/',
  ],
  [
    'For experienced professionals',
    'Bring your experience to a new challenge.',
    'Discover work across software, AI, cloud and connected systems. Talk with HR about your strengths, interests and available roles.',
    'Find your next chapter',
    '/careers/',
  ],
  [
    'For partners & investors',
    'Start with a shared conversation.',
    'For strategic collaboration or investment-related enquiries, connect with our business team to discuss your interests and request relevant company information.',
    'Discuss collaboration',
    '/contact/',
  ],
];
export default function WhyLakshya() {
  return (
    <main id="main">
      <section className="page-hero wrap story-hero">
        <span className="eyebrow">WHY LAKSHYA</span>
        <h1>
          Different starting points.
          <br />
          <span className="muted">Shared possibility.</span>
        </h1>
        <p>
          Technology is only the beginning. Find the people, capabilities and
          conversation that move your next chapter forward.
        </p>
      </section>
      <section className="section wrap audience-grid">
        {audiences.map(([label, title, body, cta, href]) => (
          <details className="audience-card" key={label}>
            <summary>
              <span className="eyebrow">{label}</span>
              <h2>{title}</h2>
              <span>Explore your path +</span>
            </summary>
            <p>{body}</p>
            <Link className="text-link" href={href}>
              {cta} ↗
            </Link>
          </details>
        ))}
      </section>
      <PeopleStory />
      <ContactBand />
    </main>
  );
}
