import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StackItem } from '../services/dataService';
import { Cpu, Activity, CheckCircle2 } from 'lucide-react';
import { TECH_ICONS, getIconUrl } from '../constants/techIcons';
import { cyberAudio } from '../utils/cyberAudio';

gsap.registerPlugin(ScrollTrigger);

export default function Stack({ data }: { data: StackItem[] }) {
  const [selectedTech, setSelectedTech] = useState<string | null>(data[0]?.name || "React");
  const [cliHistory, setCliHistory] = useState<string[]>([
    "SYS_INIT: Booting core modules...",
    "VERIFYING HARDWARE RUNTIMES // STABLE",
    "HOVER OR QUERY ANY MODULE TO INSPECT TELEMETRY."
  ]);

  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Lenis Masked Header Line Reveal
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      if (tagRef.current) {
        headerTl.fromTo(
          tagRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power4.out' }
        );
      }

      if (headingRef.current) {
        headerTl.fromTo(
          headingRef.current,
          { yPercent: 110, skewY: 2, opacity: 0 },
          { yPercent: 0, skewY: 0, opacity: 1, duration: 0.85, ease: 'power4.out' },
          '-=0.35'
        );
      }

      // 2. Telemetry Console Reveal
      if (consoleRef.current) {
        gsap.fromTo(
          consoleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: consoleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 3. Tech Module Chips Staggered Unmasking
      const chips = chipsContainerRef.current?.querySelectorAll('.tech-module-chip');
      if (chips && chips.length > 0) {
        gsap.fromTo(
          chips,
          { y: 30, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.025,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chipsContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  const handleTechHover = (techName: string) => {
    if (selectedTech === techName) return;
    cyberAudio.playHoverChirp();
    setSelectedTech(techName);
    
    const randomHash = Math.random().toString(16).substring(2, 10).toUpperCase();
    const randomLatency = (Math.random() * 5 + 0.5).toFixed(2);
    const newLog = `QUERY_LINK: --module=${techName.toLowerCase()} --hash=0x${randomHash} --latency=${randomLatency}ms`;
    
    setCliHistory((prev) => [...prev.slice(-3), newLog]);
  };

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="min-h-screen w-full flex flex-col justify-between py-16 sm:py-24 border-b border-fg/10 bg-transparent select-none relative overflow-hidden"
    >
      {/* Tech Stack SVG Drafting Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 tech-grid-bg opacity-40" />
        <div className="absolute inset-0 tech-dot-bg opacity-25" />

        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect x="60" y="45" width="1800" height="990" rx="4" fill="none" stroke="currentColor" strokeWidth="1" className="text-fg/20" />
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />

          {/* Microchip Pinouts */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
            const x = 700 + idx * 30;
            return <circle key={`stack-pin-${idx}`} cx={x} cy={160} r={3} fill="#FF5500" />;
          })}

          {/* Corner Registration Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />

          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" className="fill-accent">
            HARDWARE_BUS // PROTOCOL_04
          </text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" className="fill-accent">
            ☒
          </text>
        </svg>

        <div className="absolute right-6 top-8 font-mono text-[9vw] font-black text-fg/[0.03] leading-none pointer-events-none select-none">
          04_STACK
        </div>
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-16 mx-auto flex-1 flex flex-col justify-between">
        
        {/* Lenis Masked Header Line Reveal */}
        <div className="border-b border-fg/10 pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="overflow-hidden mb-3">
              <div ref={tagRef} className="flex items-center gap-2 will-change-transform">
                <span className="w-2 h-2 bg-accent inline-block" />
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold">
                  [SYSTEM.04 // RUNTIMES]
                </span>
              </div>
            </div>

            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display font-black text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9] uppercase text-fg tracking-tighter will-change-transform"
              >
                TECH STACK
              </h2>
            </div>
          </div>
        </div>

        {/* Main Open Hardware Chassis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch my-auto">
          
          {/* Left Side: Unboxed Telemetry Live Shell */}
          <div 
            ref={consoleRef}
            className="lg:col-span-4 bg-surface/90 border border-fg/20 p-6 sm:p-8 flex flex-col justify-between relative hud-plate-a will-change-transform"
          >
            <div>
              <div className="flex items-center justify-between border-b border-fg/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-accent inline-block" />
                  <span className="font-mono text-[10px] text-fg uppercase tracking-widest font-bold">
                    [TELEMETRY_SHELL // CONSOLE]
                  </span>
                </div>
                <div className="font-mono text-[9px] text-accent font-bold px-2 py-0.5 bg-accent/10 border border-accent/20">
                  PORT: 3000 // LIVE
                </div>
              </div>

              {/* Log History */}
              <div className="font-mono text-[10px] leading-relaxed text-fg space-y-2 mb-6 bg-fg/[0.02] p-4 border border-fg/10">
                {cliHistory.map((log, index) => (
                  <div 
                    key={index} 
                    className={log.startsWith("QUERY") ? "text-accent font-bold" : "text-fg/70"}
                  >
                    <span className="text-accent mr-1.5">&gt;&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                
                <div className="flex items-center gap-1.5 text-fg font-bold pt-2 border-t border-fg/10">
                  <span className="text-accent">&gt;&gt;</span>
                  <span>FOCUS: {selectedTech?.toUpperCase() || "IDLE"}</span>
                  <span className="w-1.5 h-3.5 bg-accent animate-blink inline-block" />
                </div>
              </div>
            </div>

            {/* Diagnostic Metrics Box */}
            <div className="border-t border-fg/10 pt-4 font-mono text-[9.5px] text-fg/60 space-y-2 uppercase bg-fg/[0.015] p-3.5 border border-fg/10">
              <div className="flex justify-between items-center">
                <span>QUERY_TARGET:</span>
                <span className="text-accent font-bold px-2 py-0.5 bg-accent/10 border border-accent/20">
                  {selectedTech || "NONE"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>HEALTH_CHECK:</span>
                <span className="text-fg font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-accent" /> 100% OPERATIONAL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>FREQUENCY_LOCK:</span>
                <span className="text-fg font-semibold">38.74_LIDETA // 04</span>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 hazard-hatch-dark opacity-10" />
          </div>

          {/* Right Side: Open Interactive Module Matrix */}
          <div 
            ref={chipsContainerRef}
            className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4"
          >
            {data.map((item, i) => {
              const isSelected = selectedTech === item.name;
              return (
                <div
                  key={`${item.name}-${i}`}
                  onMouseEnter={() => handleTechHover(item.name)}
                  onClick={() => handleTechHover(item.name)}
                  className={`tech-module-chip cursor-none p-4.5 border flex flex-col items-start justify-between min-h-[130px] transition-all duration-300 relative hud-plate-c will-change-transform ${
                    isSelected 
                      ? "bg-accent text-white border-accent shadow-[0_12px_28px_rgba(255,85,0,0.35)] -translate-y-1 z-10" 
                      : "bg-surface/90 text-fg border-fg/15 hover:border-accent hover:bg-surface hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    {/* Module Icon */}
                    <div className="w-6 h-6 flex items-center justify-center filter grayscale contrast-200">
                      {TECH_ICONS[item.name] ? (
                        <img 
                          src={getIconUrl(TECH_ICONS[item.name].slug)} 
                          alt={item.name}
                          className={`w-full h-full object-contain ${isSelected ? 'brightness-200 invert' : ''}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.innerText = '•';
                              fallback.className = isSelected ? 'text-white text-lg font-bold' : 'text-accent text-lg font-bold';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <Cpu size={15} className={isSelected ? "text-white" : "text-accent"} />
                      )}
                    </div>
                    
                    <span className={`font-mono text-[8px] font-bold ${isSelected ? 'text-white/60' : 'text-fg/30'}`}>
                      0{i + 1}
                    </span>
                  </div>

                  <div className="w-full mt-4">
                    <span className="font-display font-black text-sm uppercase tracking-tight block truncate w-full select-none">
                      {item.name}
                    </span>
                    <span className={`font-mono text-[8px] uppercase block tracking-widest mt-0.5 font-semibold ${isSelected ? 'text-white/80' : 'text-fg/40'}`}>
                      COMPILED // OK
                    </span>
                  </div>

                  {isSelected && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-white inline-block" />
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Section Bottom Footer */}
      <div className="w-full mt-10 border-t border-fg/10 px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[9px] text-fg/40">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-accent animate-pulse" />
          <span>REALTIME_SWEEP_HZ: 60 // ZERO_DEVIATION</span>
        </div>
        <div>[MOD_TOTAL: {data.length}] // 04</div>
      </div>
    </section>
  );
}
