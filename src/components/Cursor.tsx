import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export type CursorType = 'default' | 'footer';

interface CursorProps {
  type: CursorType;
}

export default function Cursor({ type }: CursorProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Real-time coordinates state for the floating text label
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 25, stiffness: 350, mass: 0.4 };
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
      {/* Central Interactive Crosshair Cursor */}
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
          scale: type === 'footer' ? 1.3 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Core Dot */}
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          type === 'footer' ? 'bg-accent-red animate-ping' : 'bg-accent'
        }`} />

        {/* Framing Ring */}
        <motion.div 
          className={`absolute w-8 h-8 border rounded-full transition-colors duration-300 ${
            type === 'footer' ? 'border-accent-red/40' : 'border-accent/30'
          }`}
          animate={{
            rotate: 360,
            scale: type === 'footer' ? 1.5 : 1,
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 10, ease: "linear" },
            scale: { duration: 0.3 }
          }}
        />

        {/* Small crosshair ticks */}
        <div className="absolute w-[1px] h-2 bg-accent/20 -top-3" />
        <div className="absolute w-[1px] h-2 bg-accent/20 -bottom-3" />
        <div className="absolute w-2 h-[1px] bg-accent/20 -left-3" />
        <div className="absolute w-2 h-[1px] bg-accent/20 -right-3" />

        {/* Coordinate Readout */}
        <div className="absolute left-6 top-2 font-mono text-[8px] tracking-wider text-fg/45 bg-bg/85 px-1.5 py-0.5 border border-fg/10 whitespace-nowrap select-none">
          {coords.x.toString().padStart(4, '0')} // {coords.y.toString().padStart(4, '0')}
        </div>
      </motion.div>
    </>
  );
}
