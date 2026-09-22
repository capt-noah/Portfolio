import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Github, Terminal, ShieldCheck } from 'lucide-react';
import { Project } from '../services/dataService';

gsap.registerPlugin(ScrollTrigger);

interface WorkProps {
  data: Project[];
  onSelectProject: (id: string) => void;
}

export default function Work({ data, onSelectProject }: WorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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

      // 2. Project Cards Lenis Staggered Unmasking
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            y: 60,
            opacity: 0,
            scale: 0.96
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            delay: (idx % 3) * 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
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
      id="work"
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
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />

          {/* Registration Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />

          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" className="fill-accent">
            ARTIFACT_MATRIX // PROTOCOL_03
          </text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" className="fill-accent">
            ☒
          </text>
        </svg>

        <div className="absolute left-6 top-8 font-mono text-[9vw] font-black text-fg/[0.03] leading-none pointer-events-none select-none">
          03_PROJECTS
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
                  [SYSTEM.03 // ARTIFACTS]
                </span>
              </div>
            </div>

            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display font-black text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9] uppercase text-fg tracking-tighter will-change-transform"
              >
                PROJECTS
              </h2>
            </div>
          </div>
        </div>

        {/* Interlocking Asymmetric Specimen Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 my-auto">
          {data.map((project, i) => {
            const isFeatured = i === 0;
            
            if (isFeatured) {
              return (
                <div
                  key={`${project.id}-${i}`}
                  ref={(el) => (cardRefs.current[i] = el)}
                  onClick={() => {
                    if (project.id) onSelectProject(project.id);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                  }}
                  className="xl:col-span-2 bg-accent text-white p-6 sm:p-10 flex flex-col justify-between min-h-[460px] relative shadow-[0_20px_50px_rgba(255,85,0,0.3)] group cursor-none transition-transform duration-200 hud-plate-b will-change-transform"
                >
                  {/* Top HUD Callout Strip */}
                  <div className="flex items-center justify-between border-b border-white/25 pb-4 mb-6">
                    <div className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-white">
                      <span>FLAGSHIP_SPECIMEN // {project.id}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase">
                      <span className="px-2.5 py-0.5 bg-white text-accent">
                        {project.technologies?.[0] || 'FULL_STACK'}
                      </span>
                      <span className="hidden sm:inline opacity-75">380/AC002 &gt;&gt;</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
                        {project.title}
                      </h3>
                      <span className="font-mono text-5xl sm:text-6xl font-black text-white/20 leading-none select-none">
                        {project.id}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 font-mono text-[10px] uppercase tracking-wider text-white mb-6">
                      <Terminal size={11} />
                      <span>{project.meta}</span>
                    </div>

                    <p className="font-body text-base text-white/95 font-medium leading-relaxed max-w-2xl mb-6">
                      {project.desc}
                    </p>

                    {/* Integrated Technologies Pills */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((t, idx) => (
                          <span key={idx} className="font-mono text-[9px] uppercase px-2.5 py-1 bg-white/15 text-white border border-white/20 font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="border-t border-white/25 pt-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-white/90">
                      <ShieldCheck size={14} />
                      <span>INTEGRITY_VERIFIED // 60_FPS</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-accent transition-colors border border-white/20"
                          title="View Repository"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      <div className="px-5 py-2.5 bg-white text-accent font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:bg-fg group-hover:text-white transition-colors">
                        <span>INSPECT</span>
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-12 h-12 hazard-hatch-white opacity-25" />
                </div>
              );
            }

            // Secondary Specimen HUD Plates
            return (
              <div
                key={`${project.id}-${i}`}
                ref={(el) => (cardRefs.current[i] = el)}
                onClick={() => {
                  if (project.id) onSelectProject(project.id);
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-3px)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                }}
                className="bg-surface/90 border border-fg/20 p-6 sm:p-8 flex flex-col justify-between min-h-[460px] relative transition-transform duration-200 hover:border-accent hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] group cursor-none hud-plate-a will-change-transform"
              >
                {/* Top Corner Badge */}
                <div className="flex items-center justify-between border-b border-fg/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-accent inline-block" />
                    <span className="font-mono text-[9px] text-fg/50 uppercase font-semibold">
                      SPEC_{project.id} // {String(data.length).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] font-bold uppercase px-2.5 py-0.5 bg-fg/5 border border-fg/15 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    {project.technologies?.[0] || 'NODE'}
                  </span>
                </div>

                {/* Header Information */}
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-mono text-4xl sm:text-5xl font-black text-fg/15 group-hover:text-accent/30 tracking-tighter leading-none select-none transition-colors">
                      {project.id}
                    </span>
                    <span className="font-mono text-[9px] text-fg/40 group-hover:text-accent font-semibold transition-colors">
                      [0010 0000]
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-fg group-hover:text-accent mb-3 transition-colors">
                    {project.title}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-fg/10 bg-fg/[0.03] font-mono text-[9px] uppercase tracking-wider text-fg/60 mb-5">
                    <Terminal size={10} className="text-accent" />
                    <span>{project.meta}</span>
                  </div>

                  <p className="font-body text-sm text-muted font-medium leading-relaxed mb-6">
                    {project.desc}
                  </p>
                </div>

                {/* Tech Badges & Footer Action */}
                <div>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-fg/10">
                      {project.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="font-mono text-[8.5px] uppercase px-2 py-0.5 border border-fg/10 text-fg/70 bg-fg/[0.02]">
                          {t}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="font-mono text-[8.5px] text-accent font-bold px-1.5 py-0.5">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-fg/10 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-fg/40 uppercase font-semibold">
                      // CLICK TO INSPECT
                    </span>

                    <div className="w-9 h-9 border border-fg/20 group-hover:bg-accent group-hover:border-accent flex items-center justify-center transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 text-fg group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-8 h-8 hazard-hatch-dark opacity-10 group-hover:opacity-25 transition-opacity" />
              </div>
            );
          })}
        </div>

      </div>

      {/* Section Footer */}
      <div className="w-full mt-10 border-t border-fg/10 px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[9px] text-fg/40">
        <div>[TOTAL_ARTIFACTS: 0{data.length}]</div>
        <div className="hidden sm:block">SA/CT_II // RUNTIME_STABLE // 03</div>
      </div>
    </section>
  );
}
