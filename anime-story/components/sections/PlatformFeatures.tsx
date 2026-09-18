'use client';

export default function PlatformFeatures() {
  const features = [
    {
      title: 'Pace-Controlled Reading',
      subtitle: 'Reader Control',
      desc: 'You control the scroll speed while animations and audio fluidly adapt to your individual pace.',
    },
    {
      title: 'Creator Studio Suite',
      subtitle: 'Creator Empowerment',
      desc: 'Intuitive web portal for creators to upload motion panels, sync sound files, and manage episodes.',
    },
    {
      title: 'Dynamic Soundscapes',
      subtitle: 'Sensory Audio',
      desc: 'Original background scores and environmental sound FX tuned to evoke deep emotional resonance.',
    },
    {
      title: 'Community Discussions',
      subtitle: 'Fan Engagement',
      desc: 'Engage with fellow readers, leave panel reactions, and support your favorite independent creators.',
    },
    {
      title: 'IP Pipeline & Incubation',
      subtitle: 'Future Entertainment',
      desc: 'Top-performing stories receive dedicated incubation into adaptation pipelines for film and series.',
    },
    {
      title: 'Seamless Mobile First UI',
      subtitle: 'Anytime Entertainment',
      desc: 'Engineered for smooth 60fps mobile scrolling and high-contrast OLED dark mode display.',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#FFC857] uppercase">
            STATE-OF-THE-ART TECHNOLOGY
          </span>
          <h2 className="font-bricolage text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
            PLATFORM <span className="text-gradient-02">FEATURES</span>
          </h2>
          <p className="font-manrope text-white/60 text-base mt-3">
            Designed from the ground up for immersive readers and vision-driven story creators.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#121216] border border-white/10 hover:border-[#FFC857]/50 p-8 rounded-sm transition-all duration-300 relative group"
            >
              <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#2596be] uppercase block mb-2">
                {feat.subtitle}
              </span>
              <h3 className="font-bricolage text-2xl font-bold text-white uppercase mb-3 group-hover:text-[#FFC857] transition-colors">
                {feat.title}
              </h3>
              <p className="font-manrope text-white/60 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
