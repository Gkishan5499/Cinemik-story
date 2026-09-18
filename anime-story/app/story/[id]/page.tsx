'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { storiesAPI, episodesAPI, commentsAPI } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { formatDate } from '@/lib/date';

interface Story {
  _id: string;
  title: string;
  description: string;
  contentType?: 'text' | 'video';
  videoUrl?: string;
  coverImage?: string;
  category?: string;
  status?: 'draft' | 'published';
  creator?: { _id: string; username: string };
  episodesCount?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  liked?: boolean;
}

interface Episode {
  _id: string;
  episodeNumber: number;
  title: string;
  content: string;
  contentType?: 'text' | 'video';
  videoUrl?: string;
  images?: string[];
  createdAt: string;
}

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user?: {
    username?: string;
    avatar?: string;
  };
  episode?: {
    title?: string;
    episodeNumber?: number;
  };
}

export default function StoryDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const storyId = params?.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (storyId) {
      loadData();
    }
  }, [storyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [storyRes, episodesRes, relatedRes, commentsRes] = await Promise.all([
        storiesAPI.getDetail(storyId),
        episodesAPI.list(storyId),
        storiesAPI.listPublic(),
        commentsAPI.list(storyId),
      ]);

      const storyData = storyRes.story;
      setStory(storyData);
      setLiked(storyData.liked || false);

      const episodeList = episodesRes.episodes || [];
      setEpisodes(episodeList);

      const related = (relatedRes.stories || [])
        .filter((item: Story) => item._id !== storyId)
        .slice(0, 3);
      setRelatedStories(related);
      setComments(commentsRes.comments || []);

      setError('');
    } catch (err) {
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return alert('Please login to like');
    try {
      await storiesAPI.toggleLike(storyId);
      setLiked(!liked);
      if (story) {
        setStory({
          ...story,
          likesCount: (story.likesCount || 0) + (liked ? -1 : 1),
        });
      }
    } catch (err) {
      setError('Failed to toggle like');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }

    const text = commentText.trim();
    if (!text) return;

    try {
      setSubmittingComment(true);
      const res = await commentsAPI.create(storyId, { text });
      if (res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setCommentText('');
        setStory((prev) =>
          prev
            ? {
                ...prev,
                commentsCount: (prev.commentsCount || 0) + 1,
              }
            : prev
        );
      }
    } catch {
      setError('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-ink text-white flex items-center justify-center">Loading...</div>;
  }

  if (!story) {
    return <div className="min-h-screen bg-ink text-white flex items-center justify-center">Story not found</div>;
  }

  const firstEpisode = episodes.length > 0 ? episodes[0] : null;
  const latestEpisode = episodes.length > 0 ? episodes[episodes.length - 1] : null;

  const shortDescription = (() => {
    const text = (story.description || '').trim();
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= 100) return text;
    return `${words.slice(0, 100).join(' ')}...`;
  })();

  return (
    <main className="min-h-screen bg-ink pb-16">
      <section className="relative pt-24 md:pt-28 pb-6 px-6 md:px-12 overflow-hidden">
        {story.coverImage && (
          <>
            <img src={story.coverImage} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-45" />
            <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/55 to-ink" />
          </>
        )}

        <div className="relative max-w-6xl mx-auto text-center">
          <Link href="/story" className="text-ash/70 hover:text-crimson font-mono text-xs tracking-widest uppercase inline-flex items-center gap-2 mb-5">
            <span>←</span>
            <span>Back To Stories</span>
          </Link>

          <p className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase mb-2">{story.category || 'Story'}</p>
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-tight mb-3">{story.title}</h1>
          <p className="font-mono text-xs tracking-[0.2em] text-ash/60 uppercase mt-4">
            {story.creator?.username || 'Unknown'}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="px-3 py-1 text-[11px] bg-white/10 border border-white/25 text-ash/90 uppercase tracking-wide">
              {story.status || 'Published'}
            </span>
            <span className="px-3 py-1 text-[11px] bg-white/10 border border-white/25 text-ash/90 uppercase tracking-wide">
              {episodes.length} Episodes
            </span>
            <span className="px-3 py-1 text-[11px] bg-white/10 border border-white/25 text-ash/90 uppercase tracking-wide">
              {story.likesCount || 0} Likes
            </span>
            <span className="px-3 py-1 text-[11px] bg-white/10 border border-white/25 text-ash/90 uppercase tracking-wide">
              {story.commentsCount || 0} Comments
            </span>
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 -mt-2 md:-mt-3">
        <div className="max-w-6xl mx-auto bg-ink/85 text-ash border border-crimson/25 shadow-[0_16px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-crimson/20">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-bold text-xl md:text-2xl tracking-tight">Read more episodes</h2>
                <span className="text-xs uppercase tracking-widest text-ash/40">{episodes.length} Episodes</span>
              </div>

              {episodes.length === 0 ? (
                <p className="text-ash/55">No episodes yet.</p>
              ) : (
                <div className="space-y-2">
                  {episodes
                    .slice()
                    .sort((a, b) => b.episodeNumber - a.episodeNumber)
                    .map((ep) => {
                      const thumb = ep.images?.[0] || story.coverImage || '';
                      const active = latestEpisode?._id === ep._id;
                      const isVideo = ep.contentType === 'video' || Boolean(ep.videoUrl);

                      return (
                        <Link
                          key={ep._id}
                          href={`/episodes/${ep._id}`}
                          className={`w-full grid grid-cols-[56px_1fr_auto] md:grid-cols-[72px_1fr_auto_auto] items-center gap-3 p-2 md:p-3 border transition-colors text-left ${
                            active ? 'bg-crimson/20 text-ash border-crimson/55' : 'bg-white/3 border-crimson/20 hover:border-crimson/45'
                          }`}
                        >
                          <div className="h-14 md:h-16 w-14 md:w-16 overflow-hidden bg-white/10 relative">
                            {thumb ? (
                              <img src={thumb} alt={ep.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-ash/40">IMG</div>
                            )}
                            {isVideo && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-sm">🎬</span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm md:text-base font-medium truncate">Episode {ep.episodeNumber}</p>
                              {isVideo && (
                                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-crimson/30 text-crimson border border-crimson/50 rounded uppercase shrink-0">
                                  🎬 {(ep as any).videoSections && (ep as any).videoSections.length > 1 ? `${(ep as any).videoSections.length} PARTS` : 'VIDEO'}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs md:text-sm truncate ${active ? 'text-ash/85' : 'text-ash/55'}`}>{ep.title}</p>
                          </div>

                          <p className={`hidden md:block text-xs ${active ? 'text-ash/70' : 'text-ash/45'}`}>
                            {formatDate(ep.createdAt)}
                          </p>
                          <p className={`text-sm font-semibold ${active ? 'text-ash/90' : 'text-ash/55'}`}>#{ep.episodeNumber}</p>
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>

            <aside className="p-6 md:p-8 bg-ink/70">
              <div className="flex items-center gap-4 text-sm mb-5">
                <p className="text-crimson font-semibold">✓</p>
                <p>{story.likesCount || 0} likes</p>
                <p>{story.commentsCount || 0} comments</p>
              </div>

              <p className="text-xs uppercase tracking-widest text-crimson mb-2">{story.status || 'Published'}</p>
              <h3 className="text-3xl font-semibold tracking-tight mb-4">{story.title}</h3>
              <p className="text-ash/75 leading-relaxed mb-8">{shortDescription}</p>

              <div className="space-y-3">
                {latestEpisode && (
                  <Link
                    href={`/episodes/${latestEpisode._id}`}
                    className="w-full h-14 rounded-full bg-[#2f3135] text-white hover:bg-[#26282c] transition-colors font-semibold text-[1.05rem] flex items-center justify-center relative px-8"
                  >
                    <span>Continue reading</span>
                    <span className="absolute right-6 text-3xl leading-none">›</span>
                  </Link>
                )}

                {firstEpisode && (
                  <Link
                    href={`/episodes/${firstEpisode._id}`}
                    className="w-full h-14 rounded-full bg-[#2f3135] text-white hover:bg-[#26282c] transition-colors font-semibold text-[1.05rem] flex items-center justify-center relative px-8"
                  >
                    <span>First episode</span>
                    <span className="absolute right-6 text-3xl leading-none">›</span>
                  </Link>
                )}

                <button
                  onClick={handleLike}
                  className={`w-full h-12 flex items-center justify-center px-4 border transition-colors font-semibold text-[1.05rem] ${
                    liked ? 'bg-crimson/20 border-crimson text-crimson' : 'bg-white/4 border-crimson/35 text-ash hover:bg-white/8'
                  }`}
                >
                  {liked ? '♥ Liked' : '♡ Like Story'} ({story.likesCount || 0})
                </button>
              </div>
            </aside>
          </div>
        </div>

        {error && (
          <div className="max-w-6xl mx-auto mt-6 p-4 bg-crimson/20 border border-crimson/50 text-crimson font-mono text-sm rounded">
            {error}
          </div>
        )}

        {relatedStories.length > 0 && (
          <section className="max-w-6xl mx-auto mt-12 bg-ink/85 text-ash border border-crimson/25 p-6 md:p-8">
            <h3 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">You may also like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedStories.map((item) => {
                const thumb = item.coverImage || '';
                return (
                  <Link
                    key={item._id}
                    href={`/story/${item._id}`}
                    className="bg-white/4 border border-crimson/20 hover:border-crimson/45 transition-colors overflow-hidden"
                  >
                    <div className="grid grid-cols-[96px_1fr] items-center gap-3">
                      <div className="w-24 h-24 bg-white/10 overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-ash/40">IMG</div>
                        )}
                      </div>
                      <div className="pr-3 py-3">
                        <p className="text-2xl font-medium leading-tight line-clamp-2">{item.title}</p>
                        <p className="text-sm text-ash/60 mt-1 line-clamp-1">{item.creator?.username || 'Unknown'}</p>
                        <p className="text-sm text-crimson mt-2">{item.likesCount || 0} likes</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="max-w-6xl mx-auto mt-12 bg-ink/85 text-ash border border-crimson/25 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Comments</h3>
            <p className="text-sm text-ash/60">{comments.length} total</p>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder={user ? 'Write your comment...' : 'Login to write a comment'}
              disabled={!user || submittingComment}
              className="w-full bg-white/5 border border-crimson/30 focus:border-crimson text-ash placeholder:text-ash/45 p-4 outline-none resize-y min-h-[110px]"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-ash/50">{commentText.length}/1000</p>
              <button
                type="submit"
                disabled={!user || submittingComment || !commentText.trim()}
                className="h-11 px-6 bg-crimson text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-crimson/85 transition-colors"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <p className="text-ash/60">No comments yet. Be the first to comment.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <article key={comment._id} className="bg-white/4 border border-crimson/20 p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-medium text-ash">{comment.user?.username || 'User'}</p>
                    <p className="text-xs text-ash/50">{formatDate(comment.createdAt)}</p>
                  </div>
                  {comment.episode?.episodeNumber && (
                    <p className="text-xs text-crimson mb-2">
                      Episode {comment.episode.episodeNumber}: {comment.episode.title || 'Untitled'}
                    </p>
                  )}
                  <p className="text-ash/85 whitespace-pre-wrap leading-relaxed">{comment.text}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
