'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DESIGN_PRINCIPLES = [
  {
    number: '01',
    title: 'CINEMATIC FLOW',
    description: 'Every scroll is a scene. Every animation is a beat in the narrative symphony.',
    accent: 'from-amber-500/30',
  },
  {
    number: '02',
    title: 'MONOCHROMATIC DEPTH',
    description: 'Ash, ink, and crimson. Three colors to tell the story between light and darkness.',
    accent: 'from-gray-600/30',
  },
  {
    number: '03',
    title: 'RESPONSIVE GRACE',
    description: 'From phone to desktop, the narrative flows seamlessly across all dimensions.',
    accent: 'from-blue-500/30',
  },
  {
    number: '04',
    title: 'SMOOTH SCROLLING',
    description: 'Every pixel glides with intention. No jarring transitions, only deliberate movement.',
    accent: 'from-crimson/30',
  },
];

export default function DesignPhilosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Title animation
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        }
      });
    }

    // Cards staggered animation
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      gsap.from(card, {
        x: index % 2 === 0 ? -60 : 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.15,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      });

      // Hover effect
      gsap.set(card, { transformOrigin: 'center' });
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-20 md:py-32 px-6 md:px-20 bg-ink selection:bg-crimson"
    >
      {/* Gradient accent - top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />

      <div className="max-w-[90rem] mx-auto">
        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">Design Language</span>
          <h2 
            ref={titleRef}
            className="font-display text-5xl md:text-7xl lg:text-[6rem] text-ash uppercase tracking-tight mt-4 leading-none"
          >
            PHILOSOPHY
          </h2>
          <p className="font-body text-ash/60 text-base md:text-lg max-w-3xl mt-8 leading-relaxed">
            The Monogatari experience isn't just visual. It's a carefully orchestrated dance of pixels, words, and motion designed to immerse you in a cinematic world.
          </p>
        </div>

        {/* Design Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20">
          {DESIGN_PRINCIPLES.map((principle, index) => (
            <div
              key={principle.number}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group relative overflow-hidden rounded-sm border border-border/30 hover:border-crimson/60 transition-all duration-500 p-8 md:p-10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] hover:from-white/[0.04] hover:to-white/[0.02] backdrop-blur-sm cursor-pointer"
              data-cursor-hover
            >
              {/* Number background */}
              <div className="absolute -top-6 -right-8 opacity-[0.05] group-hover:opacity-10 transition-opacity duration-500">
                <span className="font-display text-[15rem] text-ash pointer-events-none">
                  {principle.number}
                </span>
              </div>

              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${principle.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-mono text-2xl md:text-3xl text-crimson font-bold tracking-wider">
                    {principle.number}
                  </span>
                  <div className="h-px flex-1 bg-border/30 group-hover:bg-crimson/30 transition-colors duration-500" />
                </div>

                <h3 className="font-display text-2xl md:text-3xl text-white mb-4 uppercase tracking-tight">
                  {principle.title}
                </h3>

                <p className="font-body text-ash/70 group-hover:text-ash/90 transition-colors duration-500 leading-relaxed">
                  {principle.description}
                </p>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-crimson/10 via-transparent to-transparent blur-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="flex items-center gap-6 pt-12 border-t border-border/20">
          <div className="w-3 h-3 rounded-full bg-crimson" />
          <p className="font-mono text-xs tracking-[0.2em] text-ash/50 uppercase">
            Crafted with GSAP · Lenis · Tailwind · Next.js
          </p>
        </div>
      </div>

      {/* Gradient accent - bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
    </section>
  );
}
