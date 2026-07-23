'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const EPISODES = [
  { id: 1,  ep: 'EP. 01', season: 'S1', title: 'THE FIRST BLADE',       desc: 'A young wanderer discovers a blade from the age of gods.',                 video: '/fire.mp4' },
  { id: 5,  ep: 'EP. 05', season: 'S1', title: 'ASHES OF THE CAPITAL',  desc: 'The great capital falls in a single night of fire.',                      video: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-starry-sky-30514-large.mp4' },
  { id: 12, ep: 'EP. 12', season: 'S1', title: 'BLOOD COVENANT',        desc: 'A forbidden pact is sealed beneath the crimson moon.',                    video: 'https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4' },
  { id: 20, ep: 'EP. 20', season: 'S2', title: 'THE HOLLOW FOREST',     desc: 'Ancient spirits awaken as the armies cross the sacred border.',           video: '/fire.mp4' },
  { id: 27, ep: 'EP. 27', season: 'S2', title: 'EMPRESS OF ASH',        desc: 'Yori reclaims the shattered throne — at a terrible cost.',               video: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-starry-sky-30514-large.mp4' },
  { id: 34, ep: 'EP. 34', season: 'S3', title: 'THE FALLEN GODS',       desc: 'A forgotten alliance is forged in the ruins of heaven.',                  video: 'https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4' },
  { id: 35, ep: 'EP. 35', season: 'S3', title: 'CRIMSON TIDE',          desc: 'The armies march on the Ash Citadel under a blood-red sky.',              video: '/fire.mp4' },
  { id: 36, ep: 'EP. 36', season: 'S3', title: 'REQUIEM OF BLADES',     desc: 'The season finale. Every sword has its final swing.',                     video: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-starry-sky-30514-large.mp4' },
  { id: 37, ep: 'EP. 37', season: 'S3', title: 'ECHOES OF TOMORROW',    desc: 'A new dawn rises over the ruins, but the shadows grow longer.',           video: 'https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4' },
  { id: 38, ep: 'EP. 38', season: 'S3', title: 'THE HOLLOW CROWN',      desc: 'Betrayal erupts from within the council of the remaining warlords.',     video: '/fire.mp4' },
  { id: 39, ep: 'EP. 39', season: 'S3', title: 'ASH AND BONE',          desc: 'The final confrontation at the edge of the world. Nothing survives.',     video: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-starry-sky-30514-large.mp4', isNew: true },
];

const SEASON_COLORS: Record<string, string> = {
  S1: 'text-amber-400/70',
  S2: 'text-sky-400/70',
  S3: 'text-crimson',
};

export default function Episodes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from('.episode-card', {
      y: 80,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      }
    });

    gsap.from(featuredRef.current, {
      x: -60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: featuredRef.current,
        start: 'top 80%',
      }
    });

  }, { scope: containerRef });

  const featured = EPISODES[EPISODES.length - 1]; // Latest
  const rest = EPISODES.slice(0, -1).reverse().slice(0, 6); // Previous 6

  return (
    <section id="episodes" ref={containerRef} className="w-full bg-ink pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-20 overflow-hidden">
      <div className="max-w-[90rem] mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 border-b border-border/30 pb-8">
          <div>
            <span className="font-mono text-[10px] tracking-[0.3em] text-crimson uppercase mb-3 block">SEASON III · FINALE</span>
            <h2 className="font-display text-5xl md:text-7xl lg:text-[6rem] text-ash uppercase tracking-tight drop-shadow-md">LATEST EPISODES</h2>
          </div>
          <Link href="/episodes" className="font-mono text-crimson text-sm md:text-base mt-8 md:mt-0 tracking-[0.2em] hover:text-white transition-colors" data-cursor-hover>
            VIEW ALL [ + ]
          </Link>
        </div>

        {/* Featured Latest Episode */}
        <div ref={featuredRef} className="mb-20">
          <Link
            href={`/episodes/${featured.id}`}
            className="group block relative w-full"
            data-cursor-hover
          >
            <div className="relative w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden rounded-sm border border-crimson/40 hover:border-crimson transition-colors duration-500 shadow-[0_0_80px_rgba(200,16,46,0.15)]">
              <video
                src={featured.video}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 origin-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
              
              {/* NEW badge */}
              {featured.isNew && (
                <div className="absolute top-6 right-6 font-mono text-[10px] tracking-[0.25em] bg-crimson text-white px-3 py-1.5 uppercase">
                  NEW
                </div>
              )}

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 rounded-full border-2 border-ash/60 flex items-center justify-center pl-2 backdrop-blur-sm bg-ink/20">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--ash)"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-3">
                  <span className={`font-mono text-[10px] tracking-widest uppercase ${SEASON_COLORS[featured.season]}`}>{featured.season}</span>
                  <span className="font-mono text-[10px] tracking-widest text-ash/40 uppercase">{featured.ep}</span>
                </div>
                <h3 className="font-display text-4xl md:text-6xl lg:text-7xl text-ash tracking-tight group-hover:text-crimson transition-colors duration-300 mb-3">
                  {featured.title}
                </h3>
                <p className="font-body text-ash/70 text-base md:text-lg max-w-lg">{featured.desc}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Grid of previous episodes */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tracking-[0.3em] text-ash/40 uppercase">Previous Episodes</span>
            <div className="flex-1 h-[1px] bg-border/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((ep) => (
              <Link 
                key={ep.id}
                href={`/episodes/${ep.id}`}
                className="episode-card group block relative transition-transform duration-300 hover:-translate-y-2"
                data-cursor-hover
              >
                {/* Thumbnail */}
                <div className="w-full aspect-video relative overflow-hidden rounded-sm border border-border group-hover:border-crimson/60 transition-colors duration-300 bg-ink/50">
                  <video 
                    src={ep.video} 
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500 origin-center"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-ink/20 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full border border-ash/50 flex items-center justify-center pl-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ash)"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  {/* Season badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-1 backdrop-blur-sm bg-ink/60 ${SEASON_COLORS[ep.season]} border-current opacity-80`}>
                      {ep.season}
                    </span>
                  </div>
                </div>

                {/* Text Info */}
                <div className="pt-5">
                  <p className="font-mono text-muted text-xs tracking-widest mb-2">{ep.ep}</p>
                  <h3 className="font-display text-xl md:text-2xl text-ash mb-2 group-hover:text-crimson transition-colors duration-300 leading-tight">
                    {ep.title}
                  </h3>
                  <p className="font-body text-ash/60 text-sm leading-relaxed">{ep.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
