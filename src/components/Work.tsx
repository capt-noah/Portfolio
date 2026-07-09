import { motion } from 'motion/react';
import { ArrowUpRight, Code, ShieldCheck } from 'lucide-react';
import { Project } from '../services/dataService';

interface WorkProps {
  data: Project[];
  onSelectProject: (id: string) => void;
}

export default function Work({ data, onSelectProject }: WorkProps) {
  return (
    <section id="work" className="min-h-screen flex flex-col justify-center py-24 px-[6vw] relative border-b border-fg/10 bg-bg">
      <div className="max-w-[1400px] w-full mx-auto">
        
        {/* Header Block of Bento Grid */}
        <div className="border-b border-fg/10 pb-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold mb-3">
              [SYSTEM.EXPLORATION // 03]
            </div>
            <h2 className="font-display font-black text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9] uppercase text-fg tracking-tighter">
              PROJECTS
            </h2>
          </div>
          <div className="font-mono text-[10px] text-fg/40 leading-relaxed uppercase text-left md:text-right max-w-sm">
            // HIGHEST COMPILATION STANDARDS <br />
            // SELECT ANY COMPONENT TO EXPOSE SCHEMATICS AND DATA ARTIFACTS
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {data.map((project, i) => (
            <motion.div
              key={`${project.id}-${i}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectProject(project.id);
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="group cursor-none bg-fg/[0.02] border border-fg/10 p-6 flex flex-col justify-between min-h-[460px] relative transition-all duration-500 hover:bg-fg/5 hover:border-fg hover:-translate-y-2"
            >
              {/* Folder/Tab custom curve accent on top left, similar to screenshot 3 */}
              <div className="absolute top-0 right-0 bg-fg/10 group-hover:bg-accent font-mono text-[9px] text-fg group-hover:text-white px-2.5 py-1 uppercase tracking-wider transition-colors">
                {project.technologies?.[0] || "PROT_V1"}
              </div>

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-fg/20 group-hover:border-accent transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-fg/20 group-hover:border-accent transition-colors" />

              <div>
                {/* Serial Number & Tech Label (Matches bulky numbers in screenshot 3) */}
                <div className="flex justify-between items-baseline mb-8">
                  <span className="font-mono text-[4rem] font-black text-fg/10 group-hover:text-accent/30 tracking-tighter leading-none select-none transition-colors">
                    {project.id}
                  </span>
                  <div className="font-mono text-[9px] text-fg/30 group-hover:text-accent/60 tracking-wider transition-colors">
                    [SECURED_NODE: {project.id}/04]
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-black text-[1.4rem] sm:text-[1.8rem] uppercase leading-none tracking-tight text-fg group-hover:text-accent mb-4 transition-colors select-none">
                  {project.title}
                </h3>

                {/* Subtitle / Category badge */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-fg/10 bg-fg/[0.02] rounded-none font-mono text-[9px] uppercase tracking-widest text-fg/50 mb-6">
                  <Code size={10} className="text-accent" />
                  {project.meta}
                </div>

                {/* Brief description */}
                <p className="text-[14px] text-muted leading-relaxed font-medium group-hover:text-fg/80 transition-colors">
                  {project.desc}
                </p>
              </div>

              {/* Footer Actions inside the bento item */}
              <div className="mt-8 pt-4 border-t border-fg/5 flex justify-between items-center">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-fg/40">
                  <ShieldCheck size={12} className="text-accent" />
                  <span>INTEGRITY_STABLE</span>
                </div>

                {/* High Contrast Arrow Button */}
                <div className="w-10 h-10 border border-fg/10 group-hover:bg-fg group-hover:border-fg flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-fg group-hover:text-bg transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
