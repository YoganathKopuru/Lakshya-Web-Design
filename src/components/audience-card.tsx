'use client';
import { useRef } from 'react';
export function AudienceCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={ref}
      className="audience-card"
      onToggle={(event) => {
        const current = event.currentTarget;
        if (current.open) {
          for (const card of current.parentElement?.querySelectorAll(
            'details',
          ) ?? []) {
            if (card !== current) card.open = false;
          }
        }
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse' && ref.current) {
          for (const card of ref.current.parentElement?.querySelectorAll(
            'details',
          ) ?? [])
            card.open = card === ref.current;
        }
      }}
    >
      {children}
    </details>
  );
}
