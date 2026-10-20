import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Activity, ShieldCheck, Award, ArrowUpRight } from 'lucide-react';
import { Experience as ExperienceType, CertificateItem } from '../services/dataService';
import CertificateModal from './CertificateModal';

gsap.registerPlugin(ScrollTrigger);

export default function Experience({ data }: { data: ExperienceType[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineRailRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCerts, setSelectedCerts] = useState<CertificateItem[] | undefined>(undefined);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Lenis-Style Masked Header Line Reveal
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true
        }
      });

      if (tagRef.current) {
        headerTl.fromTo(
          tagRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power4.out' }
        );
      }

      if (headingRef.current) {
        headerTl.fromTo(
          headingRef.current,
          { yPercent: 110, skewY: 2, opacity: 0 },
          { yPercent: 0, skewY: 0, opacity: 1, duration: 0.7, ease: 'power4.out' },
          '-=0.3'
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
              start: 'top 70%',
              end: 'bottom 85%',
              scrub: 1.0
            }
          }
        );
      }

      // 3. Smooth Milestone Sequential Assembly Timeline (Fast & Snappy)
      cardRefs.current.forEach((item) => {
        if (!item) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        });

        // 1. Pip node on rail pops in swiftly with bounce
        const node = item.querySelector('.exp-node');
        if (node) {
          tl.fromTo(
            node,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.8)' }
          );
        }

        // 2. Connector trace line zips across to card
        const connector = item.querySelector('.exp-connector');
        if (connector) {
          tl.fromTo(
            connector,
            { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
            { scaleX: 1, opacity: 1, duration: 0.25, ease: 'power2.out' },
            '+=0.02'
          );
        }

        // 3. Milestone card plate slides in
        const card = item.querySelector('.exp-card');
        if (card) {
          tl.fromTo(
            card,
            { x: 22, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.38, ease: 'power3.out' },
            '+=0.03'
          );
        }

        // 4. Milestone header (Number & Period badge)
        const header = item.querySelectorAll('.exp-header');
        if (header.length > 0) {
          tl.fromTo(
            header,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.28, ease: 'power3.out' },
            '+=0.03'
          );
        }

        // 5. Role Title
        const title = item.querySelectorAll('.exp-title');
        if (title.length > 0) {
          tl.fromTo(
            title,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.32, ease: 'power4.out' },
            '+=0.03'
          );
        }

        // 6. Narrative Description
        const desc = item.querySelectorAll('.exp-desc');
        if (desc.length > 0) {
          tl.fromTo(
            desc,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.32, ease: 'power3.out' },
            '+=0.03'
          );
        }

        // 7. Certificate Action Button
        const certBtn = item.querySelectorAll('.exp-cert-btn');
        if (certBtn.length > 0) {
          tl.fromTo(
            certBtn,
            { y: 10, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.4)' },
            '+=0.04'
          );
        }
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

        </svg>

        <div className="absolute right-6 top-8 font-mono text-[9vw] font-black text-fg/[0.03] leading-none pointer-events-none select-none">
          CAREER
        </div>
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-20 mx-auto flex-1 flex flex-col justify-between relative z-10">
        
        {/* Lenis Masked Header Line Reveal */}
        <div className="border-b border-fg/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="overflow-hidden mb-2">
              <div ref={tagRef} className="flex items-center gap-2 will-change-transform">
                <span className="w-2 h-2 bg-accent inline-block animate-ping" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent font-bold">
                  CAREER & EDUCATION
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
                  <div className="exp-node relative flex-shrink-0 z-20 mt-1 will-change-transform">
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
                  <div className="exp-connector hidden sm:block absolute left-[35px] top-5 w-6 h-[2px] bg-fg/20 group-hover:bg-accent transition-colors will-change-transform origin-left" />

                  {/* Milestone Card Plate */}
                  <div className="exp-card flex-1 bg-surface/90 border border-fg/20 hover:border-accent transition-all duration-300 p-6 sm:p-7 hud-plate-a hover:shadow-[0_16px_36px_rgba(255,85,0,0.12)] relative overflow-hidden will-change-transform">
                    {/* Top Callout Header Strip */}
                    <div className="exp-header flex flex-wrap items-center justify-between gap-3 border-b border-fg/10 pb-3.5 mb-4 will-change-transform">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-fg/60 font-bold">
                          0{i + 1}
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
                    <h3 className="exp-title font-display font-black text-xl sm:text-2xl text-fg uppercase tracking-tight mb-3 group-hover:text-accent transition-colors leading-tight will-change-transform">
                      {exp.role}
                    </h3>
                    
                    {/* Narrative Description */}
                    <p className="exp-desc font-body text-sm sm:text-base text-muted font-medium leading-relaxed mb-4 will-change-transform">
                      {exp.desc}
                    </p>

                    {/* Certificate Action Button (if ALX or certificates attached) */}
                    {((exp.certificates && exp.certificates.length > 0) || exp.role.toLowerCase().includes('alx')) && (
                      <div className="exp-cert-btn pt-2 will-change-transform">
                        <button
                          onClick={() => {
                            setSelectedCerts(exp.certificates || undefined);
                            setIsCertModalOpen(true);
                          }}
                          className="px-4 py-2 bg-accent/15 hover:bg-accent text-accent hover:text-white border border-accent/40 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-2 transition-all duration-200 cursor-none shadow-sm hover:shadow-[0_4px_16px_rgba(255,85,0,0.25)] group/cert-btn"
                        >
                          <Award size={14} className="text-accent group-hover/cert-btn:text-white transition-colors" />
                          <span>View Certificates</span>
                          <ArrowUpRight size={13} className="group-hover/cert-btn:translate-x-0.5 group-hover/cert-btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Timeline Footer Strip */}
      <div className="w-full mt-8 border-t border-fg/10 px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[9px] text-fg/40 z-10">
        <div>Continuous Journey</div>
        <div className="hidden sm:block">Noah Portfolio</div>
      </div>
      {/* Credential Verification Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificates={selectedCerts}
      />
    </section>
  );
}
