import Link from 'next/link';
import {
  ArrowUpRight,
  Search,
  Map,
  PenTool,
  Code2,
  ShieldCheck,
  CloudUpload,
  Headphones,
} from 'lucide-react';
import styles from './delivery-journey.module.css';

const stages = [
  { name: 'Understand', detail: 'Requirements & discovery', Icon: Search },
  { name: 'Plan', detail: 'Strategy & roadmap', Icon: Map },
  { name: 'Design', detail: 'Experience & prototypes', Icon: PenTool },
  { name: 'Build', detail: 'Engineering & integration', Icon: Code2 },
  { name: 'Test', detail: 'Quality & assurance', Icon: ShieldCheck },
  { name: 'Deploy', detail: 'Launch & adoption', Icon: CloudUpload },
  { name: 'Support', detail: 'Maintain & improve', Icon: Headphones },
];
const explanations = [
  'Agree on the problem, stakeholders and what success should look like.',
  'Define priorities, dependencies and a practical delivery roadmap.',
  'Explore user journeys and validate the proposed experience before building.',
  'Develop and integrate the solution in manageable increments.',
  'Check expected behavior, reliability and readiness for release.',
  'Prepare the release, rollout and handover with your team.',
  'Maintain the solution and identify opportunities for improvement.',
];
const numbers = [
  ['2015', 'Established'],
  ['9+', 'Years of experience'],
  ['350+', 'Projects worldwide'],
  ['99%', 'Client satisfaction'],
];
export function DeliveryJourney() {
  return (
    <section className={styles.section} id="approach">
      <div className="wrap">
        <div className={styles.heading}>
          <div>
            <span className="eyebrow">03 — THE LAKSHYA APPROACH</span>
            <h2>
              From first idea.
              <br />
              <span>To lasting impact.</span>
            </h2>
          </div>
          <div>
            <p>
              Every challenge is different. Our delivery journey keeps people,
              purpose and progress connected at every step.
            </p>
            <Link href="/company/" className={styles.link}>
              Get to know Lakshya <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <ol className={styles.stages}>
          {stages.map(({ name, detail, Icon }, i) => (
            <li key={name}>
              <details className={styles.card}>
                <summary className={styles.summary}>
                  <div className={styles.top}>
                    <span className={styles.icon}>
                      <Icon size={21} strokeWidth={1.5} />
                    </span>
                    <span className={styles.number}>0{i + 1}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{detail}</p>
                  <span className={styles.prompt}>
                    Explore this stage <span aria-hidden="true">+</span>
                  </span>
                </summary>
                <p className={styles.explanation}>{explanations[i]}</p>
              </details>
            </li>
          ))}
        </ol>
        <div className={styles.snapshot}>
          <div className={styles.snapshotIntro}>
            <span>THE BIGGER PICTURE</span>
            <h3>Experience in perspective.</h3>
          </div>
          <div className={styles.metrics}>
            {numbers.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
