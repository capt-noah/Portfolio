import { motion } from 'motion/react';
import { ArrowUpRight, Github, ExternalLink, Terminal, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { Project } from '../services/dataService';

interface WorkProps {
  data: Project[];
  onSelectProject: (id: string) => void;
}

export default function Work({ data, onSelectProject }: WorkProps) {
  return (
    <section id="work" className="min-h-screen w-full flex flex-col justify-between py-16 sm:py-24 border-b border-fg/10 bg-transparent select-none relative overflow-hidden">
      
      {/* Work Section Subtle Wireframe Drafting Background (Stazquez aesthetic) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Subtle grid & dot matrix */}
        <div className="absolute inset-0 tech-grid-bg opacity-40" />
        <div className="absolute inset-0 tech-dot-bg opacity-25" />

        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Outer Framing Chassis */}
          <rect x="60" y="45" width="1800" height="990" rx="4" fill="none" stroke="currentColor" strokeWidth="1" className="text-fg/20" />

          {/* Continuous Architectural Guide Conduits extending across sections */}
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />

          {/* Stazquez Signature Diagonal Armature / Chevron Frame in Upper Center */}
          <polygon
            points="980,100 1040,40 1100,100 1100,200 1340,440 1440,440 1440,500 1380,560 1300,560 1140,400 980,240"
            fill="rgba(11, 13, 16, 0.035)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/30"
          />
          {/* Inner Cutout for Depth */}
          <polygon
            points="1020,180 1060,180 1240,360 1200,400 1100,300 1020,220"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-fg/25"
          />

          {/* _(5) Diagonal 45° Armor Bar (Upper-Left) */}
          <polygon
            points="140,240 220,160 380,160 260,280 140,280"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />

          {/* _(5) Diagonal 45° Armor Bar (Lower-Right) */}
          <polygon
            points="1540,840 1620,760 1780,760 1660,880 1540,880"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />

          {/* Stazquez Left Bank: 8 Stacked Angled Louver Slot Capsules */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const y = 380 + idx * 24;
            return (
              <polygon
                key={`work-louver-lt-${idx}`}
                points={`80,${y} 150,${y - 20} 166,${y - 20} 96,${y}`}
                fill="rgba(11, 13, 16, 0.04)"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-fg/30"
              />
            );
          })}

          {/* Stazquez Right-Side Double Horizontal Beveled Stadium Bars */}
          <polygon
            points="1460,180 1780,180 1805,205 1485,205"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />
          <polygon
            points="1500,225 1740,225 1765,250 1525,250"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />

          {/* _(5) Stepped Horizontal Cyber Rail across Lower Base */}
          <polygon
            points="120,940 760,940 800,980 1480,980 1480,1015 780,1015 740,975 120,975"
            fill="rgba(11, 13, 16, 0.035)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/30"
          />

          {/* Central Grid Under-chassis Depth Sub-Plate */}
          <rect
            x="180"
            y="240"
            width="1560"
            height="660"
            rx="8"
            fill="rgba(11, 13, 16, 0.02)"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="12 8"
            className="text-fg/15"
          />

          {/* _(5) Mechanical Eyelet Accent */}
          <circle cx="1680" cy="215" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/35" />
          <circle cx="1680" cy="215" r="5" fill="#FF5500" />

          {/* Corner Registration Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />

          {/* Specimen Markers */}
          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" className="fill-accent">ARTIFACT_MATRIX // PROTOCOL_03</text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" className="fill-accent">☒</text>
        </svg>

        {/* Background Section Identification Watermark */}
        <div className="absolute left-6 top-8 font-mono text-[9vw] font-black text-fg/[0.03] leading-none pointer-events-none select-none">
          03_PROJECTS
        </div>
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-16 mx-auto flex-1 flex flex-col justify-between">
        
        {/* Section Header Strip with Standardized Section Name: PROJECTS */}
        <div className="border-b border-fg/10 pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-accent inline-block" />
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold">
                [SYSTEM.03 // ARTIFACTS]
              </span>
            </div>
            <h2 className="font-display font-black text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9] uppercase text-fg tracking-tighter">
              PROJECTS
            </h2>
          </div>
        </div>

        {/* Interlocking Asymmetric Specimen Showcase (Using Reference HUD Plates) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 my-auto">
          {data.map((project, i) => {
            const isFeatured = i === 0;
            
            if (isFeatured) {
              return (
                <motion.div
                  key={`${project.id}-${i}`}
                  initial={{ opacity: 0, y: 45, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  onClick={() => project.id && onSelectProject(project.id)}
                  className="xl:col-span-2 bg-accent text-white p-6 sm:p-10 flex flex-col justify-between min-h-[460px] relative shadow-[0_20px_50px_rgba(255,85,0,0.3)] group cursor-none hover:-translate-y-1.5 transition-all duration-300 hud-plate-b"
                >
                  {/* Top HUD Callout Strip (Icon removed next to FLAGSHIP_SPECIMEN) */}
                  <div className="flex items-center justify-between border-b border-white/25 pb-4 mb-6">
                    <div className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-white">
                      <span>FLAGSHIP_SPECIMEN // {project.id}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase">
                      <span className="px-2.5 py-0.5 bg-white text-accent">
                        {project.technologies?.[0] || 'FULL_STACK'}
                      </span>
                      <span className="hidden sm:inline opacity-75">380/AC002 &gt;&gt;</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
                        {project.title}
                      </h3>
                      <span className="font-mono text-5xl sm:text-6xl font-black text-white/20 leading-none select-none">
                        {project.id}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 font-mono text-[10px] uppercase tracking-wider text-white mb-6">
                      <Terminal size={11} />
                      <span>{project.meta}</span>
                    </div>

                    <p className="font-body text-base text-white/95 font-medium leading-relaxed max-w-2xl mb-6">
                      {project.desc}
                    </p>

                    {/* Integrated Technologies Pills */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((t, idx) => (
                          <span key={idx} className="font-mono text-[9px] uppercase px-2.5 py-1 bg-white/15 text-white border border-white/20 font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions inside Flagship Plate */}
                  <div className="border-t border-white/25 pt-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-white/90">
                      <ShieldCheck size={14} />
                      <span>INTEGRITY_VERIFIED // 60_FPS</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-accent transition-colors border border-white/20"
                          title="View Repository"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      <div className="px-5 py-2.5 bg-white text-accent font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:bg-fg group-hover:text-white transition-colors">
                        <span>INSPECT</span>
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Top-right hazard hatch accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 hazard-hatch-white opacity-25" />
                </motion.div>
              );
            }

            // Secondary Specimen HUD Plates with Staggered Delayed Slide-Up & Pop Motion
            return (
              <motion.div
                key={`${project.id}-${i}`}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.1 }}
                onClick={() => project.id && onSelectProject(project.id)}
                className="bg-surface/90 border border-fg/20 p-6 sm:p-8 flex flex-col justify-between min-h-[460px] relative transition-all duration-300 hover:border-accent hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 group cursor-none hud-plate-a"
              >
                {/* Top Corner Badge & Callout Pin */}
                <div className="flex items-center justify-between border-b border-fg/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-accent inline-block" />
                    <span className="font-mono text-[9px] text-fg/50 uppercase font-semibold">
                      SPEC_{project.id} // {String(data.length).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] font-bold uppercase px-2.5 py-0.5 bg-fg/5 border border-fg/15 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    {project.technologies?.[0] || 'NODE'}
                  </span>
                </div>

                {/* Header Information */}
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-mono text-4xl sm:text-5xl font-black text-fg/15 group-hover:text-accent/30 tracking-tighter leading-none select-none transition-colors">
                      {project.id}
                    </span>
                    <span className="font-mono text-[9px] text-fg/40 group-hover:text-accent font-semibold transition-colors">
                      [0010 0000]
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-fg group-hover:text-accent mb-3 transition-colors">
                    {project.title}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-fg/10 bg-fg/[0.03] font-mono text-[9px] uppercase tracking-wider text-fg/60 mb-5">
                    <Terminal size={10} className="text-accent" />
                    <span>{project.meta}</span>
                  </div>

                  <p className="font-body text-sm text-muted font-medium leading-relaxed mb-6">
                    {project.desc}
                  </p>
                </div>

                {/* Tech Badges & Footer Action */}
                <div>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-fg/10">
                      {project.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="font-mono text-[8.5px] uppercase px-2 py-0.5 border border-fg/10 text-fg/70 bg-fg/[0.02]">
                          {t}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="font-mono text-[8.5px] text-accent font-bold px-1.5 py-0.5">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-fg/10 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-fg/40 uppercase font-semibold">
                      // CLICK TO INSPECT
                    </span>

                    <div className="w-9 h-9 border border-fg/20 group-hover:bg-accent group-hover:border-accent flex items-center justify-center transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 text-fg group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Diagonal zebra hatch corner grip */}
                <div className="absolute top-0 right-0 w-8 h-8 hazard-hatch-dark opacity-10 group-hover:opacity-25 transition-opacity" />
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Section Footer */}
      <div className="w-full mt-10 border-t border-fg/10 px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[9px] text-fg/40">
        <div>[TOTAL_ARTIFACTS: 0{data.length}]</div>
        <div className="hidden sm:block">SA/CT_II // RUNTIME_STABLE // 03</div>
      </div>

    </section>
  );
}

