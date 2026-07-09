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
  CheckCircle2
} from "lucide-react";

const SOCIAL_ICONS_MAP: Record<string, React.ReactNode> = {
  GitHub: <Github size={18} />,
  LinkedIn: <Linkedin size={18} />,
  Twitter: <Twitter size={18} />,
  X: <Twitter size={18} />,
  Instagram: <Instagram size={18} />,
  Dribbble: <Dribbble size={18} />,
  TikTok: <Music2 size={18} />,
  YouTube: <Youtube size={18} />,
  Facebook: <Facebook size={18} />,
};

interface FooterProps {
  data: Social[];
  onFooterIntersect: (isIntersecting: boolean) => void;
}

export default function Footer({ data, onFooterIntersect }: FooterProps) {
  // Mock Contact Form state
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    
    setIsTransmitting(true);
    // Simulate high-tech compilation transmission
    setTimeout(() => {
      setIsTransmitting(false);
      setIsSent(true);
      setFormData({ email: "", message: "" });
      
      // Auto reset success message after 5 seconds
      setTimeout(() => setIsSent(false), 5000);
    }, 1800);
  };

  return (
    <motion.section
      id="footer"
      onViewportEnter={() => onFooterIntersect(true)}
      onViewportLeave={() => onFooterIntersect(false)}
      viewport={{ amount: 0.4 }}
      className="footer min-h-screen bg-fg text-bg flex flex-col justify-center py-20 px-[6vw] relative overflow-hidden"
    >
      {/* Grid lines inside dark footer */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full tech-grid-bg" />
      </div>

      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Column: Big bulky title and social grid links */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent font-bold mb-4">
              [COMMUNICATION_DISPATCH // 05]
            </div>
            <h2 className="font-display font-black text-[clamp(2.5rem,5.5vw,6rem)] leading-[0.85] uppercase text-bg tracking-tighter mb-8">
              SECURE<br />LINK
            </h2>
            <p className="font-body text-sm text-bg/60 max-w-md leading-relaxed mb-10">
              Initiate connection over secure network parameters. Available for architectural consultation, full-stack systems engineering, and custom development nodes.
            </p>
          </div>

          {/* High contrast sharp social tile grid */}
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-widest text-bg/40 mb-4">// INDEXED_NET_LINKS</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.map((social, i) => {
                const isEmailLink = social.url.startsWith("mailto:");
                return (
                  <motion.a
                    key={`${social.name}-${i}`}
                    href={social.url}
                    {...(isEmailLink
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className="cursor-none p-4 border border-bg/15 bg-bg/[0.02] flex items-center gap-3 transition-all hover:bg-bg hover:text-fg hover:border-bg select-none"
                    aria-label={social.name}
                  >
                    <div className="flex-shrink-0">
                      {SOCIAL_ICONS_MAP[social.name] || <Mail size={18} />}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold">{social.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Retro Interactive Mail Console Form */}
        <div className="lg:col-span-6 border border-bg/15 bg-bg/[0.03] p-6 sm:p-8 relative">
          <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-accent" />
          <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-accent" />
          <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-accent" />
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-accent" />

          {/* Form Header */}
          <div className="flex items-center justify-between border-b border-bg/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">TRANSMITTER_FORM_V3.9</span>
            </div>
            <div className="font-mono text-[9px] text-bg/40">
              STATUS: STABLE_CONN
            </div>
          </div>

          {isSent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <CheckCircle2 size={42} className="text-accent mb-4 animate-bounce" />
              <h3 className="font-display font-black text-lg uppercase mb-2">TRANSMISSION COMPLETED</h3>
              <p className="font-mono text-[10px] text-bg/50 max-w-xs uppercase">
                Packet successfully compiled and relayed to endpoint. Noah will respond on secure frequency.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleTransmit} className="space-y-6">
              {/* Email prompt */}
              <div className="space-y-2">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-bg/50">
                  [ SENDER_ADDRESS ]
                </label>
                <div className="flex items-center bg-bg/[0.04] border border-bg/15 focus-within:border-accent transition-colors">
                  <span className="font-mono text-[11px] text-accent pl-4 pr-2 font-bold">&gt;</span>
                  <input 
                    type="email" 
                    required
                    placeholder="your_email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="cursor-none w-full bg-transparent border-0 outline-none ring-0 p-3 font-mono text-[12px] text-bg placeholder:text-bg/30"
                  />
                </div>
              </div>

              {/* Message prompt */}
              <div className="space-y-2">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-bg/50">
                  [ TRANS_BODY_DATA ]
                </label>
                <div className="flex items-start bg-bg/[0.04] border border-bg/15 focus-within:border-accent transition-colors">
                  <span className="font-mono text-[11px] text-accent pl-4 pt-3.5 font-bold">&gt;</span>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Type your message details here..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="cursor-none w-full bg-transparent border-0 outline-none ring-0 p-3 font-mono text-[12px] text-bg placeholder:text-bg/30 resize-none"
                  />
                </div>
              </div>

              {/* Transmit button */}
              <button
                type="submit"
                disabled={isTransmitting}
                className="cursor-none w-full bg-accent hover:bg-bg hover:text-fg border border-accent text-bg p-4 font-mono text-[10px] uppercase tracking-[0.2em] font-black transition-all flex items-center justify-center gap-3"
              >
                {isTransmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current" />
                    <span>COMPILING PACKETS...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>TRANSMIT_MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

      <div className="mt-20 pt-8 border-t border-bg/10 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[9px] text-bg/40 uppercase tracking-widest">
        <div>
          © {new Date().getFullYear()} ARCHIVE_SYS // CAPT_NOAH
        </div>
        <div className="flex gap-6">
          <span>PORT: 3000 // LOC: ETH_AA</span>
          <span>INTEGRITY SECURED</span>
        </div>
      </div>
    </motion.section>
  );
}
