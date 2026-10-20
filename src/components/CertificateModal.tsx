import { motion, AnimatePresence } from 'motion/react';
import { MouseEvent, useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Download, Award, Calendar } from 'lucide-react';
import { CertificateItem } from '../services/dataService';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates?: CertificateItem[];
}

const DEFAULT_ALX_CERTIFICATES: CertificateItem[] = [
  {
    id: 'alx-frontend-pro-developer',
    title: 'Front-End Web Pro-Development',
    issuer: 'ALX Africa',
    date: 'August 2025',
    image: '/certificates/alx-frontend-pro-developer.png',
  },
  {
    id: 'alx-professional-foundations',
    title: 'Professional Foundations',
    issuer: 'ALX Africa',
    date: 'August 2025',
    image: '/certificates/alx-professional-foundations.png',
  },
];

export default function CertificateModal({
  isOpen,
  onClose,
  certificates = DEFAULT_ALX_CERTIFICATES,
}: CertificateModalProps) {
  const certList = certificates && certificates.length > 0 ? certificates : DEFAULT_ALX_CERTIFICATES;
  const [activeTab, setActiveTab] = useState<number>(0);

  // Keyboard navigation (ESC to close)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCert = certList[activeTab] || certList[0];

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-fg/80 z-[500000] flex items-center justify-center p-3 sm:p-6 lg:p-10 backdrop-blur-md select-none cursor-none overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-4xl bg-surface border border-fg/20 shadow-[0_30px_90px_rgba(0,0,0,0.5)] relative overflow-hidden my-auto chamfer-tr"
        >
          {/* Top HUD Schematic Header */}
          <div className="w-full bg-fg text-surface px-5 sm:px-7 py-3 flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-widest relative">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-accent inline-block animate-pulse" />
              <span>DOSSIER // CREDENTIAL_VERIFICATION</span>
              <span className="hidden sm:inline text-surface/30">|</span>
              <span className="hidden sm:inline text-accent font-semibold flex items-center gap-1.5">
                <ShieldCheck size={12} className="inline text-accent" />
                ACCREDITED: ALX_AFRICA
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline font-mono text-[8.5px] text-surface/60">
                VERIFIED_CREDENTIAL_V26
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

            {/* Corner diagonal zebra hatch */}
            <div className="absolute top-0 right-28 w-16 h-full hazard-hatch-white opacity-20 pointer-events-none hidden sm:block" />
          </div>

          {/* Modal Body Container */}
          <div className="p-5 sm:p-8 max-h-[82vh] overflow-y-auto scrollbar-none flex flex-col gap-6">
            
            {/* Header info & tabs strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-fg/10 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-accent/15 border border-accent/30 text-accent font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Award size={11} />
                    <span>OFFICIAL CERTIFICATE</span>
                  </span>
                  <span className="text-fg/40 font-mono text-[9px]">// 0{activeTab + 1} OF 0{certList.length}</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-fg uppercase tracking-tight">
                  {currentCert.title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-mono text-muted mt-1">
                  <span>ISSUER: <strong className="text-fg">{currentCert.issuer}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {currentCert.date}</span>
                </div>
              </div>

              {/* Tabs for switching certificates */}
              <div className="flex items-center gap-2 bg-surface border border-fg/15 p-1">
                {certList.map((cert, idx) => (
                  <button
                    key={cert.id}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-none flex items-center gap-1.5 ${
                      activeTab === idx
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-fg/60 hover:text-fg hover:bg-fg/5'
                    }`}
                  >
                    <span>0{idx + 1}</span>
                    <span className="hidden sm:inline">{cert.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Certificate Preview Frame */}
            <div className="relative w-full aspect-[16/9] bg-black/60 border border-fg/20 overflow-hidden shadow-inner flex items-center justify-center group/cert">
              <img
                src={currentCert.image}
                alt={currentCert.title}
                className="w-full h-full object-contain select-none transition-transform duration-300 group-hover/cert:scale-[1.01]"
              />

              {/* Subtle Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent opacity-60" />
            </div>

            {/* Action Bar Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-fg/10 font-mono text-[10px]">
              <div className="flex items-center gap-2 text-fg/50">
                <ShieldCheck size={14} className="text-accent" />
                <span>SHA-256 VERIFIED RECORD // ALX_COHORT_2025</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={currentCert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-surface hover:bg-fg/5 text-fg border border-fg/20 hover:border-accent hover:text-accent font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-none"
                >
                  <ExternalLink size={12} />
                  <span>VIEW FULL RESOLUTION</span>
                </a>

                <a
                  href={currentCert.image}
                  download={`${currentCert.id}.png`}
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-none shadow-sm"
                >
                  <Download size={12} />
                  <span>DOWNLOAD</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
