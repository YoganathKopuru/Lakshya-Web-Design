'use client';

import { useEffect, useState } from 'react';

export function PeopleStory({ careers = false }: { careers?: boolean }) {
  const [allowMotion, setAllowMotion] = useState(false);
  const asset = careers ? '/career-growth' : '/engineering-team';

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowMotion(!preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return (
    <section className="people-story wrap">
      <figure className="people-media">
        {allowMotion ? (
          <video
            src={asset + '.mp4'}
            poster={asset + '.webp'}
            preload="metadata"
            autoPlay
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
        <span className="eyebrow">
          {careers
            ? 'YOUR POTENTIAL. YOUR DIRECTION.'
            : 'CONNECTED BY CURIOSITY'}
        </span>
        <h2>
          {careers
            ? 'Grow through the work.\nFind your direction.'
            : 'Different disciplines.\nA shared ambition.'}
        </h2>
        <p>
          {careers
            ? 'Explore where your strengths meet real engineering challenges. From software and data to connected systems, start a conversation about the work you want to do and the skills you want to develop.'
            : 'Good technology starts with people who understand the problem. We connect software, engineering and business perspectives to shape solutions around the way your organization works.'}
        </p>
        <ul>
          <li>
            {careers
              ? 'Build depth in a technical discipline.'
              : 'Start with your priorities and operational context.'}
          </li>
          <li>
            {careers
              ? 'Learn how your work connects to a wider delivery team.'
              : 'Bring design, engineering and implementation together.'}
          </li>
          <li>
            {careers
              ? 'Discuss role expectations and development opportunities with HR.'
              : 'Plan for adoption, support and continued improvement.'}
          </li>
        </ul>
      </div>
    </section>
  );
}
