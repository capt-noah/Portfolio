import { motion } from 'motion/react';
import { Terminal, Briefcase, Layers, Cpu, Send } from 'lucide-react';

const navItems = [
  { id: 'hero', icon: Terminal, label: 'SYS', code: '01' },
  { id: 'experience', icon: Briefcase, label: 'CAREER', code: '02' },
  { id: 'work', icon: Layers, label: 'PROJECTS', code: '03' },
  { id: 'stack', icon: Cpu, label: 'TECH STACK', code: '04' },
  { id: 'footer', icon: Send, label: 'CONNECT', code: '05' },
];

interface NavigationProps {
  isInFooter?: boolean;
  activeSection?: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const scrollTo = (id: string) => {
    const container = document.querySelector('.snap-container') as HTMLElement;
    const element = document.getElementById(id);
    if (container && element) {
      const originalSnapType = container.style.scrollSnapType;
      container.style.scrollSnapType = 'none';

      const targetTop = element.offsetTop;
      const startTop = container.scrollTop;
      const distance = targetTop - startTop;
      const duration = 750;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const timeElapsed = time - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const ease = easeInOutCubic(progress);
        container.scrollTop = startTop + distance * ease;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          container.style.scrollSnapType = originalSnapType || 'y mandatory';
        }
      };

      requestAnimationFrame(animate);
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400000] px-4 w-full max-w-fit pointer-events-none">
      {/* Ambient Cyber Neon Ground-Effect Glow */}
      <div className="absolute -inset-2 bg-accent/20 blur-xl rounded-full pointer-events-none opacity-60 -z-10" />

      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.3 }}
        className="pointer-events-auto bg-[#07080B] text-white border-2 border-accent shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,85,0,0.45),0_0_12px_rgba(255,85,0,0.8)] relative select-none"
        style={{
          clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'
        }}
      >
        {/* Top HUD Telemetry Status Ticker Strip */}
        <div className="w-full flex items-center justify-between px-4 py-1.5 border-b border-accent/40 bg-accent/[0.12] font-mono text-[8.5px] uppercase tracking-widest text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block shadow-[0_0_10px_#FF5500] animate-pulse" />
            <span className="font-bold text-white tracking-widest drop-shadow-[0_0_6px_rgba(255,85,0,0.8)]">
              HUD_NAV // SYS.ONLINE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-[8px] font-semibold tracking-wider">PROTOCOL // V26.0</span>
            <span className="text-accent font-black text-[10px]">☒</span>
          </div>
        </div>

        {/* HUD Navigation Tabs Row - Strictly Horizontal with Full Screen Adaptability */}
        <div className="flex flex-row flex-nowrap items-center p-2 sm:p-2.5 gap-1.5 sm:gap-2 bg-[#0B0D12] overflow-x-auto scrollbar-none max-w-[95vw]">
          {/* Left HUD Hazard Wing */}
          <div className="w-2.5 h-9 hazard-hatch-orange opacity-90 mr-0.5 sm:mr-1 shrink-0 hidden md:block border border-accent/40 shadow-[0_0_8px_rgba(255,85,0,0.4)]" />

          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-200 flex flex-row flex-nowrap items-center gap-1.5 sm:gap-2 font-mono text-[10.5px] sm:text-[12px] font-bold uppercase tracking-wider relative cursor-none chamfer-tr shrink-0 whitespace-nowrap ${
                  isActive 
                    ? 'bg-accent text-white shadow-[0_0_24px_rgba(255,85,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-white/60 scale-[1.02]'
                    : 'bg-[#141820] text-white/80 hover:text-white hover:bg-[#1E2430] border border-white/20 shadow-sm'
                }`}
                title={item.label}
                aria-label={item.label}
              >
                <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-accent'}`} />
                <span className="hidden sm:inline font-mono whitespace-nowrap">{item.label}</span>
                <span className={`text-[8.5px] sm:text-[9px] font-mono font-black shrink-0 ${isActive ? 'text-white' : 'text-accent'}`}>
                  //{item.code}
                </span>

                {/* Active HUD top indicator pip */}
                {isActive && (
                  <span className="absolute top-0 left-2 right-2 h-[2px] bg-white shadow-[0_0_8px_white] inline-block" />
                )}
              </button>
            );
          })}

          {/* Right HUD Hazard Wing */}
          <div className="w-2.5 h-9 hazard-hatch-orange opacity-90 ml-0.5 sm:ml-1 shrink-0 hidden md:block border border-accent/40 shadow-[0_0_8px_rgba(255,85,0,0.4)]" />
        </div>

        {/* Outer High-Visibility Corner Ticks */}
        <div className="absolute -top-1.5 -left-1.5 text-[11px] text-accent pointer-events-none font-mono font-black">┌</div>
        <div className="absolute -top-1.5 -right-1.5 text-[11px] text-accent pointer-events-none font-mono font-black">┐</div>
        <div className="absolute -bottom-1.5 -left-1.5 text-[11px] text-accent pointer-events-none font-mono font-black">└</div>
        <div className="absolute -bottom-1.5 -right-1.5 text-[11px] text-accent pointer-events-none font-mono font-black">┘</div>
      </motion.nav>
    </div>
  );
}

