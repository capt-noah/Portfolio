import { motion } from 'motion/react';
import { Terminal, Briefcase, Layers, Cpu, Send } from 'lucide-react';

const navItems = [
  { id: 'hero', icon: Terminal, label: 'Home' },
  { id: 'experience', icon: Briefcase, label: 'Career' },
  { id: 'work', icon: Layers, label: 'Projects' },
  { id: 'stack', icon: Cpu, label: 'Stack' },
  { id: 'footer', icon: Send, label: 'Contact' },
];

interface NavigationProps {
  isInFooter?: boolean;
  activeSection?: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const scrollTo = (id: string) => {
    const container = document.querySelector('.snap-container') as HTMLElement;
    const element = document.getElementById(id);
    if (container && element) {
      const originalSnapType = container.style.scrollSnapType;
      container.style.scrollSnapType = 'none';

      const targetTop = element.offsetTop;
      const startTop = container.scrollTop;
      const distance = targetTop - startTop;
      const duration = 750;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const timeElapsed = time - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const ease = easeInOutCubic(progress);
        container.scrollTop = startTop + distance * ease;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          container.style.scrollSnapType = originalSnapType || 'y mandatory';
        }
      };

      requestAnimationFrame(animate);
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400000] px-4 w-full max-w-fit pointer-events-none">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.3 }}
        className="pointer-events-auto bg-[#0B0D12]/95 backdrop-blur-md text-white border border-fg/20 shadow-[0_16px_40px_rgba(0,0,0,0.6)] rounded-full p-1.5 flex items-center gap-1 sm:gap-2 select-none"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3.5 sm:px-4 py-2 transition-all duration-200 flex items-center gap-2 rounded-full font-mono text-xs font-semibold tracking-wide relative cursor-none whitespace-nowrap ${
                isActive 
                  ? 'bg-accent text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-accent'}`} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
