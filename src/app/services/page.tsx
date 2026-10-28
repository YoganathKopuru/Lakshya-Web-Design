import type { Metadata } from 'next';
import { ServiceGrid } from '@/components/service-grid';
import { ContactBand } from '@/components/chrome';
export const metadata: Metadata = { title: 'Our expertise' };
export default function Services() { return <main id="main"><section className="page-hero wrap"><span className="eyebrow">OUR EXPERTISE</span><h1>Connected capabilities.<br/><span className="muted">Countless possibilities.</span></h1><p>From emerging AI to the systems your business relies on. Find the expertise to move your next idea forward.</p></section><section className="section wrap"><ServiceGrid/></section><ContactBand/></main>; }
