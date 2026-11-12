import { pageMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { services } from '@/data/content';
import { ContactBand } from '@/components/chrome';
import { ServiceExperience } from '@/components/service-experience';
import { QualityStandards } from '@/components/quality-standards';
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  return s ? pageMetadata(s.name, s.description, `/services/${s.slug}/`) : {};
}
export default async function Service({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  // Suggest the next three services in order (wrapping around) so each page
  // links to a different set, rather than every page repeating the first three.
  const index = services.indexOf(s);
  const related = [1, 2, 3].map(
    (offset) => services[(index + offset) % services.length],
  );
  return (
    <main id="main">
      <section className="page-hero wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link href="/services/">Expertise</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page">{s.name}</span>
        </nav>
        <div className="detail-hero">
          <div>
            <span className="eyebrow">{s.name.toUpperCase()}</span>
            <h1>{s.intro}</h1>
            <p>{s.description}</p>
            <div className="tag-row">
              {s.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <Link
              className="button button-dark"
              href={`/contact/?service=${s.slug}`}
            >
              Discuss your project <ArrowUpRight size={17} />
            </Link>
          </div>
          <ServiceExperience key={s.slug} serviceSlug={s.slug} />
        </div>
      </section>
      <section className="section wrap detail-layout">
        <div>
          <span className="eyebrow">TURNING POSSIBILITY INTO PRACTICE</span>
          <h2>
            Start with your challenge.
            <br />
            Build with purpose.
          </h2>
          <p>{s.detail}</p>
        </div>
        <div className="area-list">
          {s.areas.map((area, i) => (
            <div className="area-row" key={area}>
              <span>0{i + 1}</span>
              <h3>{area}</h3>
            </div>
          ))}
        </div>
      </section>
      {s.slug === 'quality-managed-services' && <QualityStandards />}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <span className="eyebrow">CONNECTED EXPERTISE</span>
        <h2 style={{ marginTop: 16 }}>Explore what’s next.</h2>
        <div className="related-links">
          {related.map((r) => (
            <Link
              className="related-link"
              href={`/services/${r.slug}/`}
              key={r.slug}
            >
              {r.name}
              <ArrowUpRight size={19} />
            </Link>
          ))}
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
