import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Page not found' };
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>Let’s get you back.</h1>
      <p>The page you’re looking for is unavailable.</p>
      <Link href="/" className="button button-dark">
        Back to homepage ↗
      </Link>
    </main>
  );
}
