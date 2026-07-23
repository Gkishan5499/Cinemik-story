'use client';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

const CHARACTERS = [
  { id: '01', name: 'Kaelen Kuro', role: 'THE WANDERING ASH', image: '/character_1.png' },
  { id: '02', name: 'Ayame Shi', role: 'BLADE OF THE LOTUS', image: '/character_1.png' },
  { id: '03', name: 'Jinzo Rai', role: 'THUNDER STRUCK', image: '/character_1.png' },
  { id: '04', name: 'Maru', role: 'THE FORSAKEN CHILD', image: '/character_1.png' },
  { id: '05', name: 'Lord Vael', role: 'CRIMSON OVERLORD', image: '/character_1.png' },
];

export default function Characters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  useGSAP(() => {
    if (!containerRef.current || !scrollWrapperRef.current) return;

    const cards = gsap.utils.toArray('.character-card-wrapper') as HTMLElement[];
    const totalScrollWidth = scrollWrapperRef.current.scrollWidth - window.innerWidth;

    gsap.to(scrollWrapperRef.current, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${totalScrollWidth}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // Calculate active index based on progress
          const progress = self.progress;
          const index = Math.min(
            CHARACTERS.length - 1,
            Math.floor(progress * CHARACTERS.length)
          );
          setActiveIndex(index + 1);
        }
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-fog text-ash overflow-hidden">
      {/* Halftone texture overlay */}
      <div className="absolute inset-0 halftone-overlay opacity-30 z-0 pointer-events-none" />
      
      {/* Section Header */}
      <div className="absolute top-12 left-6 md:left-16 z-20 pointer-events-none">
        <h2 className="font-mono text-crimson tracking-[0.3em] text-sm uppercase">Dramatis Personae</h2>
      </div>

      {/* Progress Counter */}
      <div className="absolute bottom-12 right-6 md:right-16 z-20 font-mono text-6xl md:text-8xl text-ash opacity-20 pointer-events-none">
        {String(activeIndex).padStart(2, '0')} <span className="text-2xl md:text-4xl">/ {String(CHARACTERS.length).padStart(2, '0')}</span>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div ref={scrollWrapperRef} className="absolute inset-0 z-10 flex items-center pt-20 px-[10vw]">
        {CHARACTERS.map((char, index) => (
          <div key={char.id} className="character-card-wrapper flex items-center shrink-0">
            {/* Divider Line before first and between */}
            {index === 0 && <div className="h-48 w-[1px] bg-crimson/30 mr-12 md:mr-24 shrink-0" />}
            
            <div 
              className="group relative w-[80vw] md:w-[480px] aspect-[2/3] cursor-pointer overflow-hidden"
              data-cursor-hover
            >
              <div className="absolute inset-0 bg-ink overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03] border border-border/50 group-hover:border-crimson group-hover:shadow-[0_0_40px_rgba(200,16,46,0.3)]">
                <Image 
                  src={char.image}
                  alt={char.name}
                  fill
                  sizes="(max-width: 768px) 80vw, 480px"
                  className="object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                />
                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              {/* Text Layer */}
              <div className="absolute -bottom-8 md:-bottom-12 -left-4 md:-left-12 z-20 pointer-events-none transition-transform duration-500 group-hover:translate-x-6">
                <div className="font-mono text-crimson text-sm md:text-base tracking-[0.25em] mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold">
                  {char.role}
                </div>
                <div className="font-display text-5xl md:text-7xl lg:text-[6rem] text-ash transition-colors duration-300 group-hover:text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap">
                  {char.name}
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="h-48 w-[1px] bg-crimson/30 mx-12 md:mx-24 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
