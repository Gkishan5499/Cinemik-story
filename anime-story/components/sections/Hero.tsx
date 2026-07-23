'use client';
import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { splitTextToWords } from '@/lib/gsap-utils';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!titleRef.current) return;

    // Save original text for strict mode cleanup
    const originalText = titleRef.current.innerText;
    
    // Only split if not already split
    if (!titleRef.current.querySelector('span')) {
      const words = splitTextToWords(titleRef.current);
      
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(words, {
        y: 120,
        opacity: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power4.out',
      })
      .fromTo(subtitleRef.current, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out'
      }, '-=0.6')
      .fromTo(badgesRef.current, {
        opacity: 0,
        y: 15
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      .fromTo(ctaRef.current, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.8')
      .fromTo(statsRef.current, {
        opacity: 0,
      }, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.6');
      
      return () => {
        if (titleRef.current) {
          titleRef.current.innerHTML = originalText;
        }
      };
    }
  });

  return (
    <section id="story" className="relative w-full h-screen flex flex-col justify-center px-6 md:px-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero_bg.png"
          alt="Atmospheric Background"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-20"
        />
        {/* Multi-layer gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/40 z-10" />
        {/* Crimson glow accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-crimson/5 blur-[80px] z-10 rounded-full" />
      </div>

      {/* Red vertical accent line */}
      <div className="absolute left-6 md:left-16 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-crimson/80 to-transparent z-20" />
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-screen-2xl mx-auto flex flex-col items-center text-center justify-center mt-16 md:mt-24">

        {/* Badges row */}
        <div ref={badgesRef} className="flex items-center gap-4 mb-8 opacity-0 flex-wrap justify-center">
          <span className="font-mono text-[10px] tracking-[0.3em] text-crimson uppercase border border-crimson/40 px-3 py-1.5 bg-crimson/5 backdrop-blur-sm">
            SEASON III
          </span>
          <span className="w-1 h-1 rounded-full bg-ash/40" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ash/60 uppercase">
            NOW STREAMING
          </span>
          <span className="w-1 h-1 rounded-full bg-ash/40" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ash/60 uppercase">
            EP. 39 FINALE
          </span>
        </div>

        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="font-hero text-[18vw] md:text-[15vw] leading-[0.75] tracking-tight uppercase text-ash select-none drop-shadow-[0_0_60px_rgba(200,16,46,0.4)]"
        >
          THE WORLD AWAKENS
        </h1>
        
        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="font-body text-ash/80 text-lg md:text-2xl max-w-2xl mt-10 md:mt-14 opacity-0 tracking-wide font-light drop-shadow-lg leading-relaxed"
        >
          In the age before memory, the first blade was drawn — and the crimson lotus bloomed from the blood of forgotten gods.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-10 opacity-0">
          <Link 
            href="/episodes/39"
            className="group font-mono text-xs tracking-[0.25em] uppercase px-8 py-4 bg-crimson hover:bg-crimson/90 text-white transition-all duration-300 relative overflow-hidden"
            data-cursor-hover
          >
            <span className="relative z-10">WATCH LATEST EPISODE</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 skew-x-[-12deg]" />
          </Link>
          <Link 
            href="/story"
            className="font-mono text-xs tracking-[0.25em] uppercase px-8 py-4 border border-ash/30 text-ash/80 hover:text-white hover:border-ash/60 transition-all duration-300 backdrop-blur-sm"
            data-cursor-hover
          >
            EXPLORE THE STORY
          </Link>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="flex items-center gap-8 md:gap-16 mt-16 opacity-0">
          {[
            { value: '39', label: 'Episodes' },
            { value: '3', label: 'Seasons' },
            { value: '12M+', label: 'Viewers' },
            { value: '96', label: 'Score' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-hero text-3xl md:text-5xl text-ash leading-none">{stat.value}</div>
              <div className="font-mono text-[10px] tracking-widest text-ash/40 mt-1 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="font-mono text-[9px] tracking-[0.4em] text-ash/30 uppercase">Scroll</span>
        <div className="w-[1px] h-14 bg-border relative overflow-hidden">
          <div className="w-[1px] h-4 bg-crimson absolute top-0 animate-scroll-drop"></div>
        </div>
      </div>
    </section>
  );
}
