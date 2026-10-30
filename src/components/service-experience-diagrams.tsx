import type { ReactNode } from 'react';
import styles from './service-experience.module.css';

type NodeProps = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  selected: boolean;
  children?: ReactNode;
};
function Node({
  x,
  y,
  w = 84,
  h = 56,
  label,
  sub,
  selected,
  children,
}: NodeProps) {
  return (
    <g
      className={styles.node}
      data-selected={selected}
      transform={`translate(${x} ${y})`}
    >
      <rect width={w} height={h} rx="7" />
      <text
        x={w / 2}
        y={sub || children ? 22 : h / 2 + 3}
        textAnchor="middle"
        className={styles.nodeLabel}
      >
        {label}
      </text>
      {sub && (
        <text x={w / 2} y="37" textAnchor="middle" className={styles.nodeSub}>
          {sub}
        </text>
      )}
      {children}
    </g>
  );
}
function Wire({ d, active = false }: { d: string; active?: boolean }) {
  return (
    <g className={styles.wire} data-selected={active}>
      <path d={d} />
      <path d={d} className={styles.packet} />
    </g>
  );
}
function Ring({
  x,
  y,
  label,
  selected,
}: {
  x: number;
  y: number;
  label: string;
  selected: boolean;
}) {
  return (
    <g className={styles.ring} data-selected={selected}>
      <circle cx={x} cy={y} r="35" />
      <circle cx={x} cy={y} r="27" />
      <text x={x} y={y + 3} textAnchor="middle" className={styles.nodeLabel}>
        {label}
      </text>
    </g>
  );
}

