'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { episodesAPI, storiesAPI } from '@/lib/api';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StoryItem {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  backgroundMusic?: string;
  characterImages?: string[];
  scenicImages?: string[];
  creator?: { username: string };
}

interface EpisodeItem {
  _id: string;
  title: string;
  content: string;
  episodeNumber: number;
  images?: string[];
  createdAt: string;
  storyId: string;
  storyTitle: string;
  storyDescription: string;
  storyCover?: string;
  storyBackgroundMusic?: string;
  storyCharacterImages?: string[];
  storyScenicImages?: string[];
  creatorName?: string;
}

interface ReaderBlock {
  type: 'narration' | 'dialogue' | 'divider';
  text: string;
  speaker?: string;
}

export default function EpisodePage() {
  const params = useParams();
  const episodeId = (params?.id as string) || '';
  const containerRef = useRef<HTMLDivElement>(null);

  const [episodesInStory, setEpisodesInStory] = useState<EpisodeItem[]>([]);
  const [episode, setEpisode] = useState<EpisodeItem | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadEpisode = async () => {
      if (!episodeId) return;

      try {
        setLoading(true);
        setError('');

        const storiesRes = await storiesAPI.listPublic();
        const stories: StoryItem[] = storiesRes.stories || [];

        let foundEpisode: EpisodeItem | null = null;
        let siblingEpisodes: EpisodeItem[] = [];

        for (const story of stories) {
          const epRes = await episodesAPI.list(story._id);
          const eps = (epRes.episodes || []) as any[];

          const normalized = eps
            .map((ep) => ({
              ...ep,
              storyId: story._id,
              storyTitle: story.title,
              storyDescription: story.description,
              storyCover: story.coverImage,
              storyBackgroundMusic: story.backgroundMusic,
              storyCharacterImages: story.characterImages || [],
              storyScenicImages: story.scenicImages || [],
              creatorName: story.creator?.username,
            }))
            .sort((a, b) => a.episodeNumber - b.episodeNumber);

          const match = normalized.find((ep) => ep._id === episodeId) || null;
          if (match) {
            foundEpisode = match;
            siblingEpisodes = normalized;
            break;
          }
        }

        if (!foundEpisode) {
          setError('Episode not found.');
          setEpisode(null);
          setEpisodesInStory([]);
          return;
        }

        setEpisode(foundEpisode);
        setEpisodesInStory(siblingEpisodes);
      } catch {
        setError('Failed to load episode.');
      } finally {
        setLoading(false);
      }
    };

    void loadEpisode();
  }, [episodeId]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !episode?.storyBackgroundMusic) return;

    audio.volume = 0.6;

    const playPromise = audio.play();
    if (playPromise) {
      void playPromise
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
      setIsMusicPlaying(false);
    };
  }, [episode?._id, episode?.storyBackgroundMusic]);

  const navigation = useMemo(() => {
    if (!episode) return { previous: null as EpisodeItem | null, next: null as EpisodeItem | null };
    const index = episodesInStory.findIndex((ep) => ep._id === episode._id);
    return {
      previous: index > 0 ? episodesInStory[index - 1] : null,
      next: index >= 0 && index < episodesInStory.length - 1 ? episodesInStory[index + 1] : null,
    };
  }, [episode, episodesInStory]);

  const readerBlocks = useMemo(() => {
    if (!episode?.content) return [] as ReaderBlock[];

    const lines = episode.content.split('\n');
    const blocks: ReaderBlock[] = [];

    lines.forEach((rawLine, index) => {
      const line = rawLine.trim();

      if (!line) {
        if (blocks.length > 0 && blocks[blocks.length - 1].type !== 'divider') {
          blocks.push({ type: 'divider', text: `divider-${index}` });
        }
        return;
      }

      const speakerMatch = line.match(/^([A-Za-z][A-Za-z0-9\s'\-]{1,30}):\s+(.+)$/);
      if (speakerMatch) {
        blocks.push({
          type: 'dialogue',
          speaker: speakerMatch[1],
          text: speakerMatch[2],
        });
        return;
      }

      const looksLikeDialogue =
        (line.startsWith('"') && line.endsWith('"')) ||
        (line.startsWith('\u201c') && line.endsWith('\u201d')) ||
        line.startsWith('- ');

      if (looksLikeDialogue) {
        blocks.push({
          type: 'dialogue',
          text: line.replace(/^-\s*/, ''),
        });
        return;
      }

      blocks.push({ type: 'narration', text: line });
    });

    return blocks;
  }, [episode?.content]);

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>('.reader-block');
      const images = gsap.utils.toArray<HTMLElement>('.reader-image');

      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 36, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      images.forEach((image) => {
        gsap.fromTo(
          image,
          { opacity: 0, y: 24, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: image,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    },
    { scope: containerRef, dependencies: [episode?._id] }
  );

  if (loading) {
    return <div className='min-h-screen bg-ink text-white flex items-center justify-center'>Loading...</div>;
  }

  if (error || !episode) {
    return (
      <div className='min-h-screen bg-ink text-white flex items-center justify-center px-6'>
        <div className='text-center'>
          <p className='font-mono text-red-300 mb-4'>{error || 'Episode not found.'}</p>
          <Link href='/episodes' className='text-crimson hover:underline font-mono text-xs tracking-widest uppercase'>
            Back to Episodes
          </Link>
        </div>
      </div>
    );
  }

  const topBannerImage = episode.images?.[0] || episode.storyCover;

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      } catch {
        setError('Your browser blocked autoplay. Use the audio controls to play music.');
      }
      return;
    }

    audioRef.current.pause();
    setIsMusicPlaying(false);
  };

  return (
    <main ref={containerRef} className='min-h-screen bg-ink text-ash pt-24 pb-20'>
      <div className='absolute inset-0 -z-10 opacity-30 pointer-events-none'>
        <div className='h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(200,16,46,0.14),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(240,237,232,0.05),transparent_35%)]' />
      </div>

      {topBannerImage && (
        <section className='reader-image relative w-full h-[58vh] min-h-85 max-h-190 overflow-hidden border-b border-border/25'>
          <img src={topBannerImage} alt={episode.title} className='w-full h-full object-cover object-center' />
          <div className='absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-black/30' />
        </section>
      )}

      <div className='max-w-4xl mx-auto px-6 md:px-10'>
        <Link
          href='/episodes'
          className='inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-ash/40 hover:text-crimson transition-colors mb-8'
        >
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M19 12H5M12 5l-7 7 7 7' />
          </svg>
          ALL EPISODES
        </Link>

        <div className='mb-10 text-center'>
          <p className='font-mono text-[10px] tracking-[0.35em] text-crimson uppercase mb-3'>
            {episode.storyTitle}
          </p>
          <h1 className='font-display text-3xl md:text-4xl lg:text-5xl text-ash uppercase tracking-tight leading-tight'>
            {episode.title}
          </h1>
          <p className='font-mono text-xs tracking-[0.2em] text-ash/50 uppercase mt-4'>
            Episode {episode.episodeNumber}
            {episode.creatorName ? ` · BY ${episode.creatorName}` : ''}
          </p>
          {episode.storyDescription && (
            <p className='mt-5 max-w-2xl mx-auto text-ash/60 text-sm md:text-base leading-relaxed'>
              {episode.storyDescription}
            </p>
          )}
        </div>

        {episode.storyBackgroundMusic && (
          <section className='mb-10 rounded border border-crimson/35 bg-crimson/10 p-4 md:p-5'>
            <div className='flex flex-col md:flex-row gap-3 md:items-center md:justify-between'>
              <div>
                <p className='font-mono text-[10px] tracking-[0.32em] text-crimson uppercase mb-2'>Background Music</p>
                <p className='text-sm text-ash/70'>Autoplays when episode opens. Use toggle to turn it on or off.</p>
              </div>
              <button
                onClick={toggleMusic}
                className='px-4 py-2 border border-crimson/55 text-crimson hover:bg-crimson/15 transition-colors font-mono text-xs tracking-widest uppercase'
              >
                {isMusicPlaying ? 'Music ON' : 'Music OFF'}
              </button>
            </div>
            <audio
              ref={audioRef}
              autoPlay
              loop
              preload='metadata'
              src={episode.storyBackgroundMusic}
              className='hidden'
              onPlay={() => setIsMusicPlaying(true)}
              onPause={() => setIsMusicPlaying(false)}
            >
              Your browser does not support audio playback.
            </audio>
          </section>
        )}

        {episode.images && episode.images.length > 0 && (
          <div className='mb-12'>
            <p className='font-mono text-[10px] tracking-[0.3em] text-ash/40 uppercase mb-4 text-center'>Episode Images</p>
            <div className={episode.images.length === 1 ? 'grid grid-cols-1 max-w-3xl mx-auto gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
              {episode.images.map((img, idx) => (
                <div key={idx} className='reader-image rounded-sm overflow-hidden border border-border/30 bg-black/20'>
                  <img
                    src={img}
                    alt={`${episode.title} ${idx + 1}`}
                    className='w-full h-72 md:h-96 object-cover object-center hover:scale-[1.02] transition-transform duration-500'
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {episode.storyCharacterImages && episode.storyCharacterImages.length > 0 && (
          <div className='mb-12'>
            <p className='font-mono text-[10px] tracking-[0.3em] text-crimson uppercase mb-4 text-center'>Character Pictures</p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {episode.storyCharacterImages.map((img, idx) => (
                <div key={`char-${idx}`} className='reader-image rounded-sm overflow-hidden border border-crimson/25 bg-black/20'>
                  <img
                    src={img}
                    alt={`Character ${idx + 1}`}
                    className='w-full h-56 object-cover object-center hover:scale-[1.02] transition-transform duration-500'
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {episode.storyScenicImages && episode.storyScenicImages.length > 0 && (
          <div className='mb-12'>
            <p className='font-mono text-[10px] tracking-[0.3em] text-crimson uppercase mb-4 text-center'>Scenic Pictures</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {episode.storyScenicImages.map((img, idx) => (
                <div key={`scene-${idx}`} className='reader-image rounded-sm overflow-hidden border border-crimson/25 bg-black/20'>
                  <img
                    src={img}
                    alt={`Scenery ${idx + 1}`}
                    className='w-full h-72 object-cover object-center hover:scale-[1.02] transition-transform duration-500'
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='mb-14'>
          <div className='mb-6 flex items-center gap-4'>
            <div className='h-px flex-1 bg-border/20' />
            <span className='font-mono text-[10px] tracking-[0.35em] text-crimson uppercase'>Reading Mode</span>
            <div className='h-px flex-1 bg-border/20' />
          </div>

          {readerBlocks.length > 0 ? (
            <div className='space-y-5'>
              {readerBlocks.map((block, idx) => {
                if (block.type === 'divider') {
                  return (
                    <div key={`divider-${idx}`} className='reader-block py-2 flex justify-center'>
                      <div className='w-12 h-px bg-border/20' />
                    </div>
                  );
                }

                if (block.type === 'dialogue') {
                  return (
                    <div key={`dialogue-${idx}`} className='reader-block md:px-8'>
                      <div className='border-l-2 border-crimson/40 bg-crimson/5 px-4 py-3 md:px-5 md:py-4'>
                        {block.speaker && (
                          <p className='font-mono text-[10px] tracking-[0.28em] text-crimson uppercase mb-2 text-center'>
                            {block.speaker}
                          </p>
                        )}
                        <p className='font-body text-ash/95 text-lg leading-relaxed italic text-center'>
                          {block.text}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <p key={`narration-${idx}`} className='reader-block font-body text-ash/80 leading-loose text-[1.06rem] md:text-[1.14rem] text-center'>
                    {block.text}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className='reader-block font-body text-ash/80 leading-loose text-[1.06rem] md:text-[1.14rem] text-center'>
              {episode.content}
            </p>
          )}
        </div>

        <div className='flex flex-col md:flex-row justify-center gap-4 border-t border-border/20 pt-8'>
          {navigation.previous ? (
            <Link
              href={`/episodes/${navigation.previous._id}`}
              className='px-6 py-3 bg-crimson/10 border border-crimson/40 text-crimson hover:bg-crimson/20 transition-colors font-mono text-xs tracking-widest uppercase text-center'
            >
              ← Previous Episode
            </Link>
          ) : (
            <div className='hidden md:block w-45' />
          )}

          {navigation.next ? (
            <Link
              href={`/episodes/${navigation.next._id}`}
              className='px-6 py-3 bg-crimson/20 border border-crimson/50 text-crimson hover:bg-crimson/30 transition-colors font-mono text-xs tracking-widest uppercase text-center'
            >
              Next Episode →
            </Link>
          ) : (
            <div className='px-6 py-3 text-ash/40 font-mono text-xs tracking-widest uppercase text-center'>
              End of Story
            </div>
          )}
        </div>

        <div className='mt-10 text-center'>
          <Link
            href={`/story/${episode.storyId}`}
            className='text-crimson hover:underline font-mono text-xs tracking-widest uppercase'
          >
            View Full Story →
          </Link>
        </div>
      </div>
    </main>
  );
}
