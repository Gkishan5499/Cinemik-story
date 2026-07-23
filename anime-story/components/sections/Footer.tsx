'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const PAGE_LINKS = [
  { href: '/',           label: 'HOME' },
  { href: '/story',      label: 'STORY' },
  { href: '/characters', label: 'CHARACTERS' },
  { href: '/episodes',   label: 'EPISODES' },
];

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !watermarkRef.current) return;
    gsap.to(watermarkRef.current, {
      opacity: 0.05,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
      }
    });
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="relative w-full bg-ink pt-32 pb-12 px-6 md:px-16 overflow-hidden border-t border-border mt-20">
      
      {/* Watermark */}
      <div 
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 translate-y-12 select-none overflow-hidden"
      >
        <span className="font-hero text-[25vw] leading-none text-ash whitespace-nowrap">
          MONOGATARI
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end md:items-center gap-12">
        
        {/* Logo + tagline */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-[3px] h-5 bg-crimson" />
            <span className="font-display text-lg tracking-[0.2em] text-ash group-hover:text-white transition-colors">
              MONOGATARI
            </span>
          </Link>
          <p className="font-mono text-[10px] tracking-[0.2em] text-ash/30 uppercase max-w-xs">
            A cinematic anime story. Studio Ash © {new Date().getFullYear()}.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-8 md:gap-12">
          {PAGE_LINKS.map(({ href, label }) => (
            <Link 
              key={href}
              href={href}
              className="font-mono text-sm tracking-widest text-ash/60 hover:text-crimson transition-colors"
              data-cursor-hover
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex flex-col md:items-end gap-6">
          <div className="flex gap-6">
            <a href="#" aria-label="Twitter" className="text-ash/60 hover:text-crimson transition-colors" data-cursor-hover>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-ash/60 hover:text-crimson transition-colors" data-cursor-hover>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="text-ash/60 hover:text-crimson transition-colors" data-cursor-hover>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>
          <Link
            href="/episodes/39"
            className="font-mono text-[10px] tracking-[0.25em] text-crimson hover:text-white transition-colors uppercase flex items-center gap-2"
            data-cursor-hover
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
            WATCH LATEST EPISODE
          </Link>
        </div>

      </div>
    </footer>
  );
}
