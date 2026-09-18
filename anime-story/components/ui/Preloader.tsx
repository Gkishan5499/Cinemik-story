'use client';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { setupDrawSVG } from '@/lib/gsap-utils';

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(true);

  // Check storage on mount
  useEffect(() => {
    if (sessionStorage.getItem('preloader_shown')) {
      setShow(false);
    } else {
      sessionStorage.setItem('preloader_shown', 'true');
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }
  }, []);

  useGSAP(() => {
    if (!show || !containerRef.current || !pathRef.current || !progressRef.current || !textRef.current) return;
    
    setupDrawSVG(pathRef.current);
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }
    });

    // 1. Draw logo path
    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    })
    // 2. Fade in CINEMIKS text
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.4')
    // 3. Fill progress bar
    .to(progressRef.current, {
      scaleX: 1,
      duration: 1.0,
      ease: 'power4.inOut',
    }, 0)
    // 4. Wipe container up
    .to(containerRef.current, {
      clipPath: 'inset(0% 0 100% 0)',
      duration: 0.7,
      ease: 'power4.inOut',
      delay: 0.2,
    });

  }, { scope: containerRef, dependencies: [show] });

  if (!show) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0A0A]"
    >
      <div className="flex flex-col items-center relative z-10">
        <svg width="90" height="90" viewBox="0 0 100 100" className="mb-4">
          <path
            ref={pathRef}
            d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z M50 20 L50 80 M15 35 L85 35 M20 70 L80 30"
            fill="none"
            stroke="#2596be"
            strokeWidth="2"
            strokeLinejoin="miter"
          />
        </svg>
        <div 
          ref={textRef} 
          className="flex flex-col items-center opacity-0 translate-y-4"
        >
          <span className="font-bricolage text-3xl font-extrabold text-white tracking-widest uppercase">
            CINEMIKS
          </span>
          <span className="font-manrope text-[10px] font-bold text-[#FFC857] tracking-[0.3em] uppercase mt-1">
            READ THE REEL
          </span>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 h-[2px] bg-white/10 mx-12 md:mx-32 overflow-hidden">
        <div 
          ref={progressRef}
          className="h-full w-full bg-gradient-to-r from-[#2596be] to-[#FFC857] origin-left scale-x-0"
        />
      </div>
    </div>
  );
}
