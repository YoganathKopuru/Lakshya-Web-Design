import type { Metadata, Viewport } from 'next';
import './globals.css';
import './theme-midnight.css';
import './signature.css';
import { siteUrl, allowIndexing } from '@/lib/site-metadata';
import { defaultTheme, themeInitScript, themes } from '@/lib/theme';
import { Header, Footer } from '@/components/chrome';
import { CursorSignal } from '@/components/cursor-signal';
import { ScrollMotion } from '@/components/scroll-motion';
import { SmoothScroll } from '@/components/smooth-scroll';

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

export const viewport: Viewport = {
  themeColor: themes.find((theme) => theme.id === defaultTheme)?.chrome,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-theme={defaultTheme}
      suppressHydrationWarning
    >
      <head>
        {/* Host-independent baseline; full policy is sent as headers. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="base-uri 'none'; object-src 'none'; form-action 'none'"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
        <SmoothScroll />
      </body>
    </html>
  );
}
