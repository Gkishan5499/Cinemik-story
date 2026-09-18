'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storiesAPI } from '@/lib/api';

interface Story {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  category?: string;
  creator?: { username: string };
  episodesCount?: number;
  likesCount?: number;
}

export default function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await storiesAPI.listPublic();
        const list = res.stories || [];
        setStories(list.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured stories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const fallbackFeatured: Story[] = [
    {
      _id: 'featured-1',
      title: 'CHRONICLES OF THE BLOOMING LOTUS',
      description: 'In an age of forgotten gods, a renegade blade master battles through atmospheric realms to uncover ancient secrets.',
      category: 'Cinematic Fantasy',
      creator: { username: 'KAI_STUDIO' },
      episodesCount: 14,
      likesCount: 1420,
    },
    {
      _id: 'featured-2',
      title: 'NEON ASHES: CYBER REEL 2099',
      description: 'A sensory-rich journey through subterranean cyber cities where synthetic souls rebel against imperial code.',
      category: 'Sci-Fi Motion',
      creator: { username: 'LUNA_VFX' },
      episodesCount: 22,
      likesCount: 2890,
    },
    {
      _id: 'featured-3',
      title: 'THE SILENT ECHO: ABYSSAL WHISPERS',
      description: 'A deep psychological horror tale featuring spatial audio, dynamic scroll pacing, and dark visual atmosphere.',
      category: 'Psychological Horror',
      creator: { username: 'NOCTURNE' },
      episodesCount: 9,
      likesCount: 980,
    },
  ];

  const displayStories = stories.length > 0 ? stories : fallbackFeatured;

  return (
    <section className="py-24 px-6 md:px-16 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#2596be] uppercase">
              HANDPICKED EXPERIENCES
            </span>
            <h2 className="font-bricolage text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight mt-2">
              FEATURED <span className="text-gradient-01">STORIES</span>
            </h2>
          </div>
          <Link
            href="/story"
            className="font-manrope text-xs font-bold tracking-widest text-[#FFC857] hover:text-[#2596be] uppercase flex items-center gap-2 transition-colors self-start md:self-auto"
          >
            <span>VIEW ALL ARCHIVES</span>
            <span>→</span>
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayStories.map((story) => (
            <Link
              key={story._id}
              href={`/story/${story._id}`}
              className="group relative bg-[#121216] border border-white/10 hover:border-[#2596be]/50 rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Cover Gradient/Image Overlay */}
              <div className="h-56 bg-gradient-to-br from-[#2596be]/20 via-[#121216] to-[#E63946]/20 relative overflow-hidden flex items-center justify-center">
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                ) : (
                  <div className="text-center p-6">
                    <span className="font-bricolage text-2xl font-bold text-white/40 tracking-wider">
                      CINEMIKS REEL
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-[#2596be]/40 rounded-full font-manrope text-[10px] font-bold text-[#FFC857] uppercase tracking-wider">
                  {story.category || 'FEATURED'}
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-manrope text-[11px] font-semibold text-[#2596be] uppercase tracking-widest">
                    BY {story.creator?.username || 'CINEMIKS CREATOR'}
                  </span>
                  <h3 className="font-bricolage text-2xl font-bold text-white group-hover:text-[#2596be] transition-colors mt-2 leading-tight uppercase">
                    {story.title}
                  </h3>
                  <p className="font-manrope text-white/60 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {story.description}
                  </p>
                </div>

                {/* Card Footer Meta */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between font-manrope text-xs text-white/50">
                  <div className="flex items-center gap-4">
                    <span>🎬 {story.episodesCount || 12} Episodes</span>
                    <span>🔥 {story.likesCount || 850} Likes</span>
                  </div>
                  <span className="text-[#2596be] group-hover:translate-x-1 transition-transform font-bold">
                    READ →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
