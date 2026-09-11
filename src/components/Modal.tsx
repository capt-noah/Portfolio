import { motion, AnimatePresence } from 'motion/react';
import { MouseEvent } from 'react';
import { X, Github, ArrowUpRight, Terminal, Layers, ShieldCheck, Cpu, Activity, ExternalLink } from 'lucide-react';
import { Project } from '../services/dataService';

interface ModalProps {
  projectId: string | null;
  onClose: () => void;
  projects: Project[];
}

export default function Modal({ projectId, onClose, projects }: ModalProps) {
  const data = projectId ? projects.find(p => p.id === projectId) : null;

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {projectId && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-fg/70 z-[500000] flex items-center justify-center p-4 sm:p-6 lg:p-10 backdrop-blur-md select-none cursor-none overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 25 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-full max-w-5xl lg:max-w-6xl bg-surface border border-fg/20 shadow-[0_30px_90px_rgba(0,0,0,0.35)] relative overflow-hidden my-auto chamfer-tr"
          >
            {/* Top HUD Schematic Header (Matching Project & Career Cards Theme) */}
            <div className="w-full bg-fg text-surface px-6 sm:px-8 py-3.5 flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-widest relative">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-accent inline-block animate-pulse" />
                <span>DOSSIER // SPEC_{data.id}</span>
                <span className="hidden sm:inline text-surface/30">|</span>
                <span className="hidden sm:inline text-accent font-semibold">STATUS: OPERATIONAL</span>
                <span className="hidden md:inline text-surface/40 text-[9px]">00:54:09 &gt;&gt;&gt;</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline font-mono text-[8.5px] text-surface/60">
                  380/AC002 // 0010 0000
                </span>
                <button
                  onClick={onClose}
                  className="px-2.5 py-1 hover:bg-accent text-surface transition-colors flex items-center gap-1.5 cursor-none bg-surface/10 border border-surface/20 font-mono text-[9px]"
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

                  {/* Tech Stack Section (Moved directly below Project Description) */}
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
                  
                  {/* High-End Project Visual Preview Section */}
                  <div className="bg-plate/70 border border-fg/15 p-4 sm:p-5 relative chamfer-tr flex flex-col">
                    {/* Top Preview Bar */}
                    <div className="flex items-center justify-between border-b border-fg/10 pb-3 mb-4 font-mono text-[9.5px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
                        <span className="font-bold text-fg uppercase tracking-wider">
                          PREVIEW // {data.id}
                        </span>
                      </div>
                      <span className="text-accent font-bold px-2 py-0.5 bg-accent/10 border border-accent/20">
                        HD_VIEW
                      </span>
                    </div>

                    {/* Preview Viewport Canvas */}
                    <div className="w-full aspect-video bg-[#0B0D12] border border-fg/20 relative overflow-hidden flex items-center justify-center group/preview">
                      {data.image ? (
                        <img 
                          src={data.image} 
                          alt={data.title}
                          className="w-full h-full object-cover object-center group-hover/preview:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full p-5 flex flex-col justify-between bg-gradient-to-br from-[#0F1218] to-[#08090C] text-white select-none">
                          <div className="flex justify-between items-start font-mono text-[9px] text-white/50">
                            <span>RENDER_BUFFER: 0x{data.id}</span>
                            <span className="text-accent font-bold">READY</span>
                          </div>

                          <div className="my-auto text-center py-4">
                            <div className="font-display font-black text-2xl uppercase tracking-wider text-white/90 mb-1">
                              {data.title}
                            </div>
                            <div className="font-mono text-[10px] text-accent uppercase tracking-widest">
                              // {data.meta}
                            </div>
                          </div>

                          <div className="flex justify-between items-end font-mono text-[8px] text-white/40">
                            <span>RES: 1920x1080</span>
                            <span className="text-white/60">SYS_VIEW_ACTIVE</span>
                          </div>
                        </div>
                      )}

                      {/* HUD Scanline & Crosshair Overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-30" />
                      <div className="absolute top-2 left-2 text-[9px] text-accent font-mono pointer-events-none font-bold">+</div>
                      <div className="absolute top-2 right-2 text-[9px] text-accent font-mono pointer-events-none font-bold">+</div>
                      <div className="absolute bottom-2 left-2 text-[9px] text-accent font-mono pointer-events-none font-bold">+</div>
                      <div className="absolute bottom-2 right-2 text-[9px] text-accent font-mono pointer-events-none font-bold">+</div>
                    </div>

                    {/* Corner Accent Ticks */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent" />
                  </div>

                  {/* Tactical Action Triggers */}
                  <div className="space-y-3 pt-4 border-t border-fg/10">
                    {data.link && (
                      <a
                        href={data.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3.5 px-5 bg-accent hover:bg-accent-hover text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(255,85,0,0.3)] hover:-translate-y-0.5 cursor-none chamfer-tr group"
                      >
                        <span>LAUNCH LIVE ARTIFACT</span>
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
      )}
    </AnimatePresence>
  );
}


