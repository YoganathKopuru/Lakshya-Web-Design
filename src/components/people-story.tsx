export function PeopleStory({ careers = false }: { careers?: boolean }) {
  return (
    <section className="people-story wrap">
      <div
        className="people-art"
        role="img"
        aria-label="Illustration of people connecting ideas across technology disciplines"
      >
        <span>IDEAS</span>
        <span>PEOPLE</span>
        <span>POSSIBILITY</span>
        <svg viewBox="0 0 500 300" aria-hidden="true">
          <path
            d="M50 220 Q250 20 450 220 M50 80 Q250 280 450 80"
            fill="none"
            stroke="currentColor"
          />
          <circle cx="170" cy="120" r="25" />
          <path d="M120 230v-30a50 50 0 0 1 100 0v30" />
          <circle cx="330" cy="120" r="25" />
          <path d="M280 230v-30a50 50 0 0 1 100 0v30" />
        </svg>
      </div>
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
