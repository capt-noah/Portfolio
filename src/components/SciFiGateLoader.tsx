import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cyberAudio } from '../utils/cyberAudio';
import { Radio, Zap } from 'lucide-react';

interface SciFiGateLoaderProps {
  onComplete: () => void;
}

export default function SciFiGateLoader({ onComplete }: SciFiGateLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState('SYS.BOOT_DIAGNOSTICS');
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const topLeftPanelRef = useRef<HTMLDivElement>(null);
  const bottomRightPanelRef = useRef<HTMLDivElement>(null);
  const hudOverlayRef = useRef<HTMLDivElement>(null);

  const phases = [
    { threshold: 18, text: 'DIAGNOSTIC // BUS_SYNC_OK' },
    { threshold: 38, text: 'REACTOR // CHARGING_CELLS' },
    { threshold: 60, text: 'HYDRAULICS // PRESSURE_980_BAR' },
    { threshold: 82, text: 'CHAMBER // DEPRESSURIZING' },
    { threshold: 95, text: 'SYSTEM_VERIFIED // UNLOCK_GATE' },
    { threshold: 100, text: 'ACCESS_GRANTED // OPEN_GATE' }
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 2;
      current = Math.min(current + increment, 100);
      setProgress(current);

      cyberAudio.playReactorSpool(current);

      const matchingPhase = phases.find((p) => current <= p.threshold);
      if (matchingPhase) {
        setStatusLog(matchingPhase.text);
      }

      if (current >= 100) {
        clearInterval(interval);
        triggerGateOpening();
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const triggerGateOpening = () => {
    // 1. Heavy pneumatic depressurization sound
    cyberAudio.playHydraulicRelease();

    // 2. Dispatch completion immediately so Hero entrance begins in direct synchronization
    onComplete();

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
      }
    });

    // Step A: HUD Diagnostics blast outward and collapse
    tl.to(hudOverlayRef.current, {
      scale: 1.15,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in'
    })
    // Step B: 45° Diagonal Blast Door Opening
    .to(
      topLeftPanelRef.current,
      {
        xPercent: -125,
        yPercent: -125,
        duration: 1.35,
        ease: 'power4.inOut'
      },
      '+=0.05'
    )
    .to(
      bottomRightPanelRef.current,
      {
        xPercent: 125,
        yPercent: 125,
        duration: 1.35,
        ease: 'power4.inOut'
      },
      '<'
    )
    // Step C: Fade out master overlay container
    .to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out'
      },
      '-=0.3'
    );
  };

  if (isDone) return null;

  // Reusable exact vector graphic component matching media_1789972682058.jpg
  const GateGraphic = () => (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Exact 45° Black-and-Light-Gray Hazard Stripe Pattern */}
        <pattern
          id="mecha-hazard-stripes"
          width="48"
          height="48"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="24" height="48" fill="#111317" />
          <rect x="24" width="24" height="48" fill="#E8ECEF" />
        </pattern>
      </defs>

      {/* 1. Base Industrial Chassis Plate */}
      <rect width="1920" height="1080" fill="#E8ECEF" />

      {/* 2. Top-Left 5 Diagonal Louver Slats (#CDD5DC) */}
      <g fill="#CDD5DC">
        <polygon points="340,0 380,0 600,220 560,220" />
        <polygon points="400,0 440,0 600,160 560,160" />
        <polygon points="460,0 500,0 600,100 560,100" />
        <polygon points="520,0 560,0 600,40 560,40" />
        <polygon points="280,0 320,0 600,280 560,280" />
      </g>

      {/* 3. Hairline Circuit Conduits (Thin Orange & Gray with 90° & 45° Doglegs) */}
      <g fill="none" strokeWidth="1.2">
        {/* Top circuit trace */}
        <path
          d="M 860,0 L 860,280 L 980,400 L 1090,400"
          stroke="#C2CBD4"
        />
        {/* Middle connector trace */}
        <path
          d="M 160,190 L 230,190 L 230,80 L 600,80 L 640,120 L 640,460 L 580,520 L 460,520"
          stroke="#FF5500"
          strokeWidth="1.2"
        />
        {/* Center stepped trace */}
        <path
          d="M 820,500 L 910,500 L 910,600 L 1100,600"
          stroke="#FF5500"
          strokeWidth="1.2"
        />
        {/* Lower diagonal trace */}
        <path
          d="M 440,780 L 540,680 L 700,680 L 760,740 L 760,770"
          stroke="#C2CBD4"
          strokeWidth="1.4"
        />
      </g>

      {/* 4. Top-Left Tactical Orange Chevron Armature */}
      <polygon
        points="0,0 310,0 590,280 590,390 530,390 380,240 230,240 230,170 120,60 0,60"
        fill="#FF5500"
      />

      {/* 5. Middle-Left Tactical Orange Chevron Beam */}
      <polygon
        points="0,620 90,620 380,390 380,500 100,720 0,720"
        fill="#FF5500"
      />

      {/* 6. Bottom-Left Tactical Orange Chamfered Notch */}
      <polygon
        points="370,825 470,825 640,995 540,1080 470,1080 370,980"
        fill="#FF5500"
      />

      {/* 7. Bottom-Center 45° Diagonal Hazard Stripe Telemetry Box */}
      <rect
        x="515"
        y="770"
        width="1050"
        height="240"
        fill="url(#mecha-hazard-stripes)"
      />

      {/* PART-041 Label directly above hazard stripe box */}
      <text
        x="1050"
        y="750"
        fill="#FF5500"
        fontFamily="monospace"
        fontSize="24"
        fontWeight="900"
        letterSpacing="3"
      >
        PART-041
      </text>

      {/* 8. Solid Matte Black Bulkhead Plate on Right Edge */}
      <rect x="1670" y="70" width="250" height="570" fill="#111317" />

      {/* 9. Top-Right Outline Typography: YC9 */}
      <g
        stroke="#B4BEC8"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        {/* Y */}
        <path d="M 1060,70 L 1100,120 L 1100,180 M 1140,70 L 1100,120" />
        {/* C */}
        <path d="M 1250,70 L 1180,70 L 1180,180 L 1250,180" />
        {/* 9 */}
        <path d="M 1350,125 L 1280,125 L 1280,70 L 1350,70 L 1350,180 L 1280,180" />
      </g>

      {/* Registration Crosshairs (+) */}
      <g stroke="#FF5500" strokeWidth="2.5" strokeLinecap="square">
        <line x1="1025" y1="80" x2="1025" y2="100" />
        <line x1="1015" y1="90" x2="1035" y2="90" />

        <line x1="1025" y1="325" x2="1025" y2="345" />
        <line x1="1015" y1="335" x2="1035" y2="335" />
      </g>

      {/* 10. Upper Diagonal Tactical Orange Armature (Center-Right) */}
      <polygon
        points="1860,0 1690,0 1490,90 1050,530 1050,615 1170,615 1770,150 1770,75 1920,0"
        fill="#FF5500"
      />

      {/* 11. Main Heavy Right Tactical Orange Armature (Interlocking with black plate) */}
      <polygon
        points="1890,300 1770,300 1240,830 1240,990 1440,990 1480,950 1480,910 1600,910 1600,840 1890,550"
        fill="#FF5500"
      />

      {/* 12. Lower-Right Angled Orange Bracket */}
      <polygon
        points="1670,640 1730,640 1920,830 1920,950 1850,950 1760,860 1760,760 1670,670"
        fill="#FF5500"
      />

      {/* 13. Left Edge Vertical Barcode and Serial (#710646316) */}
      <g transform="translate(45, 620) rotate(-90)">
        {/* Barcode Lines */}
        <line x1="0" y1="-8" x2="140" y2="-8" stroke="#111317" strokeWidth="3" />
        <line x1="0" y1="-4" x2="140" y2="-4" stroke="#111317" strokeWidth="6" />
        <line x1="0" y1="3" x2="140" y2="3" stroke="#111317" strokeWidth="2" />
        <line x1="0" y1="8" x2="140" y2="8" stroke="#111317" strokeWidth="4" />
        {/* Serial Text */}
        <text
          x="155"
          y="3"
          fill="#111317"
          fontFamily="monospace"
          fontSize="22"
          fontWeight="900"
          letterSpacing="3"
        >
          | #710646316
        </text>
      </g>

      {/* Bottom-Left Corner Alignment Brackets */}
      <g stroke="#B0B8C0" strokeWidth="1.8" fill="none">
        <path d="M 170,830 L 190,830 M 180,820 L 180,840" />
        <path d="M 170,890 L 190,890 M 180,880 L 180,900" />
      </g>
    </svg>
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden bg-[#E8ECEF] font-mono cursor-none"
    >
      {/* --- TOP-LEFT 45° DIAGONAL BLAST PANEL --- */}
      <div
        ref={topLeftPanelRef}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 0 100%)'
        }}
        className="absolute inset-0 w-full h-full pointer-events-none shadow-[20px_20px_80px_rgba(0,0,0,0.6)] z-10"
      >
        <GateGraphic />
      </div>

      {/* --- BOTTOM-RIGHT 45° DIAGONAL BLAST PANEL --- */}
      <div
        ref={bottomRightPanelRef}
        style={{
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
        }}
        className="absolute inset-0 w-full h-full pointer-events-none shadow-[-20px_-20px_80px_rgba(0,0,0,0.6)] z-10"
      >
        <GateGraphic />
      </div>

      {/* --- CENTRAL HIGH-TECH DIAGNOSTIC HUD LAYER --- */}
      <div
        ref={hudOverlayRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
      >
        {/* Main Tactical Reactor Capsule Plate */}
        <div className="bg-[#111317]/95 border-2 border-accent text-white p-6 sm:p-8 flex flex-col items-center shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(255,85,0,0.4)] chamfer-tr max-w-sm w-full">
          
          {/* Top Telemetry Header */}
          <div className="w-full flex items-center justify-between border-b border-accent/30 pb-3 mb-5 font-mono text-[9.5px] uppercase tracking-widest text-accent font-bold">
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="animate-pulse text-accent" />
              CYBER_GATE // V26
            </span>
            <span>SEC_01 // OK</span>
          </div>

          {/* Glowing Digital Percentage Display */}
          <div className="font-display font-black text-6xl sm:text-7xl text-white tracking-tighter flex items-baseline leading-none mb-3">
            <span>{String(progress).padStart(3, '0')}</span>
            <span className="text-xl text-accent font-mono ml-1.5">%</span>
          </div>

          {/* High-Tech Progress Segment Bar */}
          <div className="w-full bg-white/10 h-2 p-0.5 border border-white/20 mb-4 flex">
            <div
              className="bg-accent h-full transition-all duration-75 shadow-[0_0_12px_#FF5500]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Live System Diagnostics Log */}
          <div className="w-full bg-black/60 border border-accent/20 px-3 py-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
            <div className="flex items-center gap-2">
              <Radio size={12} className="text-accent animate-spin" />
              <span className="text-white truncate">{statusLog}</span>
            </div>
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
          </div>

        </div>

        {/* Outer Lat/Long Coordinates Strip */}
        <div className="mt-4 bg-[#111317]/80 border border-accent/20 px-4 py-1.5 font-mono text-[8.5px] text-white/70 tracking-widest uppercase flex items-center gap-4">
          <span>PORT: 3000 // PROD</span>
          <span>LAT: 9.0320° N</span>
          <span>LON: 38.7469° E</span>
        </div>
      </div>
    </div>
  );
}
