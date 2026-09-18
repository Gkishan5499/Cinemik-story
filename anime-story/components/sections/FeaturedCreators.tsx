'use client';
import Link from 'next/link';

export default function FeaturedCreators() {
  const creators = [
    {
      id: 'c-1',
      name: 'KAI_STUDIO',
      role: 'Master Storyteller & VFX Artist',
      followers: '145K Followers',
      works: '3 Original Series',
      bio: 'Pioneering sensory-driven dark fantasy reels with dynamic vertical scrolling and orchestral soundscapes.',
    },
    {
      id: 'c-2',
      name: 'LUNA_VFX',
      role: 'Cyberpunk Animator & Producer',
      followers: '98K Followers',
      works: '5 Motion Titles',
      bio: 'Creating futuristic cyber noir experiences combining glowing neon visuals and synthetic audio scores.',
    },
    {
      id: 'c-3',
      name: 'THOR_STUDIO',
      role: 'Mythological Universe Builder',
      followers: '210K Followers',
      works: '4 Epics',
      bio: 'Crafting grand mythological sagas that incubate into animation, streaming series, and game concepts.',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-[#121216] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#2596be] uppercase">
              CREATOR-DRIVEN ENTERTAINMENT
            </span>
            <h2 className="font-bricolage text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
              FEATURED <span className="text-gradient-02">CREATORS</span>
            </h2>
          </div>
          <Link
            href="/creator-setup"
            className="font-manrope text-xs font-bold tracking-widest text-[#FFC857] hover:text-[#2596be] uppercase transition-colors"
          >
            BECOME A CREATOR →
          </Link>
        </div>

        {/* Creator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="bg-[#0A0A0A] border border-white/10 hover:border-[#FFC857]/50 p-8 rounded-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2596be] to-[#E63946] flex items-center justify-center font-bricolage text-2xl font-bold text-white shadow-lg">
                    {creator.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bricolage text-xl font-bold text-white uppercase">{creator.name}</h3>
                    <p className="font-manrope text-xs font-semibold text-[#FFC857]">{creator.role}</p>
                  </div>
                </div>

                <p className="font-manrope text-white/60 text-sm leading-relaxed mb-6">
                  {creator.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-manrope text-xs text-white/50">
                <span>⚡ {creator.followers}</span>
                <span>📚 {creator.works}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
