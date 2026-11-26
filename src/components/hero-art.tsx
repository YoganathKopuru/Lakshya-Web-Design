import type { CSSProperties } from 'react';

/**
 * Line art for inner-page heroes, in both themes, one motif per page, each
 * a picture of that page's headline:
 *
 * - waves (Company): a sea of signals in the logo spectrum, drifting.
 * - converge (Why Lakshya): different starting points meeting at one.
 * - route (Careers): a path that rises, with a pulse travelling along it.
 * - resolve (Work): "Real challenges. Purposeful technology." Tangled
 *   lines pass through a delivery module and leave it as clean, evenly
 *   spaced paths that end in value.
 * - skyline (Industries): "Technology in context." One line takes the
 *   shape of each industry served: a factory's sawtooth roof, a
 *   heartbeat, a civic building, office towers.
 * - threads (Services, Contact): fine threads flowing in.
 *
 * Decorative (aria-hidden). Drawn in SVG; CSS draws the lines in and keeps
 * them moving (signature.css), reduced motion keeps them still, and the
 * pointer and scroll move the whole piece for depth.
 */
export type HeroArtVariant =
  'waves' | 'converge' | 'route' | 'resolve' | 'skyline' | 'threads';

const SPECTRUM = [
  '#6f7bff',
  '#5a86f0',
  '#3f8fe0',
  '#2f9fcf',
  '#34b8b5',
  '#46d3b3',
];

const i = (index: number) => ({ '--i': index }) as CSSProperties;

function Spectrum() {
  return (
    <defs>
      <linearGradient
        id="signal-art-spectrum"
        x1="0"
        y1="0"
        x2="600"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#6f7bff" stopOpacity="0" />
        <stop offset="0.32" stopColor="#6f7bff" stopOpacity="0.6" />
        <stop offset="0.7" stopColor="#2f8fd8" />
        <stop offset="1" stopColor="#46d3b3" />
      </linearGradient>
      {/* The spectrum at full strength almost from the left edge, for a
          single line that carries the whole piece. */}
      <linearGradient
        id="signal-art-band"
        x1="0"
        y1="0"
        x2="600"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.28" stopColor="#6f7bff" stopOpacity="0" />
        <stop offset="0.36" stopColor="#6f7bff" stopOpacity="0.9" />
        <stop offset="0.62" stopColor="#2f8fd8" />
        <stop offset="1" stopColor="#46d3b3" />
      </linearGradient>
      <linearGradient
        id="signal-art-fade"
        x1="0"
        y1="0"
        x2="600"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      {/* Fixed to the frame, so drifting waves fade at the same place. */}
      <mask
        id="signal-art-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="600"
        height="400"
      >
        <rect width="600" height="400" fill="url(#signal-art-fade)" />
      </mask>
    </defs>
  );
}

/** A smooth wave across [-600, 1200] built from quadratic arcs. */
function wave(baseY: number, amplitude: number, half: number) {
  let d = `M-600 ${baseY} Q${-600 + half / 2} ${baseY - amplitude} ${-600 + half} ${baseY}`;
  for (let x = -600 + half * 2; x <= 1200; x += half) d += ` T${x} ${baseY}`;
  return d;
}

function Waves() {
  return (
    <g mask="url(#signal-art-mask)">
      {SPECTRUM.map((colour, index) => (
        <g key={colour} className="signal-art-drift" style={i(index)}>
          <path
            className="signal-art-line"
            d={wave(118 + index * 38, 16 + index * 3, 150)}
            stroke={colour}
            strokeOpacity={0.45 + index * 0.09}
            pathLength={1}
            style={i(index)}
          />
          <circle
            className="signal-art-node"
            cx={150 + index * 75}
            cy={118 + index * 38}
            r={2.4}
            fill={colour}
          />
        </g>
      ))}
    </g>
  );
}

const STARTS: Array<[number, number]> = [
  [0, 46],
  [0, 128],
  [0, 214],
  [0, 296],
  [0, 372],
  [150, 0],
  [170, 400],
];

