import Link from 'next/link';
import {
  ArrowUpRight,
  FileText,
  GitCompareArrows,
  ClipboardCheck,
} from 'lucide-react';
import styles from './ai-workflow.module.css';

const stages = [
  {
    name: 'Retrieve',
    title: 'Find the right records.',
    detail:
      'Bring an order, its packing list and the receiving log into one view so the team can trace every figure.',
    icon: FileText,
    artifact: 'Receiving file',
    rows: [
      ['Purchase order', '24 units'],
      ['Packing list', '24 units'],
      ['Receiving log', '22 units'],
    ],
  },
  {
    name: 'Compare',
    title: 'Spot the discrepancy.',
    detail:
      'Extract quantities from each document and compare them. Surface the difference alongside the source that explains it.',
    icon: GitCompareArrows,
    artifact: 'Quantity check',
    rows: [
      ['Expected', '24 units'],
      ['Received', '22 units'],
      ['Difference', '2 units short'],
    ],
  },
  {
    name: 'Review',
    title: 'Give the team a next step.',
    detail:
      'Prepare an exception for the buyer with the records attached. The buyer reviews the evidence and decides how to follow up.',
    icon: ClipboardCheck,
    artifact: 'Buyer review',
    rows: [
      ['Assigned to', 'Purchasing'],
      ['Evidence', 'Receiving log'],
      ['Decision', 'Awaiting review'],
    ],
  },
];

export function AiWorkflow() {
  return (
    <section
      className={styles.section}
      id="ai-in-motion"
      aria-labelledby="workflow-title"
    >
      <div className="wrap">
        <header className={styles.intro}>
          <div>
            <span className={styles.kicker}>AI &amp; data engineering</span>
            <h2 id="workflow-title">
              From a short shipment
              <br />
              to a clear next step.
            </h2>
          </div>
          <p>
            An illustrative procurement workflow. Follow one order from source
            documents to a decision your team can make.
          </p>
        </header>
        <ol className={styles.deck}>
          {stages.map(
            ({ name, title, detail, icon: Icon, artifact, rows }, index) => (
              <li className={styles.card} key={name} data-workflow-card>
                <div className={styles.copy}>
                  <span className={styles.kicker}>
                    0{index + 1} / {name}
                  </span>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                  {index === stages.length - 1 && (
                    <Link className={styles.link} href="/services/ai-data/">
                      Explore AI &amp; data <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
                <div className={styles.desk}>
                  <div className={styles.record} data-workflow-record>
                    <div className={styles.recordHead}>
                      <Icon aria-hidden="true" size={26} />
                      <span>Order 0418</span>
                    </div>
                    <h4>{artifact}</h4>
                    <dl>
                      {rows.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </li>
            ),
          )}
        </ol>
      </div>
    </section>
  );
}
