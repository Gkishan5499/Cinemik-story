'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Create a smooth transition visual
    gsap.to(containerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 100%',
        end: 'top 50%',
        scrub: 1,
      }
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-32 md:h-48 bg-ink flex items-center justify-center overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* Gradient line accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-1 h-8 md:h-12 bg-gradient-to-b from-crimson to-transparent" />
        <p className="font-mono text-xs md:text-sm tracking-[0.25em] text-ash/50 uppercase">
          Continuing the Story
        </p>
      </div>

      {/* Gradient line accent bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
    </div>
  );
}
