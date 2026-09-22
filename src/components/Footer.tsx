import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Social } from "../services/dataService";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Dribbble,
  Music2,
  Youtube,
  Facebook,
  Send,
  Terminal,
  CheckCircle2,
  Radio,
  Sparkles
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS_MAP: Record<string, React.ReactNode> = {
  GitHub: <Github size={16} />,
  LinkedIn: <Linkedin size={16} />,
  Twitter: <Twitter size={16} />,
  X: <Twitter size={16} />,
  Instagram: <Instagram size={16} />,
  Dribbble: <Dribbble size={16} />,
  TikTok: <Music2 size={16} />,
  YouTube: <Youtube size={16} />,
  Facebook: <Facebook size={16} />,
  Email: <Mail size={16} />,
};

interface FooterProps {
  data: Social[];
  onFooterIntersect: (isIntersecting: boolean) => void;
}

export default function Footer({ data, onFooterIntersect }: FooterProps) {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Footer Intersection Trigger for Custom Cursor
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom bottom',
        onEnter: () => onFooterIntersect(true),
        onLeaveBack: () => onFooterIntersect(false)
      });

      // 2. Lenis Masked Header Line Reveal
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

      if (descRef.current) {
        headerTl.fromTo(
          descRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out' },
          '-=0.4'
        );
      }

      // 3. Social Chips Staggered Unmasking
      const socialChips = socialsRef.current?.querySelectorAll('.social-chip-item');
      if (socialChips && socialChips.length > 0) {
        gsap.fromTo(
          socialChips,
          { y: 25, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.04,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: socialsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 4. Dispatcher Console Form Reveal
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { y: 50, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [data, onFooterIntersect]);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setIsSent(true);
      setFormData({ email: "", message: "" });
      setTimeout(() => setIsSent(false), 6000);
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="footer"
      className="footer min-h-screen w-full bg-fg text-surface flex flex-col justify-between py-16 sm:py-24 relative overflow-hidden select-none"
    >
      {/* Footer Drafting SVG Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect x="60" y="45" width="1800" height="990" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="white" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.15" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="white" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.15" />

          {/* Registration Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />

          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#FF5500">
            FREQUENCY_DISPATCH // PROTOCOL_05
          </text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#FF5500">
            ☒
          </text>
        </svg>

        <div className="absolute right-6 top-8 font-mono text-[9vw] font-black text-white/[0.03] leading-none pointer-events-none select-none">
          05_CONNECT
        </div>
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-16 mx-auto flex-1 flex flex-col justify-center">
        
        {/* Main Chassis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
          
          {/* Left Column: Heading & Social Matrix */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <div className="overflow-hidden mb-3">
                <div ref={tagRef} className="flex items-center gap-2 will-change-transform">
                  <span className="w-2 h-2 bg-accent inline-block animate-ping" />
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold">
                    [SYSTEM.05 // DISPATCH]
                  </span>
                </div>
              </div>

              <div className="overflow-hidden mb-6 sm:mb-8">
                <h2
                  ref={headingRef}
                  className="font-display font-black text-[clamp(2.5rem,6vw,6.5rem)] leading-[0.85] uppercase text-white tracking-tighter will-change-transform"
                >
                  CONNECT
                </h2>
              </div>

              <p
                ref={descRef}
                className="font-body text-base text-white/70 font-medium leading-relaxed max-w-md mb-8 sm:mb-10 will-change-transform"
              >
                Open for high-impact technical advisory, distributed systems engineering, and full-stack software leadership.
              </p>
            </div>

            {/* Social Links Matrix */}
            <div ref={socialsRef}>
              <div className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold mb-4 flex items-center gap-2">
                <Radio size={13} className="text-accent" />
                <span>// EXTERNAL_COMMUNICATION_CHANNELS</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {data.map((social, i) => (
                  <a
                    key={`${social.name}-${i}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-chip-item flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.04] border border-white/15 hover:border-accent hover:bg-accent hover:text-white transition-all duration-300 font-mono text-xs uppercase font-bold tracking-wider cursor-none chamfer-tr group will-change-transform"
                  >
                    <span className="text-accent group-hover:text-white transition-colors">
                      {SOCIAL_ICONS_MAP[social.name] || <Sparkles size={14} />}
                    </span>
                    <span>{social.name}</span>
                    <span className="text-[9px] text-white/40 group-hover:text-white/80 transition-colors">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Dispatcher Console Form */}
          <div 
            ref={formRef}
            className="lg:col-span-6 bg-white/[0.04] border border-white/15 p-6 sm:p-10 relative hud-plate-b will-change-transform"
          >
            {/* Form Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent" />
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-white">
                  TRANSMITTER_SHELL // V26
                </span>
              </div>
              <div className="font-mono text-[9px] text-accent font-bold px-2 py-0.5 bg-accent/15 border border-accent/30">
                FREQUENCY: 38.74_LIDETA
              </div>
            </div>

            {isSent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 size={44} className="text-accent mb-4 animate-pulse" />
                <h3 className="font-display font-black text-xl uppercase mb-2 text-white">
                  TRANSMISSION RELAYED
                </h3>
                <p className="font-mono text-xs text-white/60 max-w-sm uppercase">
                  Data packet encrypted and delivered to station endpoint. Response will dispatch promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTransmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
                    [ SENDER_FREQUENCY_ADDRESS ]
                  </label>
                  <div className="flex items-center bg-white/[0.04] border border-white/15 focus-within:border-accent transition-colors">
                    <span className="font-mono text-xs text-accent pl-4 pr-2 font-bold">&gt;&gt;</span>
                    <input 
                      type="email" 
                      required
                      placeholder="your_email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="cursor-none w-full bg-transparent border-0 outline-none ring-0 p-3 font-mono text-xs text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
                    [ MESSAGE_PAYLOAD_BODY ]
                  </label>
                  <div className="flex items-start bg-white/[0.04] border border-white/15 focus-within:border-accent transition-colors">
                    <span className="font-mono text-xs text-accent pl-4 pt-3 font-bold">&gt;&gt;</span>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Specify project parameters or consultation requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="cursor-none w-full bg-transparent border-0 outline-none ring-0 p-3 font-mono text-xs text-white placeholder:text-white/30 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="cursor-none w-full bg-accent hover:bg-accent-hover text-white p-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_24px_rgba(255,85,0,0.35)] relative overflow-hidden"
                >
                  {isTransmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                      <span>RELAYING PACKETS...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>DISPATCH TRANSMISSION</span>
                    </>
                  )}
                  <div className="absolute right-0 top-0 bottom-0 w-2 hazard-hatch-white opacity-30" />
                </button>
              </form>
            )}

            <div className="absolute top-0 right-0 w-8 h-8 hazard-hatch-white opacity-15" />
          </div>

        </div>

      </div>

      {/* Terminal Footer Info Strip */}
      <div className="w-full mt-12 border-t border-white/10 px-6 sm:px-12 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[9px] text-white/40 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold">☒</span>
          <span>© {new Date().getFullYear()} NOAH TESFAYE // SYSTEMS ARCHITECT</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LAT: 9.01 // LONG: 38.74</span>
          <span className="text-accent font-semibold">ALL_SYSTEMS_GO // 05</span>
        </div>
      </div>
    </section>
  );
}
