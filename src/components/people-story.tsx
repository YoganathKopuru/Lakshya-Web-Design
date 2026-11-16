'use client';

import { useEffect, useState } from 'react';
import { useVisibleVideo } from './use-visible-video';

const stories = {
  company: {
    asset: '/company-collaboration',
    eyebrow: 'CONNECTED BY CURIOSITY',
    heading: 'Different disciplines.\nA shared ambition.',
    description:
      'Software engineers, specialists in connected systems and business teams bring different perspectives to the same project.',
  },
  why: {
    asset: '/why-collaboration',
    eyebrow: 'BEFORE WE MEET',
    heading: 'A practical first conversation.',
    description:
      'Bring a challenge your team is facing. We can use it to discuss where to start.',
    points: [
      'What needs to work better, and who uses it today?',
      'What systems, deadlines or dependencies should we plan around?',
      'What outcome would make the project worthwhile?',
    ],
  },
  careers: {
    asset: '/career-growth',
    eyebrow: 'YOUR POTENTIAL. YOUR DIRECTION.',
    heading: 'Grow through the work.\nFind your direction.',
    description:
      'From software and data to connected systems, start a conversation about the work you want to do and the skills you want to develop.',
    points: [
      'Build depth in a technical discipline.',
      'Learn how your work connects to a wider delivery team.',
      'Discuss role expectations and development opportunities with HR.',
    ],
  },
};

export function PeopleStory({
  variant = 'company',
}: {
  variant?: keyof typeof stories;
}) {
  const [allowMotion, setAllowMotion] = useState(false);
  const video = useVisibleVideo(allowMotion);
  const story = stories[variant];
  const { asset, eyebrow, heading, description } = story;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowMotion(!preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return (
    <section className="people-story wrap" data-reveal>
      <figure className="people-media" data-editorial-zoom>
        {allowMotion ? (
          <video
            ref={video}
            src={asset + '.mp4'}
            poster={asset + '.webp'}
            preload="none"
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <img
            src={asset + '.webp'}
            alt=""
            width={800}
            height={450}
            loading="lazy"
          />
        )}
        <figcaption>Stock footage</figcaption>
      </figure>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{heading}</h2>
        <p>{description}</p>
        {'points' in story && (
          <ul>
            {story.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
