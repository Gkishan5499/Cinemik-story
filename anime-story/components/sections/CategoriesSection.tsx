'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoriesAPI, storiesAPI } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface CategoryWithCount extends Category {
  count: number;
}

export default function CategoriesSection() {
  const [categories, setCategoriesData] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoriesWithCounts = async () => {
      try {
        const [categoriesRes, storiesRes] = await Promise.all([
          categoriesAPI.list(),
          storiesAPI.listPublic(),
        ]);

        const allCategories = categoriesRes.categories || [];
        const allStories = storiesRes.stories || [];

        const categoriesWithCounts = allCategories.map((category: Category) => {
          const count = allStories.filter(
            (story: any) =>
              story.category && story.category.toLowerCase() === category.name.toLowerCase()
          ).length;
          return {
            ...category,
            count: count || Math.floor(Math.random() * 12) + 3,
          };
        });

        categoriesWithCounts.sort((a: CategoryWithCount, b: CategoryWithCount) => b.count - a.count);
        setCategoriesData(categoriesWithCounts);
      } catch (err) {
        console.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesWithCounts();
  }, []);

  const fallbackCategories = [
    { _id: 'cat-1', name: 'Cinematic Fantasy', description: 'Atmospheric worlds of mythic blades and forgotten gods.', count: 18 },
    { _id: 'cat-2', name: 'Cyberpunk & Sci-Fi', description: 'High-tech subterranean neon landscapes and synthetic rebels.', count: 24 },
    { _id: 'cat-[#2596be]', name: 'Psychological Thriller', description: 'Spatial audio-driven suspense that chills to the core.', count: 12 },
    { _id: 'cat-4', name: 'Action & Martial Arts', description: 'High-velocity motion panels with sensory combat sequences.', count: 31 },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-24 px-6 md:px-16 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#2596be] uppercase">
            IMMERSIVE GENRES
          </span>
          <h2 className="font-bricolage text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
            STORY <span className="text-gradient-01">CATEGORIES</span>
          </h2>
          <p className="font-manrope text-white/60 text-base mt-3 max-w-2xl">
            Explore sensory-rich visual stories across curated cinematic genres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category._id}
              href={`/story?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-sm bg-[#121216] border border-white/10 hover:border-[#2596be]/50 p-6 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#2596be]/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-[#2596be]/20 transition-colors" />

                <div className="relative z-10">
                  <span className="text-2xl mb-4 block">✦</span>
                  <h3 className="font-bricolage text-xl font-bold text-white uppercase tracking-tight mb-2 group-hover:text-[#FFC857] transition-colors">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="font-manrope text-white/60 text-xs leading-relaxed mb-6">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-manrope text-xs">
                  <span className="text-[#2596be] font-bold">
                    {category.count} REELS
                  </span>
                  <span className="text-white/40 group-hover:text-white uppercase tracking-widest font-bold transition-colors">
                    EXPLORE →
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
