import { pageMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';
import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { ContactBand } from '@/components/chrome';

export default function Careers() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <span className="eyebrow">CAREERS AT LAKSHYA</span>
        <h1>
          Bring your curiosity.
          <br />
          <span className="muted">Build what’s next.</span>
        </h1>
        <p>
          Meaningful challenges. Connected disciplines. Explore a career at the
          intersection of technology, engineering and business.
        </p>
      </section>
      <section className="section wrap careers-layout">
        <div className="empty-jobs">
          <BriefcaseBusiness size={34} strokeWidth={1.3} />
          <h2>Let’s find your next opportunity.</h2>
          <p>
            Current openings are not displayed on this preview. Contact our HR
            team for available roles, or share your resume and the kind of work
            you’re looking for.
          </p>
          <a
            className="button button-dark"
            href="mailto:hr@lakshya-soft.com?subject=Career%20enquiry%20%7C%20Lakshya"
          >
            Email our HR team <ArrowUpRight size={17} />
          </a>
          <p
            className="content-note"
            style={{ marginTop: 20, marginBottom: 0 }}
          >
            Attach your resume in your email. Applications are handled by our HR
            team.
          </p>
        </div>
        <div className="hiring-steps">
          <span className="eyebrow">FIND YOUR FIT</span>
          <h2>
            Many disciplines.
            <br />
            One shared curiosity.
          </h2>
          <p>
            Connect with us about software engineering, AI and data, enterprise
            platforms, cloud, embedded systems or specialist technical roles.
          </p>
          <div className="steps">
            {[
              [
                'Introduce yourself',
                'Tell us about your experience and interests.',
              ],
              [
                'Explore the fit',
                'Our HR team can guide you through available opportunities.',
              ],
              [
                'Stay connected',
                'Reach out directly with questions about your application.',
              ],
            ].map(([title, text], i) => (
              <div className="step" key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactBand />
    </main>
  );
}

export const metadata = pageMetadata(
  'Careers',
  'Explore technology and engineering careers with Lakshya. Contact our HR team about opportunities and your next move.',
  '/careers/',
);
