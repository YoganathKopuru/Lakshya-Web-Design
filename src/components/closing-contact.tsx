import Link from 'next/link';
import { ArrowUpRight, Sparkles, Code2, Layers3, Mail } from 'lucide-react';
import styles from './closing-contact.module.css';

const startingPoints = [
  {label:'Explore AI & data',slug:'ai-data',icon:Sparkles},
  {label:'Build better software',slug:'software-engineering',icon:Code2},
  {label:'Connect enterprise systems',slug:'enterprise-platforms',icon:Layers3},
];

export function ClosingContact() {
  return <section className={`wrap ${styles.band}`} id="start-a-conversation">
    <div className={styles.ambient} aria-hidden="true"><svg viewBox="0 0 900 420" fill="none"><path d="M150 410C230 410 270 80 580 80S820 250 950-20"/><path d="M190 450C290 400 340 115 615 115S830 280 970 30"/><path d="M210 490C330 430 395 150 650 150S850 310 990 80"/><circle cx="580" cy="80" r="4"/><circle cx="650" cy="150" r="3"/></svg></div>
    <div className={styles.top}><div className={styles.copy}><span className={styles.eyebrow}>YOUR NEXT CHAPTER</span><h2>Have a challenge?<br/>Let’s build what’s next.</h2><p>An idea to explore. A system to improve.<br/>A conversation is a good place to start.</p></div>
      <div className={styles.action}><span className={styles.actionLabel}>TURN POSSIBILITY INTO A PLAN</span><Link className={styles.primary} href="/contact/"><span>Start a conversation</span><span className={styles.arrow}><ArrowUpRight size={25}/></span></Link><a href="mailto:contact@lakshya-soft.com" className={styles.email}><Mail size={13}/>contact@lakshya-soft.com</a></div></div>
    <div className={styles.paths}><span>What are you exploring?</span><div>{startingPoints.map(({label,slug,icon:Icon})=><Link href={`/contact/?service=${slug}`} key={slug}><Icon size={15} strokeWidth={1.5}/>{label}<ArrowUpRight size={14}/></Link>)}</div></div>
  </section>;
}
