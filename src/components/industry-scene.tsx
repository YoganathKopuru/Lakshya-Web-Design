export function IndustryScene({ type }: { type: number }) {
  return (
    <div className="industry-scene" aria-hidden="true">
      <svg
        viewBox="0 0 600 260"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {type === 0 ? (
          <>
            <path d="M90 220V110l80 40v-40l80 40v-40l80 40v70ZM350 220V60h30v160" />
            <path d="M70 230h430" />
            {[120, 180, 240, 300].map((x) => (
              <rect key={x} x={x} y="180" width="25" height="25" />
            ))}
            <g className="scene-signal">
              <path d="M360 40q-25-20 0-40m20 40q25-20 0-40" />
            </g>
            <g className="scene-conveyor">
              {[110, 190, 270, 350].map((x) => (
                <rect key={x} x={x} y="235" width="35" height="15" rx="4" />
              ))}
            </g>
          </>
        ) : type === 1 ? (
          <>
            <rect x="180" y="40" width="240" height="190" rx="14" />
            <path d="M280 60h40v25h25v40h-25v25h-40v-25h-25V85h25Z" />
            <path
              className="scene-pulse"
              d="M90 185h100l20-25 25 55 30-90 30 60h150"
            />
            <path d="M270 230v-50h60v50" />
          </>
        ) : type === 2 ? (
          <>
            <path d="M140 95 300 30 460 95ZM120 235h360M140 220h320" />
            {[170, 240, 310, 380].map((x) => (
              <path key={x} d={`M${x} 110v100h30V110Z`} />
            ))}
            <path className="scene-pulse" d="M130 250h340" />
          </>
        ) : (
          <>
            <rect x="180" y="25" width="130" height="210" rx="5" />
            <rect x="330" y="95" width="110" height="140" rx="5" />
            {[55, 95, 135, 175].map((y) => (
              <g key={y} className="scene-signal">
                <path d={`M200 ${y}h25m35 0h25`} />
              </g>
            ))}
            <path d="M120 240h370" />
            <path className="scene-pulse" d="M100 130h50v60h170v-40h160" />
          </>
        )}
      </svg>
    </div>
  );
}
