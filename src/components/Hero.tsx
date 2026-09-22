import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Compass, Terminal } from 'lucide-react';

export default function Hero() {
  const [scrambledTitle, setScrambledTitle] = useState("N           ");
  const originalTitle = "NOAH TESFAYE";

  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const valueProp1Ref = useRef<HTMLDivElement>(null);
  const valueProp2Ref = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const statusStripRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // Progressive ASCII Scramble decipher effect
  const triggerScramble = () => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<{{^}}>_//-+=#@*";
    let interval: NodeJS.Timeout;

    const initialScramble = originalTitle.split("").map((letter, index) => {
      if (index === 0) return "N";
      if (letter === " ") return " ";
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
    setScrambledTitle(initialScramble);

    interval = setInterval(() => {
      setScrambledTitle(() => {
        return originalTitle
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            const revealIndex = Math.floor(frame / 3.5);
            if (index <= revealIndex || index === 0) {
              return letter;
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });

      frame++;
      if (Math.floor(frame / 3.5) >= originalTitle.length) {
        clearInterval(interval);
        setScrambledTitle(originalTitle);
      }
    }, 35);
  };

  // Coordinated Lenis-Style Masked Line Unmasking Timeline on Mount
  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const tl = gsap.timeline({ delay: 0.1 });

    // Step 1: Badge unmasks smoothly from top
    if (badgeRef.current) {
      tl.fromTo(
        badgeRef.current,
        { yPercent: -120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power4.out' }
      );
    }

    // Step 2: Giant Heroic Title masked line slide-up (Lenis standard: translateY 110% -> 0%)
    const titleWords = titleContainerRef.current?.querySelectorAll('.hero-title-line');
    if (titleWords && titleWords.length > 0) {
      tl.fromTo(
        titleWords,
        { yPercent: 115, skewY: 2, opacity: 0 },
        {
          yPercent: 0,
          skewY: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.1,
          ease: 'power4.out',
          onStart: () => triggerScramble()
        },
        '-=0.35'
      );
    } else {
      triggerScramble();
    }

    // Step 3: Value propositions unmask from their overflow containers
    const valueProps = [valueProp1Ref.current, valueProp2Ref.current].filter(Boolean);
    if (valueProps.length > 0) {
      tl.fromTo(
        valueProps,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power4.out'
        },
        '-=0.55'
      );
    }

    // Step 4: Tactical CTA buttons unmask from bottom
    if (ctaContainerRef.current) {
      tl.fromTo(
        ctaContainerRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power4.out' },
        '-=0.5'
      );
    }

    // Step 5: Bottom telemetry status strip unmasks
    if (statusStripRef.current) {
      tl.fromTo(
        statusStripRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
        '-=0.45'
      );
    }
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="min-h-screen w-full flex flex-col justify-between relative border-b border-fg/10 bg-transparent overflow-hidden select-none"
    >
      {/* Hero Section Authentic HUD Drafting Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 tech-grid-bg opacity-40" />
        <div className="absolute inset-0 tech-dot-bg opacity-25" />

        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Outer Framing Chassis */}
          <rect
            x="60"
            y="45"
            width="1800"
            height="990"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-fg/20"
          />

          {/* Continuous Architectural Guide Conduits */}
          <line
            x1="240"
            y1="-50"
            x2="240"
            y2="1150"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="8 6"
            className="text-fg/20"
          />
          <line
            x1="1680"
            y1="-50"
            x2="1680"
            y2="1150"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="8 6"
            className="text-fg/20"
          />

          {/* Top Asymmetric Chamfered Hood */}
          <polygon
            points="1180,45 1420,45 1560,185 1800,185 1740,245 1520,245 1400,125 1180,125"
            fill="rgba(11, 13, 16, 0.035)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/30"
          />

          {/* Signature Diagonal Armature / Structural Chevron Frame */}
          <polygon
            points="1040,110 1100,50 1160,110 1160,240 1440,520 1560,520 1560,580 1500,640 1420,640 1240,460 1040,260"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-fg/35"
          />

          {/* Right Bank: Stacked Angled Louver Slots */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const y = 240 + idx * 24;
            return (
              <polygon
                key={`hero-louver-rt-${idx}`}
                points={`1640,${y} 1710,${y - 20} 1726,${y - 20} 1656,${y}`}
                fill="rgba(11, 13, 16, 0.04)"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-fg/30"
              />
            );
          })}

          {/* Left Flank: Stacked Angled Louver Slots */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const y = 520 + idx * 24;
            return (
              <polygon
                key={`hero-louver-lt-${idx}`}
                points={`80,${y} 150,${y - 20} 166,${y - 20} 96,${y}`}
                fill="rgba(11, 13, 16, 0.04)"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-fg/30"
              />
            );
          })}

          {/* Corner Registration Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />

          {/* HUD Telemetry Labels */}
          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" className="fill-accent">
            HUD_SYS // PROTOCOL_01
          </text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" className="fill-accent">
            ☒
          </text>
        </svg>
      </div>

      {/* Main Full-Bleed Viewport Chassis with Fluid Responsive Padding */}
      <div className="flex-1 w-full flex items-stretch relative z-10 px-4 sm:px-10 lg:px-20 py-10 sm:py-16">
        <div className="flex-1 flex flex-col justify-center items-start max-w-6xl relative">
          
          {/* Lenis Masked Overflow Container: Orange Chamfered Badge */}
          <div className="overflow-hidden mb-6 sm:mb-8">
            <div
              ref={badgeRef}
              className="flex items-center will-change-transform"
            >
              <div className="bg-accent text-white px-4 sm:px-5 py-2 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2.5 shadow-md chamfer-tr">
                <Terminal size={15} />
                <span>FULL-STACK ARCHITECT ↗</span>
              </div>
            </div>
          </div>

          {/* Giant Heroic Typographic Title with Masked Line Wrappers */}
          <div
            ref={titleContainerRef}
            className="flex items-end gap-4 sm:gap-8 flex-wrap mb-8 sm:mb-10 overflow-hidden"
          >
            <h1 className="font-display font-black text-[clamp(3.2rem,9vw,11.5rem)] leading-[0.86] tracking-[-0.02em] uppercase text-fg break-words select-all flex flex-wrap gap-x-[0.2em]">
              {originalTitle.split(" ").map((word, wordIndex) => {
                const wordStartIndex = wordIndex === 0 ? 0 : 5;
                return (
                  <div key={wordIndex} className="overflow-hidden inline-flex">
                    <span className="hero-title-line inline-flex whitespace-nowrap will-change-transform">
                      {word.split("").map((originalLetter, charIndex) => {
                        const absoluteIndex = wordStartIndex + charIndex;
                        const scrambledLetter = scrambledTitle[absoluteIndex] || originalLetter;
                        const hasCyberAccent = absoluteIndex === 1 || absoluteIndex === 8;
                        return (
                          <span key={charIndex} className="relative inline-block overflow-hidden">
                            <span className="opacity-0 select-none">{originalLetter}</span>
                            <span className="absolute inset-0 flex items-center justify-center">
                              {scrambledLetter}
                            </span>
                            {hasCyberAccent && (
                              <span className="absolute top-1 right-0 text-xs text-accent font-bold pointer-events-none select-none">
                                ▲
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                );
              })}
            </h1>
          </div>

          {/* Value Prop & Engineering Philosophy with Masked Line Wrappers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-[960px] w-full py-4 my-2">
            <div className="overflow-hidden">
              <div ref={valueProp1Ref} className="border-l-3 border-accent pl-5 will-change-transform">
                <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-accent font-bold block mb-2">
                  // ARCHITECTURE &amp; DISTRIBUTED CORE
                </span>
                <p className="font-body text-base sm:text-lg lg:text-xl text-fg/85 font-medium leading-relaxed">
                  Engineering resilient distributed architectures, low-latency microservices, and high-performance interactive web systems.
                </p>
              </div>
            </div>

            <div className="overflow-hidden">
              <div ref={valueProp2Ref} className="border-l-3 border-fg/20 pl-5 will-change-transform">
                <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-fg/50 font-bold block mb-2">
                  // HIGH-IMPACT SPECIALIZATION
                </span>
                <p className="font-body text-base sm:text-lg lg:text-xl text-muted font-medium leading-relaxed">
                  Modern Full-Stack Applications, Real-time APIs, Database Infrastructure &amp; Mission-Critical Client Interfaces.
                </p>
              </div>
            </div>
          </div>

          {/* Tactical CTAs with Masked Reveal Wrapper */}
          <div className="overflow-hidden w-full mt-8 sm:mt-10">
            <div
              ref={ctaContainerRef}
              className="flex flex-wrap items-center gap-4 sm:gap-6 will-change-transform"
            >
              <button
                onClick={() => scrollToWork()}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-accent hover:bg-accent-hover text-white font-mono text-sm sm:text-base font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 shadow-[0_6px_25px_rgba(255,85,0,0.35)] hover:-translate-y-0.5 cursor-none relative overflow-hidden group chamfer-tr"
              >
                <span className="relative z-10">EXPLORE PROJECTS</span>
                <ArrowUpRight size={18} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <a
                href="#footer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 sm:px-9 py-4 sm:py-5 bg-surface/80 hover:bg-surface text-fg border border-fg/20 font-mono text-sm sm:text-base font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 hover:border-accent hover:text-accent cursor-none chamfer-tr shadow-xs"
              >
                <Compass size={18} />
                <span>INITIATE CONTACT</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Persistent Bottom Status Strip */}
      <div className="overflow-hidden w-full">
        <div
          ref={statusStripRef}
          className="w-full border-t border-fg/10 px-4 sm:px-12 lg:px-20 py-4 flex flex-wrap items-center justify-between font-mono text-[10px] sm:text-xs text-fg/50 relative z-10 bg-surface/30 backdrop-blur-xs gap-3 will-change-transform"
        >
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-2 text-fg/80 font-bold">
              <span className="w-2 h-2 bg-accent rounded-full inline-block animate-pulse" />
              STATUS: READY
            </span>
            <span className="hidden sm:inline font-semibold">LOC // ADDIS_ABABA // UTC+3</span>
            <span className="hidden md:inline font-semibold">SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-accent font-bold">[ARCHITECT_SPEC_2026]</span>
            <span className="hidden sm:inline font-bold">SEC_01</span>
          </div>
        </div>
      </div>

    </section>
  );
}