export function ExperienceDiagram({
  slug,
  step,
}: {
  slug: string;
  step: number;
}) {
  let scene: ReactNode;
  switch (slug) {
    case 'ai-data':
      scene = (
        <>
          <Wire
            d="M86 75H116L140 110M86 145H116L140 110M206 110H246"
            active={step > 0}
          />
          <g className={styles.documents} data-selected={step === 0}>
            <rect x="28" y="42" width="51" height="67" rx="5" />
            <rect x="36" y="50" width="51" height="67" rx="5" />
            <path d="M47 66H73M47 76H73M47 86H65" />
            <text x="61" y="104" textAnchor="middle">
              KNOWLEDGE
            </text>
          </g>
          <Node
            x={27}
            y={133}
            w={60}
            h={28}
            label="CONTEXT"
            selected={step === 1}
          />
          <Ring
            x={174}
            y={110}
            label={step === 1 ? 'RETRIEVE' : 'AI'}
            selected={step === 1 || step === 2}
          />
          <g className={styles.satellites}>
            {[
              [128, 63],
              [220, 63],
              [128, 157],
              [220, 157],
            ].map(([x, y], i) => (
              <g key={i}>
                <path d={`M${x} ${y}L174 110`} />
                <circle cx={x} cy={y} r={step === 2 ? 5 : 3} />
              </g>
            ))}
          </g>
          <Node
            x={248}
            y={66}
            w={84}
            h={88}
            label="RESPONSE"
            selected={step === 3}
          >
            <path
              d="M15 43H68M15 53H62M15 63H52"
              className={styles.answerLines}
            />
          </Node>
          <text
            x="180"
            y="199"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            INFORMATION → CONTEXT → UNDERSTANDING
          </text>
        </>
      );
      break;
    case 'software-engineering':
      scene = (
        <>
          <g className={styles.editor} data-selected={step < 2}>
            <rect x="24" y="39" width="139" height="130" rx="7" />
            <path d="M24 62H163" />
            <circle cx="36" cy="50" r="2" />
            <circle cx="44" cy="50" r="2" />
            <circle cx="52" cy="50" r="2" />
            <text x="37" y="82">
              {step === 0
                ? '// define the challenge'
                : 'function buildNext() {'}
            </text>
            {[63, 93, 77, 51].map((w, i) => (
              <rect
                key={i}
                className={styles.code}
                x={i % 2 ? 47 : 37}
                y={94 + i * 13}
                width={w}
                height="4"
                rx="2"
              />
            ))}
          </g>
          <Wire d="M164 104H205" active={step > 0} />
          <g className={styles.browserFrame} data-selected={step === 3}>
            <rect x="207" y="39" width="124" height="104" rx="7" />
            <path d="M207 59H331" />
            <rect x="219" y="71" width="99" height="10" rx="2" />
            <rect x="219" y="91" width="42" height="37" rx="3" />
            <rect x="269" y="91" width="49" height="15" rx="3" />
            <rect x="269" y="113" width="49" height="15" rx="3" />
          </g>
          <Node
            x={210}
            y={155}
            w={119}
            h={28}
            label={
              step === 2
                ? 'TEST & VALIDATE'
                : step === 3
                  ? 'RELEASE TO USERS'
                  : 'WORK IN PROGRESS'
            }
            selected={step === 2 || step === 3}
          />
          <text
            x="180"
            y="207"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            IDEA → EXPERIENCE → WORKING SOFTWARE
          </text>
        </>
      );
      break;
    case 'enterprise-platforms':
      scene = (
        <>
          <Wire
            d="M105 52L158 95M254 52L202 95M105 168L158 125M254 168L202 125"
            active
          />
          <Ring x={180} y={110} label="ERP" selected />
          <Node
            x={24}
            y={28}
            w={82}
            h={48}
            label="CRM"
            sub="CUSTOMERS"
            selected={step === 0}
          />
          <Node
            x={254}
            y={28}
            w={82}
            h={48}
            label="INVENTORY"
            sub="OPERATIONS"
            selected={step === 1}
          />
          <Node
            x={24}
            y={145}
            w={82}
            h={48}
            label="HRMS"
            sub="PEOPLE"
            selected={step === 2}
          />
          <Node
            x={254}
            y={145}
            w={82}
            h={48}
            label="INSIGHTS"
            sub="REPORTING"
            selected={step === 3}
          />
          <circle cx="180" cy="110" r="51" className={styles.orbit} />
          <text
            x="180"
            y="216"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            CONNECTED SYSTEMS. A SHARED VIEW.
          </text>
        </>
      );
      break;
    case 'cloud-devops':
      scene = (
        <>
          <Wire d="M43 70H317" active />
          {['COMMIT', 'BUILD', 'CHECK', 'DEPLOY'].map((label, i) => (
            <g key={label}>
              <Node
                x={12 + i * 87}
                y={47}
                w={75}
                h={45}
                label={label}
                selected={step === i}
              />
              <text
                x={49 + i * 87}
                y="33"
                textAnchor="middle"
                className={styles.diagramCaption}
              >
                0{i + 1}
              </text>
              <Wire d={`M${49 + i * 87} 93V126`} active={step >= i} />
              <g
                className={styles.pod}
                data-selected={step >= i}
                transform={`translate(${26 + i * 87} 129)`}
              >
                <rect width="45" height="39" rx="7" />
                <path d="M12 14L22 9 32 14V25L22 30 12 25Z M12 14L22 19 32 14M22 19V30" />
              </g>
            </g>
          ))}
          <path d="M31 185H329" className={styles.foundation} />
          <text
            x="180"
            y="208"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            REPEATABLE DELIVERY. VISIBLE OPERATIONS.
          </text>
        </>
      );
      break;
    case 'semiconductor-vlsi':
      scene = (
        <>
          <g className={styles.circuit}>
            <path d="M20 59H70L96 85M20 110H96M20 161H70L96 135M264 85L290 59H340M264 110H340M264 135L290 161H340" />
            {[111, 132, 153, 174, 195, 216, 237, 249].map((x) => (
              <path key={x} d={`M${x} 18V38M${x} 182V202`} />
            ))}
          </g>
          <rect
            x="96"
            y="38"
            width="168"
            height="144"
            rx="9"
            className={styles.die}
          />
          {['LOGIC', 'MEMORY', 'I/O', 'VERIFY'].map((label, i) => (
            <Node
              key={label}
              x={107 + (i % 2) * 77}
              y={49 + Math.floor(i / 2) * 66}
              w={69}
              h={58}
              label={label}
              selected={step === i}
            />
          ))}
          <g className={styles.scanline}>
            <path d={`M97 ${47 + step * 40}H263`} />
            <rect x="97" y={47 + step * 40} width="166" height="6" />
          </g>
          <text
            x="180"
            y="220"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            SELECT A BLOCK TO EXPLORE THE SYSTEM
          </text>
        </>
      );
      break;
    case 'embedded-iot':
      scene = (
        <>
          <Wire
            d="M85 61H119L153 107M205 107L236 61H276M205 107L236 167H276"
            active
          />
          <Node
            x={18}
            y={37}
            w={70}
            h={48}
            label="SENSOR"
            sub="PHYSICAL INPUT"
            selected={step === 0}
          />
          <Ring x={179} y={107} label="MCU" selected={step === 1} />
          <g
            className={styles.waves}
            transform="translate(178 108)"
            data-selected={step === 2}
          >
            {[47, 57, 67].map((r, i) => (
              <circle key={r} r={r} style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </g>
          <Node
            x={274}
            y={37}
            w={70}
            h={48}
            label="CLOUD"
            sub="CONNECT"
            selected={step === 2}
          />
          <Node
            x={274}
            y={141}
            w={70}
            h={48}
            label="ACTION"
            sub="DASHBOARD"
            selected={step === 3}
          />
          <g className={styles.sensorWave} data-selected={step === 0}>
            <path d="M23 145H36L43 130 52 163 63 138 74 148H93" />
          </g>
          <text
            x="180"
            y="218"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            PHYSICAL SIGNALS. DIGITAL POSSIBILITIES.
          </text>
        </>
      );
      break;
    case 'quality-managed-services':
      scene = (
        <>
          <g className={styles.shield} data-selected={step === 3}>
            <path d="M90 38L35 58V105C35 145 60 168 90 180 120 168 145 145 145 105V58Z" />
            <circle cx="90" cy="103" r="31" />
            <path d="M74 103L85 114 108 91" />
          </g>
          {['TEST PLAN', 'VALIDATION', 'REVIEW', 'SUPPORT'].map((t, i) => (
            <g key={t}>
              <Node
                x={180}
                y={29 + i * 43}
                w={153}
                h={32}
                label={t}
                selected={step === i}
              />
              <circle
                cx="192"
                cy={45 + i * 43}
                r="3"
                className={step >= i ? styles.lit : styles.unlit}
              />
            </g>
          ))}
          <Wire d={`M145 103H164V${45 + step * 43}H179`} active />
          <text
            x="180"
            y="220"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            PLAN. TEST. LEARN. IMPROVE.
          </text>
        </>
      );
      break;
    default:
      scene = (
        <>
          <Wire
            d="M91 56L153 110M91 111H153M91 166L153 110M207 110H252"
            active
          />
          <Node
            x={18}
            y={35}
            w={74}
            h={38}
            label="SKILLS"
            selected={step === 0}
          />
          <Node
            x={18}
            y={92}
            w={74}
            h={38}
            label="EXPERTISE"
            selected={step === 1}
          />
          <Node
            x={18}
            y={149}
            w={74}
            h={38}
            label="WORKING FIT"
            selected={step === 1}
          />
          <Ring
            x={180}
            y={110}
            label="ALIGN"
            selected={step === 1 || step === 2}
          />
          <g className={styles.team} data-selected={step > 1}>
            <rect x="252" y="49" width="91" height="121" rx="8" />
            <text
              x="298"
              y="69"
              textAnchor="middle"
              className={styles.nodeLabel}
            >
              YOUR TEAM
            </text>
            {[
              [276, 98],
              [319, 98],
              [298, 143],
            ].map(([x, y], i) => (
              <g key={i} className={step === 3 ? styles.teamMember : ''}>
                <circle cx={x} cy={y - 5} r="7" />
                <path d={`M${x - 11} ${y + 13}q0-12 11-12t11 12`} />
              </g>
            ))}
          </g>
          <text
            x="180"
            y="214"
            textAnchor="middle"
            className={styles.diagramCaption}
          >
            THE RIGHT PEOPLE. A SHARED DIRECTION.
          </text>
        </>
      );
  }
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 360 234"
      fill="none"
      aria-hidden="true"
    >
      {scene}
    </svg>
  );
}
