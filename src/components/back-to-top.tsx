'use client';

import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '@/lib/scroll-to-top';

/**
 * The last control on every page: a quiet label and a round button whose
 * arrow leaves through the top and returns from below on hover. It sits in
 * the footer's closing row, so it is always where a long page ends.
 */
export function BackToTop() {
  return (
    <button
      type="button"
      className="back-to-top"
      data-magnetic
      onClick={scrollToTop}
    >
      <span className="back-to-top-label">Back to top</span>
      <span className="back-to-top-icon" aria-hidden="true">
        <ArrowUp size={17} strokeWidth={1.8} />
        <ArrowUp size={17} strokeWidth={1.8} />
      </span>
    </button>
  );
}
