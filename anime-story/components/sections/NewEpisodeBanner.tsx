'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function NewEpisodeBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bannerRef.current) return;
    gsap.from(bannerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'top 95%',
      }
    });
  }, { scope: bannerRef });

  return (
    <div ref={bannerRef} className="w-full bg-ink border-y border-crimson/20 px-6 md:px-20 py-6 md:py-8">
      <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        {/* Left: badge + text */}
        <div className="flex items-start md:items-center gap-5">
          {/* Pulsing badge */}
          <div className="flex items-center gap-2 shrink-0 mt-1 md:mt-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-crimson uppercase">New Episode</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1px] h-10 bg-border/40" />

          {/* Episode info */}
          <div>
            <p className="font-display text-base md:text-xl text-ash tracking-wide leading-snug">
              EP. 39 &mdash; <span className="text-white">ASH AND BONE</span>
            </p>
            <p className="font-body text-ash/50 text-sm mt-0.5 leading-snug">
              The final confrontation at the edge of the world. Nothing survives.
            </p>
          </div>
        </div>

        {/* Right: CTA */}
        <Link
          href="/episodes/39"
          className="group flex items-center gap-3 font-mono text-xs tracking-[0.25em] uppercase text-crimson hover:text-white transition-colors duration-300 shrink-0"
          data-cursor-hover
        >
          WATCH NOW
          <span className="w-6 h-[1px] bg-crimson group-hover:w-10 transition-all duration-300" />
        </Link>
      </div>
    </div>
  );
}
