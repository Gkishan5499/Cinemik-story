'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storiesAPI } from '@/lib/api';

interface Story {
  _id: string;
  title: string;
  category?: string;
  creator?: { username: string };
  likesCount?: number;
  episodesCount?: number;
}

export default function TrendingStories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await storiesAPI.listPublic();
        const list = res.stories || [];
        setStories(list.slice(0, 5));
      } catch (e) {
        console.error('Failed to load trending stories', e);
      }
    };
    fetchTrending();
  }, []);

  const fallbackTrending = [
    { _id: 't-1', title: 'THE EMBERS OF ODYSSEY', category: 'Action', creator: { username: 'VALKYRIE' }, likesCount: 4320, episodesCount: 18 },
    { _id: 't-2', title: 'VALKYRIE RISING', category: 'Fantasy', creator: { username: 'THOR_STUDIO' }, likesCount: 3890, episodesCount: 24 },
    { _id: 't-3', title: 'SHADOWS OVER KYOTO 2088', category: 'Cyberpunk', creator: { username: 'KENJI_X' }, likesCount: 3100, episodesCount: 15 },
    { _id: 't-4', title: 'THE CRIMSON LOTUS PROTOCOL', category: 'Thriller', creator: { username: 'AKIRA' }, likesCount: 2750, episodesCount: 12 },
    { _id: 't-5', title: 'CELESTIAL REEL: AWAKENING', category: 'Sci-Fi', creator: { username: 'ASTRID' }, likesCount: 2400, episodesCount: 30 },
  ];

  const displayStories = stories.length > 0 ? stories : fallbackTrending;

  return (
    <section className="py-24 px-6 md:px-16 bg-[#121216] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="mb-12">
          <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#FFC857] uppercase">
            LIVE POPULARITY RANKINGS
          </span>
          <h2 className="font-bricolage text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
            TRENDING ON <span className="text-gradient-02">CINEMIKS</span>
          </h2>
        </div>

        {/* Trending List */}
        <div className="space-y-4">
          {displayStories.map((story, index) => (
            <Link
              key={story._id}
              href={`/story/${story._id}`}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#0A0A0A] border border-white/10 hover:border-[#2596be]/60 rounded-sm transition-all duration-300 gap-4"
            >
              <div className="flex items-center gap-6">
                <span className="font-bricolage text-4xl font-extrabold text-[#2596be]/40 group-hover:text-[#2596be] transition-colors w-10 text-center">
                  0{index + 1}
                </span>
                <div>
                  <span className="font-manrope text-[10px] font-bold tracking-widest text-[#FFC857] uppercase">
                    {story.category || 'TRENDING'} · BY {story.creator?.username || 'CREATOR'}
                  </span>
                  <h3 className="font-bricolage text-xl md:text-2xl font-bold text-white group-hover:text-[#FFC857] transition-colors uppercase">
                    {story.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 font-manrope text-xs text-white/60">
                <div className="flex items-center gap-4">
                  <span>🎬 {story.episodesCount || 10} Episodes</span>
                  <span className="text-[#2596be] font-bold">🔥 {story.likesCount || 1200} Likes</span>
                </div>
                <span className="text-white group-hover:translate-x-2 transition-transform font-bold">
                  READ REEL →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
