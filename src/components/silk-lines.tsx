import type { CSSProperties } from 'react';

/**
 * Bundles of fine curves that draw themselves in, like threads of silk at the
 * edges of a panel. Pure SVG + CSS (see .silk in globals.css): each thread is
 * normalised with pathLength=1 so the draw-in is the same on every curve, and
 * the threads are staggered so the bundle unfurls rather than appears.
 */
const THREADS = 16;

function thread(side: 'left' | 'right', i: number) {
  const s = i / (THREADS - 1);
  if (side === 'left')
    return `M ${-60 + s * 120} -40 C ${300 + s * 90} ${210 - s * 60}, ${-160 + s * 120} ${560 + s * 40}, ${210 + s * 150} 940`;
  return `M ${1500 - s * 120} -40 C ${1140 - s * 90} ${260 + s * 40}, ${1600 - s * 120} ${520 - s * 50}, ${1230 - s * 150} 940`;
}

export function SilkLines({
  className = '',
  sides = ['left', 'right'],
}: {
  className?: string;
  sides?: Array<'left' | 'right'>;
}) {
  return (
    <svg
      className={`silk ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {sides.map((side) => (
        <g key={side} className={`silk-bundle silk-${side}`}>
          {Array.from({ length: THREADS }, (_, i) => (
            <path
              key={i}
              d={thread(side, i)}
              pathLength={1}
              style={
                {
                  '--i': i,
                  opacity: 0.12 + 0.4 * Math.sin((Math.PI * i) / THREADS),
                } as CSSProperties
              }
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
