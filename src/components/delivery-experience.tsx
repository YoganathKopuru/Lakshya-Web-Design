import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projectAreas } from '@/data/content';
import { ProjectVisual } from './visuals';
import styles from './delivery-experience.module.css';

const journeys = [ ['Operations', 'ERP', 'Clarity'], ['Request', 'Review', 'Action'], ['Capture', 'Connect', 'Monitor'] ];

export function DeliveryExperience() {
  return <section className="section wrap" id="delivery">
    <div className="section-head"><div><span className="eyebrow">02 — DELIVERY EXPERIENCE</span><h2>Technology that connects<br/><span className="muted">to the real world.</span></h2></div><Link className="text-link" href="/work/">Explore our work <ArrowUpRight size={18}/></Link></div>
    <div className={styles.grid}>{projectAreas.map((project,index) => <Link className={styles.card} href={`/work/#${project.type}`} key={project.type} aria-labelledby={`delivery-${project.type}`}>
      <div className={styles.visual}><ProjectVisual type={project.type}/><span className={styles.scan} aria-hidden="true"/><div className={styles.visualTop} aria-hidden="true"><span>FIELD NOTES / 0{index+1}</span><span className={styles.signal}/></div><div className={styles.journey} aria-hidden="true">{journeys[index].map((step,i)=><span key={step} style={{'--step':i} as React.CSSProperties}>{i>0 && <i/>}{step}</span>)}</div></div>
      <div className={styles.copy}><span className="eyebrow">{project.category}</span><h3 id={`delivery-${project.type}`}>{project.title}</h3><p>{project.text}</p><div className={styles.bottom}><span>Explore delivery area</span><span className={styles.arrow}><ArrowUpRight size={20}/></span></div></div>
    </Link>)}</div>
    <p className="content-note">Selected delivery areas. Detailed case studies will be added as approved project stories become available.</p>
  </section>;
}
