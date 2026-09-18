'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { episodesAPI, storiesAPI } from '@/lib/api';
import { formatDate } from '@/lib/date';

interface StoryItem {
  _id: string;
  title: string;
  coverImage?: string;
  creator?: { username: string };
}

interface EpisodeItem {
  _id: string;
  title: string;
  content: string;
  contentType?: 'text' | 'video';
  videoUrl?: string;
  episodeNumber: number;
  images?: string[];
  createdAt: string;
  storyId: string;
  storyTitle: string;
  storyCover?: string;
  creatorName?: string;
}

export default function EpisodesPage() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        setLoading(true);
        setError('');

        const storiesRes = await storiesAPI.listPublic();
        const storyList: StoryItem[] = storiesRes.stories || [];
        setStories(storyList);

        const episodesByStory = await Promise.all(
          storyList.map(async (story) => {
            const episodeRes = await episodesAPI.list(story._id);
            const list = episodeRes.episodes || [];
            return list.map((ep: any) => ({
              ...ep,
              storyId: story._id,
              storyTitle: story.title,
              storyCover: story.coverImage,
              creatorName: story.creator?.username,
            }));
          })
        );

        const merged = episodesByStory
          .flat()
          .sort((a: EpisodeItem, b: EpisodeItem) => {
            const dateDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (dateDiff !== 0) return dateDiff;
            return a.episodeNumber - b.episodeNumber;
          });

        setEpisodes(merged);
      } catch {
        setError('Failed to load episodes.');
      } finally {
        setLoading(false);
      }
    };

    void loadEpisodes();
  }, []);

  const totalEpisodes = episodes.length;

  const totalStories = useMemo(() => {
    const ids = new Set(episodes.map((ep) => ep.storyId));
    return ids.size || stories.length;
  }, [episodes, stories.length]);

  return (
    <main className='min-h-screen bg-ink select-none'>
      <div className='pt-32 md:pt-40 pb-0 px-6 md:px-20'>
        <div className='max-w-[90rem] mx-auto border-b border-border/30 pb-10'>
          <span className='font-mono text-[10px] tracking-[0.35em] text-crimson uppercase'>
            {totalStories} Stories · {totalEpisodes} Episodes
          </span>
          <h1 className='font-display text-5xl md:text-7xl lg:text-[8rem] text-ash uppercase tracking-tight mt-3 leading-none'>
            ALL EPISODES
          </h1>
          <p className='font-body text-ash/50 text-base md:text-xl max-w-2xl mt-5 leading-relaxed'>
            Browse every episode from live stories in the archive.
          </p>
        </div>
      </div>

      <div className='px-6 md:px-20 pt-16 pb-32'>
        <div className='max-w-[90rem] mx-auto'>
          {loading ? (
            <p className='text-ash/60 font-mono'>Loading episodes...</p>
          ) : error ? (
            <p className='text-red-300 font-mono'>{error}</p>
          ) : episodes.length === 0 ? (
            <p className='text-ash/60 font-mono'>No episodes found yet.</p>
          ) : (
            <div className='flex flex-col divide-y divide-border/15'>
              {episodes.map((ep) => {
                const previewImage = ep.images?.[0] || ep.storyCover || '';
                const isVideo = ep.contentType === 'video' || Boolean(ep.videoUrl);

                return (
                  <Link
                    key={ep._id}
                    href={`/episodes/${ep._id}`}
                    className='group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 py-6 hover:bg-white/[0.02] transition-colors px-2 -mx-2 rounded-sm'
                  >
                    <div className='w-full md:w-48 aspect-video relative overflow-hidden rounded-sm border border-border/30 group-hover:border-crimson/40 transition-colors duration-300 shrink-0 bg-ink/60'>
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt={ep.title}
                          className='w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-ash/40 font-mono text-xs'>
                          NO IMAGE
                        </div>
                      )}
                      {isVideo && (
                        <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                          <span className='text-xl'>🎬</span>
                        </div>
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-3 mb-2 flex-wrap'>
                        <span className='font-mono text-[9px] tracking-widest text-crimson uppercase'>
                          {ep.storyTitle}
                        </span>
                        <span className='font-mono text-[9px] tracking-widest text-ash/20'>·</span>
                        <span className='font-mono text-[9px] tracking-widest text-ash/30 uppercase'>
                          Episode {ep.episodeNumber}
                        </span>
                        {isVideo && (
                          <>
                            <span className='font-mono text-[9px] tracking-widest text-ash/20'>·</span>
                            <span className='px-1.5 py-0.5 text-[9px] font-mono tracking-widest text-crimson bg-crimson/20 border border-crimson/40 rounded uppercase'>
                              🎬 MOTION COMIC {(ep as any).videoSections && (ep as any).videoSections.length > 1 ? `(${(ep as any).videoSections.length} PARTS)` : ''}
                            </span>
                          </>
                        )}
                        {ep.creatorName && (
                          <>
                            <span className='font-mono text-[9px] tracking-widest text-ash/20'>·</span>
                            <span className='font-mono text-[9px] tracking-widest text-ash/30 uppercase'>
                              BY {ep.creatorName}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className='font-display text-xl md:text-3xl text-ash group-hover:text-white transition-colors duration-300 uppercase tracking-tight leading-tight'>
                        {ep.title}
                      </h3>
                      <p className='font-body text-ash/45 text-sm mt-1.5 leading-relaxed line-clamp-2'>
                        {ep.content}
                      </p>
                    </div>

                    <div className='hidden md:flex flex-col items-end gap-2 shrink-0'>
                      <span className='font-mono text-[9px] tracking-[0.2em] text-ash/25 uppercase'>
                        {formatDate(ep.createdAt)}
                      </span>
                      <div className='flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-crimson opacity-0 group-hover:opacity-100 transition-all duration-300'>
                        {isVideo ? 'WATCH' : 'READ'}
                        <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                          <path d='M5 12h14M12 5l7 7-7 7' />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
