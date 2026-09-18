import Preloader from '@/components/ui/Preloader';
import Hero from '@/components/sections/Hero';
import FeaturedStories from '@/components/sections/FeaturedStories';
import TrendingStories from '@/components/sections/TrendingStories';
import NewReleasesSection from '@/components/sections/NewReleasesSection';
import FeaturedCreators from '@/components/sections/FeaturedCreators';
import CategoriesSection from '@/components/sections/CategoriesSection';
import WhyCinemiks from '@/components/sections/WhyCinemiks';
import PlatformFeatures from '@/components/sections/PlatformFeatures';
import HowItWorks from '@/components/sections/HowItWorks';
import CommunityHighlights from '@/components/sections/CommunityHighlights';
import FaqSection from '@/components/sections/FaqSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] select-none overflow-hidden font-manrope">
      <Preloader />
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Featured Stories */}
      <FeaturedStories />

      {/* 3. Trending Stories */}
      <TrendingStories />

      {/* 4. New Releases */}
      <NewReleasesSection />

      {/* 5. Featured Creators */}
      <FeaturedCreators />

      {/* 6. Story Categories */}
      <CategoriesSection />

      {/* 7. Why Choose CINEMIKS */}
      <WhyCinemiks />

      {/* 8. Platform Features */}
      <PlatformFeatures />

      {/* 9. How It Works */}
      <HowItWorks />

      {/* 10. Community Highlights */}
      <CommunityHighlights />

      {/* 11. Frequently Asked Questions */}
      <FaqSection />

      {/* 12. Newsletter Subscription */}
      <NewsletterSection />

      {/* 13, 14, 15. Footer Navigation, Social Media Links, & Contact Information */}
      <Footer />
    </main>
  );
}
