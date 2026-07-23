'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

type StoryBlock = 
  | { type: 'text'; content: string }
  | { type: 'quote'; content: string; speaker: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'video'; src: string; caption?: string }
  | { type: 'divider'; label: string };

const STORY_BLOCKS: StoryBlock[] = [
  { type: 'text', content: "Smoke gathered where the capital once stood." },
  { type: 'video', src: "/fire.mp4", caption: "The burning of Ashfall — the last great capital" },
  { type: 'text', content: "A thousand banners burned in the swirling ash." },
  { type: 'text', content: "Yet one swordsman remained, unmoving amidst the chaos." },
  { type: 'image', src: "/character_1.png", alt: "The Wandering Ash", caption: "Kairu — The Last Blade of the Old Kingdom" },
  { type: 'text', content: "He carried no allegiance, only a shattered blade and a vow." },
  { type: 'quote', content: "The gods do not fall in battle. They fall in silence, when the last believer draws their final breath.", speaker: "Kairu, on the Ashen Plains" },
  { type: 'text', content: "His eyes had seen the gods fall, and he did not blink." },
  { type: 'divider', label: 'ACT II · THE CRIMSON TIDE' },
  { type: 'text', content: "The Crimson Lotus bloomed once more — an omen none could ignore." },
  { type: 'image', src: "/world_map.png", alt: "The Ruined Kingdom", caption: "The fractured territories after the Great Collapse" },
  { type: 'text', content: "Three warlords moved their forces under cover of the moonless night." },
  { type: 'text', content: "Each believed themselves the chosen sovereign. Each was wrong." },
  { type: 'quote', content: "Power is not seized. It is inherited — from those foolish enough to die for it.", speaker: "Empress Yori, in her last letter" },
  { type: 'video', src: "https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4", caption: "The spirit forests awakened with the rise of the crimson moon" },
  { type: 'text', content: "From the ruins of the old world, something ancient stirred." },
  { type: 'divider', label: 'ACT III · THE HOLLOW THRONE' },
  { type: 'text', content: "The age of men was over." },
  { type: 'text', content: "The era of the crimson lotus had begun." },
  { type: 'quote', content: "We did not lose the war. We simply ran out of reasons to keep fighting.", speaker: "Kairu, before vanishing into the East" },
  { type: 'text', content: "And across the wastes, a new flame was being carried forward." },
];

export default function ChapterOne() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    blocksRef.current.forEach((block) => {
      if (!block) return;

      // Simple scroll-triggered fade in animation
      gsap.fromTo(block, 
        { filter: 'blur(10px)', opacity: 0, y: 60 },
        {
          filter: 'blur(0px)', opacity: 1, y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.5,
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-ink selection:bg-crimson pt-16 md:pt-24 pb-20">
      
      {/* Background - visual only, doesn't affect layout */}
      <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image 
          src="/hero_bg.png"
          alt="Atmosphere"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.08] filter grayscale blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink via-transparent to-ink opacity-80" />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-transparent to-ink opacity-60" />
      </div>

        {/* Chapter Marker */}
        <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 flex items-center gap-6 z-10 opacity-60">
          <div className="w-px h-32 md:h-48 bg-crimson" />
          <h2 className="font-mono text-crimson text-xs md:text-sm tracking-[0.4em] uppercase" style={{ writingMode: 'vertical-rl' }}>
            ACT I. THE FALLEN KINGDOM
          </h2>
        </div>

        {/* Progress dots on right */}
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10 opacity-40">
          {[0,1,2].map(i => (
            <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-crimson scale-150' : 'bg-ash/40'}`} />
          ))}
        </div>

      {/* Story Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center gap-16 md:gap-20 pb-12">
        {STORY_BLOCKS.map((block, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) blocksRef.current[i] = el;
            }}
            className="w-full flex items-center justify-center will-change-[filter,opacity,transform]"
          >
            {block.type === 'text' && (
              <p className="w-full text-center font-display text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] text-ash tracking-tight drop-shadow-[0_0_40px_rgba(240,237,232,0.15)] leading-tight">
                {block.content}
              </p>
            )}
            
            {block.type === 'quote' && (
              <div className="w-full md:w-[85%] flex flex-col items-center gap-6">
                <div className="w-8 h-px bg-crimson/60" />
                <p className="text-center font-body text-2xl md:text-4xl text-ash/80 italic leading-relaxed tracking-wide">
                  &ldquo;{block.content}&rdquo;
                </p>
                <span className="font-mono text-xs tracking-[0.25em] text-crimson uppercase">— {block.speaker}</span>
                <div className="w-8 h-px bg-crimson/60" />
              </div>
            )}

            {block.type === 'divider' && (
              <div className="w-full flex items-center gap-6">
                <div className="flex-1 h-px bg-border/40" />
                <span className="font-mono text-xs tracking-[0.3em] text-crimson uppercase whitespace-nowrap">{block.label}</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
            )}
            
            {block.type === 'image' && (
              <div className="flex flex-col items-center gap-4 w-full md:w-[80%]">
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-border bg-ink">
                  <Image 
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-cover opacity-80"
                  />
                </div>
                {block.caption && (
                  <p className="font-mono text-[10px] tracking-[0.2em] text-ash/40 uppercase">{block.caption}</p>
                )}
              </div>
            )}

            {block.type === 'video' && (
              <div className="flex flex-col items-center gap-4 w-full md:w-[80%]">
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-crimson/30 shadow-[0_0_30px_rgba(200,16,46,0.15)] bg-ink">
                  <video 
                    src={block.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90 mix-blend-screen"
                  />
                </div>
                {block.caption && (
                  <p className="font-mono text-[10px] tracking-[0.2em] text-ash/40 uppercase">{block.caption}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}
