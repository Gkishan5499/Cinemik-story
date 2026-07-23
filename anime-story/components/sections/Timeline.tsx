'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const ARCS = [
  { 
    id: 1, 
    episodes: 'EP. 01–12', 
    title: 'THE FALLEN KINGDOM', 
    synopsis: 'Before the ash fell, there was a kingdom of gold. Follow the original betrayal that shattered the realm.',
    status: 'COMPLETED',
    image: '/hero_bg.png' // Reusing placeholder
  },
  { 
    id: 2, 
    episodes: 'EP. 13–24', 
    title: 'BLOOD IN THE LOTUS', 
    synopsis: 'Ayame seeks revenge against the Crimson Overlord, cutting a path through the Hidden sanctums.',
    status: 'COMPLETED',
    image: '/character_1.png'
  },
  { 
    id: 3, 
    episodes: 'EP. 25–36', 
    title: 'RECKONING OF ASH', 
    synopsis: 'The final confrontation at the citadel. The first blade is drawn once more, setting the world ablaze.',
    status: 'ONGOING',
    image: '/world_map.png'
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Draw timeline line
    if (lineRef.current) {
      const length = lineRef.current.getTotalLength();
      gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-section',
          start: 'top center',
          end: 'bottom center',
          scrub: 2,
        }
      });
    }

    // Animate cards on scroll into view
    const cards = gsap.utils.toArray('.arc-card') as HTMLElement[];
    cards.forEach((card) => {
      gsap.from(card, {
        x: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      });
    });

    // Marquee animation
    gsap.to('.marquee-track', {
      xPercent: -50,
      ease: 'none',
      repeat: -1,
      duration: 15,
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="timeline-section relative w-full bg-ink pt-24 md:pt-32 overflow-hidden flex flex-col"
    >
      <div className="max-w-[90rem] mx-auto flex w-full px-6 md:px-24 mb-16 md:mb-24">
        
        {/* Left Timeline Line */}
        <div className="w-16 md:w-32 shrink-0 flex justify-center relative">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path 
              ref={lineRef}
              d="M 8 0 L 8 10000"
              vectorEffect="non-scaling-stroke"
              stroke="var(--crimson)" 
              strokeWidth="2" 
              fill="none" 
            />
          </svg>
          {/* Faded background line */}
          <div className="w-[1px] h-full bg-border absolute left-1/2 -translate-x-1/2 top-0" />
        </div>

        {/* Right Cards */}
        <div className="flex-1 flex flex-col gap-20 py-12 md:pl-16">
          <div className="font-display text-5xl md:text-7xl lg:text-[6rem] text-ash mb-16 pb-8 border-b border-border/30 tracking-tight drop-shadow-md">
            STORY ARCS
          </div>

          {ARCS.map((arc, index) => (
            <div key={arc.id} className="arc-card w-full flex flex-col md:flex-row gap-8 items-start relative">
              {/* Timeline dot connecting to the active line */}
              <div className="absolute -left-16 md:-left-32 top-6 w-3 h-3 bg-ink border-2 border-crimson rounded-full translate-x-1/2 md:translate-x-[calc(50%+1px)] z-10" />

              {/* Thumbnail */}
              <div className="w-full md:w-2/5 aspect-[16/9] relative rounded-sm overflow-hidden border border-border">
                <Image 
                  src={arc.image} 
                  alt={arc.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="w-full md:w-3/5 flex flex-col pt-2 border-t border-border mt-4 md:mt-0 md:pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-muted text-sm tracking-widest">{arc.episodes}</span>
                  <span className={`font-mono text-xs tracking-[0.2em] px-2 py-1 border ${arc.status === 'COMPLETED' ? 'text-gold border-gold/30 bg-gold/5' : 'text-crimson border-crimson/30 bg-crimson/5'}`}>
                    {arc.status}
                  </span>
                </div>
                
                <h3 className="font-display text-3xl md:text-5xl text-ash uppercase mb-6 leading-none">
                  {arc.title}
                </h3>
                
                <p className="font-body text-ash/70 md:text-lg leading-relaxed max-w-lg">
                  {arc.synopsis}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Animated Marquee */}
      <div className="w-full border-y border-border/20 bg-ink py-6 md:py-10 relative flex overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap will-change-transform w-max">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="font-hero text-6xl md:text-8xl text-ash/10 tracking-[0.2em] px-12 uppercase flex items-center">
              THE CHRONICLES CONTINUE <span className="text-crimson/40 ml-12 text-5xl">✦</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
