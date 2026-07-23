'use client';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextToChars } from '@/lib/gsap-utils';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const LOCATIONS = [
  { id: 1, name: 'The Ash Citadel', desc: 'Seat of the Crimson Overlord', top: '30%', left: '40%' },
  { id: 2, name: 'Lotus Sanctum', desc: 'Hidden temple of the blade', top: '65%', left: '25%' },
  { id: 3, name: 'Forsaken Wastes', desc: 'Where the gods fell', top: '45%', left: '75%' },
];

export default function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mapBgRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  
  const [activePin, setActivePin] = useState<number | null>(null);

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current || !mapBgRef.current || !fogRef.current) return;

    // Split title
    const chars = splitTextToChars(titleRef.current);

    // Title animation
    gsap.from(chars, {
      y: 40,
      opacity: 0,
      stagger: 0.04,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    });

    // Parallax Map Background
    gsap.to(mapBgRef.current, {
      yPercent: 30, // 0.6x relative effect based on section height
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Parallax Fog Layer
    gsap.to(fogRef.current, {
      yPercent: -40, // 1.2x relative effect
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Pins stagger in
    gsap.from('.map-pin-marker', {
      scale: 0,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 50%',
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[120vh] bg-ink overflow-hidden flex flex-col items-center justify-center pointer-events-auto"
    >
      {/* Background Map - Parallax 0.6x */}
      <div 
        ref={mapBgRef} 
        className="absolute inset-0 z-0 h-[140%] -top-[20%]"
      >
        <Image 
          src="/world_map.png"
          alt="World Map"
          fill
          sizes="100vw"
          className="object-cover opacity-40 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-ink/50" />
      </div>

      {/* Fog Layer - Parallax 1.2x */}
      <div 
        ref={fogRef}
        className="absolute inset-0 z-10 opacity-30 pointer-events-none h-[150%] -top-[25%]"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--fog) 0%, transparent 70%)' }}
      />

      <div className="relative z-20 w-full max-w-7xl mx-auto h-full pt-32 px-6">
        <h2 
          ref={titleRef} 
          className="font-hero text-[12vw] md:text-[14vw] text-ash uppercase tracking-tight text-center leading-[0.8] drop-shadow-xl"
        >
          THE KNOWN WORLD
        </h2>

        {/* Floating Interactive Pins */}
        <div className="absolute inset-0 mt-32 z-30 pointer-events-none">
          {LOCATIONS.map((loc) => (
            <div 
              key={loc.id} 
              className="absolute pointer-events-auto"
              style={{ top: loc.top, left: loc.left }}
              onMouseEnter={() => setActivePin(loc.id)}
              onMouseLeave={() => setActivePin(null)}
            >
              <div className="map-pin-marker relative flex items-center justify-center cursor-pointer group" data-cursor-hover>
                {/* SVG Pin Marker */}
                <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-[0_0_10px_rgba(200,16,46,0.6)]">
                  <circle cx="20" cy="20" r="6" fill="var(--crimson)" className="transition-transform duration-300 group-hover:scale-150" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--crimson)" strokeWidth="1" strokeDasharray="2 4" className="animate-[spin_4s_linear_infinite]" />
                </svg>

                {/* Info Panel expanding on hover */}
                <div 
                  className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-4 bg-ink border border-crimson/30 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] origin-top ${activePin === loc.id ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'}`}
                >
                  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-ink border-t border-l border-crimson/30 rotate-45" />
                  <h3 className="font-display text-lg text-gold mb-1">{loc.name}</h3>
                  <p className="font-body text-xs text-ash/70">{loc.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
