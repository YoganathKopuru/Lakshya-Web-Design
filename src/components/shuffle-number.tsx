'use client';
import { useEffect, useRef, useState } from 'react';
export function ShuffleNumber({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => {
      clearInterval(timer);
      setDisplay(value);
    };
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observer.disconnect();
        if (media.matches) return;
        let tick = 0;
        timer = setInterval(() => {
          tick++;
          if (tick >= 14) {
            stop();
            return;
          }
          setDisplay(
            value.replace(/\d/g, (digit, index) =>
              tick > 8 + index ? digit : String(Math.floor(Math.random() * 10)),
            ),
          );
        }, 65);
      },
      { threshold: 0.6 },
    );
    if (ref.current) observer.observe(ref.current);
    media.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      clearInterval(timer);
      media.removeEventListener('change', stop);
    };
  }, [value]);
  return (
    <strong
      ref={ref}
      aria-label={value}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <span aria-hidden="true">{display}</span>
    </strong>
  );
}
