'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { storiesAPI, episodesAPI } from '@/lib/api';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';

interface Story {
  _id: string;
  title: string;
  description: string;
  backgroundMusic?: string;
  status?: 'published' | 'draft';
  createdAt: string;
}

interface Episode {
  _id: string;
  episodeNumber: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
}

interface EpisodeFormState {
  episodeNumber: number;
  title: string;
  content: string;
}

const initialEpisodeForm: EpisodeFormState = {
  episodeNumber: 1,
  title: '',
  content: '',
};

export default function StoryEditorPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();

  const storyId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);

  const [story, setStory] = useState<Story | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  const [storyData, setStoryData] = useState({ title: '', description: '', backgroundMusic: '' });
  const [newBackgroundMusic, setNewBackgroundMusic] = useState<File | null>(null);
  const [savingStory, setSavingStory] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);

  const [showCreateEpisode, setShowCreateEpisode] = useState(false);
  const [creatingEpisode, setCreatingEpisode] = useState(false);
  const [newEpisode, setNewEpisode] = useState<EpisodeFormState>(initialEpisodeForm);
  const [episodeImages, setEpisodeImages] = useState<File[]>([]);

  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [updatingEpisode, setUpdatingEpisode] = useState(false);
  const [editEpisodeData, setEditEpisodeData] = useState<EpisodeFormState>(initialEpisodeForm);
  const [editEpisodeImages, setEditEpisodeImages] = useState<File[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'creator')) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (storyId && user?.role === 'creator') {
      void loadData();
    }
  }, [storyId, user?.role]);

  const loadData = async () => {
    if (!storyId) return;

    try {
      setPageLoading(true);
      setError('');

      const [storyRes, episodesRes] = await Promise.all([
        storiesAPI.getDetail(storyId),
        episodesAPI.list(storyId),
      ]);

      setStory(storyRes.story);
      setStoryData({
        title: storyRes.story.title,
        description: storyRes.story.description,
        backgroundMusic: storyRes.story.backgroundMusic || '',
      });

      const nextEpisodes = episodesRes.episodes || [];
      setEpisodes(nextEpisodes);
      setNewEpisode((prev) => ({
        ...prev,
        episodeNumber: Math.max(1, nextEpisodes.length + 1),
      }));
    } catch (err) {
      setError(err instanceof Error ? `Failed to load story details: ${err.message}` : 'Failed to load story details');
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId) return;

    try {
      setSavingStory(true);
      setError('');

      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('description', storyData.description);
      if (newBackgroundMusic) {
        formData.append('backgroundMusic', newBackgroundMusic);
      }

      const res = await storiesAPI.update(storyId, formData);
      setStory(res.story);
      setStoryData((prev) => ({
        ...prev,
        backgroundMusic: res.story.backgroundMusic || prev.backgroundMusic,
      }));
      setNewBackgroundMusic(null);
    } catch {
      setError('Failed to update story');
    } finally {
      setSavingStory(false);
    }
  };
  const handleTogglePublish = async () => {
    if (!storyId) return;
    try {
      setTogglingPublish(true);
      setError('');
      const res = await storiesAPI.togglePublish(storyId);
      setStory(res.story);
    } catch (err) {
      setError('Failed to toggle publish status');
    } finally {
      setTogglingPublish(false);
    }
  };
  const handleCreateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId) return;

    try {
      setCreatingEpisode(true);
      setError('');

      const formData = new FormData();
      formData.append('episodeNumber', String(newEpisode.episodeNumber));
      formData.append('title', newEpisode.title);
      formData.append('content', newEpisode.content);
      episodeImages.forEach((file) => formData.append('images', file));

      await episodesAPI.create(storyId, formData);

      setShowCreateEpisode(false);
      setEpisodeImages([]);
      setNewEpisode({ ...initialEpisodeForm, episodeNumber: episodes.length + 2 });
      await loadData();
    } catch {
      setError('Failed to create episode');
    } finally {
      setCreatingEpisode(false);
    }
  };

  const startEditEpisode = (episode: Episode) => {
    setEditingEpisodeId(episode._id);
    setEditEpisodeData({
      episodeNumber: episode.episodeNumber,
      title: episode.title,
      content: episode.content,
    });
    setEditEpisodeImages([]);
  };

  const cancelEditEpisode = () => {
    setEditingEpisodeId(null);
    setEditEpisodeData(initialEpisodeForm);
    setEditEpisodeImages([]);
  };

  const handleUpdateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId || !editingEpisodeId) return;

    try {
      setUpdatingEpisode(true);
      setError('');

      const formData = new FormData();
      formData.append('episodeNumber', String(editEpisodeData.episodeNumber));
      formData.append('title', editEpisodeData.title);
      formData.append('content', editEpisodeData.content);
      editEpisodeImages.forEach((file) => formData.append('images', file));

      await episodesAPI.update(storyId, editingEpisodeId, formData);
      cancelEditEpisode();
      await loadData();
    } catch {
      setError('Failed to update episode');
    } finally {
      setUpdatingEpisode(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!storyId) return;
    if (!confirm('Delete this episode?')) return;

    try {
      setError('');
      await episodesAPI.delete(storyId, episodeId);
      await loadData();
    } catch {
      setError('Failed to delete episode');
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className='min-h-screen pt-32 px-6 bg-black text-white flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (!story) {
    return (
      <div className='min-h-screen pt-32 px-6 bg-black text-white flex items-center justify-center'>
        Story not found
      </div>
    );
  }

  return (
    <main className='min-h-screen pt-32 px-6 md:px-12 pb-12 bg-black text-white'>
      <div className='max-w-4xl mx-auto'>
        <Link
          href='/dashboard'
          className='inline-block mb-6 text-sm uppercase tracking-wider text-red-400 hover:text-red-300'
        >
          ← Back to Dashboard
        </Link>

        <section className='mb-10 rounded-lg border border-white/15 bg-white/5 p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl md:text-4xl font-semibold'>Edit Story</h1>
            <div className='flex gap-3 items-center'>
              <span className={`px-3 py-1 text-xs font-mono uppercase rounded border ${
                story.status === 'published'
                  ? 'bg-green-500/20 border-green-500/50 text-green-500'
                  : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500'
              }`}>
                {story.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
              </span>
              <button
                onClick={handleTogglePublish}
                disabled={togglingPublish}
                className='px-3 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 disabled:opacity-60 text-xs font-mono uppercase rounded'
              >
                {togglingPublish ? 'UPDATING...' : (story.status === 'published' ? 'UNPUBLISH' : 'PUBLISH')}
              </button>
            </div>
          </div>

          <form onSubmit={handleUpdateStory} className='space-y-4'>
            <div>
              <label htmlFor='story-title' className='block mb-2 text-sm text-white/80'>
                Title
              </label>
              <input
                id='story-title'
                type='text'
                value={storyData.title}
                onChange={(e) => setStoryData((prev) => ({ ...prev, title: e.target.value }))}
                className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                required
              />
            </div>

            <div>
              <label htmlFor='story-description' className='block mb-2 text-sm text-white/80'>
                Description
              </label>
              <textarea
                id='story-description'
                value={storyData.description}
                onChange={(e) => setStoryData((prev) => ({ ...prev, description: e.target.value }))}
                className='w-full min-h-32 rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                required
              />
            </div>

            <div>
              <label htmlFor='story-music' className='block mb-2 text-sm text-white/80'>
                Background Music (optional)
              </label>
              {storyData.backgroundMusic && (
                <audio controls className='mb-3 w-full' src={storyData.backgroundMusic}>
                  Your browser does not support audio playback.
                </audio>
              )}
              <input
                id='story-music'
                type='file'
                accept='audio/*'
                onChange={(e) => setNewBackgroundMusic(e.target.files?.[0] || null)}
                className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 outline-none file:mr-4 file:rounded file:border-0 file:bg-red-500/20 file:px-3 file:py-1 file:text-red-200 focus:border-red-400'
              />
              {newBackgroundMusic && (
                <p className='mt-2 text-xs text-white/60'>Selected: {newBackgroundMusic.name}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={savingStory}
              className='rounded border border-red-400/70 px-4 py-2 text-red-300 hover:bg-red-500/10 disabled:opacity-60'
            >
              {savingStory ? 'Saving...' : 'Update Story'}
            </button>
          </form>
        </section>

        {error && (
          <div className='mb-6 rounded border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-300'>
            {error}
          </div>
        )}

        <section className='mb-6 flex items-center justify-between gap-4'>
          <h2 className='text-2xl font-semibold'>Episodes</h2>
          {!showCreateEpisode && (
            <button
              onClick={() => {
                setShowCreateEpisode(true);
                setNewEpisode((prev) => ({
                  ...prev,
                  episodeNumber: Math.max(episodes.length + 1, prev.episodeNumber),
                }));
              }}
              className='rounded border border-red-400/70 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10'
            >
              + New Episode
            </button>
          )}
        </section>

        {showCreateEpisode && (
          <form onSubmit={handleCreateEpisode} className='mb-8 rounded-lg border border-white/15 bg-white/5 p-6 space-y-4'>
            <h3 className='text-xl font-medium'>Create Episode</h3>

            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <label htmlFor='new-episode-number' className='block mb-2 text-sm text-white/80'>
                  Episode Number
                </label>
                <input
                  id='new-episode-number'
                  type='number'
                  min={1}
                  value={newEpisode.episodeNumber}
                  onChange={(e) =>
                    setNewEpisode((prev) => ({
                      ...prev,
                      episodeNumber: Number(e.target.value) || 1,
                    }))
                  }
                  className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                  required
                />
              </div>

              <div>
                <label htmlFor='new-episode-title' className='block mb-2 text-sm text-white/80'>
                  Title
                </label>
                <input
                  id='new-episode-title'
                  type='text'
                  value={newEpisode.title}
                  onChange={(e) => setNewEpisode((prev) => ({ ...prev, title: e.target.value }))}
                  className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor='new-episode-content' className='block mb-2 text-sm text-white/80'>
                Content
              </label>
              <textarea
                id='new-episode-content'
                value={newEpisode.content}
                onChange={(e) => setNewEpisode((prev) => ({ ...prev, content: e.target.value }))}
                className='w-full min-h-40 rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                required
              />
            </div>

            <div>
              <p className='mb-2 text-sm text-white/80'>Episode Images</p>
              <ImageUpload onImagesSelected={setEpisodeImages} multiple={true} preview={true} />
            </div>

            <div className='flex gap-3'>
              <button
                type='submit'
                disabled={creatingEpisode}
                className='rounded border border-red-400/70 px-4 py-2 text-red-300 hover:bg-red-500/10 disabled:opacity-60'
              >
                {creatingEpisode ? 'Creating...' : 'Create Episode'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setShowCreateEpisode(false);
                  setEpisodeImages([]);
                }}
                className='rounded border border-white/30 px-4 py-2 text-white/80 hover:bg-white/10'
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {episodes.length === 0 ? (
          <div className='rounded border border-white/15 bg-white/5 p-5 text-white/70'>No episodes yet.</div>
        ) : (
          <div className='space-y-4'>
            {episodes.map((episode) => {
              const isEditingThis = editingEpisodeId === episode._id;

              return (
                <article key={episode._id} className='rounded-lg border border-white/15 bg-white/5 p-5'>
                  {!isEditingThis ? (
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <p className='text-sm text-red-300'>Episode {episode.episodeNumber}</p>
                        <h3 className='text-xl font-medium mt-1'>{episode.title}</h3>
                        <p className='mt-3 text-white/75 whitespace-pre-wrap line-clamp-4'>{episode.content}</p>
                        
                        {/* Episode Images Preview */}
                        {episode.images && episode.images.length > 0 && (
                          <div className='mt-4'>
                            <p className='text-xs text-white/60 mb-2'>IMAGES ({episode.images.length})</p>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                              {episode.images.slice(0, 3).map((img, idx) => (
                                <div key={idx} className='rounded overflow-hidden border border-white/20 hover:border-red-400/50 transition-colors'>
                                  <img
                                    src={img}
                                    alt={`Episode ${episode.episodeNumber} Image ${idx + 1}`}
                                    className='w-full h-32 object-cover'
                                  />
                                </div>
                              ))}
                              {episode.images.length > 3 && (
                                <div className='rounded border border-white/20 bg-white/5 flex items-center justify-center h-32'>
                                  <span className='text-xs text-white/60'>+{episode.images.length - 3} more</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='flex gap-2 shrink-0'>
                        <button
                          type='button'
                          onClick={() => startEditEpisode(episode)}
                          className='rounded border border-blue-400/70 px-3 py-1.5 text-blue-200 hover:bg-blue-500/10'
                        >
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDeleteEpisode(episode._id)}
                          className='rounded border border-red-400/70 px-3 py-1.5 text-red-300 hover:bg-red-500/10'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateEpisode} className='space-y-4'>
                      <h3 className='text-lg font-medium'>Edit Episode</h3>

                      <div className='grid gap-4 md:grid-cols-2'>
                        <div>
                          <label htmlFor={`edit-number-${episode._id}`} className='block mb-2 text-sm text-white/80'>
                            Episode Number
                          </label>
                          <input
                            id={`edit-number-${episode._id}`}
                            type='number'
                            min={1}
                            value={editEpisodeData.episodeNumber}
                            onChange={(e) =>
                              setEditEpisodeData((prev) => ({
                                ...prev,
                                episodeNumber: Number(e.target.value) || 1,
                              }))
                            }
                            className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor={`edit-title-${episode._id}`} className='block mb-2 text-sm text-white/80'>
                            Title
                          </label>
                          <input
                            id={`edit-title-${episode._id}`}
                            type='text'
                            value={editEpisodeData.title}
                            onChange={(e) => setEditEpisodeData((prev) => ({ ...prev, title: e.target.value }))}
                            className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={`edit-content-${episode._id}`} className='block mb-2 text-sm text-white/80'>
                          Content
                        </label>
                        <textarea
                          id={`edit-content-${episode._id}`}
                          value={editEpisodeData.content}
                          onChange={(e) => setEditEpisodeData((prev) => ({ ...prev, content: e.target.value }))}
                          className='w-full min-h-36 rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                          required
                        />
                      </div>

                      {/* Current Episode Images */}
                      {episode.images && episode.images.length > 0 && (
                        <div>
                          <p className='mb-2 text-sm text-white/80'>Current Images ({episode.images.length})</p>
                          <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mb-4'>
                            {episode.images.map((img, idx) => (
                              <div key={idx} className='rounded overflow-hidden border border-white/20'>
                                <img
                                  src={img}
                                  alt={`Episode ${episode.episodeNumber} Image ${idx + 1}`}
                                  className='w-full h-40 object-cover'
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className='mb-2 text-sm text-white/80'>Replace Episode Images (optional)</p>
                        <ImageUpload onImagesSelected={setEditEpisodeImages} multiple={true} preview={true} />
                      </div>

                      <div className='flex gap-3'>
                        <button
                          type='submit'
                          disabled={updatingEpisode}
                          className='rounded border border-blue-400/70 px-4 py-2 text-blue-200 hover:bg-blue-500/10 disabled:opacity-60'
                        >
                          {updatingEpisode ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type='button'
                          onClick={cancelEditEpisode}
                          className='rounded border border-white/30 px-4 py-2 text-white/80 hover:bg-white/10'
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}