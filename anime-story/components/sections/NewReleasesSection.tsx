'use client';
import Link from 'next/link';

export default function NewReleasesSection() {
  const newReleases = [
    {
      id: 'nr-1',
      title: 'EPISODE 39 — ASH AND BONE',
      storyTitle: 'THE CRIMSON LOTUS PROTOCOL',
      format: 'MOTION COMIC + AUDIO',
      date: 'JUST DROPPED',
      description: 'The final confrontation at the edge of the world. High-definition motion effects and immersive spatial audio soundtrack.',
    },
    {
      id: 'nr-2',
      title: 'CHAPTER 12 — VOID ECHOES',
      storyTitle: 'CHRONICLES OF THE BLOOMING LOTUS',
      format: 'VERTICAL SCROLL + SOUNDTRACK',
      date: '2 HOURS AGO',
      description: 'As the abyssal gates open, a solitary warrior must decipher the runic chant before total memory wipe.',
    },
    {
      id: 'nr-3',
      title: 'EPISODE 08 — SYNTHETIC DREAMS',
      storyTitle: 'NEON ASHES: CYBER REEL 2099',
      format: 'FULL CINEMIKS MOTION',
      date: 'TODAY',
      description: 'In the lower cyber grid, rebellion breaks out when the central server overrides organic consciousness.',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63946]/10 border border-[#E63946]/40 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E63946] animate-ping" />
              <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#E63946] uppercase">
                FRESH FROM CREATORS
              </span>
            </div>
            <h2 className="font-bricolage text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
              NEW <span className="text-gradient-01">RELEASES</span>
            </h2>
          </div>
          <Link
            href="/episodes"
            className="font-manrope text-xs font-bold tracking-widest text-[#FFC857] hover:text-[#2596be] uppercase transition-colors"
          >
            BROWSE ALL EPISODES →
          </Link>
        </div>

        {/* Release Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newReleases.map((item) => (
            <div
              key={item.id}
              className="bg-[#121216] border border-white/10 hover:border-[#2596be]/50 p-8 rounded-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-manrope font-bold mb-4">
                  <span className="text-[#2596be] uppercase tracking-wider">{item.format}</span>
                  <span className="text-white/40 uppercase tracking-widest">{item.date}</span>
                </div>
                <span className="font-manrope text-xs font-bold text-[#FFC857] uppercase tracking-widest block mb-1">
                  {item.storyTitle}
                </span>
                <h3 className="font-bricolage text-2xl font-bold text-white uppercase leading-tight mb-3">
                  {item.title}
                </h3>
                <p className="font-manrope text-white/60 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <Link
                href="/episodes"
                className="w-full font-manrope text-xs font-bold tracking-widest text-center text-white bg-white/5 hover:bg-[#2596be] hover:text-white py-3 rounded-sm border border-white/10 transition-all uppercase block"
              >
                EXPERIENCE NOW
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
