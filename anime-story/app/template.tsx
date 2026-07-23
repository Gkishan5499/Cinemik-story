'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // "ink-wipe" enter transition
    if (wipeRef.current && containerRef.current) {
      const tl = gsap.timeline();
      
      // Setup initial state: mask covering the screen
      gsap.set(wipeRef.current, { clipPath: 'inset(0 0 0% 0)', zIndex: 9990 });
      gsap.set(containerRef.current, { opacity: 0 });

      // Animate mask away (clip from top to bottom) and reveal container
      tl.to(wipeRef.current, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.8,
        ease: 'power3.inOut',
      }, 0.2) // small delay to let page load
      .to(containerRef.current, {
        opacity: 1,
        duration: 0.4
      }, 0.4);
    }
  }, []);

  return (
    <>
      <div 
        ref={wipeRef} 
        className="fixed inset-0 bg-ink pointer-events-none"
        style={{ zIndex: 9990, willChange: 'clip-path' }}
      />
      <div ref={containerRef} style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}
