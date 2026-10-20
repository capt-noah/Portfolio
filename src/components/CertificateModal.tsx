import { motion, AnimatePresence } from 'motion/react';
import { MouseEvent, useState, useEffect } from 'react';
import { X, ExternalLink, Award } from 'lucide-react';
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
        className="fixed inset-0 bg-black/80 z-[500000] flex items-center justify-center p-3 sm:p-6 backdrop-blur-md select-none cursor-none overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-4xl bg-surface border border-fg/20 shadow-2xl relative overflow-hidden my-auto rounded-lg"
        >
          {/* Top Header */}
          <div className="w-full border-b border-fg/10 px-5 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                <Award size={15} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-fg leading-none">
                  {currentCert.title}
                </h3>
                <p className="text-xs text-muted mt-1 font-mono">
                  {currentCert.issuer} • {currentCert.date}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-fg/10 text-muted hover:text-fg transition-colors flex items-center gap-1 cursor-none font-mono text-xs"
              aria-label="Close"
            >
              <X size={18} />
              <span className="hidden sm:inline">[ESC]</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            {/* Tabs for switching certificates */}
            {certList.length > 1 && (
              <div className="flex items-center gap-2 border-b border-fg/10 pb-3">
                {certList.map((cert, idx) => (
                  <button
                    key={cert.id}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3.5 py-1.5 rounded text-xs font-semibold tracking-wide transition-all duration-150 cursor-none ${
                      activeTab === idx
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-muted hover:text-fg hover:bg-fg/5'
                    }`}
                  >
                    {cert.title}
                  </button>
                ))}
              </div>
            )}

            {/* Certificate Display Area - Fits fully without clipping */}
            <div className="w-full max-h-[62vh] bg-black/40 rounded-md border border-fg/10 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
              <img
                src={currentCert.image}
                alt={currentCert.title}
                className="max-h-[56vh] w-auto max-w-full object-contain rounded shadow-lg select-none"
              />
            </div>

            {/* Footer Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-fg/10">
              <span className="text-xs text-muted">
                Official Credential
              </span>

              <a
                href={currentCert.image}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-none shadow-sm"
              >
                <span>View</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
