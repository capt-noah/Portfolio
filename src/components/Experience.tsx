import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Activity, ShieldCheck } from 'lucide-react';
import { Experience as ExperienceType } from '../services/dataService';
import { cyberAudio } from '../utils/cyberAudio';

gsap.registerPlugin(ScrollTrigger);

export default function Experience({ data }: { data: ExperienceType[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineRailRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Lenis-Style Masked Header Line Reveal
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

      // 2. Timeline Spine Parallax Scrubbing
      if (timelineRailRef.current) {
        gsap.fromTo(
          timelineRailRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'bottom 85%',
              scrub: 1.0
            }
          }
        );
      }

      // 3. Staggered Lenis-Style Milestone Card Unmasking
      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            y: 50,
            opacity: 0,
            clipPath: 'polygon(0 25%, 100% 25%, 100% 100%, 0 100%)'
          },
          {
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.85,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="min-h-screen w-full flex flex-col justify-between py-16 sm:py-24 border-b border-fg/10 bg-transparent select-none relative overflow-hidden"
    >
      {/* Drafting SVG Background */}
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
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 6" className="text-fg/20" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />

          <rect x="1590" y="-50" width="12" height="520" rx="6" fill="#0B0D10" opacity="0.8" />
          <polygon points="1610,60 1670,60 1640,150 1610,150" fill="#0B0D10" opacity="0.8" />
          <rect x="1614" y="70" width="4" height="16" fill="#FF5500" rx="1" />

          {/* Registration Markers */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />

          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" className="fill-accent">
            EPOCH_LOG // PROTOCOL_02
          </text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" className="fill-accent">
            ☒
          </text>
        </svg>

        <div className="absolute right-6 top-8 font-mono text-[9vw] font-black text-fg/[0.03] leading-none pointer-events-none select-none">
          02_CAREER
        </div>
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-20 mx-auto flex-1 flex flex-col justify-between relative z-10">
        
        {/* Lenis Masked Header Line Reveal */}
        <div className="border-b border-fg/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="overflow-hidden mb-2">
              <div ref={tagRef} className="flex items-center gap-2 will-change-transform">
                <span className="w-2 h-2 bg-accent inline-block animate-ping" />
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold">
                  [SYSTEM.02 // CHRONOLOGY_TIMELINE]
                </span>
              </div>
            </div>

            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display font-black text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9] uppercase text-fg tracking-tighter will-change-transform"
              >
                CAREER
              </h2>
            </div>
          </div>
        </div>

        {/* --- Interactive Cyberpunk Vertical Timeline Highway --- */}
        <div className="relative max-w-4xl w-full my-auto pl-4 sm:pl-10">
          
          {/* Main Continuous Vertical Timeline Rail Spine with Scroll Parallax */}
          <div
            ref={timelineRailRef}
            className="absolute left-[20px] sm:left-[35px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-accent via-fg/30 to-fg/10 will-change-transform"
          />

          {/* Timeline Nodes & Milestones */}
          <div className="space-y-8 sm:space-y-10 relative">
            {data.map((exp, i) => {
              const isCurrent = i === 0;
              return (
                <div
                  key={`${exp.role}-${i}`}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="relative flex items-start gap-4 sm:gap-8 group cursor-none will-change-transform"
                >
                  {/* Timeline Pip / Node on the Rail */}
                  <div className="relative flex-shrink-0 z-20 mt-1">
                    {isCurrent ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-white flex items-center justify-center font-mono text-[11px] font-bold shadow-[0_0_20px_rgba(255,85,0,0.5)] ring-4 ring-accent/20">
                        <Activity size={14} className="animate-spin" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface border-2 border-fg/30 text-fg flex items-center justify-center font-mono text-[10px] font-bold group-hover:border-accent group-hover:text-accent transition-colors shadow-sm">
                        0{i + 1}
                      </div>
                    )}
                  </div>

                  {/* Horizontal Branching Trace Connector */}
                  <div className="hidden sm:block absolute left-[35px] top-5 w-6 h-[2px] bg-fg/20 group-hover:bg-accent transition-colors" />

                  {/* Milestone Card Plate */}
                  <div 
                    onMouseEnter={() => cyberAudio.playHoverChirp()}
                    className="flex-1 bg-surface/90 border border-fg/20 hover:border-accent transition-all duration-300 p-6 sm:p-7 hud-plate-a hover:shadow-[0_16px_36px_rgba(255,85,0,0.12)] relative overflow-hidden"
                  >
                    {/* Top Callout Header Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fg/10 pb-3.5 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-fg/60">
                          MILESTONE_0{i + 1} //
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-accent text-white font-mono text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                            CURRENT ROLE
                          </span>
                        )}
                      </div>

                      {/* Period Badge */}
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-accent bg-accent/10 px-3 py-1 border border-accent/20">
                        <Calendar size={11} />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    {/* Role Title */}
                    <h3 className="font-display font-black text-xl sm:text-2xl text-fg uppercase tracking-tight mb-3 group-hover:text-accent transition-colors leading-tight">
                      {exp.role}
                    </h3>
                    
                    {/* Narrative Description */}
                    <p className="font-body text-sm sm:text-base text-muted font-medium leading-relaxed mb-5">
                      {exp.desc}
                    </p>

                    {/* Bottom Status Telemetry */}
                    <div className="border-t border-fg/10 pt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] text-fg/50">
                      <div className="flex items-center gap-1.5 text-accent font-semibold">
                        <ShieldCheck size={12} />
                        <span>VERIFIED_MILESTONE</span>
                      </div>
                      <div className="flex items-center gap-2 text-fg/40 font-pixel text-[8px]">
                        <span>HASH: 0x{((i + 1) * 38049).toString(16).toUpperCase()}</span>
                        <span>// CHRONO_V26</span>
                      </div>
                    </div>

                    {/* Diagonal Zebra Hatch Corner Accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 hazard-hatch-dark opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Timeline Footer Telemetry Strip */}
      <div className="w-full mt-8 border-t border-fg/10 px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[9px] text-fg/40 z-10">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold">☒</span>
          <span>TIMELINE_CHRONOLOGY // CONTINUOUS_RECORD</span>
        </div>
        <div className="hidden sm:block font-pixel text-[8px]">STATION_LIDETA // ARCHITECT_LOG</div>
      </div>
    </section>
  );
}
