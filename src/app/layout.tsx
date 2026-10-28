import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/chrome';

export const metadata: Metadata = {
  title: { default: 'Lakshya | Technology, with purpose.', template: '%s | Lakshya' },
  description: 'Lakshya Software Technologies. Explore AI, software engineering, enterprise platforms, cloud and engineering services. Based in Hyderabad, India.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /></body></html>;
}
