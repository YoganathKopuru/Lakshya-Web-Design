const standards = [
  [
    'ISO 9001:2015',
    'Quality management',
    'A framework for consistent services and customer expectations.',
  ],
  [
    'ISO/IEC 27001:2022',
    'Information security',
    'A management framework for protecting information and managing risks.',
  ],
  [
    'ISO 45001:2018',
    'Health and safety',
    'A framework for safer, healthier workplaces.',
  ],
  [
    'TC-260',
    'Talent competency',
    'A people-focused standard listed in Lakshya’s quality framework.',
  ],
];
export function QualityStandards() {
  return (
    <section className="section wrap standards">
      <div className="standards-intro">
        <span className="eyebrow">OUR QUALITY FRAMEWORK</span>
        <h2>
          Quality is a practice.
          <br />
          <span className="muted">Trust is built in.</span>
        </h2>
        <p>
          Our original website highlights these standards as part of Lakshya’s
          commitment to quality, security, safety and people.
        </p>
      </div>
      <div className="standards-grid">
        {standards.map(([code, title, description], i) => (
          <article key={code}>
            <span className="standards-number">0{i + 1} / STANDARD</span>
            <h3>{code}</h3>
            <strong>{title}</strong>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <p className="content-note">
        Standards listed on{' '}
        <a href="https://www.lakshya-soft.com/#/quality">
          Lakshya’s original quality page
        </a>
        . Certification scope and current validity should be confirmed with our
        team.
      </p>
    </section>
  );
}
