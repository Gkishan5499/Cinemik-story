'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storiesAPI } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

interface Story {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  creator?: { username: string };
  episodesCount?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
}

export default function StoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const res = await storiesAPI.listPublic();
      setStories(res.stories || []);
    } catch (err) {
      console.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink select-none">
      {/* Page header */}
      <div className="pt-32 md:pt-48 pb-20 px-6 md:px-20">
        <div className="max-w-[90rem] mx-auto">
          <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">The Monogatari Archive</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[8rem] text-ash uppercase tracking-tight mt-3 leading-none">
            CHOOSE YOUR TALE
          </h1>
          <p className="font-body text-ash/50 text-base md:text-xl max-w-2xl mt-5 leading-relaxed">
            Each story is a window into the world. Choose wisely — once you begin, the narrative will consume you.
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="px-6 md:px-20 pb-40">
        <div className="max-w-[90rem] mx-auto">
          {loading ? (
            <p className="text-ash/60 font-mono">Loading stories...</p>
          ) : stories.length === 0 ? (
            <p className="text-ash/60 font-mono">No stories published yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Link
                  key={story._id}
                  href={`/story/${story._id}`}
                  className="group"
                >
                  <div className="h-full bg-gradient-to-br from-ash/5 to-crimson/5 border border-border/40 hover:border-crimson/30 rounded-sm p-8 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-crimson/20 hover:y-2">
                    <div className="flex flex-col h-full gap-6">
                      {/* Cover Image */}
                      {story.coverImage && (
                        <div className="rounded-sm overflow-hidden border border-crimson/20 hover:border-crimson/50 transition-colors -mx-8 -mt-8 mb-4">
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

                      {/* Creator Header */}
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase">
                          BY {story.creator?.username?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        <p className="font-mono text-xs tracking-[0.2em] text-ash/40 uppercase mt-2">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="font-display text-3xl md:text-2xl lg:text-3xl text-ash uppercase tracking-tight leading-tight mb-4">
                          {story.title}
                        </h3>
                        <p className="font-body text-ash/60 text-sm leading-relaxed line-clamp-2">
                          {story.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-border/30">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="font-mono text-ash/40 uppercase tracking-[0.15em]">Episodes</span>
                            <p className="text-crimson font-display">{story.episodesCount || 0}</p>
                          </div>
                          <div>
                            <span className="font-mono text-ash/40 uppercase tracking-[0.15em]">Likes</span>
                            <p className="text-crimson font-display">{story.likesCount || 0}</p>
                          </div>
                          <div>
                            <span className="font-mono text-ash/40 uppercase tracking-[0.15em]">Comments</span>
                            <p className="text-crimson font-display">{story.commentsCount || 0}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-crimson text-sm font-mono uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-300 pt-3">
                          <span>READ NOW</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
