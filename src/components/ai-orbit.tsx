'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import styles from './ai-orbit.module.css';

export function AiOrbit() {
  const [paused,setPaused] = useState(false);
  const [reduced,setReduced] = useState(false);
  const [visible,setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();preference.addEventListener('change',update);
    const observer = new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});
    if(root.current) observer.observe(root.current);
    return ()=>{preference.removeEventListener('change',update);observer.disconnect();};
  },[]);
  return <div ref={root} className={styles.art} data-paused={paused||reduced||!visible}>
    <div className={styles.scene} role="img" aria-label="Rotating orbital lines connect your knowledge, workflows and people around an AI core.">
      <div className={styles.glow} aria-hidden="true"/>
      <svg viewBox="0 0 500 420" fill="none" aria-hidden="true"><defs><linearGradient id="ai-orbit-stroke" x1="70" y1="100" x2="420" y2="340" gradientUnits="userSpaceOnUse"><stop stopColor="#6f8ab7"/><stop offset=".55" stopColor="#71bba7"/><stop offset="1" stopColor="#c9efdb"/></linearGradient></defs>
        <g className={styles.ringOne}><g transform="rotate(-28 250 210)"><ellipse cx="250" cy="210" rx="192" ry="91" className={styles.rail}/><ellipse cx="250" cy="210" rx="192" ry="91" className={styles.tracer}/><circle cx="442" cy="210" r="4" className={styles.satellite}/></g></g>
        <g className={styles.ringTwo}><g transform="rotate(63 250 210)"><ellipse cx="250" cy="210" rx="180" ry="83" className={styles.rail}/><ellipse cx="250" cy="210" rx="180" ry="83" className={styles.tracer}/><circle cx="70" cy="210" r="3" className={styles.satellite}/></g></g>
        <circle cx="250" cy="210" r="120" stroke="#93cdb518" strokeDasharray="2 10"/>
      </svg>
      <div className={styles.core} aria-hidden="true"><span>AI</span></div>
      <span className={`${styles.label} ${styles.knowledge}`} aria-hidden="true"><i/>YOUR KNOWLEDGE</span>
      <span className={`${styles.label} ${styles.workflows}`} aria-hidden="true"><i/>YOUR WORKFLOWS</span>
      <span className={`${styles.label} ${styles.people}`} aria-hidden="true"><i/>YOUR PEOPLE</span>
    </div>
    <button type="button" className={styles.motionButton} disabled={reduced} onClick={()=>setPaused(!paused)} aria-pressed={paused||reduced} aria-label={reduced?'Orbital motion disabled by reduced-motion preference':paused?'Resume orbital motion':'Pause orbital motion'}>{paused||reduced?<Play size={11}/>:<Pause size={11}/>} {reduced?'Motion reduced':paused?'Resume motion':'Pause motion'}</button>
  </div>;
}
