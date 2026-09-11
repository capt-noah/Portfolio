export default function ContinuousHudSpine() {
  return (
    <div className="absolute top-0 left-0 w-full h-[500vh] pointer-events-none select-none z-0 overflow-hidden">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 5400"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <filter id="spine-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0B0D10" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* ========================================================================== */}
        {/* CONTINUOUS HIGHWAY 1: Right-Flank Dual Power/Data Bus (Runs through all 500vh) */}
        {/* ========================================================================== */}
        <g opacity="0.65">
          {/* Main vertical bus line */}
          <line x1="1840" y1="0" x2="1840" y2="5400" stroke="#0B0D10" strokeWidth="2" strokeDasharray="16 8" />
          <line x1="1848" y1="0" x2="1848" y2="5400" stroke="#FF5500" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.8" />
          
          {/* Periodic Bus Junction Nodes every 360 units */}
          {Array.from({ length: 15 }).map((_, idx) => {
            const y = 180 + idx * 360;
            return (
              <g key={`bus-node-${idx}`}>
                <circle cx="1840" cy={y} r="4" fill="#0B0D10" />
                <circle cx="1848" cy={y} r="2.5" fill="#FF5500" />
                <line x1="1815" y1={y} x2="1840" y2={y} stroke="#0B0D10" strokeWidth="1" />
                <text x="1805" y={y + 3} fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#0B0D10" textAnchor="end" opacity="0.6">
                  {`BUS.${String(idx + 1).padStart(2, '0')}`}
                </text>
              </g>
            );
          })}
        </g>

        {/* ========================================================================== */}
        {/* CONTINUOUS HIGHWAY 2: Left-Flank Reference Telemetry Rail */}
        {/* ========================================================================== */}
        <g opacity="0.4">
          <line x1="60" y1="120" x2="60" y2="5280" stroke="#0B0D10" strokeWidth="1.5" />
          <line x1="68" y1="120" x2="68" y2="5280" stroke="#0B0D10" strokeWidth="0.75" strokeDasharray="6 6" />
        </g>

        {/* ========================================================================== */}
        {/* BRIDGING CONDUIT 1: HERO (0-1080) ➔ CAREER (1080-2160) */}
        {/* Massive 45° mechanical conduit carrying telemetry from Hero into Career */}
        {/* ========================================================================== */}
        <g filter="url(#spine-shadow)">
          {/* Long angled conduit crossing boundary at Y=1080 */}
          <path
            d="
              M 1640 680
              L 1520 800
              L 1520 1020
              L 1380 1160
              L 420 1160
              L 340 1240
              L 340 1480
            "
            fill="none"
            stroke="#0B0D10"
            strokeWidth="3.5"
            opacity="0.8"
          />
          <path
            d="
              M 1648 675
              L 1528 795
              L 1528 1015
              L 1385 1155
              L 425 1155
              L 348 1235
              L 348 1480
            "
            fill="none"
            stroke="#FF5500"
            strokeWidth="1.5"
            strokeDasharray="10 6"
            opacity="0.9"
          />
          {/* Seam Crossing Junction Badge at Y=1080 */}
          <g transform="translate(1380, 1070)">
            <rect x="0" y="0" width="130" height="22" fill="#0B0D10" rx="2" />
            <text x="8" y="15" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#FFFFFF">
              INTERLINK // 01→02
            </text>
            <circle cx="120" cy="11" r="3" fill="#FF5500" />
          </g>
          {/* Diagonal Louvers on Seam Crossing Flank */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 1420 + i * 22;
            return (
              <line
                key={`seam1-louver-${i}`}
                x1={x}
                y1="1145"
                x2={x + 14}
                y2="1175"
                stroke="#0B0D10"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.7"
              />
            );
          })}
        </g>

        {/* ========================================================================== */}
        {/* BRIDGING CONDUIT 2: CAREER (1080-2160) ➔ PROJECTS (2160-3240) */}
        {/* Diagonal mechanical beam and stadium slot carrier bridging into Projects */}
        {/* ========================================================================== */}
        <g filter="url(#spine-shadow)">
          <path
            d="
              M 240 1920
              L 240 2100
              L 380 2240
              L 860 2240
              L 940 2320
              L 1580 2320
            "
            fill="none"
            stroke="#0B0D10"
            strokeWidth="3.5"
            opacity="0.8"
          />
          <path
            d="
              M 248 1920
              L 248 2095
              L 385 2235
              L 865 2235
              L 945 2315
              L 1580 2315
            "
            fill="none"
            stroke="#FF5500"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            opacity="0.9"
          />
          {/* Seam Crossing Stadium Slot at Y=2160 */}
          <g transform="translate(320, 2145)">
            <rect x="0" y="0" width="110" height="24" rx="12" fill="#0B0D10" />
            <rect x="8" y="7" width="36" height="10" rx="5" fill="#FF5500" />
            <text x="52" y="16" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#FFFFFF">
              SYS.02 // 03
            </text>
          </g>
          {/* Diagonal Louvers along the horizontal arm */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const x = 520 + i * 20;
            return (
              <line
                key={`seam2-louver-${i}`}
                x1={x}
                y1="2225"
                x2={x + 12}
                y2="2255"
                stroke="#0B0D10"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.75"
              />
            );
          })}
        </g>

        {/* ========================================================================== */}
        {/* BRIDGING CONDUIT 3: PROJECTS (2160-3240) ➔ TECH STACK (3240-4320) */}
        {/* Hardware bus conduit diving from Projects into Tech Stack terminal */}
        {/* ========================================================================== */}
        <g filter="url(#spine-shadow)">
          <path
            d="
              M 1680 3000
              L 1540 3140
              L 1540 3280
              L 1280 3540
              L 720 3540
            "
            fill="none"
            stroke="#0B0D10"
            strokeWidth="3.5"
            opacity="0.8"
          />
          <path
            d="
              M 1688 2995
              L 1548 3135
              L 1548 3275
              L 1285 3535
              L 720 3535
            "
            fill="none"
            stroke="#FF5500"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            opacity="0.9"
          />
          {/* Seam Crossing Badge at Y=3240 */}
          <g transform="translate(1500, 3225)">
            <rect x="0" y="0" width="124" height="24" fill="#0B0D10" rx="2" />
            <text x="8" y="16" fontFamily="monospace" fontSize="8.5" fontWeight="bold" fill="#FFFFFF">
              BUS_LINK // 03→04
            </text>
            <circle cx="114" cy="12" r="3" fill="#FF5500" />
          </g>
          {/* Circuit Pinout Terminal pads at Y=3540 */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={`stack-bridge-pin-${i}`} cx={760 + i * 36} cy="3540" r="4" fill="#FF5500" />
          ))}
        </g>

        {/* ========================================================================== */}
        {/* BRIDGING CONDUIT 4: TECH STACK (3240-4320) ➔ CONNECT (4320-5400) */}
        {/* Transmission umbilical diving into the dark carbon canvas */}
        {/* ========================================================================== */}
        <g filter="url(#spine-shadow)">
          <path
            d="
              M 360 4120
              L 480 4240
              L 480 4420
              L 720 4660
              L 1420 4660
            "
            fill="none"
            stroke="#0B0D10"
            strokeWidth="3.5"
            opacity="0.85"
          />
          <path
            d="
              M 368 4115
              L 488 4235
              L 488 4415
              L 725 4655
              L 1420 4655
            "
            fill="none"
            stroke="#FF5500"
            strokeWidth="1.5"
            strokeDasharray="10 8"
            opacity="0.9"
          />
          {/* Seam Crossing Marker at Y=4320 (Entering Dark Footer) */}
          <g transform="translate(440, 4305)">
            <rect x="0" y="0" width="136" height="26" fill="#0B0D10" stroke="#FF5500" strokeWidth="1" rx="2" />
            <text x="8" y="17" fontFamily="monospace" fontSize="8.5" fontWeight="bold" fill="#FF5500">
              TERMINAL // 04→05
            </text>
            <circle cx="124" cy="13" r="3" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
}
