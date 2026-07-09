import { motion } from 'motion/react';
import { Home, Briefcase, BriefcaseBusiness, Cpu, MessageSquare } from 'lucide-react';

const navItems = [
  { id: 'hero', icon: Home, label: 'SYS' },
  { id: 'experience', icon: Briefcase, label: 'JOURNAL' },
  { id: 'work', icon: BriefcaseBusiness, label: 'INDEX' },
  { id: 'stack', icon: Cpu, label: 'RESOURCES' },
  { id: 'footer', icon: MessageSquare, label: 'DISPATCH' },
];

interface NavigationProps {
  isInFooter?: boolean;
  activeSection?: string;
}

export default function Navigation({ isInFooter, activeSection }: NavigationProps) {
  const scrollTo = (id: string) => {
    const container = document.querySelector('.snap-container') as HTMLElement;
    const element = document.getElementById(id);
    if (container && element) {
      const originalSnapType = container.style.scrollSnapType;
      container.style.scrollSnapType = 'none';

      const targetTop = element.offsetTop;
      const startTop = container.scrollTop;
      const distance = targetTop - startTop;
      const duration = 800; // Elegant 800ms duration for rich, smooth glide
      let startTime: number | null = null;

      // Cubic ease-in-out for perfect acceleration and deceleration curves
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400000] px-4 w-full max-w-fit">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 1 }}
        className="flex items-center gap-1.5 p-1.5 border border-fg/15 bg-bg/80 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-full relative overflow-hidden transition-all duration-300 cursor-none"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`p-3.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-none ${
                isActive 
                  ? 'bg-fg text-bg border-fg scale-105 shadow-sm'
                  : 'bg-transparent border-transparent text-fg/55 hover:text-accent hover:bg-fg/5'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
