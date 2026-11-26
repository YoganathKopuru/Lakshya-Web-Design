import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { office } from '@/data/content';
import { ClosingContact } from './closing-contact';
import { BackToTop } from './back-to-top';
export { Header } from './header';

export function ContactBand() {
  return <ClosingContact />;
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <Link href="/" className="footer-wordmark">
            lakshya<span>®</span>
          </Link>
          <p>
            Technology, with purpose.
            <br />
            Possibilities, made real.
          </p>
          <a href="mailto:contact@lakshya-soft.com">
            contact@lakshya-soft.com <ArrowUpRight size={15} />
          </a>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/services/">Expertise</Link>
          <Link href="/work/">Our work</Link>
          <Link href="/company/">Company</Link>
          <Link href="/careers/">Careers</Link>
        </div>
        <div>
          <h2>Connect</h2>
          <Link href="/contact/">Business enquiries</Link>
          <a href="mailto:hr@lakshya-soft.com">Join our team</a>
          <a
            href="https://www.linkedin.com/company/lakshya-software-technologies"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="footer-location">
          <h2>Find us</h2>
          <p>
            {office.building}
            <br />
            {office.address}
          </p>
          <a href={office.maps} target="_blank" rel="noreferrer">
            Get directions <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Lakshya Software Technologies.</span>
        <span>Built around people. Powered by technology.</span>
        <BackToTop />
      </div>
      <div className="footer-mega" aria-hidden="true">
        <span data-footer-mega>lakshya</span>
      </div>
    </footer>
  );
}
