'use client';
import { useEffect, useRef } from 'react';
export function AudienceCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
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
        if (e.pointerType !== 'mouse' || e.currentTarget.open) return;
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => {
          if (ref.current?.matches(':hover') && !ref.current.open) {
            ref.current.open = true;
          }
        }, 200);
      }}
      onPointerLeave={() => clearTimeout(hoverTimer.current)}
      onPointerDown={() => clearTimeout(hoverTimer.current)}
    >
      {children}
    </details>
  );
}
