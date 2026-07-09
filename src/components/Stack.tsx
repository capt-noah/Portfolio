import React, { useState } from 'react';
import { motion } from 'motion/react';
import { StackItem } from '../services/dataService';
import { Terminal, Shield, Power, Activity } from 'lucide-react';
import { TECH_ICONS, getIconUrl } from '../constants/techIcons';

export default function Stack({ data }: { data: StackItem[] }) {
  const [selectedTech, setSelectedTech] = useState<string | null>(data[0]?.name || "React");
  const [cliHistory, setCliHistory] = useState<string[]>([
    "SYS_INIT: Booting modules...",
    "VERIFYING DATA INTEGRITY...",
    "ALL CORE SYSTEM BADGES STABLE.",
    "HOVER OR CLICK ON ANY MODULE TO QUERY SYSTEM TELEMETRY."
  ]);

  const handleTechHover = (techName: string) => {
    if (selectedTech === techName) return;
    setSelectedTech(techName);
    
    // Add realistic randomized cyber telemetry readouts
    const randomHash = Math.random().toString(16).substring(2, 10).toUpperCase();
    const randomLatency = (Math.random() * 12 + 1).toFixed(2);
    const newLog = `QUERY_SYS_LINK: --module=${techName.toLowerCase()} --hash=0x${randomHash} --latency=${randomLatency}ms`;
    
    setCliHistory(prev => [...prev.slice(-5), newLog]);
  };

  return (
    <section id="stack" className="min-h-screen flex flex-col justify-center py-20 px-[6vw] relative border-b border-fg/10 bg-bg">
      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Mock Console Prompt Terminal */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-fg/10 bg-fg/[0.03] p-6 relative">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-fg/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-red animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="font-mono text-[10px] text-fg uppercase tracking-widest font-bold ml-2">
                [TERMINAL_SHELL // STACK_CON]
              </span>
            </div>
            <div className="font-mono text-[9px] text-fg/40 uppercase">
              PORT: 3000
            </div>
          </div>

          {/* Running Logger Log Lines */}
          <div className="flex-grow font-mono text-[10px] leading-relaxed text-fg space-y-2 mb-8 overflow-y-auto max-h-[250px] scrollbar-none select-none">
            {cliHistory.map((log, index) => (
              <div 
                key={index} 
                className={`transition-all duration-300 ${
                  log.startsWith("QUERY") ? "text-accent font-bold" : "text-fg/60"
                }`}
              >
                <span className="text-accent-red mr-1.5">&gt;</span> {log}
              </div>
            ))}
            
            {/* Blinking CLI Cursor line */}
            <div className="flex items-center gap-1.5 text-accent font-bold">
              <span className="text-accent-red">&gt;</span>
              <span>QUERY_SYS_ACTIVE: --focus={selectedTech?.toLowerCase() || "none"}</span>
              <span className="w-1.5 h-3 bg-accent animate-blink" />
            </div>
          </div>

          {/* Real-time details of selected tech */}
          <div className="border-t border-fg/10 pt-4 font-mono text-[9px] text-fg/50 space-y-1.5 uppercase">
            <div className="flex justify-between">
              <span>ACTIVE_MODULE:</span>
              <span className="text-fg font-bold tracking-wider">{selectedTech || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS_METRIC:</span>
              <span className="text-accent font-bold">100% OPERATIONAL</span>
            </div>
            <div className="flex justify-between">
              <span>HASH_SIGNATURE:</span>
              <span>SHA256_STABLE_INTEGRITY</span>
            </div>
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-accent" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-accent" />
        </div>

        {/* Right Side: Bento Grid of Tech Stack badging */}
        <div className="lg:col-span-7 flex flex-col justify-between pl-0 lg:pl-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold mb-3">
              [SYSTEM.RESOURCES // 04]
            </div>
            <h2 className="font-display font-black text-[clamp(2rem,5vw,5rem)] leading-[0.85] uppercase text-fg tracking-tighter mb-10">
              TECH<br />RESOURCE
            </h2>
          </div>

          {/* Grid of badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.map((item, i) => {
              const isSelected = selectedTech === item.name;
              return (
                <motion.div
                  key={`${item.name}-${i}`}
                  onMouseEnter={() => handleTechHover(item.name)}
                  onClick={() => handleTechHover(item.name)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
                  className={`cursor-none p-4 border flex flex-col items-start justify-between min-h-[110px] transition-all duration-300 relative ${
                    isSelected 
                      ? "bg-fg text-bg border-fg scale-105 shadow-md shadow-black/15" 
                      : "bg-fg/[0.02] text-fg border-fg/10 hover:border-fg/40 hover:bg-fg/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    {/* Tiny Vector Logo or fallback */}
                    <div className="w-6 h-6 flex items-center justify-center filter grayscale contrast-200">
                      {TECH_ICONS[item.name] ? (
                        <img 
                          src={getIconUrl(TECH_ICONS[item.name].slug)} 
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.innerText = '•';
                              fallback.className = 'text-accent text-lg font-bold';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <Terminal size={14} className={isSelected ? "text-accent" : "text-fg/40"} />
                      )}
                    </div>
                    
                    <span className="font-mono text-[8px] opacity-40">0{i+1}</span>
                  </div>

                  <div className="w-full mt-4">
                    <span className="font-display font-black text-sm uppercase tracking-tight block truncate w-full select-none">{item.name}</span>
                    <span className="font-mono text-[8px] opacity-45 uppercase block tracking-widest mt-0.5">LOADED</span>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Quick instructions in margins */}
          <div className="mt-8 flex items-center gap-4 font-mono text-[9px] text-fg/40 uppercase">
            <Activity size={12} className="text-accent animate-pulse" />
            <span>SWEEP RATE: 60HZ</span>
            <span>// DEVIATION: 0.00%</span>
          </div>
        </div>

      </div>
    </section>
  );
}
