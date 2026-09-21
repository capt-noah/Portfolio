import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Compass, Terminal, ShieldCheck, Activity } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

export default function Hero() {
  const [scrambledTitle, setScrambledTitle] = useState("N           ");
  const originalTitle = "NOAH TESFAYE";

  // Progressive ASCII Scramble decipher effect
  useEffect(() => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<{{^}}>_//-+=#@*";
    let interval: NodeJS.Timeout;

    const initialScramble = originalTitle.split("").map((letter, index) => {
      if (index === 0) return "N";
      if (letter === " ") return " ";
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
    setScrambledTitle(initialScramble);

    const runScramble = () => {
      interval = setInterval(() => {
        setScrambledTitle(() => {
          return originalTitle
            .split("")
            .map((letter, index) => {
              if (letter === " ") return " ";
              const revealIndex = Math.floor(frame / 4);
              if (index <= revealIndex || index === 0) {
                return letter;
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        });

        frame++;
        if (Math.floor(frame / 4) >= originalTitle.length) {
          clearInterval(interval);
          setScrambledTitle(originalTitle);
        }
      }, 35);
    };

    const delayTimeout = setTimeout(runScramble, 400);
    return () => {
      clearInterval(interval);
      clearTimeout(delayTimeout);
    };
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen w-full flex flex-col justify-between relative border-b border-fg/10 bg-transparent overflow-hidden select-none">
      
      {/* Hero Section Authentic HUD Drafting Background (Stazquez on Twitter & _(5) HUD Reference) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Subtle grid & dot matrix */}
        <div className="absolute inset-0 tech-grid-bg opacity-40" />
        <div className="absolute inset-0 tech-dot-bg opacity-25" />

        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Outer Framing Chassis */}
          <rect x="60" y="45" width="1800" height="990" rx="4" fill="none" stroke="currentColor" strokeWidth="1" className="text-fg/20" />
          
          {/* Continuous Architectural Guide Conduits extending across sections */}
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />

          {/* Top Asymmetric Chamfered Hood (Stazquez top plate) */}
          <polygon
            points="1180,45 1420,45 1560,185 1800,185 1740,245 1520,245 1400,125 1180,125"
            fill="rgba(11, 13, 16, 0.035)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/30"
          />
          <path
            d="M 1240 85 L 1400 85 L 1520 205 L 1720 205"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="6 4"
            className="text-fg/20"
          />

          {/* Signature Stazquez Diagonal Armature / Structural Chevron Frame */}
          <polygon
            points="1040,110 1100,50 1160,110 1160,240 1440,520 1560,520 1560,580 1500,640 1420,640 1240,460 1040,260"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-fg/35"
          />
          {/* Inner Hollow Cutout Window for Armature Depth */}
          <polygon
            points="1080,220 1120,220 1340,440 1300,480 1180,360 1080,260"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />

          {/* Stazquez Right Bank: 8 Stacked Angled Louver Slot Capsules */}
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

          {/* Stazquez Left Flank: 8 Stacked Angled Louver Slot Capsules */}
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

          {/* Stazquez Bottom-Left: Double Horizontal Beveled Stadium Bars */}
          <polygon
            points="80,880 440,880 465,905 105,905"
            fill="rgba(11, 13, 16, 0.045)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/35"
          />
          <polygon
            points="80,925 400,925 425,950 105,950"
            fill="rgba(11, 13, 16, 0.045)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/35"
          />

          {/* Stazquez Lower-Right Translucent Sub-Plate (Depth Layer) */}
          <rect
            x="1480"
            y="680"
            width="340"
            height="320"
            rx="10"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/25"
          />
          <rect
            x="1220"
            y="650"
            width="220"
            height="24"
            rx="12"
            fill="rgba(11, 13, 16, 0.035)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />

          {/* Stepped Mechanical Armor Bracket (Stazquez bottom contour) */}
          <polygon
            points="1320,680 1480,680 1480,920 1440,960 1400,960 1400,840 1360,800 1320,800"
            fill="rgba(11, 13, 16, 0.03)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/30"
          />

          {/* Corner Registration Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />

          {/* HUD Telemetry Labels */}
          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" className="fill-accent">HUD_SYS // PROTOCOL_01</text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" className="fill-accent">☒</text>
        </svg>
      </div>

      {/* Main Full-Bleed Viewport Chassis with Fluid Responsive Padding */}
      <div className="flex-1 w-full flex items-stretch relative z-10 px-4 sm:px-10 lg:px-20 py-10 sm:py-16">
        
        {/* Main Content Arena: Unboxed Cyberpunk Architectural Canvas */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-6xl relative">
          
          {/* Orange Chamfered Badge with Snappy Reveal Motion */}
          <motion.div 
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex items-center mb-6 sm:mb-8"
          >
            <div className="bg-accent text-white px-4 sm:px-5 py-2 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2.5 shadow-md chamfer-tr">
              <Terminal size={15} />
              <span>FULL-STACK ARCHITECT ↗</span>
            </div>
          </motion.div>

          {/* Giant Heroic Typographic Title with Staggered Cyber Decipher Effect */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex items-end gap-4 sm:gap-8 flex-wrap mb-8 sm:mb-10"
          >
            <h1 className="font-display font-black text-[clamp(3.2rem,9vw,11.5rem)] leading-[0.86] tracking-[-0.02em] uppercase text-fg break-words select-all flex flex-wrap gap-x-[0.2em]">
              {originalTitle.split(" ").map((word, wordIndex) => {
                const wordStartIndex = wordIndex === 0 ? 0 : 5;
                return (
                  <span key={wordIndex} className="inline-flex whitespace-nowrap">
                    {word.split("").map((originalLetter, charIndex) => {
                      const absoluteIndex = wordStartIndex + charIndex;
                      const scrambledLetter = scrambledTitle[absoluteIndex] || originalLetter;
                      const hasCyberAccent = absoluteIndex === 1 || absoluteIndex === 8; // 'O' and 'A'
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
                );
              })}
            </h1>
          </motion.div>

          {/* Value Prop & Engineering Philosophy with Staggered Slide-Up */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-[960px] w-full py-4 my-2"
          >
            <div className="border-l-3 border-accent pl-5">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-accent font-bold block mb-2">
                // ARCHITECTURE &amp; DISTRIBUTED CORE
              </span>
              <p className="font-body text-base sm:text-lg lg:text-xl text-fg/85 font-medium leading-relaxed">
                Engineering resilient distributed architectures, low-latency microservices, and high-performance interactive web systems.
              </p>
            </div>
            <div className="border-l-3 border-fg/20 pl-5">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-fg/50 font-bold block mb-2">
                // HIGH-IMPACT SPECIALIZATION
              </span>
              <p className="font-body text-base sm:text-lg lg:text-xl text-muted font-medium leading-relaxed">
                Modern Full-Stack Applications, Real-time APIs, Database Infrastructure &amp; Mission-Critical Client Interfaces.
              </p>
            </div>
          </motion.div>

          {/* Tactical CTAs with Staggered Slide-Up Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10 w-full"
          >
            <button
              onClick={() => {
                cyberAudio.playMechanicalClick();
                scrollToWork();
              }}
              onMouseEnter={() => cyberAudio.playHoverChirp()}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-accent hover:bg-accent-hover text-white font-mono text-sm sm:text-base font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 shadow-[0_6px_25px_rgba(255,85,0,0.35)] hover:-translate-y-0.5 cursor-none relative overflow-hidden group chamfer-tr"
            >
              <span className="relative z-10">EXPLORE PROJECTS</span>
              <ArrowUpRight size={18} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                cyberAudio.playMechanicalClick();
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={() => cyberAudio.playHoverChirp()}
              className="px-8 sm:px-9 py-4 sm:py-5 bg-surface/80 hover:bg-surface text-fg border border-fg/20 font-mono text-sm sm:text-base font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 hover:border-accent hover:text-accent cursor-none chamfer-tr shadow-xs"
            >
              <Compass size={18} />
              <span>INITIATE CONTACT</span>
            </a>
          </motion.div>

        </div>
      </div>

      {/* Persistent Bottom Status Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
        className="w-full border-t border-fg/10 px-4 sm:px-12 lg:px-20 py-4 flex flex-wrap items-center justify-between font-mono text-[10px] sm:text-xs text-fg/50 relative z-10 bg-surface/30 backdrop-blur-xs gap-3"
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
      </motion.div>

    </section>
  );
}

