import Link from 'next/link';
import { ArrowUpRight, BrainCircuit, Network, Cpu } from 'lucide-react';
import { services } from '@/data/content';
import styles from './expertise-chapters.module.css';

const chapters = [
  {
    title: 'Build intelligent software.',
    label: 'FROM INFORMATION TO ACTION',
    text: 'Turn knowledge into useful tools. Create applications, connect your data and bring AI into the work people do every day.',
    icon: BrainCircuit,
    services: [0, 1],
    words: ['KNOWLEDGE', 'INTELLIGENCE', 'ACTION'],
  },
  {
    title: 'Connect systems & operations.',
    label: 'FROM COMPLEXITY TO CLARITY',
    text: 'Bring platforms, infrastructure and everyday workflows together. Build a foundation your business can run on and keep improving.',
    icon: Network,
    services: [2, 3, 6],
    words: ['PLATFORMS', 'WORKFLOWS', 'OPERATIONS'],
  },
  {
    title: 'Engineer products & teams.',
    label: 'FROM POSSIBILITY TO DELIVERY',
    text: 'Connect silicon, embedded software and specialist skills. Bring the right engineering disciplines together for your next challenge.',
    icon: Cpu,
    services: [4, 5, 7],
    words: ['SILICON', 'SYSTEMS', 'PEOPLE'],
  },
];

export function ExpertiseChapters() {
  return (
    <div className={styles.chapters}>
      {chapters.map((chapter, index) => {
        const Icon = chapter.icon;
        return (
          <article className={styles.chapter} key={chapter.title}>
            <div className={styles.scene} aria-hidden="true">
              <span className={styles.index}>
                0{index + 1} / CONNECTED CAPABILITIES
              </span>
              <div className={styles.circuit}>
                <i />
                <i />
                <i />
                <span className={styles.core}>
                  <Icon size={54} strokeWidth={1} />
                </span>
              </div>
              <div className={styles.words}>
                {chapter.words.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>
            </div>
            <div className={styles.copy}>
              <span className="eyebrow">{chapter.label}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.text}</p>
              <ul>
                {chapter.services.map((i) => (
                  <li key={services[i].slug}>
                    <Link href={`/services/${services[i].slug}/`}>
                      {services[i].name}
                      <ArrowUpRight size={18} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
