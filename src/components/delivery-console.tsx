'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { journeyStages } from '@/data/journey';
import styles from './delivery-console.module.css';

/**
 * The hero's "live" panel: Lakshya at a glance, with the delivery journey
 * drawn as a line across its seven stages. Each practice tab moves the focus
 * to the stage that practice leans on and names one real service area. The
 * line is a picture of the journey, not a data series, so it carries no axis.
 * Tabs advance on their own while the panel is on screen, until the visitor
 * picks one; reduced motion keeps them still.
 */
const practices = [
  {
    id: 'software',
    label: 'Software',
    focus: 3,
    area: 'Web & mobile experiences',
    curve: [150, 134, 118, 84, 74, 56, 40],
  },
  {
    id: 'ai',
    label: 'AI & data',
    focus: 1,
    area: 'Enterprise knowledge & RAG',
    curve: [156, 104, 96, 82, 70, 58, 44],
  },
  {
    id: 'platforms',
    label: 'Platforms',
    focus: 5,
    area: 'ERP implementation',
    curve: [152, 138, 126, 108, 92, 52, 42],
  },
];

const W = 600;
const H = 190;
const xAt = (i: number) => 24 + (i * (W - 48)) / (journeyStages.length - 1);

/** Catmull-Rom through every stage, as cubic Béziers. */
function line(curve: number[]) {
  const pts = curve.map((y, i) => [xAt(i), y] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6}, ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6}, ${x2} ${y2}`;
  }
  return d;
}

export function DeliveryConsole() {
  const [active, setActive] = useState(0);
  const [chosen, setChosen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const practice = practices[active];
  const stage = journeyStages[practice.focus];
  const path = line(practice.curve);
  const at = (xAt(practice.focus) / W) * 100;
  // Keep the tooltip inside the chart when the focus sits near an edge.
  const shift = at < 30 ? -18 : at > 70 ? -82 : -50;

  useEffect(() => {
    const element = root.current;
    if (!element || chosen) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer: number | undefined;
    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (!entry.isIntersecting) return;
      timer = window.setInterval(() => {
        if (!paused && !document.hidden)
          setActive((current) => (current + 1) % practices.length);
      }, 4200);
    });
    observer.observe(element);
    element.addEventListener('pointerenter', pause);
    element.addEventListener('pointerleave', resume);
    element.addEventListener('focusin', pause);
    element.addEventListener('focusout', resume);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      element.removeEventListener('pointerenter', pause);
      element.removeEventListener('pointerleave', resume);
      element.removeEventListener('focusin', pause);
      element.removeEventListener('focusout', resume);
    };
  }, [chosen]);

  const choose = (index: number) => {
    setChosen(true);
    setActive(index);
  };
  const onKey = (event: React.KeyboardEvent) => {
    const step =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + practices.length) % practices.length;
    choose(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={styles.console} ref={root} data-console>
      <div className={styles.bar}>
        <span className={styles.title}>
          <i className={styles.live} aria-hidden="true" />
          Delivery overview
        </span>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Practice"
          onKeyDown={onKey}
        >
          {practices.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${item.id}`}
              aria-selected={index === active}
              aria-controls={`${id}-panel`}
              tabIndex={index === active ? 0 : -1}
              className={styles.tab}
              onClick={() => choose(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.figure}>
          <span className={styles.label}>Projects worldwide</span>
          <strong className={styles.big}>
            350<sup>+</sup>
          </strong>
          <span className={styles.chip}>Since 2015 · Hyderabad</span>
          <dl className={styles.mini}>
            <div>
              <dt>Client satisfaction</dt>
              <dd>99%</dd>
              <span className={styles.meter} aria-hidden="true">
                <i />
              </span>
            </div>
            <div>
              <dt>Years of experience</dt>
              <dd>10+</dd>
            </div>
            <div>
              <dt>Connected practices</dt>
              <dd>8</dd>
            </div>
          </dl>
        </div>

        <div
          className={styles.chart}
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${practice.id}`}
        >
          <div className={styles.chartHead}>
            <span className={styles.label}>Delivery journey</span>
            <span className={styles.note}>
              From first idea to lasting impact
            </span>
          </div>
          <div className={styles.plot}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#9ee6d3" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#9ee6d3" stopOpacity="0" />
                </linearGradient>
              </defs>
              {journeyStages.map((_, i) => (
                <line
                  key={i}
                  x1={xAt(i)}
                  x2={xAt(i)}
                  y1="12"
                  y2={H}
                  className={
                    i === practice.focus ? styles.guideOn : styles.guide
                  }
                />
              ))}
              <path
                key={`area-${practice.id}`}
                className={styles.area}
                d={`${path} L ${xAt(journeyStages.length - 1)} ${H} L ${xAt(0)} ${H} Z`}
                fill={`url(#${id}-area)`}
              />
              <path
                key={`line-${practice.id}`}
                className={styles.line}
                d={path}
                pathLength={1}
              />
            </svg>
            <span
              className={styles.marker}
              style={{
                left: `${at}%`,
                top: `${(practice.curve[practice.focus] / H) * 100}%`,
              }}
              aria-hidden="true"
            />
            <div
              className={styles.tip}
              style={{ left: `${at}%`, translate: `${shift}% -100%` }}
            >
              <b>
                {stage.name} · {stage.detail}
              </b>
              <span>{practice.area}</span>
            </div>
          </div>
          <ol className={styles.stages}>
            {journeyStages.map((item, i) => (
              <li
                key={item.name}
                aria-current={i === practice.focus ? 'step' : undefined}
              >
                {item.name}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
