'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.7'
      )
      .fromTo(
        badgesRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        statsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.4'
      );
  });

  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-16 pt-28 pb-16 overflow-hidden bg-[#0A0A0A]">
      {/* Background Image & Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_bg.png"
          alt="CINEMIKS Background"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-[#0A0A0A] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]/80 z-10" />
        {/* Glow Accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vh] bg-[#2596be]/15 blur-[120px] z-10 rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[40vw] h-[30vh] bg-[#FFC857]/10 blur-[100px] z-10 rounded-full" />
      </div>

      {/* Cinematic Accent Bar */}
      <div className="absolute left-6 md:left-12 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-[#2596be] to-transparent z-20 hidden sm:block" />

      {/* Hero Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center text-center justify-center">

        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2596be]/30 bg-[#2596be]/10 backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-[#2596be] animate-pulse" />
          <span className="font-manrope text-xs font-bold tracking-[0.25em] text-[#FFC857] uppercase">
            POWERED BY IMMERSIVE READING
          </span>
        </div>

        {/* Main Title - READ THE REEL */}
        <h1
          ref={titleRef}
          className="font-bricolage text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-extrabold tracking-tight uppercase text-white leading-none drop-shadow-[0_0_60px_rgba(37, 150, 190,0.35)]"
        >
          READ THE <span className="text-gradient-01">REEL</span>
        </h1>

        {/* Subheading */}
        <p
          ref={subtitleRef}
          className="font-manrope text-white/80 text-base sm:text-lg md:text-2xl max-w-3xl mt-6 md:mt-8 tracking-wide font-medium leading-relaxed"
        >
          Experience a new generation of storytelling where motion, cinematic visuals, immersive audio, and imagination come together to create unforgettable entertainment experiences.
        </p>

        {/* Supporting Points Badges */}
        <div ref={badgesRef} className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8">
          {[
            'Experience immersive stories.',
            'Build passionate communities.',
            'Create the next generation of entertainment.',
          ].map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md font-manrope text-xs font-semibold text-[#F5F5F7]"
            >
              <span className="text-[#FFC857]">✦</span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-10 w-full sm:w-auto">
          <Link
            href="/story"
            className="w-full sm:w-auto font-manrope text-sm font-bold tracking-wider uppercase px-9 py-4 bg-gradient-to-r from-[#2596be] to-[#E63946] hover:from-[#FFC857] hover:to-[#2596be] text-white rounded-sm transition-all duration-300 shadow-xl shadow-[#2596be]/25 hover:scale-[1.02] flex items-center justify-center gap-2"
            data-cursor-hover
          >
            <span>Explore CINEMIKS</span>
            <span className="text-lg">→</span>
          </Link>
          <Link
            href="/creator-setup"
            className="w-full sm:w-auto font-manrope text-sm font-semibold tracking-wider uppercase px-8 py-4 border border-[#FFC857]/40 hover:border-[#FFC857] text-[#FFC857] hover:bg-[#FFC857]/10 rounded-sm transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
            data-cursor-hover
          >
            <span>Become a Creator</span>
          </Link>
        </div>

        {/* Platform Stats Row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 mt-16 pt-10 border-t border-white/10 w-full max-w-4xl">
          {[
            { value: '12M+', label: 'Passionate Readers' },
            { value: '500+', label: 'Original Creators' },
            { value: '2.5K+', label: 'Immersive Episodes' },
            { value: '98%', label: 'Entertainment Rating' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-bricolage text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2596be] leading-none">
                {stat.value}
              </div>
              <div className="font-manrope text-xs font-semibold tracking-wider text-white/50 mt-2 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="mt-12 flex flex-col items-center gap-2 z-20">
        <span className="font-manrope text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[2px] h-12 bg-white/10 relative overflow-hidden">
          <div className="w-full h-4 bg-gradient-to-b from-[#2596be] to-[#FFC857] absolute top-0 animate-scroll-drop rounded-full" />
        </div>
      </div>
    </section>
  );
}
