'use client';

export default function CommunityHighlights() {
  const testimonials = [
    {
      quote: 'Reading on CINEMIKS feels like step inside an animated movie. The atmospheric audio and vertical motion scroll completely change how I experience stories.',
      author: 'ELENA V.',
      tag: 'PASSIONATE READER',
    },
    {
      quote: 'As a visual artist, CINEMIKS gave my dark fantasy webcomic a sensory dimension I never thought possible. The audio sync and motion layout are incredible.',
      author: 'MARCUS REEL',
      tag: 'CREATOR & ANIMATOR',
    },
    {
      quote: 'The IP incubation focus is real. CINEMIKS empowers independent creators to build true entertainment franchises directly with our audience.',
      author: 'ASTRID K.',
      tag: 'CREATOR STUDIO LEAD',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#FFC857] uppercase">
            GLOBAL FAN COMMUNITY
          </span>
          <h2 className="font-bricolage text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
            COMMUNITY <span className="text-gradient-02">HIGHLIGHTS</span>
          </h2>
          <p className="font-manrope text-white/60 text-base mt-3">
            Join thousands of creators and millions of readers shaping the future of entertainment IP.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#121216] border border-white/10 p-8 rounded-sm flex flex-col justify-between hover:border-[#FFC857]/50 transition-all duration-300"
            >
              <div>
                <span className="text-[#2596be] text-3xl font-bricolage block mb-4">“</span>
                <p className="font-manrope text-white/80 text-sm leading-relaxed mb-6 font-medium italic">
                  {item.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="font-bricolage text-base font-bold text-white uppercase">{item.author}</p>
                <p className="font-manrope text-[10px] font-bold tracking-widest text-[#FFC857] uppercase">{item.tag}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
