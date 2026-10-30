'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { services, office } from '@/data/content';
import { ClosingContact } from './closing-contact';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);
  useEffect(() => { function close(e: KeyboardEvent) { if (e.key === 'Escape') { setOpen(false); setMega(false); } } document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, []);
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="brand" aria-label="Lakshya home"><img src="/logo.png" alt="Lakshya Software Technologies" width="164" height="54" /></Link>
    <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      <div className="expertise-nav"><button onClick={() => setMega(!mega)} aria-expanded={mega} aria-controls="expertise-menu" className={pathname.startsWith('/services') ? 'nav-button active' : 'nav-button'}>Expertise <ChevronDown size={13} /></button>
      {mega && <div className="mega-menu" id="expertise-menu"><div className="mega-intro"><span className="eyebrow">OUR EXPERTISE</span><h3>Ideas into<br />real-world impact.</h3><Link href="/services/" onClick={() => setMega(false)}>Explore all services <ArrowRight size={16}/></Link></div><div className="mega-links">{services.map(s => <Link key={s.slug} href={`/services/${s.slug}/`}>{s.name}<ArrowUpRight size={16}/></Link>)}</div></div>}</div>
      {[['Work','/work/'],['Industries','/industries/'],['Company','/company/'],['Careers','/careers/']].map(([label, href]) => <Link className={pathname === href || pathname === href.slice(0,-1) ? 'active' : ''} key={href} href={href}>{label}</Link>)}
      <Link className="button button-dark header-cta" href="/contact/">Let’s talk <ArrowUpRight size={16} /></Link>
    </nav>
  </div>{mega && <button className="menu-scrim" aria-label="Close services menu" onClick={() => setMega(false)} />}</header>;
}
export function ContactBand() { return <ClosingContact/>; }
export function Footer() { return <footer className="site-footer"><div className="wrap footer-grid"><div className="footer-about"><Link href="/" className="footer-wordmark">lakshya<span>®</span></Link><p>Technology, with purpose.<br />Possibilities, made real.</p><a href="mailto:contact@lakshya-soft.com">contact@lakshya-soft.com <ArrowUpRight size={15}/></a></div><div><h3>Explore</h3><Link href="/services/">Expertise</Link><Link href="/work/">Our work</Link><Link href="/company/">Company</Link><Link href="/careers/">Careers</Link></div><div><h3>Connect</h3><Link href="/contact/">Business enquiries</Link><a href="mailto:hr@lakshya-soft.com">Join our team</a><a href="https://www.linkedin.com/company/lakshya-software-technologies" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13}/></a></div><div className="footer-location"><h3>Find us</h3><p>{office.building}<br />{office.address}</p><a href={office.maps} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15}/></a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Lakshya Software Technologies.</span><span>Built around people. Powered by technology.</span></div></footer>; }