function Converge() {
  const focus = [478, 200];
  return (
    <g>
      {STARTS.map(([x, y], index) => {
        const d = `M${x} ${y} C${x + 170} ${y} ${360} ${200 + (y - 200) * 0.3} ${focus[0]} ${focus[1]}`;
        return (
          <g key={index}>
            <path
              className="signal-art-line"
              d={d}
              stroke="url(#signal-art-spectrum)"
              pathLength={1}
              style={i(index)}
            />
            <circle className="signal-art-pulse" r={2.4} fill="#9ee6d3">
              <animateMotion
                dur={`${3.2 + (index % 3) * 0.6}s`}
                begin={`${index * 0.45}s`}
                repeatCount="indefinite"
                path={d}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.15;0.8;1"
                dur={`${3.2 + (index % 3) * 0.6}s`}
                begin={`${index * 0.45}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
      <circle
        className="signal-art-ring"
        cx={focus[0]}
        cy={focus[1]}
        r={7}
        fill="none"
        stroke="#46d3b3"
      />
      <circle cx={focus[0]} cy={focus[1]} r={6} fill="#46d3b3" />
      <circle cx={focus[0]} cy={focus[1]} r={18} fill="#46d3b31f" />
    </g>
  );
}

const ROUTE =
  'M24 362 C150 362 168 262 262 246 S384 160 432 136 S520 78 568 64';

function Route() {
  return (
    <g>
      {[48, 24].map((offset, index) => (
        <path
          key={offset}
          className="signal-art-line signal-art-contour"
          d={ROUTE}
          transform={`translate(0 ${offset})`}
          stroke="url(#signal-art-spectrum)"
          pathLength={1}
          style={i(index)}
        />
      ))}
      <path
        className="signal-art-line signal-art-main"
        d={ROUTE}
        stroke="url(#signal-art-spectrum)"
        pathLength={1}
        style={i(2)}
      />
      {(
        [
          [92, 352],
          [262, 246],
          [432, 136],
        ] as const
      ).map(([cx, cy], index) => (
        <g key={cx} className="signal-art-stop" style={i(index)}>
          <circle cx={cx} cy={cy} r={11} fill="#05060f" stroke="#ffffff38" />
          <circle cx={cx} cy={cy} r={4} fill={SPECTRUM[index * 2 + 1]} />
        </g>
      ))}
      <path
        className="signal-art-line signal-art-arrow"
        d="M548 52 L572 62 L560 86"
        stroke="#46d3b3"
        pathLength={1}
        style={i(4)}
      />
      <circle className="signal-art-pulse" r={3} fill="#c9efdb">
        <animateMotion dur="4.8s" repeatCount="indefinite" path={ROUTE} />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.1;0.85;1"
          dur="4.8s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

/** Tangled line i: [start, first turn, second turn, final level]. */
const KNOTS: Array<[number, number, number, number]> = [
  [250, 120, 230, 140],
  [130, 270, 150, 170],
  [290, 170, 110, 200],
  [160, 230, 280, 230],
  [210, 110, 260, 260],
];
const MODULE = { x: 304, y: 116, width: 46, height: 168 };

function Resolve() {
  return (
    <g>
      {/* The delivery module the lines pass through, with a port where
          each one enters and leaves. */}
      <rect {...MODULE} rx={14} fill="#ffffff0a" stroke="#ffffff38" />
      {KNOTS.map(([start, first, second, level], index) => {
        // The knot starts clear of the headline, at x 130.
        const d = `M130 ${start} C158 ${start} 172 ${first} 200 ${first} S232 ${second} 254 ${second} S276 ${level} 294 ${level} L566 ${level}`;
        const duration = `${3.8 + (index % 3) * 0.5}s`;
        return (
          <g key={index}>
            <path
              className="signal-art-line"
              d={d}
              stroke="url(#signal-art-spectrum)"
              strokeOpacity={0.7 + (index % 2) * 0.3}
              pathLength={1}
              style={i(index)}
            />
            {[MODULE.x, MODULE.x + MODULE.width].map((x) => (
              <circle key={x} cx={x} cy={level} r={2.2} fill="#c9d2f5" />
            ))}
            <circle
              className="signal-art-stop"
              cx={566}
              cy={level}
              r={3.4}
              fill={SPECTRUM[index + 1]}
              style={i(index)}
            />
            <circle className="signal-art-pulse" r={2.4} fill="#9ee6d3">
              <animateMotion
                dur={duration}
                begin={`${index * 0.6}s`}
                repeatCount="indefinite"
                path={d}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.86;1"
                dur={duration}
                begin={`${index * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
      <circle
        className="signal-art-ring"
        cx={566}
        cy={200}
        r={7}
        fill="none"
        stroke="#46d3b3"
      />
      <circle cx={566} cy={200} r={18} fill="#46d3b31f" />
    </g>
  );
}

/* One line across a common ground, taking the shape of each industry in
   turn: a sawtooth factory roof, a heartbeat, a pedimented civic building,
   then office towers. It starts at x 168, clear of the headline. */
const GROUND = 290;
const SKYLINE = [
  `M168 ${GROUND} L220 ${GROUND}`,
  'L220 236 L241 212 L241 236 L262 212 L262 236 L283 212 L283 290',
  'L304 290 L312 290 L318 278 L324 290 L331 290 L340 222 L349 328 L357 290 L368 290 L375 275 L385 290',
  'L406 290 L406 244 L448 210 L491 244 L491 290',
  'L510 290 L510 228 L529 228 L529 182 L552 182 L552 144 L571 144 L571 204 L590 204 L590 290',
].join(' ');
const COLUMNS = [418, 433, 448.5, 464, 479];
const JUNCTIONS = [294, 396, 500];

function Skyline() {
  return (
    <g>
      {[40, 22].map((offset, index) => (
        <path
          key={offset}
          className="signal-art-line signal-art-contour"
          d={`M168 ${GROUND + offset} L600 ${GROUND + offset}`}
          stroke="url(#signal-art-band)"
          pathLength={1}
          style={i(index)}
        />
      ))}
      {/* Columns and the pediment's base, drawn faintly inside the civic
          building. */}
      <path
        className="signal-art-line signal-art-contour"
        d={`M406 244 L491 244 ${COLUMNS.map((x) => `M${x} 252 L${x} 284`).join(' ')}`}
        stroke="#c9d2f5"
        pathLength={1}
        style={i(3)}
      />
      <path
        className="signal-art-line signal-art-main"
        d={SKYLINE}
        stroke="url(#signal-art-band)"
        pathLength={1}
        style={i(2)}
      />
      {JUNCTIONS.map((cx, index) => (
        <g key={cx} className="signal-art-stop" style={i(index)}>
          <circle cx={cx} cy={GROUND} r={9} fill="#05060f" stroke="#ffffff38" />
          <circle cx={cx} cy={GROUND} r={3.4} fill={SPECTRUM[index * 2 + 1]} />
        </g>
      ))}
      <circle className="signal-art-pulse" r={3} fill="#c9efdb">
        <animateMotion dur="7.2s" repeatCount="indefinite" path={SKYLINE} />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.08;0.9;1"
          dur="7.2s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

function Threads() {
  return (
    <g className="signal-art-sway">
      {Array.from({ length: 12 }, (_, index) => (
        <path
          key={index}
          className="signal-art-line"
          d={`M600 ${22 + index * 30} C${430} ${40 + index * 30} ${300 - index * 6} ${262} ${70 + index * 14} 400`}
          stroke="url(#signal-art-spectrum)"
          strokeOpacity={0.35 + (index % 4) * 0.15}
          pathLength={1}
          style={i(index)}
        />
      ))}
    </g>
  );
}

export function HeroArt({ variant }: { variant: HeroArtVariant }) {
  return (
    <div className="signal-art" data-signal-art={variant} aria-hidden="true">
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        <Spectrum />
        {variant === 'waves' && <Waves />}
        {variant === 'converge' && <Converge />}
        {variant === 'route' && <Route />}
        {variant === 'resolve' && <Resolve />}
        {variant === 'skyline' && <Skyline />}
        {variant === 'threads' && <Threads />}
      </svg>
    </div>
  );
}
