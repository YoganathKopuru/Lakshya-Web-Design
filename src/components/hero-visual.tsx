import styles from './hero-visual.module.css';

export function HeroVisual() {
  return <figure className={styles.frame} aria-label="Connected possibilities: Earth illuminated by technology">
    <img src="/hero-connected-earth-v2.webp" alt="The illuminated Earth with India and Asia visible, connected by fine teal arcs across a midnight-blue horizon." width="1672" height="941" fetchPriority="high" decoding="async"/>
    <div className={styles.shade} aria-hidden="true"/>
    <div className={styles.topline} aria-hidden="true"><span>ENGINEERING WHAT’S NEXT</span><span className={styles.cross}>+</span></div>
    <figcaption className={styles.caption}><span className={styles.rule}/><span>Connected thinking.<br/><b>Limitless possibility.</b></span></figcaption>
    <div className={styles.corner} aria-hidden="true"><i/><span>LAKSHYA / HORIZONS</span></div>
    <span className={styles.sheen} aria-hidden="true"/>
  </figure>;
}
