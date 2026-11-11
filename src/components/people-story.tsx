export function PeopleStory({ careers = false }: { careers?: boolean }) {
  return (
    <section className="people-story wrap">
      <div
        className="people-art"
        role="img"
        aria-label={
          careers
            ? 'Illustration of colleagues developing skills through learning, building, ownership and growth'
            : 'Illustration of a delivery team turning a shared plan into working software'
        }
      >
        <span>IDEAS</span>
        <span>PEOPLE</span>
        <span>POSSIBILITY</span>
        <svg viewBox="0 0 500 300" aria-hidden="true">
          <rect
            x="95"
            y="35"
            width="310"
            height="175"
            rx="14"
            fill="#0d2438"
            stroke="currentColor"
          />
          <path
            d="M110 65h280M170 230h160M250 210v20"
            fill="none"
            stroke="currentColor"
          />
          <circle cx="113" cy="50" r="3" />
          <circle cx="125" cy="50" r="3" />
          {careers ? (
            <g className="career-ladder">
              <path
                d="M130 180h60v-30h60v-30h60V90h60"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <circle cx={160 + i * 60} cy={160 - i * 30} r="9" />
                  <text
                    x={160 + i * 60}
                    y={200}
                    textAnchor="middle"
                    fill="currentColor"
                    stroke="none"
                    fontSize="9"
                  >
                    {['LEARN', 'BUILD', 'OWN', 'GROW'][i]}
                  </text>
                </g>
              ))}
            </g>
          ) : (
            <g className="collaboration-screen">
              <rect x="120" y="90" width="70" height="90" rx="5" />
              <path d="M135 110h40m-40 15h30m-30 15h40" stroke="currentColor" />
              <path
                d="M210 125h45m-15-12 15 12-15 12"
                stroke="currentColor"
                fill="none"
              />
              <rect x="275" y="90" width="105" height="90" rx="5" />
              <path
                d="m290 155 20-25 20 10 35-35"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </g>
          )}
          <g className="team-figure">
            <circle cx="95" cy="205" r="20" />
            <path d="M60 280v-35a35 35 0 0 1 70 0v35" />
            <path d="M125 244l45-25" stroke="currentColor" strokeWidth="9" />
          </g>
          <g className="team-figure">
            <circle cx="405" cy="205" r="20" />
            <path d="M370 280v-35a35 35 0 0 1 70 0v35" />
            <path d="M375 244l-45-25" stroke="currentColor" strokeWidth="9" />
          </g>
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
