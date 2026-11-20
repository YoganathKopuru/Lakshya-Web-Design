import type { Metadata } from 'next';
import './globals.css';
import { siteUrl, allowIndexing } from '@/lib/site-metadata';
import { Header, Footer } from '@/components/chrome';
import { CursorSignal } from '@/components/cursor-signal';
import { ScrollMotion } from '@/components/scroll-motion';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  referrer: 'strict-origin-when-cross-origin',
  robots: { index: allowIndexing, follow: allowIndexing },
  title: {
    default: 'Lakshya | Technology, with purpose.',
    template: '%s | Lakshya',
  },
  description:
    'Lakshya Software Technologies. Explore AI, software engineering, enterprise platforms, cloud and engineering services. Based in Hyderabad, India.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="base-uri 'none'; object-src 'none'; form-action 'none'"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <CursorSignal />
        <ScrollMotion />
      </body>
    </html>
  );
}
