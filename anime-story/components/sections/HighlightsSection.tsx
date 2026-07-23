'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHTS = [
  {
    id: 1,
    category: 'STORYTELLING',
    title: 'A Tale of Fall and Rise',
    highlight: 'From the ashes of a fallen kingdom, watch as legends are born and gods are challenged.',
    stat: '39 EPISODES',
    color: 'text-amber-400/70 group-hover:text-amber-300',
    bgColor: 'from-amber-900/10 to-transparent group-hover:from-amber-900/20',
  },
  {
    id: 2,
    category: 'ANIMATION',
    title: 'Cinematic Excellence',
    highlight: 'Every frame is hand-crafted with precision. Every scene flows like a feature film.',
    stat: '60 FPS',
    color: 'text-sky-400/70 group-hover:text-sky-300',
    bgColor: 'from-sky-900/10 to-transparent group-hover:from-sky-900/20',
  },
  {
    id: 3,
    category: 'WORLDBUILDING',
    title: 'A Living Realm',
    highlight: 'Immerse yourself in a meticulously crafted world where every location tells its own story.',
    stat: '8 REGIONS',
    color: 'text-emerald-400/70 group-hover:text-emerald-300',
    bgColor: 'from-emerald-900/10 to-transparent group-hover:from-emerald-900/20',
  },
  {
    id: 4,
    category: 'CHARACTER DEPTH',
    title: 'Complex Heroes',
    highlight: 'Watch characters grow, change, and challenge their own understanding of right and wrong.',
    stat: '20+ CHARACTERS',
    color: 'text-violet-400/70 group-hover:text-violet-300',
    bgColor: 'from-violet-900/10 to-transparent group-hover:from-violet-900/20',
  },
];

export default function HighlightsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const highlightsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

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

    // Staggered highlight animations
    highlightsRef.current.forEach((item, index) => {
      if (!item) return;

      gsap.from(item, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.12,
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        }
      });

      // Subtle parallax
      gsap.to(item, {
        y: index % 2 === 0 ? -10 : 10,
        ease: 'none',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1.5,
        }
      });
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full py-20 md:py-32 px-6 md:px-20 bg-gradient-to-b from-ink/80 to-ink overflow-hidden"
    >
      {/* Grid pattern background */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(200,16,46,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,16,46,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent z-0" />

      <div className="max-w-[90rem] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 md:mb-28">
          <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase block mb-4">Highlights</span>
          <h2
            ref={titleRef}
            className="font-display text-5xl md:text-7xl lg:text-[6rem] text-ash uppercase tracking-tight leading-none mb-8"
          >
            WHY MONOGATARI
          </h2>
          <p className="font-body text-ash/60 text-base md:text-lg max-w-3xl leading-relaxed">
            A convergence of art, technology, and storytelling. Experience the future of anime through a world-class digital narrative.
          </p>
        </div>

        {/* Highlights Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {HIGHLIGHTS.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) highlightsRef.current[index] = el;
              }}
              className="group relative overflow-hidden rounded-sm border border-border/40 hover:border-crimson/50 transition-all duration-500 p-8 md:p-12 cursor-pointer"
              data-cursor-hover
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} transition-all duration-700 z-0`} />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-crimson/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              <div className="relative z-10">
                {/* Category tag */}
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className={`font-mono text-[9px] tracking-[0.25em] uppercase ${item.color} transition-colors duration-500`}>
                    {item.category}
                  </span>
                  <div className="w-2 h-[2px] bg-crimson/30 group-hover:bg-crimson/70 transition-colors duration-500" />
                </div>

                {/* Main title */}
                <h3 className="font-display text-3xl md:text-4xl text-white mb-4 uppercase tracking-tight leading-tight">
                  {item.title}
                </h3>

                {/* Highlight text */}
                <p className="font-body text-ash/70 group-hover:text-ash/90 transition-colors duration-500 mb-8 leading-relaxed text-sm md:text-base">
                  {item.highlight}
                </p>

                {/* Stats footer */}
                <div className="flex items-center justify-between pt-6 border-t border-border/30 group-hover:border-crimson/30 transition-colors duration-500">
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] tracking-widest text-ash/40 uppercase">Key Stat</p>
                    <p className={`font-display text-2xl md:text-3xl tracking-wide ${item.color} transition-colors duration-500`}>
                      {item.stat}
                    </p>
                  </div>
                  <div className="text-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    →
                  </div>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-crimson/5 group-hover:bg-crimson/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 z-0" />
            </div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-20 pt-12 border-t border-border/20 flex items-center justify-between">
          <p className="font-body text-ash/50 text-sm md:text-base max-w-xl">
            Dive into the complete experience. Start from the beginning or catch the latest episode.
          </p>
          <div className="hidden md:flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-crimson/60 uppercase">
            <span className="w-8 h-[1px] bg-crimson/40" />
            Scroll
          </div>
        </div>
      </div>
    </section>
  );
}
