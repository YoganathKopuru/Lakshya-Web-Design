'use client';

import { useEffect, useState } from 'react';

const format = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

/**
 * The time in Hyderabad, for the hero badge: a small sign that a real team
 * is at work there now. Rendered after mount (the static export cannot know
 * the time), refreshed every 20 seconds.
 */
export function HyderabadTime({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 20000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return null;
  return (
    <time className={className} dateTime={now.toISOString()}>
      {format.format(now).toUpperCase()} IST
    </time>
  );
}
