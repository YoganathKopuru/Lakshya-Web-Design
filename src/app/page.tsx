import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MoveDown } from 'lucide-react';
import { HeroVisual } from '@/components/hero-visual';
import { ServicePlacards } from '@/components/service-placards';
import { ContactBand } from '@/components/chrome';
import { DeliveryExperience } from '@/components/delivery-experience';
import { CareersInvitation } from '@/components/careers-invitation';
import { AiOrbit } from '@/components/ai-orbit';
import { EmployeeVoices } from '@/components/employee-voices';

export default function Home() { return <main id="main">
  <section className="hero wrap"><div className="hero-content"><div className="eyebrow"><span className="status-dot"/> ENGINEERING THE NEXT</div><h1>Intelligence.<br />Engineering.<br /><span>Real possibility.</span></h1><p>From AI ambition to enterprise transformation.<br className="desktop-br"/> We bring technology, talent and purposeful thinking together to move your business forward.</p><div className="hero-actions"><Link className="button button-dark" href="/services/">Explore our expertise <ArrowUpRight size={18}/></Link><Link className="text-link" href="/contact/">Let’s build together <ArrowRight size={17}/></Link></div><div className="hero-note"><span>FROM IDEA TO IMPACT</span><span className="note-line"/><span>YOUR TECHNOLOGY PARTNER</span></div></div><HeroVisual/></section>
  <div className="capability-strip"><div className="wrap"><span>INTELLIGENT BY DESIGN</span><i/>AI & Data<i/>Software Engineering<i/>Enterprise Platforms<i/>Cloud & Beyond</div></div>
  <section className="section wrap" id="expertise"><div className="section-head"><div><span className="eyebrow">01 — OUR EXPERTISE</span><h2>Big-picture thinking.<br /><span className="muted">Deep technical expertise.</span></h2></div><p>One technology partner. A connected range of capabilities.<br/>Built around where you are—and where you want to go.</p></div><ServicePlacards/></section>
  <section className="ai-feature" id="ai-in-motion"><div className="wrap ai-feature-inner"><AiOrbit/><div className="ai-copy"><span className="eyebrow">BEYOND THE BUZZWORDS</span><h2>Make AI part of<br />your everyday.</h2><p>Put your knowledge to work. Connect your workflows. Give your people room to do more.</p><p>We help shape practical AI use cases—from enterprise search and document intelligence to agentic automation—with a clear path from exploration to integration.</p><Link className="button button-light" href="/services/ai-data/">Explore AI & data <ArrowUpRight size={18}/></Link></div></div></section>
  <DeliveryExperience/>
  <section className="approach-section"><div className="wrap approach-layout"><div><span className="eyebrow">03 — THE LAKSHYA APPROACH</span><h2>Built with you.<br /><span className="muted">For what comes next.</span></h2><p>Great technology starts with understanding.<br/>We connect your priorities with a practical delivery plan.</p><Link className="text-link" href="/company/">Get to know Lakshya <ArrowUpRight size={18}/></Link></div><div className="steps">{[['Understand','Start with the problem, the people and the possibilities.'],['Shape','Connect the right technologies with a clear delivery roadmap.'],['Build','Design, engineer and validate with your team in the loop.'],['Evolve','Support adoption and keep improving as your business grows.']].map(([title,text],i)=><div className="step" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div>{i<3 && <MoveDown size={17}/>}</div>)}</div></div></section>
  <CareersInvitation/><EmployeeVoices/><ContactBand/>
  </main>; }
