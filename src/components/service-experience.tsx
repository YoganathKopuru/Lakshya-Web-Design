'use client';
import { useEffect, useRef, useState } from 'react';
import { experiences } from '@/data/service-experiences';
import { ExperienceDiagram } from './service-experience-diagrams';
import styles from './service-experience.module.css';
export function ServiceExperience({ serviceSlug }: { serviceSlug: string }) {
  const config = experiences[serviceSlug];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const started = useRef(false);
  const instantStart =
    serviceSlug === 'ai-data' || serviceSlug === 'semiconductor-vlsi';
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () =>
      setPlaying(visible && !media.matches && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );
    if (panel.current) observer.observe(panel.current);
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  useEffect(() => {
    if (!playing) return;
    const advance = () => setStep((s) => (s + 1) % config.steps.length);
    const opening =
      instantStart && !started.current
        ? setTimeout(() => {
            started.current = true;
            advance();
          }, 180)
        : undefined;
    const timer = setInterval(advance, 3200);
    return () => {
      clearTimeout(opening);
      clearInterval(timer);
    };
  }, [playing, config.steps.length, instantStart]);
  return (
    <section
      ref={panel}
      className={styles.panel}
      aria-label={`${config.title} animated visual`}
      data-playing={playing}
      data-visible={playing}
      data-engaged="true"
      data-step={step}
    >
      <div className={styles.header}>
        <span>
          <i />
          {config.motif}
        </span>
        <span>CONNECTED IN MOTION</span>
      </div>
      <div className={styles.canvas}>
        <div className={styles.glow} />
        <ExperienceDiagram slug={serviceSlug} step={step} />
        <span className={styles.coordinate}>LST / 0{step + 1}</span>
      </div>
    </section>
  );
}
