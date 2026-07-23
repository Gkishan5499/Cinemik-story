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

        // Count stories per category
        const categoriesWithCounts = allCategories.map((category: Category) => {
          const count = allStories.filter(
            (story: any) =>
              story.category && story.category.toLowerCase() === category.name.toLowerCase()
          ).length;
          return {
            ...category,
            count,
          };
        });

        // Sort by count descending
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

  return (
    <section className="py-20 px-6 md:px-20 bg-ink/50">
      <div className="max-w-[90rem] mx-auto">
        <div className="mb-12">
          <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">Browse By Genre</span>
          <h2 className="font-display text-5xl md:text-6xl text-ash uppercase tracking-tight mt-3 leading-none">
            STORY CATEGORIES
          </h2>
          <p className="font-body text-ash/50 text-base mt-4 max-w-2xl">
            Explore stories across different genres and themes. Find your next obsession.
          </p>
        </div>

        {loading ? (
          <div className="text-ash/60 font-mono">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-ash/60 font-mono">No categories available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/story?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-crimson/10 to-ash/5 border border-crimson/30 hover:border-crimson p-6 transition-all duration-300 hover:shadow-lg hover:shadow-crimson/20 cursor-pointer h-full">
                  {/* Background accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-crimson/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-crimson/10 transition-colors" />

                  <div className="relative z-10">
                    {/* Category Name */}
                    <h3 className="font-display text-2xl text-ash uppercase tracking-tight mb-2">
                      {category.name}
                    </h3>

                    {/* Description */}
                    {category.description && (
                      <p className="font-body text-ash/60 text-xs mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Story Count */}
                    <div className="mt-auto">
                      <div className="text-crimson font-display text-lg">
                        {category.count} {category.count === 1 ? 'Story' : 'Stories'}
                      </div>
                      <p className="font-mono text-[10px] tracking-[0.35em] text-ash/40 uppercase mt-2 group-hover:text-crimson transition-colors">
                        Explore →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Featured Tip */}
        <div className="mt-12 p-6 bg-gradient-to-r from-crimson/10 to-ash/5 border border-crimson/30 rounded-sm">
          <p className="font-mono text-xs tracking-widest text-ash/70 uppercase">
            💡 TIP: Click on any category to see all stories in that genre
          </p>
        </div>
      </div>
    </section>
  );
}
