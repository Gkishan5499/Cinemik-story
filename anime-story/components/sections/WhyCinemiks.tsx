'use client';

export default function WhyCinemiks() {
  const pillars = [
    {
      title: 'MOTION & VISUALS',
      icon: '🎞️',
      description: 'Dynamic frame movement, parallax scroll effects, and atmospheric art bring every scene to life.',
    },
    {
      title: 'ATMOSPHERIC AUDIO',
      icon: '🎧',
      description: 'Spatial audio soundtracks and environment soundscapes synchronize with your reading pace.',
    },
    {
      title: 'VERTICAL READING',
      icon: '📱',
      description: 'Fluid, continuous scroll experience designed seamlessly for mobile-first modern readers.',
    },
    {
      title: 'IP INCUBATION',
      icon: '🚀',
      description: 'Original stories grow into film, streaming series, animation, and gaming collaborations.',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-[#121216] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#2596be] uppercase">
            THE CINEMIKS EXPERIENCE
          </span>
          <h2 className="font-bricolage text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mt-3 leading-tight">
            WHY CHOOSE <span className="text-gradient-01">CINEMIKS</span>
          </h2>
          <p className="font-manrope text-white/80 text-lg md:text-xl mt-6 font-medium leading-relaxed">
            “Traditional stories are read. Movies are watched. <span className="text-[#FFC857] font-bold">CINEMIKS</span> brings the best of both together.”
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, index) => (
            <div
              key={index}
              className="bg-[#0A0A0A] border border-white/10 hover:border-[#2596be]/50 p-8 rounded-sm transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="text-4xl mb-6">{item.icon}</div>
              <h3 className="font-bricolage text-xl font-bold text-white uppercase group-hover:text-[#2596be] transition-colors mb-3">
                {item.title}
              </h3>
              <p className="font-manrope text-white/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
