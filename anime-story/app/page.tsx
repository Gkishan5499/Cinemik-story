import Preloader from '@/components/ui/Preloader';
import Hero from '@/components/sections/Hero';
import NewEpisodeBanner from '@/components/sections/NewEpisodeBanner';
import Manifesto from '@/components/sections/Manifesto';
import HighlightsSection from '@/components/sections/HighlightsSection';
import Characters from '@/components/sections/Characters';
import DesignPhilosophy from '@/components/sections/DesignPhilosophy';
import ScrollingExperience from '@/components/sections/ScrollingExperience';
import SectionTransition from '@/components/sections/SectionTransition';
import CategoriesSection from '@/components/sections/CategoriesSection';
import RecentStories from '@/components/sections/RecentStories';
import StoryArchiveCTA from '@/components/sections/StoryArchiveCTA';
import Timeline from '@/components/sections/Timeline';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-ink select-none overflow-hidden">
      <Preloader />
      <Hero />
      <RecentStories />
      <Manifesto />
      <NewEpisodeBanner />
      <HighlightsSection />
      <Characters />
      <DesignPhilosophy />
      <CategoriesSection />
      <ScrollingExperience />
      <SectionTransition />
      <StoryArchiveCTA />
      <Timeline />
      <Footer />
    </main>
  );
}
