import { pageMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projectAreas } from '@/data/content';
import { ProjectVisual } from '@/components/visuals';
import { ContactBand } from '@/components/chrome';

export default function Work() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <span className="eyebrow">DELIVERY EXPERIENCE</span>
        <h1>
          Real challenges.
          <br />
          <span className="muted">Purposeful technology.</span>
        </h1>
        <p>
          A look at the areas where Lakshya has delivered technology solutions.
          Full project stories will follow as approved details become available.
        </p>
      </section>
      <section className="section wrap work-list">
        {projectAreas.map((p) => (
          <article className="work-row" id={p.type} key={p.type}>
            <ProjectVisual type={p.type} />
            <div>
              <span className="eyebrow">{p.category}</span>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
              <span className="tag">
                Project area · detailed case study forthcoming
              </span>
              <br />
              <Link className="text-link" href={`/services/${p.service}/`}>
                Explore related expertise <ArrowUpRight size={17} />
              </Link>
            </div>
          </article>
        ))}
        <div className="industry-card">
          <span className="eyebrow">MORE DELIVERY AREAS</span>
          <h3 style={{ marginTop: 16 }}>
            People, inventory and enterprise operations.
          </h3>
          <p>
            Our experience also includes HRMS and payroll applications, Zoho
            Inventory implementation for furniture operations, and enterprise
            cloud services.
          </p>
          <Link className="text-link" href="/contact/">
            Talk about a similar challenge <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <ContactBand />
    </main>
  );
}

export const metadata = pageMetadata(
  'Our work',
  'Explore Lakshya delivery areas in manufacturing ERP, workflow automation and healthcare monitoring.',
  '/work/',
);
