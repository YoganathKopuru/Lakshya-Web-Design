import Link from 'next/link';
import { Curtain } from '@/components/curtain';
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>
        <Curtain>Let’s get you back.</Curtain>
      </h1>
      <p>The page you’re looking for is unavailable.</p>
      <Link href="/" className="button button-dark">
        Back to homepage ↗
      </Link>
    </main>
  );
}
