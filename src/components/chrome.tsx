import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { office } from '@/data/content';
import { ClosingContact } from './closing-contact';
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
          <h3>Explore</h3>
          <Link href="/services/">Expertise</Link>
          <Link href="/work/">Our work</Link>
          <Link href="/company/">Company</Link>
          <Link href="/careers/">Careers</Link>
        </div>
        <div>
          <h3>Connect</h3>
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
          <h3>Find us</h3>
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
      </div>
    </footer>
  );
}
