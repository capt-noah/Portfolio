import { motion } from 'motion/react';
import { Experience as ExperienceType } from '../services/dataService';

export default function Experience({ data }: { data: ExperienceType[] }) {
  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center py-20 px-[6vw] relative border-b border-fg/10 bg-bg">
      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Side: Technical Section Header */}
        <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-fg/10 pb-8 lg:pb-0 lg:pr-10">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold">
            [SYS.JOURNAL // 02]
          </div>
          
          <div className="my-10 lg:my-0">
            <h2 className="font-display font-black text-[clamp(2rem,5vw,5rem)] leading-tight uppercase text-fg tracking-tighter mb-4">
              CAREER<br />LOGS
            </h2>
            <div className="w-16 h-1 bg-accent" />
          </div>

          <div className="font-mono text-[9px] text-fg/40 leading-relaxed uppercase">
            // INDEXED CHRONOLOGICAL REPOSITORIES <br />
            // FAULT_TOLERANT ARCHITECTURE <br />
            // STATEFUL SYNCHRONIZATION
          </div>
        </div>

        {/* Right Side: High-Tech Experience Cards */}
        <div className="lg:col-span-8 flex flex-col justify-center divide-y divide-fg/10">
          {data.map((exp, i) => (
            <motion.div 
              key={`${exp.role}-${i}`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              className="py-10 first:pt-0 last:pb-0 group relative overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-fg/[0.01] transition-all"
            >
              {/* Corner tick mark for hovered item */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex-shrink-0 md:w-1/3">
                <span className="font-mono text-[10px] uppercase text-accent tracking-[0.25em] bg-accent/5 border border-accent/15 px-3 py-1 font-bold">
                  {exp.period}
                </span>
                <div className="mt-4 font-mono text-[9px] text-fg/30 uppercase tracking-widest">
                  SYS_BUILD_VER // 0{data.length - i}.0
                </div>
              </div>

              <div className="flex-grow md:w-2/3">
                <h3 className="font-display text-[1.5rem] md:text-[2rem] font-bold text-fg tracking-tight uppercase leading-none mb-3">
                  {exp.role}
                </h3>
                <p className="text-sm md:text-base text-muted font-medium leading-relaxed max-w-[600px]">
                  {exp.desc}
                </p>
                
                {/* Tech tag highlights */}
                <div className="mt-4 flex gap-4 font-mono text-[9px] text-fg/40">
                  <span>[ STATUS: DEPLOYED ]</span>
                  <span>[ INTEGRITY: VERIFIED ]</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
