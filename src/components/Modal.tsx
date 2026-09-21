import { motion, AnimatePresence } from 'motion/react';
import { MouseEvent, useState, useEffect, useRef } from 'react';
import { 
  X, Github, ArrowUpRight, Cpu, ExternalLink, Globe, 
  RotateCw, Eye, ShieldCheck, Sparkles, Monitor 
} from 'lucide-react';
import { Project } from '../services/dataService';

interface ModalProps {
  projectId: string | null;
  onClose: () => void;
  projects: Project[];
}

const RATIO_CONFIGS = {
  '16:10': {
    className: 'aspect-[16/10]',
    virtualWidth: 1280,
    virtualHeight: 800,
    label: '16:10',
    thumCrop: 'width/1280/crop/800',
  },
  '16:9': {
    className: 'aspect-video',
    virtualWidth: 1280,
    virtualHeight: 720,
    label: '16:9',
    thumCrop: 'width/1280/crop/720',
  },
  '4:3': {
    className: 'aspect-[4/3]',
    virtualWidth: 1024,
    virtualHeight: 768,
    label: '4:3',
    thumCrop: 'width/1024/crop/768',
  },
} as const;

type RatioKey = keyof typeof RATIO_CONFIGS;

export default function Modal({ projectId, onClose, projects }: ModalProps) {
  const data = projectId ? projects.find(p => p.id === projectId) : null;
  const [viewMode, setViewMode] = useState<'iframe' | 'snapshot'>('iframe');
  const [activeRatio, setActiveRatio] = useState<RatioKey>('16:10');
  const [isLoading, setIsLoading] = useState(true);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [keyTrigger, setKeyTrigger] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Monitor preview container dimensions to dynamically scale desktop iframe
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [projectId, activeRatio]);

  // Reset loading states when project changes
  useEffect(() => {
    setIsLoading(true);
    setIframeFailed(false);
    setIsInteracting(false);
  }, [projectId, keyTrigger, activeRatio]);

  if (!projectId || !data) return null;

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const hasLiveLink = Boolean(data.link && data.link !== '#' && !data.link.includes('example.com'));
  const activeUrl = hasLiveLink ? data.link : (data.repo && data.repo !== '#' ? data.repo : 'https://noah-portfolio.system');
  const currentConfig = RATIO_CONFIGS[activeRatio];
  
  // Real high-resolution live website snapshot fallback calibrated to exact aspect ratio
  const snapshotUrl = hasLiveLink 
    ? `https://image.thum.io/get/${currentConfig.thumCrop}/noanimate/${data.link}`
    : (data.image || `https://image.thum.io/get/${currentConfig.thumCrop}/noanimate/https://github.com/capt-noah`);

  const handleReload = () => {
    setIsLoading(true);
    setIframeFailed(false);
    setKeyTrigger(prev => prev + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-fg/80 z-[500000] flex items-center justify-center p-4 sm:p-6 lg:p-10 backdrop-blur-md select-none cursor-none overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-5xl lg:max-w-6xl bg-surface border border-fg/20 shadow-[0_30px_90px_rgba(0,0,0,0.4)] relative overflow-hidden my-auto chamfer-tr"
        >
          {/* Top HUD Schematic Header */}
          <div className="w-full bg-fg text-surface px-6 sm:px-8 py-3.5 flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-widest relative">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-accent inline-block animate-pulse" />
              <span>DOSSIER // SPEC_{data.id}</span>
              <span className="hidden sm:inline text-surface/30">|</span>
              <span className="hidden sm:inline text-accent font-semibold flex items-center gap-1.5">
                <ShieldCheck size={12} className="inline text-accent" />
                STATUS: LIVE_PREVIEW
              </span>
              <span className="hidden md:inline text-surface/40 text-[9px]">00:54:09 &gt;&gt;&gt;</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline font-mono text-[8.5px] text-surface/60">
                380/AC002 // 0010 0000
              </span>
              <button
                onClick={onClose}
                className="px-2.5 py-1 hover:bg-accent hover:text-white text-surface transition-colors flex items-center gap-1.5 cursor-none bg-surface/10 border border-surface/20 font-mono text-[9px]"
                aria-label="Close"
              >
                <X size={13} />
                <span>[ESC]</span>
              </button>
            </div>

            {/* Diagonal zebra hatch accent on top-right seam */}
            <div className="absolute top-0 right-28 w-16 h-full hazard-hatch-white opacity-20 pointer-events-none hidden sm:block" />
          </div>

          {/* Expansive Two-Column Dossier Content Arena */}
          <div className="p-6 sm:p-8 lg:p-10 max-h-[78vh] overflow-y-auto scrollbar-none">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* --- LEFT COLUMN: Heroic Overview & Architecture (7 Cols) --- */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  {/* Category Stamp & Telemetry Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-[10px]">
                    <span className="px-3 py-1 bg-accent text-white font-bold uppercase tracking-wider chamfer-tr">
                      SPEC_NODE // {data.id}
                    </span>
                    <span className="px-3 py-1 bg-fg/5 border border-fg/15 text-fg/70 uppercase font-semibold">
                      {data.meta}
                    </span>
                    <span className="text-fg/40 text-[9px] ml-auto hidden sm:inline">
                      CLASS // PRODUCTION_SYSTEM
                    </span>
                  </div>

                  {/* Massive Display Title */}
                  <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-fg leading-[1.05] mb-6">
                    {data.title}
                  </h2>

                  {/* Detailed Architecture Narrative */}
                  <div className="text-sm sm:text-base text-muted font-medium leading-relaxed space-y-4 border-t border-fg/10 pt-6">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {data.detailedDesc || data.desc}
                    </p>
                  </div>
                </div>

                {/* Tech Stack Section */}
                {data.technologies && data.technologies.length > 0 && (
                  <div className="pt-6 border-t border-fg/10">
                    <div className="flex items-center justify-between mb-3 font-mono text-[10px]">
                      <span className="text-accent font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu size={13} />
                        // INTEGRATED_TECH_STACK
                      </span>
                      <span className="text-fg/40 text-[9px]">
                        [{data.technologies.length} MODULES]
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {data.technologies.map((tech, idx) => (
                        <span
                          key={`${tech}-${idx}`}
                          className="px-3 py-1.5 text-[11px] font-mono border border-fg/15 text-fg bg-plate/80 hover:bg-surface hover:border-accent hover:text-accent font-bold uppercase transition-colors shadow-xs chamfer-tr flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 bg-accent/60 inline-block" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* --- RIGHT COLUMN: Project Visual Preview & Action Triggers (5 Cols) --- */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                
                {/* High-End Project Live Website Preview Section (Calibrated Virtual Desktop Viewport & Dynamic Aspect Ratio) */}
                <div className="bg-plate/70 border border-fg/15 p-4 sm:p-5 relative chamfer-tr flex flex-col">
                  {/* Top Preview Bar with Live URL & Controls */}
                  <div className="flex items-center justify-between border-b border-fg/10 pb-3 mb-3 font-mono text-[9.5px]">
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping shrink-0" />
                      <span className="font-bold text-fg uppercase tracking-wider truncate">
                        LIVE_PREVIEW // {data.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Aspect Ratio Switcher */}
                      <button
                        onClick={() => {
                          const keys: RatioKey[] = ['16:10', '16:9', '4:3'];
                          const nextIdx = (keys.indexOf(activeRatio) + 1) % keys.length;
                          setActiveRatio(keys[nextIdx]);
                        }}
                        className="px-1.5 py-0.5 bg-fg/5 hover:bg-fg/10 border border-fg/15 text-fg/80 text-[8.5px] cursor-none flex items-center gap-1 transition-colors font-mono"
                        title="Cycle Aspect Ratio (16:10 / 16:9 / 4:3)"
                      >
                        <span className="text-fg/50">RATIO:</span>
                        <span className="text-accent font-bold">{activeRatio}</span>
                      </button>

                      {/* View Mode Toggle */}
                      <button
                        onClick={() => setViewMode(prev => prev === 'iframe' ? 'snapshot' : 'iframe')}
                        className="px-1.5 py-0.5 bg-fg/5 hover:bg-fg/10 border border-fg/15 text-fg/80 text-[8.5px] cursor-none flex items-center gap-1 transition-colors"
                        title="Toggle Iframe / Snapshot Mode"
                      >
                        <Eye size={10} className="text-accent" />
                        <span>{viewMode === 'iframe' ? 'LIVE' : 'SNAP'}</span>
                      </button>

                      {/* Reload Trigger */}
                      <button
                        onClick={handleReload}
                        className="p-1 hover:bg-fg/10 text-fg/60 hover:text-fg transition-colors cursor-none"
                        title="Reload Viewport"
                      >
                        <RotateCw size={11} className={isLoading ? 'animate-spin text-accent' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Browser Address Bar */}
                  <div className="w-full bg-fg/[0.04] border border-fg/10 px-2 py-1 mb-3 flex items-center gap-1.5 text-[8.5px] font-mono text-fg/60 overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate text-fg/80 font-mono select-all">
                      {activeUrl}
                    </span>
                  </div>

                  {/* Preview Viewport Canvas (Calibrated Aspect Ratio with Scaled Desktop Rendering) */}
                  <div 
                    ref={containerRef}
                    className={`w-full ${currentConfig.className} bg-[#080A0E] border border-fg/20 relative overflow-hidden flex items-center justify-center group/preview transition-all duration-300`}
                  >
                    
                    {/* 1. Interactive Scaled Desktop Iframe View */}
                    {viewMode === 'iframe' && !iframeFailed && hasLiveLink ? (
                      <div 
                        className="w-full h-full relative overflow-hidden bg-white"
                        onMouseLeave={() => setIsInteracting(false)}
                      >
                        <iframe
                          key={`${data.id}-${keyTrigger}-${activeRatio}`}
                          src={data.link}
                          title={`${data.title} Live Preview`}
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                          onLoad={() => setIsLoading(false)}
                          onError={() => { setIframeFailed(true); setIsLoading(false); }}
                          style={{
                            width: `${currentConfig.virtualWidth}px`,
                            height: `${currentConfig.virtualHeight}px`,
                            transform: `scale(${containerWidth > 0 ? containerWidth / currentConfig.virtualWidth : 0.3})`,
                            transformOrigin: 'top left',
                            pointerEvents: isInteracting ? 'auto' : 'none',
                          }}
                          className={`border-0 transition-opacity duration-500 absolute top-0 left-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        />

                        {/* Interactive Click-to-Scroll Focus Overlay */}
                        {!isInteracting && !isLoading && (
                          <div 
                            onClick={() => setIsInteracting(true)}
                            className="absolute inset-0 cursor-pointer z-10 flex items-end justify-center pb-2 opacity-0 hover:opacity-100 transition-opacity bg-black/10"
                            title="Click to interact with website"
                          >
                            <span className="px-2 py-0.5 bg-black/85 text-white font-mono text-[8px] font-bold uppercase tracking-wider border border-white/20 shadow-md">
                              CLICK TO INTERACT
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* 2. High-Resolution Live Snapshot Render View */
                      <div className="w-full h-full relative overflow-hidden bg-[#0A0C10] flex items-center justify-center group/shot">
                        <img
                          key={`${data.id}-snap-${keyTrigger}-${activeRatio}`}
                          src={snapshotUrl}
                          alt={`${data.title} Web Preview`}
                          onLoad={() => setIsLoading(false)}
                          onError={() => setIsLoading(false)}
                          className={`w-full h-full object-cover object-top transition-all duration-500 group-hover/shot:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        />

                        {/* Quick Interactive Hover Bar */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover/shot:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                          <div className="font-mono text-[9px] text-accent font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Sparkles size={11} />
                            LIVE ARTIFACT SNAPSHOT ({activeRatio})
                          </div>
                          {hasLiveLink && (
                            <a
                              href={data.link}
                              target="_blank"
                              rel="noreferrer"
                              className="w-fit px-2.5 py-1 bg-accent hover:bg-accent-hover text-white font-mono text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-none shadow-md"
                            >
                              <span>LAUNCH LIVE</span>
                              <ArrowUpRight size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Loading HUD Radar Sweep Overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-[#0A0C10]/95 flex flex-col items-center justify-center z-20 space-y-2.5 p-4 text-center">
                        <div className="relative w-10 h-10">
                          <div className="absolute inset-0 border border-accent/20 rounded-full" />
                          <div className="absolute inset-0 border border-transparent border-t-accent rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                          </div>
                        </div>
                        <div className="font-mono text-[9.5px] font-bold text-accent uppercase tracking-widest">
                          CONNECTING_LIVE_PORT...
                        </div>
                      </div>
                    )}

                    {/* HUD Scanline & Crosshair Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-25 z-10" />
                    <div className="absolute top-2 left-2 text-[9px] text-accent font-mono pointer-events-none font-bold z-10">+</div>
                    <div className="absolute top-2 right-2 text-[9px] text-accent font-mono pointer-events-none font-bold z-10">+</div>
                    <div className="absolute bottom-2 left-2 text-[9px] text-accent font-mono pointer-events-none font-bold z-10">+</div>
                    <div className="absolute bottom-2 right-2 text-[9px] text-accent font-mono pointer-events-none font-bold z-10">+</div>
                  </div>

                  {/* Corner Accent Ticks */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent" />
                </div>

                {/* Tactical Action Triggers */}
                <div className="space-y-3 pt-4 border-t border-fg/10">
                  {hasLiveLink && (
                    <a
                      href={data.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-5 bg-accent hover:bg-accent-hover text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(255,85,0,0.3)] hover:-translate-y-0.5 cursor-none chamfer-tr group"
                    >
                      <span className="flex items-center gap-2">
                        <Globe size={15} />
                        <span>LAUNCH LIVE ARTIFACT</span>
                      </span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  {data.repo && (
                    <a
                      href={data.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-5 bg-surface hover:bg-fg/5 text-fg border border-fg/20 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-none chamfer-tr group"
                    >
                      <span className="flex items-center gap-2">
                        <Github size={15} />
                        <span>SOURCE REPOSITORY</span>
                      </span>
                      <ExternalLink size={14} className="text-fg/40 group-hover:text-fg" />
                    </a>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Status Edge Strip */}
          <div className="w-full border-t border-fg/10 px-6 sm:px-8 py-2.5 bg-fg/[0.02] flex items-center justify-between font-mono text-[8.5px] text-fg/40 select-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full inline-block" />
              <span>NODE_REF // {data.id} // SEC_09</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-accent font-bold">SYSTEM_STABLE</span>
              <span>[ESC] TO EXIT</span>
            </div>
          </div>

          {/* Corner Bracket Registration Accents */}
          <div className="absolute top-1 left-1 font-mono text-[8px] text-accent pointer-events-none">┌</div>
          <div className="absolute top-1 right-1 font-mono text-[8px] text-accent pointer-events-none">┐</div>
          <div className="absolute bottom-1 left-1 font-mono text-[8px] text-accent pointer-events-none">└</div>
          <div className="absolute bottom-1 right-1 font-mono text-[8px] text-accent pointer-events-none">┘</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
