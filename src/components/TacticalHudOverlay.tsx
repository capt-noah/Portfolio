import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, ShieldCheck, Activity } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface TacticalHudOverlayProps {
  activeSection: string;
  isWireframe: boolean;
  onToggleWireframe: () => void;
}

export default function TacticalHudOverlay({
  activeSection,
  isWireframe,
  onToggleWireframe,
}: TacticalHudOverlayProps) {
  const [isMuted, setIsMuted] = useState(cyberAudio.getMuted());
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

  const handleAudioToggle = () => {
    const next = cyberAudio.toggleMute();
    setIsMuted(next);
    if (!next) cyberAudio.playUiClick();
  };

  const handleWireframeToggle = () => {
    cyberAudio.playModeSwitch();
    onToggleWireframe();
  };

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

      {/* TOP TACTICAL CONTROL BAR (POINTER-EVENTS-AUTO) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-2 bg-plate/90 border border-fg/15 px-3 py-1.5 shadow-sm backdrop-blur-md chamfer-tr">
        {/* Active Section Node */}
        <div className="flex items-center gap-2 pr-3 border-r border-fg/15">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="font-bold text-fg uppercase tracking-wider">
            NODE // {activeSection.toUpperCase()}
          </span>
        </div>

        {/* 3D Wireframe / Shaded Mode Toggle (Lando Norris Style) */}
        <button
          onClick={handleWireframeToggle}
          className="px-2 py-1 bg-fg/5 hover:bg-accent hover:text-white border border-fg/15 text-fg font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-none"
          title="Toggle 3D Core Rendering (PBR / Wireframe)"
        >
          <Eye size={11} className="text-accent" />
          <span>{isWireframe ? 'WIREFRAME' : 'CYBER_CORE'}</span>
        </button>

        {/* Sound Audio Mute Toggle */}
        <button
          onClick={handleAudioToggle}
          className="px-2 py-1 bg-fg/5 hover:bg-accent hover:text-white border border-fg/15 text-fg font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-none"
          title="Toggle Tactical Audio FX"
        >
          {isMuted ? (
            <>
              <VolumeX size={11} className="text-fg/40" />
              <span className="text-fg/40">MUTED</span>
            </>
          ) : (
            <>
              <Volume2 size={11} className="text-accent" />
              <span className="text-accent">AUDIO_ON</span>
            </>
          )}
        </button>
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
