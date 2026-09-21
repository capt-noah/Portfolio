import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ShieldAlert, Cpu, Radio, Zap } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface SciFiGateLoaderProps {
  onComplete: () => void;
}

export default function SciFiGateLoader({ onComplete }: SciFiGateLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState('SYS.INITIALIZE_CORE');
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const hudCenterRef = useRef<HTMLDivElement>(null);
  const clampTopRef = useRef<HTMLDivElement>(null);
  const clampBottomRef = useRef<HTMLDivElement>(null);
  const steamVentsRef = useRef<HTMLDivElement>(null);

  // Diagnostic status phases
  const phases = [
    { threshold: 15, text: 'DIAGNOSTIC // BUS_SYNC' },
    { threshold: 35, text: 'REACTOR // CHARGING_CELLS' },
    { threshold: 55, text: 'NEURAL_LINK // ACTIVE' },
    { threshold: 75, text: 'HYDRAULICS // PRE-IGNITION' },
    { threshold: 92, text: 'DEPRESSURIZING_CHAMBER' },
    { threshold: 100, text: 'ACCESS_GRANTED // OPEN_GATE' }
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Non-linear organic progress progression
      const increment = Math.floor(Math.random() * 4) + 1;
      current = Math.min(current + increment, 100);
      setProgress(current);

      cyberAudio.playReactorSpool(current);

      const matchingPhase = phases.find(p => current <= p.threshold);
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
    // 1. Play heavy pneumatic depressurization sound
    cyberAudio.playHydraulicRelease();

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete();
      }
    });

    // Step A: Clamp unlatching recoil
    tl.to([clampTopRef.current, clampBottomRef.current], {
      scaleY: 0.2,
      opacity: 0,
      duration: 0.4,
      ease: 'back.in(2)'
    })
    // Step B: Center HUD collapses and blasts outward with flash
    .to(hudCenterRef.current, {
      scale: 1.3,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.in'
    }, '-=0.1')
    // Step C: Steam vent smoke flash
    .to(steamVentsRef.current, {
      opacity: 1,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    }, '-=0.2')
    // Step D: Massive mechanical split doors slide apart with high-inertia easing
    .to(leftDoorRef.current, {
      xPercent: -102,
      duration: 1.25,
      ease: 'power4.inOut'
    }, '+=0.05')
    .to(rightDoorRef.current, {
      xPercent: 102,
      duration: 1.25,
      ease: 'power4.inOut'
    }, '<')
    // Step E: Fade container completely to allow seamless pointer interaction
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.3');
  };

  if (isDone) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden bg-black font-mono flex items-center justify-center cursor-none"
    >
      {/* LEFT HYDRAULIC BLAST DOOR */}
      <div 
        ref={leftDoorRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#080A0E] border-r-2 border-[#1E2430] flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-[20px_0_60px_rgba(0,0,0,0.8)] z-10"
      >
        {/* Door surface metallic plating & seams */}
        <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60 pointer-events-none" />

        {/* Top Header Plate Telemetry */}
        <div className="relative z-10 flex items-center gap-3 text-fg/40 text-[9px] uppercase tracking-widest">
          <span className="w-2 h-2 bg-accent inline-block animate-ping" />
          <span className="font-bold text-accent">SECTOR_GATE // LEFT_BULKHEAD</span>
          <span className="hidden sm:inline">| HYD.PRES: 980 BAR</span>
        </div>

        {/* Diagonal Structural Reinforcement Truss Bars */}
        <div className="absolute top-1/4 -left-20 w-96 h-4 bg-accent/20 rotate-45 border-y border-accent/40" />
        <div className="absolute top-1/3 -left-20 w-96 h-4 bg-accent/20 rotate-45 border-y border-accent/40" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-4 bg-accent/20 rotate-45 border-y border-accent/40" />

        {/* Hazard Chevron Stripes along central seam */}
        <div className="absolute top-0 right-0 w-4 h-full stripe-pattern-orange opacity-40 border-l border-accent/30" />

        {/* Mechanical Teeth Cutouts along Seam */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map(idx => (
            <div 
              key={`tooth-l-${idx}`}
              className="w-4 h-10 bg-[#12161F] border-y border-l border-accent/40 shadow-inner"
            />
          ))}
        </div>

        {/* Bottom Status Readout */}
        <div className="relative z-10 font-mono text-[9px] text-fg/40 flex justify-between items-end">
          <div>
            <div className="text-accent font-bold">CORE_STATUS</div>
            <div>STABLE // 120_FPS</div>
          </div>
          <div className="font-display font-bold text-lg text-fg/30 tracking-wider">
            [SYS_01]
          </div>
        </div>
      </div>

      {/* RIGHT HYDRAULIC BLAST DOOR */}
      <div 
        ref={rightDoorRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#080A0E] border-l-2 border-[#1E2430] flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-[-20px_0_60px_rgba(0,0,0,0.8)] z-10"
      >
        {/* Door surface metallic plating & seams */}
        <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/60 pointer-events-none" />

        {/* Top Header Plate Telemetry */}
        <div className="relative z-10 flex items-center justify-end gap-3 text-fg/40 text-[9px] uppercase tracking-widest">
          <span className="hidden sm:inline">AUTH: CLASSIFIED // 0x88F</span>
          <span className="font-bold text-accent">RIGHT_BULKHEAD</span>
          <span className="w-2 h-2 bg-emerald-500 inline-block animate-pulse" />
        </div>

        {/* Diagonal Structural Reinforcement Truss Bars */}
        <div className="absolute top-1/4 -right-20 w-96 h-4 bg-accent/20 -rotate-45 border-y border-accent/40" />
        <div className="absolute top-1/3 -right-20 w-96 h-4 bg-accent/20 -rotate-45 border-y border-accent/40" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-4 bg-accent/20 -rotate-45 border-y border-accent/40" />

        {/* Hazard Chevron Stripes along central seam */}
        <div className="absolute top-0 left-0 w-4 h-full stripe-pattern-orange opacity-40 border-r border-accent/30" />

        {/* Mechanical Teeth Cutouts along Seam */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map(idx => (
            <div 
              key={`tooth-r-${idx}`}
              className="w-4 h-10 bg-[#12161F] border-y border-r border-accent/40 shadow-inner"
            />
          ))}
        </div>

        {/* Bottom Status Readout */}
        <div className="relative z-10 font-mono text-[9px] text-fg/40 flex justify-between items-end">
          <div className="font-display font-bold text-lg text-fg/30 tracking-wider">
            [GATE_LOCK]
          </div>
          <div className="text-right">
            <div className="text-accent font-bold">PORTFOLIO_ENTRY</div>
            <div>VER // 2026.04</div>
          </div>
        </div>
      </div>

      {/* TOP & BOTTOM MECHANICAL LOCK CLAMPS */}
      <div 
        ref={clampTopRef}
        className="absolute top-0 z-20 w-36 h-12 bg-[#121620] border-2 border-accent flex items-center justify-center shadow-[0_0_30px_rgba(255,85,0,0.4)]"
      >
        <span className="text-[9px] font-bold text-accent tracking-widest flex items-center gap-1">
          <Zap size={11} className="animate-bounce" /> LOCK_PIN_ALPHA
        </span>
      </div>

      <div 
        ref={clampBottomRef}
        className="absolute bottom-0 z-20 w-36 h-12 bg-[#121620] border-2 border-accent flex items-center justify-center shadow-[0_0_30px_rgba(255,85,0,0.4)]"
      >
        <span className="text-[9px] font-bold text-accent tracking-widest flex items-center gap-1">
          <ShieldAlert size={11} className="animate-pulse" /> HYDRAULIC_SEAL
        </span>
      </div>

      {/* STEAM VENT BURST OVERLAY */}
      <div 
        ref={steamVentsRef}
        className="absolute inset-0 pointer-events-none opacity-0 bg-radial from-accent/30 via-white/10 to-transparent z-40 transition-opacity"
      />

      {/* CENTRAL REACTOR CALIBRATION HUD RING */}
      <div 
        ref={hudCenterRef}
        className="relative z-30 flex flex-col items-center justify-center p-8 text-center"
      >
        {/* Circular Calibration Progress Ring */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          {/* Outer Rotating Gear Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-accent/40 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-accent/20" />
          <div className="absolute inset-4 rounded-full border border-dashed border-white/20 animate-[spin_8s_linear_infinite_reverse]" />

          {/* SVG Circular Progress Arc */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              fill="none"
              stroke="rgba(255, 85, 0, 0.15)"
              strokeWidth="6"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              fill="none"
              stroke="#FF5500"
              strokeWidth="6"
              strokeDasharray="600"
              strokeDashoffset={600 - (600 * progress) / 100}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-75"
            />
          </svg>

          {/* Inner Quantum Reactor Core Value Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07090C]/90 rounded-full m-8 border border-accent/30 shadow-[0_0_40px_rgba(255,85,0,0.25)]">
            <Cpu size={24} className="text-accent mb-1 animate-pulse" />
            <div className="font-display font-black text-4xl sm:text-5xl text-white tracking-tighter">
              {String(progress).padStart(3, '0')}
              <span className="text-sm text-accent ml-1 font-mono">%</span>
            </div>
            <div className="font-mono text-[8.5px] text-accent/80 font-bold uppercase tracking-wider mt-1">
              SYS.CALIBRATING
            </div>
          </div>
        </div>

        {/* Live Diagnostics Log Strip */}
        <div className="mt-8 bg-[#0D1017] border border-accent/30 px-6 py-2 rounded-none flex items-center gap-3 shadow-lg">
          <Radio size={13} className="text-accent animate-spin" />
          <span className="font-mono text-[10px] text-white font-bold tracking-widest uppercase">
            {statusLog}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        </div>

        {/* Peripheral Telemetry Coordinates */}
        <div className="mt-3 font-mono text-[8.5px] text-fg/40 tracking-widest flex items-center gap-4">
          <span>PORT: 3000 // PROD</span>
          <span>LAT: 9.0320° N</span>
          <span>LON: 38.7469° E</span>
        </div>
      </div>
    </div>
  );
}
