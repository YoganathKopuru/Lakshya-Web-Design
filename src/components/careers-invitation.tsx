import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './careers-invitation.module.css';

export function CareersInvitation() {
  return (
    <section className={`wrap ${styles.banner}`} id="your-next-chapter">
      <div className={styles.copy}>
        <span className="eyebrow">GOOD PEOPLE. MEANINGFUL WORK.</span>
        <h2>
          Your next chapter
          <br />
          could start here.
        </h2>
        <p>
          Bring your curiosity. Find your direction.
          <br />
          Build something that matters.
        </p>
        <Link href="/careers/" className={styles.link}>
          Explore careers at Lakshya{' '}
          <span>
            <ArrowUpRight size={20} />
          </span>
        </Link>
      </div>
      <div className={styles.art} aria-hidden="true">
        <div className={styles.glow} />
        <svg viewBox="0 0 480 260" fill="none">
          <defs>
            <linearGradient
              id="career-route"
              x1="20"
              y1="220"
              x2="440"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#120c5a" />
              <stop offset="1" stopColor="#077d63" />
            </linearGradient>
          </defs>
          <path
            d="M20 215H105Q125 215 125 195V155Q125 135 145 135H235Q255 135 255 115V75Q255 55 275 55H400"
            stroke="#d3e2da"
            strokeWidth="1.5"
          />
          <path
            className={styles.route}
            d="M20 215H105Q125 215 125 195V155Q125 135 145 135H235Q255 135 255 115V75Q255 55 275 55H400"
            stroke="url(#career-route)"
            strokeWidth="2"
            pathLength="1"
          />
          <g className={styles.step1}>
            <circle cx="70" cy="215" r="23" fill="#fbfcfa" stroke="#b7cac5" />
            <text x="70" y="219" textAnchor="middle">
              01
            </text>
            <text
              x="70"
              y="257"
              textAnchor="middle"
              className={styles.stepLabel}
            >
              DISCOVER
            </text>
          </g>
          <g className={styles.step2}>
            <circle cx="200" cy="135" r="23" fill="#fbfcfa" stroke="#8ebbb1" />
            <text x="200" y="139" textAnchor="middle">
              02
            </text>
            <text
              x="200"
              y="177"
              textAnchor="middle"
              className={styles.stepLabel}
            >
              CONNECT
            </text>
          </g>
          <g className={styles.step3}>
            <circle cx="330" cy="55" r="23" fill="#0a776a" />
            <text x="330" y="59" textAnchor="middle" fill="white">
              03
            </text>
            <text
              x="330"
              y="97"
              textAnchor="middle"
              className={styles.stepLabel}
            >
              BUILD
            </text>
          </g>
          <g className={styles.launch}>
            <path
              d="M399 56L441 14M411 14H441V44"
              stroke="#0a776a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M400 78L425 53" stroke="#88b8a9" strokeWidth="1" />
          </g>
        </svg>
        <span className={styles.caption}>YOUR POTENTIAL. YOUR PATH.</span>
      </div>
    </section>
  );
}
