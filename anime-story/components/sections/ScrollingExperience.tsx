'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const VISUAL_ELEMENTS = [
  {
    id: 1,
    title: 'LAYERED DEPTH',
    description: 'Elements move at different speeds, creating infinite depth and dimension.',
    icon: '◈',
    offset: 50,
  },
  {
    id: 2,
    title: 'TEXT MORPHING',
    description: 'Words animate in and out as you scroll, telling stories frame by frame.',
    icon: '◉',
    offset: -50,
  },
  {
    id: 3,
    title: 'COLOR TRANSITIONS',
    description: 'Seamless color shifts guide your eye and set the emotional tone.',
    icon: '◆',
    offset: 75,
  },
  {
    id: 4,
    title: 'TIMING PRECISION',
    description: 'Every millisecond is calculated to match the narrative rhythm.',
    icon: '◊',
    offset: -75,
  },
];

export default function ScrollingExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !bgRef.current) return;

    // Parallax background
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // Title entrance
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        }
      });
    }

    // Elements with staggered parallax
    elementsRef.current.forEach((element, index) => {
      if (!element) return;

      const offset = VISUAL_ELEMENTS[index]?.offset || 0;

      // Entrance animation
      gsap.from(element, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
        }
      });

      // Parallax effect
      gsap.to(element, {
        y: offset,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Hover animation
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(element, {
        x: 20,
        boxShadow: '0 20px 40px rgba(200, 16, 46, 0.2)',
        duration: 0.4,
        ease: 'power2.out'
      });

      element.addEventListener('mouseenter', () => hoverTl.play());
      element.addEventListener('mouseleave', () => hoverTl.reverse());

      return () => {
        element.removeEventListener('mouseenter', () => hoverTl.play());
        element.removeEventListener('mouseleave', () => hoverTl.reverse());
      };
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-40 px-6 md:px-20 bg-gradient-to-b from-ink to-ink/95 overflow-hidden"
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(200, 16, 46, 0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Accent line - top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent z-0" />

      <div className="max-w-[90rem] mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-24 md:mb-32">
          <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">Scroll Dynamics</span>
          <h2
            ref={titleRef}
            className="font-display text-5xl md:text-7xl lg:text-[6rem] text-ash uppercase tracking-tight mt-4 leading-none"
          >
            ANIMATION LAYERS
          </h2>
        </div>

        {/* Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {VISUAL_ELEMENTS.map((element, index) => (
            <div
              key={element.id}
              ref={(el) => {
                if (el) elementsRef.current[index] = el;
              }}
              className="group relative p-8 md:p-10 border border-border/30 hover:border-crimson/60 transition-all duration-500 rounded-sm bg-gradient-to-br from-white/[0.02] to-transparent cursor-pointer"
              data-cursor-hover
            >
              {/* Number indicator - left side */}
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full border border-crimson/40 flex items-center justify-center bg-ink/60 group-hover:bg-ink group-hover:border-crimson transition-all duration-500">
                <span className="font-mono text-lg text-crimson">
                  {String(element.id).padStart(2, '0')}
                </span>
              </div>

              {/* Icon */}
              <div className="text-5xl text-crimson/40 group-hover:text-crimson/80 transition-colors duration-500 leading-none mb-6">
                {element.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl md:text-3xl text-ash/90 group-hover:text-white transition-colors duration-500 mb-3 uppercase tracking-tight">
                {element.title}
              </h3>
              <p className="font-body text-ash/60 group-hover:text-ash/80 transition-colors duration-500 leading-relaxed">
                {element.description}
              </p>

              {/* Gradient accent on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 via-transparent to-transparent blur-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 pt-12 border-t border-border/20">
          <p className="font-body text-ash/70 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
            Each section responds to your scroll position in real-time, creating a synchronized experience between your input and the visual feedback.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-crimson uppercase">
              <span className="w-2 h-2 rounded-full bg-crimson" />
              Scroll Triggered
            </div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-crimson/60 uppercase">
              <span className="w-2 h-2 rounded-full bg-crimson/40" />
              Parallax Active
            </div>
          </div>
        </div>
      </div>

      {/* Accent line - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent z-0" />
    </section>
  );
}
