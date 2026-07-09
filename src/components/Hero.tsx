import { useState, useEffect } from 'react';

export default function Hero() {
  const [scrambledTitle, setScrambledTitle] = useState("N           ");
  const originalTitle = "NOAH TESFAYE";

  useEffect(() => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-+&*!";
    let interval: NodeJS.Timeout;

    // Immediately fill with 'N' and the rest randomized characters so it doesn't look blank on load
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
              
              // Progressive reveal: reveal one character every 5 frames, always keeping index 0 ('N') revealed
              const revealIndex = Math.floor(frame / 5);
              if (index <= revealIndex || index === 0) {
                return letter;
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        });

        frame++;

        if (Math.floor(frame / 5) >= originalTitle.length) {
          clearInterval(interval);
          setScrambledTitle(originalTitle); // Force exact original text at completion
        }
      }, 30);
    };

    const delayTimeout = setTimeout(runScramble, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(delayTimeout);
    };
  }, []);

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-[6vw] relative border-b border-fg/10 bg-bg">
      
      {/* Decorative vertical blueprint tag in margin */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 font-mono text-[9px] text-fg/20 tracking-[0.4em] uppercase select-none">
        DEPLOYMENT_STATION_LIDETA // DEV_PORTAL_2026
      </div>

      <div className="max-w-[1400px] w-full mx-auto flex flex-col items-start justify-center">
        
        {/* Left Typography Column (Bulky Fonts) */}
        <div className="max-w-[950px] flex flex-col items-start pt-12 lg:pt-0">
          <h1 className="font-display font-black text-[clamp(2.5rem,7vw,10rem)] leading-[0.85] tracking-[-0.04em] uppercase text-fg break-words max-w-[950px] mb-8 select-all flex flex-wrap gap-x-[0.2em]">
            {originalTitle.split(" ").map((word, wordIndex) => {
              const wordStartIndex = wordIndex === 0 ? 0 : 5;
              return (
                <span key={wordIndex} className="inline-flex whitespace-nowrap">
                  {word.split("").map((originalLetter, charIndex) => {
                    const absoluteIndex = wordStartIndex + charIndex;
                    const scrambledLetter = scrambledTitle[absoluteIndex] || originalLetter;
                    return (
                      <span key={charIndex} className="relative inline-block overflow-hidden">
                        {/* Invisible original letter ensures stable width/height to prevent flickering */}
                        <span className="opacity-0 select-none">{originalLetter}</span>
                        {/* Scrambled letter centered absolutely in the layout-stable container */}
                        <span className="absolute inset-0 flex items-center justify-center">
                          {scrambledLetter}
                        </span>
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 border-l-2 border-accent pl-6 mt-2 max-w-[750px]">
            <p className="font-mono text-[12px] uppercase tracking-widest text-muted font-medium leading-[1.7] flex-shrink-0">
              [ROLE_MAPPING] <br />
              SYSTEMS ARCHITECT <br />
              & FULL-STACK ENGINEER
            </p>
            <p className="font-body text-sm text-fg/80 leading-relaxed font-medium">
              Software Engineer for Fun. <br />
              Problem Solver by Choice. <br />
              I build things that live on the internet.
            </p>
          </div>
        </div>

      </div>

      {/* Slide-down Indicator */}
      <div className="absolute bottom-6 left-[6vw] font-mono text-[9px] text-fg/30 flex items-center gap-3 select-none">
        <span className="h-[1px] w-12 bg-fg/25 inline-block" />
        <span>SCROLL TO SYSTEM_EXPLORATION</span>
      </div>
    </section>
  );
}
