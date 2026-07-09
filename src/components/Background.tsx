export default function Background() {
  return (
    <>
      {/* Film grain effect */}
      <div className="grain-overlay" />
      
      {/* CRT Scanline and color aberration filter */}
      <div className="scanlines" />

      {/* Grid line patterns */}
      <div className="fixed inset-0 pointer-events-none z-[-10] tech-grid-bg opacity-30" />
      <div className="fixed inset-0 pointer-events-none z-[-9] tech-dot-bg opacity-45" />

      {/* Fine technical vertical/horizontal divider lines mimicking drafting paper */}
      <div className="fixed top-0 bottom-0 left-[10vw] w-[1px] bg-fg/5 pointer-events-none z-[-5]" />
      <div className="fixed top-0 bottom-0 left-[35vw] w-[1px] bg-fg/5 pointer-events-none z-[-5]" />
      <div className="fixed top-0 bottom-0 left-[65vw] w-[1px] bg-fg/5 pointer-events-none z-[-5]" />
      <div className="fixed top-0 bottom-0 right-[10vw] w-[1px] bg-fg/5 pointer-events-none z-[-5]" />

      {/* Retro hardware accents in the background */}
      <div className="fixed top-4 left-4 font-mono text-[9px] text-fg/30 pointer-events-none tracking-widest uppercase select-none z-50">
        [SYS_CORE: ONLINE] // ARCHIVE.CONF
      </div>
      <div className="fixed top-4 right-4 font-mono text-[9px] text-fg/30 pointer-events-none tracking-widest uppercase select-none z-50">
        LOC.W2 // COORD_Z: 43.86
      </div>
    </>
  );
}
