import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export type CursorType = 'default' | 'footer' | 'interactive';

interface CursorProps {
  type: CursorType;
}

export default function Cursor({ type }: CursorProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Real-time coordinates state for the floating telemetry label
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 26, stiffness: 380, mass: 0.35 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Central Tactical Reticle */}
      <motion.div
        id="cursor"
        className="fixed top-0 left-0 pointer-events-none z-[2000000] flex items-center justify-center"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: type === 'footer' ? 1.4 : type === 'interactive' ? 1.2 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      >
        {/* Core Electric Orange Dot */}
        <div className={`w-2 h-2 transition-colors duration-300 ${
          type === 'footer' ? 'bg-accent animate-ping' : 'bg-accent'
        }`} />

        {/* Outer Square Reticle with Chamfered Corners */}
        <motion.div 
          className={`absolute w-7 h-7 border transition-colors duration-300 ${
            type === 'footer' ? 'border-accent' : 'border-fg/30'
          }`}
          animate={{
            rotate: type === 'interactive' ? 45 : 0,
            scale: type === 'interactive' ? 1.15 : 1,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Small Precision Crosshair Ticks */}
        <div className="absolute w-[1px] h-2 bg-accent/60 -top-3.5" />
        <div className="absolute w-[1px] h-2 bg-accent/60 -bottom-3.5" />
        <div className="absolute w-2 h-[1px] bg-accent/60 -left-3.5" />
        <div className="absolute w-2 h-[1px] bg-accent/60 -right-3.5" />

        {/* Live Telemetry Coordinates Pill */}
        <div className="absolute left-6 top-2 font-mono text-[8.5px] font-semibold tracking-wider text-fg/70 bg-surface/90 px-1.5 py-0.5 border border-fg/15 shadow-sm whitespace-nowrap select-none flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-accent inline-block" />
          <span>X:{coords.x.toString().padStart(4, '0')} // Y:{coords.y.toString().padStart(4, '0')}</span>
        </div>
      </motion.div>
    </>
  );
}
