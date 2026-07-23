'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryArchiveCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Fade in content
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 0.5,
        },
      }
    );

    // Button hover glow
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseenter', () => {
        gsap.to(buttonRef.current, {
          boxShadow: '0 0 30px rgba(200, 16, 46, 0.4)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
      buttonRef.current.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, {
          boxShadow: '0 0 0px rgba(200, 16, 46, 0)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-ink selection:bg-crimson flex items-center justify-center py-20 md:py-32 px-6"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, transparent 24%, rgba(200, 16, 46, 0.05) 25%, rgba(200, 16, 46, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 16, 46, 0.05) 75%, rgba(200, 16, 46, 0.05) 76%, transparent 77%, transparent), linear-gradient(0deg, transparent 24%, rgba(200, 16, 46, 0.05) 25%, rgba(200, 16, 46, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 16, 46, 0.05) 75%, rgba(200, 16, 46, 0.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">
            The Archive Awaits
          </p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-[5rem] text-ash uppercase tracking-tight leading-tight">
            Dive Deeper Into The Stories
          </h2>
          <p className="font-body text-lg md:text-2xl text-ash/60 leading-relaxed max-w-2xl mx-auto">
            From the fall of kingdoms to the rise of legends — explore the complete chronicle through multiple tales and perspectives.
          </p>
        </div>

        {/* Decorative lines */}
        <div className="flex items-center gap-6 my-6">
          <div className="w-12 h-px bg-gradient-to-r from-crimson/0 to-crimson/60" />
          <div className="w-3 h-3 rounded-full border border-crimson" />
          <div className="w-12 h-px bg-gradient-to-l from-crimson/0 to-crimson/60" />
        </div>

        {/* CTA Button */}
        <Link
          ref={buttonRef}
          href="/story"
          className="group mt-8 px-12 py-4 border border-crimson/60 hover:border-crimson text-crimson hover:text-ash bg-transparent hover:bg-crimson/10 rounded-sm font-mono text-sm tracking-[0.3em] uppercase transition-all duration-300 inline-flex items-center gap-3"
        >
          <span>ENTER THE ARCHIVE</span>
          <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 md:gap-16 mt-16 pt-16 border-t border-border/30">
          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-3xl md:text-4xl text-crimson">5+</p>
            <p className="font-mono text-xs tracking-[0.2em] text-ash/50 uppercase">Stories</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-3xl md:text-4xl text-crimson">3</p>
            <p className="font-mono text-xs tracking-[0.2em] text-ash/50 uppercase">Acts</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-3xl md:text-4xl text-crimson">∞</p>
            <p className="font-mono text-xs tracking-[0.2em] text-ash/50 uppercase">Worlds</p>
          </div>
        </div>
      </div>
    </section>
  );
}
