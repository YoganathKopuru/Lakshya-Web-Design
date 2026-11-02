'use client';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './ai-orbit.module.css';

// The rail and its moving signal use the exact same SVG path and coordinate system.
const orbits = [
  {
    path: 'M 438 210 A 188 94 0 1 1 62 210 A 188 94 0 1 1 438 210',
    angle: -28,
    duration: '18s',
    start: 'translate(438 210)',
  },
  {
    path: 'M 76 210 A 174 88 0 1 0 424 210 A 174 88 0 1 0 76 210',
    angle: 62,
    duration: '24s',
    start: 'translate(76 210)',
  },
];

export function AiOrbit() {
  const gradientId = `orbit-${useId().replace(/:/g, '')}`;
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      preference.removeEventListener('change', update);
      observer.disconnect();
    };
  }, []);
  const moving = visible && !reduced;
  return (
    <div
      ref={root}
      className={styles.art}
      data-motion={moving ? 'running' : 'resting'}
    >
      <div
        className={styles.scene}
        role="img"
        aria-label="Signals orbit an AI core, connecting your knowledge, workflows and people."
      >
        <div className={styles.glow} aria-hidden="true" />
        <svg viewBox="0 0 500 420" fill="none" aria-hidden="true">
          <defs>
            <linearGradient
              id={gradientId}
              x1="65"
              y1="100"
              x2="440"
              y2="320"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5477a2" />
              <stop offset=".55" stopColor="#74bcae" />
              <stop offset="1" stopColor="#bee9d2" />
            </linearGradient>
          </defs>
          <circle
            cx="250"
            cy="210"
            r="145"
            stroke="#93cdb521"
            strokeDasharray="2 10"
          />
          {orbits.map((orbit, index) => (
            <g
              key={orbit.path}
              transform={`rotate(${orbit.angle} 250 210)`}
              data-orbit={index}
            >
              <path
                d={orbit.path}
                stroke={`url(#${gradientId})`}
                className={styles.rail}
                data-orbit-path=""
              />
              <g
                className={styles.signal}
                transform={moving ? undefined : orbit.start}
                data-orbit-signal=""
              >
                <circle r="10" fill="#9ce3c4" opacity=".09" />
                <circle r="6" fill="#a8e8ca" opacity=".2" />
                <circle r="3.5" fill="#def9e8" />
                {moving && (
                  <animateMotion
                    path={orbit.path}
                    dur={orbit.duration}
                    repeatCount="indefinite"
                    calcMode="paced"
                  />
                )}
              </g>
            </g>
          ))}
          <g className={styles.core}>
            <path
              d="M250 125 335 210 250 295 165 210Z"
              fill="#173e49"
              stroke="#76b9aa"
              strokeWidth="1"
            />
            <path d="M250 138 322 210 250 282 178 210Z" stroke="#b7e8ce30" />
            <path d="M250 151 309 210 250 269 191 210Z" stroke="#b7e8ce20" />
            <text x="250" y="214" textAnchor="middle" dominantBaseline="middle">
              AI
            </text>
          </g>
        </svg>
        <span
          className={`${styles.label} ${styles.knowledge}`}
          aria-hidden="true"
        >
          <i />
          YOUR KNOWLEDGE
        </span>
        <span
          className={`${styles.label} ${styles.workflows}`}
          aria-hidden="true"
        >
          <i />
          YOUR WORKFLOWS
        </span>
        <span className={`${styles.label} ${styles.people}`} aria-hidden="true">
          <i />
          YOUR PEOPLE
        </span>
      </div>
    </div>
  );
}
