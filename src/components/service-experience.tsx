'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, MousePointer2 } from 'lucide-react';
import { experiences } from '@/data/service-experiences';
import { ExperienceDiagram } from './service-experience-diagrams';
import styles from './service-experience.module.css';

export function ServiceExperience({ serviceSlug }: { serviceSlug: string }) {
  const config = experiences[serviceSlug];
  const [step,setStep] = useState(0);
  const [playing,setPlaying] = useState(false);
  const [inView,setInView] = useState(true);
  const [engaged,setEngaged] = useState(false);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry])=>{ setInView(entry.isIntersecting); if (!entry.isIntersecting) setPlaying(false); },{threshold:.15});
    if (panel.current) observer.observe(panel.current);
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange',pauseWhenHidden);
    return () => { observer.disconnect();document.removeEventListener('visibilitychange',pauseWhenHidden); };
  },[]);
  useEffect(() => {
    if (!playing || !inView) return;
    const timer = window.setTimeout(() => { if (step < config.steps.length-1) setStep(step+1); else setPlaying(false); },5000);
    return () => window.clearTimeout(timer);
  },[step,playing,inView,config.steps.length]);

  const selected = config.steps[step];
  const playLabel = playing ? 'Pause flow' : step === config.steps.length-1 ? 'Replay flow' : 'Play flow';
  function togglePlay() { setEngaged(true);if (playing) {setPlaying(false);return;} if (step === config.steps.length-1) setStep(0);setPlaying(true); }

  return <section className={styles.panel} ref={panel} aria-label={`${config.title} interactive visual`} data-playing={playing && inView} data-visible={inView} data-engaged={engaged}>
    <div className={styles.header}><span><i/>{config.motif}</span><span>INTERACTIVE CONCEPT</span></div>
    <div className={styles.canvas}><div className={styles.glow}/><ExperienceDiagram slug={serviceSlug} step={step}/><span className={styles.coordinate}>LST / 0{step+1}</span></div>
    <div className={styles.controls}>
      <div className={styles.playback}>
        <button type="button" className={styles.playButton} onClick={togglePlay} aria-label={playLabel} aria-pressed={playing}>
          <span className={styles.playIcon} aria-hidden="true">{playing ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}</span>
          <span className={styles.playText}><b>{playLabel}</b><small>{playing ? 'Pause whenever you like' : step === config.steps.length-1 ? 'See the idea unfold again' : 'A four-stage guided walkthrough'}</small></span>
          <ArrowRight size={18} className={styles.playArrow} aria-hidden="true"/>
        </button>
        <button type="button" className={styles.resetButton} onClick={()=>{setEngaged(true);setPlaying(false);setStep(0);}} aria-label="Reset visual" title="Back to the beginning"><RotateCcw size={17}/></button>
      </div>
      <div className={styles.progressCaption}><span>{playing ? 'THE FLOW IS IN MOTION' : engaged ? 'EXPLORE AT YOUR OWN PACE' : 'PRESS PLAY. SEE WHAT’S POSSIBLE.'}</span><span>0{step+1} / 04</span></div>
      <div className={styles.progressTrack} aria-hidden="true">{config.steps.map((stage,index)=><i key={stage.label} data-complete={index<=step}/>)}</div>
      <div className={styles.stages} role="group" aria-label="Explore the stages">{config.steps.map((stage,index)=><button type="button" key={stage.label} aria-pressed={step===index} onClick={()=>{setEngaged(true);setPlaying(false);setStep(index);}}><span>0{index+1}</span>{stage.label}</button>)}</div>
      <div className={styles.description} role="status" aria-live="polite" aria-atomic="true"><h3>{selected.title}</h3><p>{selected.description}</p></div>
      <p className={styles.interactionHint}><MousePointer2 size={11} aria-hidden="true"/> Or choose any stage to take control.</p>
    </div>
  </section>;
}
