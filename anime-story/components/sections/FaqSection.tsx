'use client';
import { useState } from 'react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is CINEMIKS?',
      a: 'CINEMIKS is a cinematic storytelling platform powered by an immersive reading experience. It combines motion visuals, atmospheric spatial audio, and vertical scrolling to transform visual stories into dynamic entertainment.',
    },
    {
      q: 'How does CINEMIKS differ from traditional reading apps?',
      a: 'Traditional stories are read, and movies are watched. CINEMIKS blends both together—allowing readers to control scroll speed while enjoying animated panels, background soundtracks, and environmental sound FX.',
    },
    {
      q: 'How can creators publish on CINEMIKS?',
      a: 'Creators can sign up for a Creator Account to access the Creator Studio, where they can upload vertical story panels, sync audio soundscapes, organize episodes, and build a dedicated reader base.',
    },
    {
      q: 'What is CINEMIKS long-term vision for IP Incubation?',
      a: 'CINEMIKS is building an IP incubation pipeline where top original stories can grow into animated series, films, games, and streaming adaptations through future industry collaborations.',
    },
    {
      q: 'Is CINEMIKS free to read?',
      a: 'Yes! CINEMIKS offers free access to public stories and releases, with options to support creators and unlock premium story features.',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-[#121216] border-b border-white/10 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#2596be] uppercase">
            CLEAR ANSWERS
          </span>
          <h2 className="font-bricolage text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
            FREQUENTLY ASKED <span className="text-gradient-01">QUESTIONS</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#0A0A0A] border border-white/10 rounded-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bricolage text-xl font-bold text-white uppercase hover:text-[#2596be] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-2xl text-[#2596be]">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 font-manrope text-white/70 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
