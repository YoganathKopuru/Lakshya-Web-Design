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
    title: 'Search your enterprise knowledge.',
    detail:
      'Connect internal guides and technical documentation so a support engineer can find an answer and check its source.',
    icon: FileText,
    artifact: 'Knowledge search',
    rows: [
      ['Question', 'How do I restore access?'],
      ['Source', 'Access guide'],
      ['Result', 'Recovery procedure'],
    ],
  },
  {
    name: 'Extract',
    title: 'Turn documents into usable data.',
    detail:
      'Extract the application, issue and requested change from a support ticket. Flag missing details for review.',
    icon: GitCompareArrows,
    artifact: 'Document processing',
    rows: [
      ['Application', 'Employee portal'],
      ['Issue', 'Sign-in failure'],
      ['Requested change', 'Restore access'],
    ],
  },
  {
    name: 'Review',
    title: 'Connect the answer to the workflow.',
    detail:
      'Draft a response using the ticket and the access guide. Route it to a support engineer to verify before replying.',
    icon: ClipboardCheck,
    artifact: 'Assisted workflow',
    rows: [
      ['Assigned to', 'Support engineering'],
      ['Evidence', 'Access guide'],
      ['Response', 'Draft for review'],
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
              Make AI part of
              <br />
              your everyday.
            </h2>
          </div>
          <p>
            See how enterprise search, document processing and assisted
            workflows can work together on one example support request.
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
                      <span>Support request</span>
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
