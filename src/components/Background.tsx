export default function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden">
      {/* Subtle film grain texture */}
      <div className="grain-overlay" />

      {/* Primary Technical Drafting Grid & Dot Blueprint */}
      <div className="absolute inset-0 tech-grid-bg opacity-90" />
      <div className="absolute inset-0 tech-dot-bg opacity-70" />


      {/* High-Fidelity Cyberpunk Architectural Vector SVG Layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Diagonal Hazard Stripe Patterns */}
          <pattern id="diag-stripes-bg" width="10" height="10" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="3" className="text-fg/25" />
          </pattern>
          <pattern id="diag-stripes-accent-bg" width="8" height="8" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#FF5500" strokeWidth="2.5" opacity="0.7" />
          </pattern>
          <pattern id="diag-stripes-red-bg" width="8" height="8" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#E11D48" strokeWidth="2.5" opacity="0.8" />
          </pattern>
        </defs>

        {/* --- 1. Large Framing Chassis Enclosure Box with Chamfer Corners --- */}
        <rect
          x="100"
          y="60"
          width="1720"
          height="960"
          rx="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-fg/25"
        />

        {/* --- 2. Asymmetric Angled Mechanical Wireframe Contour (From media_1789120862397.jpg) --- */}
        <path
          d="M 980 60 L 1260 60 L 1380 180 L 1640 180 L 1640 340 L 1480 340 L 1340 200 L 1100 200 L 1020 120 L 980 120 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-fg/30"
        />

        {/* Diagonal Conduits & Chamfered Trace Lines Across Negative Space */}
        <path
          d="M 640 60 L 780 200 L 780 440 L 1220 880 L 1420 880 L 1480 940 L 1480 1020"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-fg/30"
        />

        <path
          d="M 700 160 L 840 300 L 840 480 L 1280 920"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="text-fg/20"
        />

        {/* --- 3. Parallel Slotted Louvers / Vents (From media_1789120862397.jpg) --- */}
        {/* Right side diagonal louvers */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
          const yOffset = 250 + idx * 24;
          return (
            <path
              key={`louver-r-${idx}`}
              d={`M 1480 ${yOffset} L 1580 ${yOffset - 35}`}
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              className="text-fg/45"
            />
          );
        })}

        {/* Left side diagonal louvers */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const yOffset = 580 + idx * 22;
          return (
            <path
              key={`louver-l-${idx}`}
              d={`M 200 ${yOffset} L 290 ${yOffset - 32}`}
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-fg/35"
            />
          );
        })}

        {/* --- 4. Solid Black Graphic Mechanical Fin & Accent Spine (From media_1789120862397.jpg) --- */}
        <g className="text-fg">
          {/* Vertical black anchor line */}
          <rect x="1420" y="560" width="10" height="380" rx="4" fill="currentColor" opacity="0.9" />
          
          {/* Upper angular fin */}
          <polygon
            points="1440,610 1530,530 1530,670 1440,720"
            fill="currentColor"
            opacity="0.95"
          />
          
          {/* Lower offset fin */}
          <polygon
            points="1440,740 1530,690 1530,780 1440,830"
            fill="currentColor"
            opacity="0.95"
          />

          {/* Electric Orange Accent Notch */}
          <rect x="1418" y="640" width="14" height="45" fill="#FF5500" />
          
          {/* Crimson micro dot at tip */}
          <circle cx="1530" cy="530" r="3" fill="#E11D48" />
        </g>

        {/* --- 5. Stadium Pill Slots & Channels (From media_1789120862397.jpg) --- */}
        <rect x="200" y="860" width="200" height="16" rx="8" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-fg/40" />
        <rect x="200" y="890" width="240" height="16" rx="8" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-fg/30" />
        <rect x="940" y="740" width="160" height="14" rx="7" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-fg/35" />

        {/* --- 6. Translucent Floating Architectural Shading Plates --- */}
        <rect x="1560" y="740" width="220" height="220" rx="10" fill="currentColor" className="text-fg/[0.04]" />
        <rect x="1380" y="660" width="280" height="260" rx="14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg/25" />

        {/* --- 7. Precision Corner Registration Brackets (4 Corners) --- */}
        {/* Top-Left */}
        <path d="M 60 100 L 60 60 L 100 60" fill="none" stroke="currentColor" strokeWidth="3" className="text-fg/80" />
        {/* Top-Right */}
        <path d="M 1820 60 L 1860 60 L 1860 100" fill="none" stroke="currentColor" strokeWidth="3" className="text-fg/80" />
        {/* Bottom-Left */}
        <path d="M 60 980 L 60 1020 L 100 1020" fill="none" stroke="currentColor" strokeWidth="3" className="text-fg/80" />
        {/* Bottom-Right */}
        <path d="M 1820 1020 L 1860 1020 L 1860 980" fill="none" stroke="currentColor" strokeWidth="3" className="text-fg/80" />

        {/* Diagonal Hatch Feature Blocks in Negative Space */}
        <rect x="120" y="80" width="60" height="20" fill="url(#diag-stripes-accent-bg)" />
        <rect x="1620" y="80" width="70" height="24" fill="url(#diag-stripes-bg)" />
        <rect x="160" y="920" width="50" height="16" fill="url(#diag-stripes-red-bg)" />

        {/* Micro Registration Crosses & Coordinates (From Cyberpunk UI Set media_1789119322429.jpg) */}
        <g className="text-accent">
          <text x="880" y="140" fontFamily="monospace" fontSize="16" fontWeight="bold">☒</text>
          <text x="1740" y="460" fontFamily="monospace" fontSize="16" fontWeight="bold">🞨</text>
          <text x="360" y="820" fontFamily="monospace" fontSize="14" fontWeight="bold">▲</text>
          <text x="1360" y="240" fontFamily="monospace" fontSize="11" fill="currentColor" fontWeight="bold" letterSpacing="2">380/AC002</text>
          <text x="200" y="945" fontFamily="monospace" fontSize="10" fill="currentColor" letterSpacing="1">SA/CT_II // :009</text>
          <text x="1420" y="960" fontFamily="monospace" fontSize="10" fill="currentColor" letterSpacing="1">@STAZQUEZ_MOTIF</text>
        </g>
      </svg>
    </div>
  );
}
