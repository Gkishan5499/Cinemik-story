import Characters from '@/components/sections/Characters';
import WorldMap from '@/components/sections/WorldMap';
import Footer from '@/components/sections/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Characters | Monogatari',
  description: 'Meet the warriors, emperors, and exiles of the Monogatari chronicle.',
};

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-ink select-none">
      {/* Page header */}
      <div className="pt-32 md:pt-40 pb-0 px-6 md:px-20">
        <div className="max-w-[90rem] mx-auto border-b border-border/30 pb-10">
          <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">Dramatis Personae</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[8rem] text-ash uppercase tracking-tight mt-3 leading-none">
            CHARACTERS
          </h1>
          <p className="font-body text-ash/50 text-base md:text-xl max-w-2xl mt-5 leading-relaxed">
            The warriors, exiles, and gods who shaped the fate of the world. Scroll to explore each one.
          </p>
        </div>
      </div>

      <Characters />
      <WorldMap />
      <Footer />
    </main>
  );
}
