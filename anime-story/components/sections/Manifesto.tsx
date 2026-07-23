'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["EVERY", "STORY", "BEGINS", "WITH", "A", "SINGLE", "LINE."];

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLHeadingElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
      }
    });

    WORDS.forEach((word, i) => {
      const el = wordsRef.current[i];
      if (!el) return;

      // Each word scales up and fades in
      tl.to(el, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'none',
      }, i * 0.5); // Stagger spacing

      // Final word triggers the flash
      if (i === WORDS.length - 1) {
        tl.to(containerRef.current, {
          backgroundColor: 'var(--crimson)',
          duration: 0.2,
          yoyo: true,
          repeat: 1
        }, '+=0.2');
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-ink flex flex-col items-center justify-center py-20 overflow-hidden"
    >
      {/* Anime / Cinematic Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          src="/fire.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-25 mix-blend-screen"
        />
        {/* Dark overlay to ensure text remains highly legible */}
        <div className="absolute inset-0 bg-ink/50" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-2 md:gap-4 w-full px-4">
        {WORDS.map((word, index) => (
          <h2 
            key={index}
            ref={(el) => {
              if (el) wordsRef.current[index] = el;
            }}
            className="font-hero text-[14vw] md:text-[18vw] text-ash uppercase leading-[0.85] text-center tracking-tighter drop-shadow-[0_0_50px_rgba(200,16,46,0.15)]"
            style={{ 
              opacity: 0, 
              transform: 'scale(0.4)',
              willChange: 'transform, opacity'
             }}
          >
            {word}
          </h2>
        ))}
      </div>
    </section>
  );
}
