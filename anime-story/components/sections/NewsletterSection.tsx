'use client';
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#121216] to-[#0A0A0A] border-b border-white/10 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vh] bg-[#2596be]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#FFC857] uppercase">
          NEVER MISS A REEL
        </span>
        <h2 className="font-bricolage text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
          JOIN THE <span className="text-gradient-01">CINEMIKS REEL</span> CLUB
        </h2>
        <p className="font-manrope text-white/70 text-base md:text-lg max-w-xl mx-auto mt-3">
          Get weekly release drops, featured creator highlights, and early access to original IP premieres.
        </p>

        {submitted ? (
          <div className="mt-8 p-6 bg-[#2596be]/20 border border-[#2596be]/50 rounded-sm font-manrope text-sm font-bold text-[#FFC857] uppercase tracking-wider">
            ✦ WELCOME TO CINEMIKS! YOU ARE ON THE REEL LIST.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-4 bg-[#0A0A0A] border border-white/20 text-white font-manrope text-sm rounded-sm focus:outline-none focus:border-[#2596be]"
            />
            <button
              type="submit"
              className="font-manrope text-xs font-bold tracking-widest text-white bg-gradient-to-r from-[#2596be] to-[#E63946] hover:from-[#FFC857] hover:to-[#2596be] px-8 py-4 rounded-sm transition-all duration-300 uppercase shadow-lg shadow-[#2596be]/20"
            >
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
