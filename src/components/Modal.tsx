import { motion, AnimatePresence } from 'motion/react';
import { MouseEvent } from 'react';
import { X, Github, ArrowUpRight } from 'lucide-react';
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
           className="fixed inset-0 bg-fg/40 z-[500000] flex justify-center items-center backdrop-blur-md p-4 cursor-none"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="bg-bg max-w-[800px] w-full max-h-[85vh] relative border-2 border-fg rounded-none shadow-[0_30px_90px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden cursor-none"
          >
             {/* Tech dither detail in modal backdrop */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.03] tech-grid-bg" />

             {/* Corner Tech Brackets */}
             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent z-[55]" />
             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent z-[55]" />
             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent z-[55]" />
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent z-[55]" />

             {/* Sticky Close Button */}
             <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 bg-fg text-bg border border-fg hover:bg-accent hover:border-accent hover:text-white transition-all z-[60] font-mono text-[10px] flex items-center gap-1 cursor-none"
              aria-label="Close modal"
             >
               <X className="w-4 h-4" />
               <span className="hidden sm:inline">[ ESC ]</span>
             </button>

             {/* Scrollable Content Area */}
             <div className="flex-grow overflow-y-auto px-6 md:px-12 pt-16 md:pt-24 pb-32 scrollbar-none">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent font-bold">[ ARTIFACT // {data.id} ]</span>
                </div>
                
                <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-tight text-fg tracking-tighter mb-8 md:mb-10 relative z-50 select-text">
                  {data.title}
                </h2>
                
                <div className="space-y-6 md:space-y-8 relative z-50">
                  <p className="text-sm md:text-base text-muted leading-relaxed font-medium whitespace-pre-wrap select-text">
                    {data.detailedDesc || data.desc}
                  </p>

                  {data.technologies && data.technologies.length > 0 && (
                    <div className="pt-4">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-fg/40 mb-3">// INTEGRATED_MODULES</span>
                      <div className="flex flex-wrap gap-2">
                        {data.technologies.map((tech, index) => (
                          <span 
                            key={`${tech}-${index}`}
                            className="px-3 py-1 text-[10px] font-mono border border-fg/10 text-fg/80 bg-fg/[0.02] hover:bg-fg/5 hover:border-fg/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-8 py-6 border-y border-fg/10">
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-fg/40 mb-2">CATEGORY</span>
                      <span className="text-xs font-mono font-bold text-fg uppercase">{data.meta.split('/')[0].trim() || 'Core Architecture'}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-fg/40 mb-2">INTEGRATION</span>
                      <span className="text-xs font-mono font-bold text-fg uppercase">{data.meta.split('/')[1]?.trim() || 'Systems Optimization'}</span>
                    </div>
                  </div>
                </div>
             </div>

             {/* Fixed Bottom Action Bar */}
             <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-bg via-bg to-transparent flex gap-4 justify-center md:justify-end z-50">
                <div className="flex gap-3">
                  <a 
                    href={data.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center px-5 h-12 bg-fg text-bg hover:bg-accent border border-fg hover:border-accent transition-all font-mono text-[10px] uppercase tracking-widest font-bold gap-2 cursor-none"
                    aria-label="Repository"
                  >
                    <Github className="w-4 h-4" />
                    <span>SOURCE_CODE</span>
                  </a>
                  <a 
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center px-5 h-12 bg-accent text-white hover:bg-fg border border-accent hover:border-fg transition-all font-mono text-[10px] uppercase tracking-widest font-bold gap-2 cursor-none"
                    aria-label="Live Project"
                  >
                    <span>LAUNCH_NODE</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
