import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface TacticalHudOverlayProps {
  activeSection: string;
}

export default function TacticalHudOverlay({
  activeSection: _activeSection,
}: TacticalHudOverlayProps) {
  const [fps, setFps] = useState(60);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor FPS and scroll depth
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calculateFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calculateFps);
    };
    animId = requestAnimationFrame(calculateFps);

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.round((window.scrollY / total) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden font-mono text-[9px]">
      {/* CORNER RETICLES WITH CALIBRATION TICKS */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-fg/30">
        <span className="text-accent font-bold text-xs">[ + ]</span>
        <span className="hidden sm:inline">SEC_GRID // 0010</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2 text-fg/30">
        <span className="hidden sm:inline">SYS.ONLINE // 99.8%</span>
        <span className="text-accent font-bold text-xs">[ + ]</span>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-fg/30">
        <span className="text-accent font-bold text-xs">[ + ]</span>
        <span>LAT: 9.0320° N // LON: 38.7469° E</span>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-fg/30">
        <div className="flex items-center gap-1.5">
          <Activity size={11} className="text-accent animate-pulse" />
          <span>FPS: {fps}</span>
        </div>
        <span className="text-accent font-bold text-xs">[ + ]</span>
      </div>

      {/* RIGHT EDGE VERTICAL SCROLL PROGRESS GAUGE */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 text-fg/40">
        <span className="text-[7.5px] font-bold text-accent">{scrollProgress}%</span>
        <div className="w-1 h-36 bg-fg/10 relative overflow-hidden rounded-full">
          <div 
            className="w-full bg-accent transition-all duration-150"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
        <span className="text-[7px] tracking-widest -rotate-90 origin-center mt-3">DEPTH</span>
      </div>
    </div>
  );
}
