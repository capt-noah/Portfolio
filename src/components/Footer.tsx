import React, { useState } from "react";
import { motion } from "motion/react";
import { Social } from "../services/dataService";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Dribbble,
  Music2,
  Youtube,
  Facebook,
  Send,
  Terminal,
  CheckCircle2,
  Radio,
  Sparkles,
  Triangle
} from "lucide-react";

const SOCIAL_ICONS_MAP: Record<string, React.ReactNode> = {
  GitHub: <Github size={16} />,
  LinkedIn: <Linkedin size={16} />,
  Twitter: <Twitter size={16} />,
  X: <Twitter size={16} />,
  Instagram: <Instagram size={16} />,
  Dribbble: <Dribbble size={16} />,
  TikTok: <Music2 size={16} />,
  YouTube: <Youtube size={16} />,
  Facebook: <Facebook size={16} />,
  Email: <Mail size={16} />,
};

interface FooterProps {
  data: Social[];
  onFooterIntersect: (isIntersecting: boolean) => void;
}

export default function Footer({ data, onFooterIntersect }: FooterProps) {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setIsSent(true);
      setFormData({ email: "", message: "" });
      setTimeout(() => setIsSent(false), 6000);
    }, 1500);
  };

  return (
    <motion.section
      id="footer"
      onViewportEnter={() => onFooterIntersect(true)}
      onViewportLeave={() => onFooterIntersect(false)}
      viewport={{ amount: 0.3 }}
      className="footer min-h-screen w-full bg-fg text-surface flex flex-col justify-between py-16 sm:py-24 relative overflow-hidden select-none"
    >
      {/* Footer Section Subtle Wireframe Drafting Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Dark Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Outer Framing Chassis */}
          <rect x="60" y="45" width="1800" height="990" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />

          {/* Continuous Architectural Guide Conduits extending across sections */}
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="white" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.15" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="white" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.15" />

          {/* Continuous Vertical Spine Bar connecting with prior sections */}
          <rect x="1590" y="-50" width="12" height="550" rx="6" fill="#FF5500" opacity="0.4" />
          <polygon points="1610,60 1670,60 1640,150 1610,150" fill="white" opacity="0.1" />

          {/* _(5) Stepped Terminal Cyber Rail across Upper Background */}
          <polygon
            points="240,160 880,160 920,200 1560,200 1560,235 900,235 860,195 240,195"
            fill="rgba(255, 255, 255, 0.03)"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.2"
          />

          {/* Stazquez Right Bank: 8 Stacked Angled Louver Slot Capsules */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const y = 320 + idx * 24;
            return (
              <polygon
                key={`footer-louver-rt-${idx}`}
                points={`1720,${y} 1790,${y - 20} 1806,${y - 20} 1736,${y}`}
                fill="rgba(255, 255, 255, 0.04)"
                stroke="white"
                strokeWidth="1.2"
                opacity="0.25"
              />
            );
          })}

          {/* Stazquez Bottom-Left: Double Horizontal Beveled Stadium Bars */}
          <polygon
            points="80,920 440,920 465,945 105,945"
            fill="rgba(255, 255, 255, 0.04)"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.25"
          />
          <polygon
            points="80,960 400,960 425,985 105,985"
            fill="rgba(255, 255, 255, 0.04)"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.25"
          />

          {/* Radial Signal Dispatch Circles */}
          <circle cx="1600" cy="540" r="280" fill="none" stroke="white" strokeWidth="1" strokeDasharray="6 6" opacity="0.08" />
          <circle cx="1600" cy="540" r="420" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 8" opacity="0.05" />
          <circle cx="1600" cy="540" r="560" fill="none" stroke="white" strokeWidth="1" strokeDasharray="14 10" opacity="0.03" />

          {/* Delta Triangle Arrays (From Stazquez & Cyberpunk UI) */}
          <polygon points="260,180 290,130 320,180" fill="none" stroke="#FF5500" strokeWidth="1.5" opacity="0.6" />
          <polygon points="340,180 370,130 400,180" fill="none" stroke="white" strokeWidth="1" opacity="0.25" />
          <polygon points="420,180 450,130 480,180" fill="none" stroke="white" strokeWidth="1" opacity="0.25" />
          
          {/* Corner Framing Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />

          {/* Dispatch Telemetry Markers */}
          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#FF5500">FREQUENCY_DISPATCH // PROTOCOL_05</text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#FF5500">☒</text>
        </svg>

        {/* Background Section Identification Watermark */}
        <div className="absolute right-6 top-8 font-mono text-[9vw] font-black text-white/[0.03] leading-none pointer-events-none select-none">
          05_CONNECT
        </div>
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-16 mx-auto flex-1 flex flex-col justify-center">
        
        {/* Main Chassis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
          
          {/* Left Column: Heading & Social Matrix with Staggered Entrance Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-accent inline-block animate-ping" />
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold">
                  [SYSTEM.05 // DISPATCH]
                </span>
              </div>

              {/* Standardized Title: CONNECT */}
              <h2 className="font-display font-black text-[clamp(2.5rem,6vw,6.5rem)] leading-[0.85] uppercase text-white tracking-tighter mb-6 sm:mb-8">
                CONNECT
              </h2>

              <p className="font-body text-base text-white/70 font-medium leading-relaxed max-w-md mb-8 sm:mb-10">
                Open for high-impact technical advisory, distributed systems engineering, and full-stack software leadership.
              </p>
            </div>

            {/* Social Links Matrix */}
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold mb-4 flex items-center gap-2">
                <Radio size={13} className="text-accent" />
                <span>// EXTERNAL_COMMUNICATION_CHANNELS</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {data.map((social, i) => (
                  <motion.a
                    key={`${social.name}-${i}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.04 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.04] border border-white/15 hover:border-accent hover:bg-accent hover:text-white transition-all duration-300 font-mono text-xs uppercase font-bold tracking-wider cursor-none chamfer-tr group"
                  >
                    <span className="text-accent group-hover:text-white transition-colors">
                      {SOCIAL_ICONS_MAP[social.name] || <Sparkles size={14} />}
                    </span>
                    <span>{social.name}</span>
                    <span className="text-[9px] text-white/40 group-hover:text-white/80 transition-colors">↗</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-Tech Dispatcher Console Form with Slide-Up Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-6 bg-white/[0.04] border border-white/15 p-6 sm:p-10 relative hud-plate-b"
          >
            
            {/* Form Top Bar with Callout */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent" />
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-white">
                  TRANSMITTER_SHELL // V26
                </span>
              </div>
              <div className="font-mono text-[9px] text-accent font-bold px-2 py-0.5 bg-accent/15 border border-accent/30">
                FREQUENCY: 38.74_LIDETA
              </div>
            </div>

            {isSent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle2 size={44} className="text-accent mb-4 animate-pulse" />
                <h3 className="font-display font-black text-xl uppercase mb-2 text-white">
                  TRANSMISSION RELAYED
                </h3>
                <p className="font-mono text-xs text-white/60 max-w-sm uppercase">
                  Data packet encrypted and delivered to station endpoint. Response will dispatch promptly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleTransmit} className="space-y-6">
                
                {/* Sender Address */}
                <div className="space-y-2">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
                    [ SENDER_FREQUENCY_ADDRESS ]
                  </label>
                  <div className="flex items-center bg-white/[0.04] border border-white/15 focus-within:border-accent transition-colors">
                    <span className="font-mono text-xs text-accent pl-4 pr-2 font-bold">&gt;&gt;</span>
                    <input 
                      type="email" 
                      required
                      placeholder="your_email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="cursor-none w-full bg-transparent border-0 outline-none ring-0 p-3 font-mono text-xs text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Message Payload */}
                <div className="space-y-2">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
                    [ MESSAGE_PAYLOAD_BODY ]
                  </label>
                  <div className="flex items-start bg-white/[0.04] border border-white/15 focus-within:border-accent transition-colors">
                    <span className="font-mono text-xs text-accent pl-4 pt-3 font-bold">&gt;&gt;</span>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Specify project parameters or consultation requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="cursor-none w-full bg-transparent border-0 outline-none ring-0 p-3 font-mono text-xs text-white placeholder:text-white/30 resize-none"
                    />
                  </div>
                </div>

                {/* Transmit Button */}
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="cursor-none w-full bg-accent hover:bg-accent-hover text-white p-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_24px_rgba(255,85,0,0.35)] relative overflow-hidden"
                >
                  {isTransmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                      <span>RELAYING PACKETS...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>DISPATCH TRANSMISSION</span>
                    </>
                  )}
                  <div className="absolute right-0 top-0 bottom-0 w-2 hazard-hatch-white opacity-30" />
                </button>
              </form>
            )}

            {/* Corner Tech Brackets */}
            <div className="absolute top-0 right-0 w-8 h-8 hazard-hatch-white opacity-15" />
          </motion.div>

        </div>

      </div>

      {/* Terminal Footer Info Strip */}
      <div className="w-full mt-12 border-t border-white/10 px-6 sm:px-12 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[9px] text-white/40 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold">☒</span>
          <span>© {new Date().getFullYear()} NOAH TESFAYE // SYSTEMS ARCHITECT</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LAT: 9.01 // LONG: 38.74</span>
          <span className="text-accent font-semibold">ALL_SYSTEMS_GO // 05</span>
        </div>
      </div>

    </motion.section>
  );
}

