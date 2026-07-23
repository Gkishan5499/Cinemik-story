'use client';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { setupDrawSVG } from '@/lib/gsap-utils';

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

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
    
    const length = setupDrawSVG(pathRef.current);
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }
    });

    // 1. Draw logo
    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut',
    })
    // 2. Fade in kanji
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    // 3. Fill progress bar
    .to(progressRef.current, {
      scaleX: 1,
      duration: 1.2,
      ease: 'power4.inOut',
    }, 0)
    // 4. Wipe container up
    .to(containerRef.current, {
      clipPath: 'inset(0% 0 100% 0)',
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.3,
    });

  }, { scope: containerRef, dependencies: [show] });

  if (!show) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-ink"
    >
      <div className="flex flex-col items-center relative z-10">
        <svg width="80" height="80" viewBox="0 0 100 100" className="mb-6">
          <path
            ref={pathRef}
            d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z M50 20 L50 80 M15 35 L85 35 M20 70 L80 30"
            fill="none"
            stroke="var(--ash)"
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />
        </svg>
        <p 
          ref={textRef} 
          className="font-display text-ash text-xl tracking-[0.3em] opacity-0 translate-y-4"
        >
          物語
        </p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 h-[1px] bg-border mx-12 md:mx-32 overflow-hidden">
        <div 
          ref={progressRef}
          className="h-full w-full bg-crimson origin-left scale-x-0"
        />
      </div>
    </div>
  );
}
