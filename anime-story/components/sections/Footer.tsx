'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NAV_FOOTER_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/story', label: 'STORIES' },
  { href: '/episodes', label: 'EPISODES' },
  { href: '/characters', label: 'CHARACTERS' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/creator-setup', label: 'CREATOR STUDIO' },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0A0A0A] pt-24 pb-12 px-6 md:px-16 overflow-hidden border-t border-white/10">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
        <span className="font-bricolage text-[26vw] font-extrabold text-white whitespace-nowrap leading-none">
          CINEMIKS
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 pb-12 border-b border-white/10">
        {/* Brand Column */}
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <Image
              src="/logo.png"
              alt="CINEMIKS Logo"
              width={280}
              height={90}
              className="h-14 md:h-20 lg:h-24 w-auto object-contain transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_0_15px_rgba(0,178,255,0.45)]"
            />
          </Link>
          <p className="font-manrope text-xs text-white/50 leading-relaxed">
            CINEMIKS is a cinematic storytelling platform transforming visual tales into immersive experiences through motion, atmospheric audio, and vertical reading.
          </p>
          <p className="font-manrope text-[11px] text-[#FFC857]/80">
            📍 Bengaluru, Karnataka – 560037, India
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-8 font-manrope text-xs font-semibold tracking-widest text-white/70">
          {NAV_FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-[#2596be] transition-colors uppercase"
              data-cursor-hover
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Social & Contact Column */}
        <div className="flex flex-col gap-4 font-manrope text-xs">
          <span className="font-bold text-[#FFC857] uppercase tracking-wider">CONNECT WITH US</span>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.instagram.com/thecinemiks?utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#E1306C]/60 hover:bg-[#E1306C]/10 text-white/80 hover:text-white transition-all duration-300 group shadow-sm"
              data-cursor-hover
            >
              <svg className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="font-semibold text-xs tracking-wide">Instagram</span>
            </a>
            <a
              href="https://youtube.com/@thecinemiks?si=bb2aOXH9Ptyg3KKV"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#FF0000]/60 hover:bg-[#FF0000]/10 text-white/80 hover:text-white transition-all duration-300 group shadow-sm"
              data-cursor-hover
            >
              <svg className="w-4 h-4 text-[#FF0000] fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-semibold text-xs tracking-wide">YouTube</span>
            </a>
          </div>
          <div className="text-white/60 space-y-1 mt-1">
            <p>📧 Email: <a href="mailto:cinemiks@gmail.com" className="text-[#2596be] hover:underline">cinemiks@gmail.com</a></p>
            <p>📞 Phone: <a href="tel:+919008779309" className="text-[#2596be] hover:underline">+91 90087 79309</a></p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between font-manrope text-[11px] text-white/40 gap-4">
        <p>© {new Date().getFullYear()} CINEMIKS PLATFORM. ALL RIGHTS RESERVED. READ THE REEL.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
          <Link href="/terms" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
          <Link href="/ip-policy" className="hover:text-white transition-colors">IP INCUBATION</Link>
        </div>
      </div>
    </footer>
  );
}
