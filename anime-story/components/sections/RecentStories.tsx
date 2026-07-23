'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storiesAPI } from '@/lib/api';

interface Story {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  creator?: { username: string };
  likesCount?: number;
  commentsCount?: number;
  episodesCount?: number;
  createdAt: string;
}

export default function RecentStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const res = await storiesAPI.listPublic();
        // Get first 6 recent stories
        const recentStories = (res.stories || []).slice(0, 6);
        setStories(recentStories);
      } catch (err) {
        console.error('Failed to load recent stories');
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  return (
    <section className="py-20 px-6 md:px-20 bg-ink">
      <div className="max-w-[90rem] mx-auto">
        <div className="mb-12">
          <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">Latest Releases</span>
          <h2 className="font-display text-5xl md:text-6xl text-ash uppercase tracking-tight mt-3 leading-none">
            RECENT STORIES
          </h2>
          <p className="font-body text-ash/50 text-base mt-4 max-w-2xl">
            Discover the latest stories published on the archive. Fresh narratives await.
          </p>
        </div>

        {loading ? (
          <div className="text-ash/60 font-mono">Loading...</div>
        ) : stories.length === 0 ? (
          <div className="text-ash/60 font-mono">No stories available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link
                key={story._id}
                href={`/story/${story._id}`}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-ash/5 to-crimson/5 border border-border/40 hover:border-crimson/30 rounded-sm p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-crimson/20">
                  <div className="flex flex-col h-full gap-4">
                    {/* Cover Image */}
                    {story.coverImage && (
                      <div className="rounded-sm overflow-hidden border border-crimson/20 hover:border-crimson/50 transition-colors -mx-6 -mt-6 mb-2">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}

                    {/* Creator */}
                    <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">
                      BY {story.creator?.username?.toUpperCase() || 'UNKNOWN'}
                    </span>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-display text-xl text-ash uppercase tracking-tight leading-tight mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="font-body text-ash/60 text-xs leading-relaxed line-clamp-2">
                        {story.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mt-auto pt-4 border-t border-border/30 text-xs">
                      <div>
                        <span className="font-mono text-ash/40 uppercase tracking-[0.15em]">Episodes</span>
                        <p className="text-crimson font-display text-sm">{story.episodesCount || 0}</p>
                      </div>
                      <div>
                        <span className="font-mono text-ash/40 uppercase tracking-[0.15em]">Likes</span>
                        <p className="text-crimson font-display text-sm">{story.likesCount || 0}</p>
                      </div>
                    </div>

                    {/* Read Button */}
                    <button className="mt-4 px-4 py-2 bg-crimson/10 border border-crimson/50 text-crimson hover:bg-crimson/20 transition-colors font-mono text-xs tracking-widest uppercase rounded group-hover:border-crimson">
                      READ NOW
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/story"
            className="inline-flex items-center gap-2 px-8 py-3 bg-crimson/10 border border-crimson/50 text-crimson hover:bg-crimson/20 transition-colors font-mono text-xs tracking-widest uppercase rounded"
          >
            <span>VIEW ALL STORIES</span>
            <span className="transition-transform group-hover:translate-x-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
