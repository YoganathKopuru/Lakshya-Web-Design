import { ArrowUpRight, Quote } from 'lucide-react';
import { employeeVoiceSnapshot as snapshot } from '@/data/employee-voices';
import styles from './employee-voices.module.css';

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className={styles.stars}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <span aria-hidden="true">★★★★★</span>
      <span aria-hidden="true" style={{ width: `${(rating / 5) * 100}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

export function EmployeeVoices() {
  return (
    <section
      className={`wrap ${styles.section}`}
      id="employee-voices"
      aria-labelledby="employee-voices-heading"
    >
      <div className={styles.heading}>
        <div>
          <span className="eyebrow">THE PEOPLE BEHIND THE TECHNOLOGY</span>
          <h2 id="employee-voices-heading">
            People make
            <br />
            <span className="muted">the difference.</span>
          </h2>
          <p>A few employee perspectives, in their own words.</p>
        </div>
        <a
          className={styles.rating}
          href={snapshot.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Read Lakshya employee reviews on Glassdoor"
        >
          <div className={styles.ratingTop}>
            <span>EMPLOYEE RATING ON GLASSDOOR</span>
            <ArrowUpRight size={17} />
          </div>
          <div className={styles.score}>
            <strong>{snapshot.rating.toFixed(1)}</strong>
            <span>/ 5</span>
            <Stars rating={snapshot.rating} />
          </div>
          <span className={styles.reviewCount}>
            Based on {snapshot.reviewCount} employee reviews
          </span>
        </a>
      </div>
      <div className={styles.selectionLabel}>SELECTED POSITIVE EXCERPTS</div>
      <div className={styles.grid}>
        {snapshot.reviews.map((review) => (
          <article className={styles.card} key={review.url}>
            <div className={styles.cardTop}>
              <Stars rating={review.rating} />
              <span>{review.rating.toFixed(1)} / 5</span>
            </div>
            <h3>{review.theme}</h3>
            <Quote
              size={23}
              strokeWidth={1.2}
              className={styles.quoteMark}
              aria-hidden="true"
            />
            <blockquote>{review.quote}</blockquote>
            <div className={styles.attribution}>
              <span>{review.role}</span>
              <time dateTime={review.date}>{review.dateLabel}</time>
            </div>
            <a href={review.url} target="_blank" rel="noreferrer">
              Read full review <ArrowUpRight size={15} />
            </a>
          </article>
        ))}
      </div>
      <p className={styles.sourceNote}>
        Excerpts from anonymous employee reviews.{' '}
        <a href={snapshot.sourceUrl} target="_blank" rel="noreferrer">
          Read the full range of perspectives on Glassdoor{' '}
          <ArrowUpRight size={12} />
        </a>
        <br />
        Publicly indexed listing, accessed{' '}
        <time dateTime={snapshot.checkedAt}>{snapshot.checkedLabel}</time>. This
        is a snapshot; ratings may have changed.
      </p>
    </section>
  );
}
