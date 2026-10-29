'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { experiences } from '@/data/service-experiences';
import { ExperienceDiagram } from './service-experience-diagrams';
import styles from './service-experience.module.css';

export function ServiceExperience({ serviceSlug }: { serviceSlug: string }) {
  const config = experiences[serviceSlug];
  const [step,setStep] = useState(0);
  const [playing,setPlaying] = useState(false);
  const [inView,setInView] = useState(true);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:.15});
    if (panel.current) observer.observe(panel.current);
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange',pauseWhenHidden);
    return () => { observer.disconnect();document.removeEventListener('visibilitychange',pauseWhenHidden); };
  },[]);
  useEffect(() => {
    if (!playing || !inView) return;
    const timer = window.setTimeout(() => { if (step < config.steps.length-1) setStep(step+1); else setPlaying(false); },1600);
    return () => window.clearTimeout(timer);
  },[step,playing,inView,config.steps.length]);

  const selected = config.steps[step];
  function togglePlay() { if (playing) {setPlaying(false);return;} if (step === config.steps.length-1) setStep(0);setPlaying(true); }

  return <section className={styles.panel} ref={panel} aria-label={`${config.title} interactive visual`} data-playing={playing && inView}>
    <div className={styles.header}><span><i/>{config.motif}</span><span>INTERACTIVE CONCEPT</span></div>
    <div className={styles.canvas}><div className={styles.glow}/><ExperienceDiagram slug={serviceSlug} step={step}/><span className={styles.coordinate}>LST / 0{step+1}</span></div>
    <div className={styles.controls}>
      <div className={styles.stages} role="group" aria-label="Explore the stages">{config.steps.map((stage,index)=><button type="button" key={stage.label} aria-pressed={step===index} onClick={()=>{setPlaying(false);setStep(index);}}><span>0{index+1}</span>{stage.label}</button>)}</div>
      <div className={styles.description} role="status" aria-live="polite" aria-atomic="true"><h3>{selected.title}</h3><p>{selected.description}</p></div>
      <div className={styles.transport}><button type="button" onClick={togglePlay}>{playing ? <Pause size={13}/> : <Play size={13}/>} {playing ? 'Pause flow' : step === config.steps.length-1 ? 'Replay flow' : 'Play flow'}</button><span>Choose a stage to explore</span><button type="button" className={styles.reset} onClick={()=>{setPlaying(false);setStep(0);}} aria-label="Reset visual"><RotateCcw size={14}/></button></div>
    </div>
  </section>;
}
