'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { storiesAPI, episodesAPI } from '@/lib/api';
import { getOptimizedVideoUrl } from '@/lib/media';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';

interface Story {
  _id: string;
  title: string;
  description: string;
  contentType?: 'text' | 'video';
  videoUrl?: string;
  backgroundMusic?: string;
  status?: 'published' | 'draft';
  createdAt: string;
}

interface EpisodeVideoSection {
  title?: string;
  videoUrl: string;
  sectionNumber?: number;
}

interface Episode {
  _id: string;
  episodeNumber: number;
  title: string;
  content: string;
  contentType?: 'text' | 'video';
  videoUrl?: string;
  videoSections?: EpisodeVideoSection[];
  images?: string[];
  createdAt: string;
}

interface EpisodeFormState {
  episodeNumber: number;
  title: string;
  content: string;
  contentType: 'text' | 'video';
  videoUrl: string;
}

interface SectionInput {
  title: string;
  videoUrl: string;
  file?: File | null;
}

const initialEpisodeForm: EpisodeFormState = {
  episodeNumber: 1,
  title: '',
  content: '',
  contentType: 'text',
  videoUrl: '',
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
  const [successMessage, setSuccessMessage] = useState('');

  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    contentType: 'text' as 'text' | 'video',
    videoUrl: '',
    backgroundMusic: ''
  });
  const [storyVideoFile, setStoryVideoFile] = useState<File | null>(null);
  const [newBackgroundMusic, setNewBackgroundMusic] = useState<File | null>(null);
  const [savingStory, setSavingStory] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);

  const [showCreateEpisode, setShowCreateEpisode] = useState(false);
  const [creatingEpisode, setCreatingEpisode] = useState(false);
  const [newEpisode, setNewEpisode] = useState<EpisodeFormState>(initialEpisodeForm);
  const [newVideoSections, setNewVideoSections] = useState<SectionInput[]>([
    { title: 'Part 1', videoUrl: '', file: null }
  ]);
  const [episodeImages, setEpisodeImages] = useState<File[]>([]);

  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [updatingEpisode, setUpdatingEpisode] = useState(false);
  const [editEpisodeData, setEditEpisodeData] = useState<EpisodeFormState>(initialEpisodeForm);
  const [editVideoSections, setEditVideoSections] = useState<SectionInput[]>([]);
  const [editEpisodeImages, setEditEpisodeImages] = useState<File[]>([]);

  const loadData = useCallback(async () => {
    if (!storyId) return;

    try {
      const [storyRes, episodesRes] = await Promise.all([
        storiesAPI.getDetail(storyId),
        episodesAPI.list(storyId),
      ]);

      setStory(storyRes.story);
      setStoryData({
        title: storyRes.story.title,
        description: storyRes.story.description,
        contentType: storyRes.story.contentType || 'text',
        videoUrl: storyRes.story.videoUrl || '',
        backgroundMusic: storyRes.story.backgroundMusic || '',
      });

      const nextEpisodes = episodesRes.episodes || [];
      setEpisodes(nextEpisodes);
      setNewEpisode((prev) => ({
        ...prev,
        episodeNumber: Math.max(1, nextEpisodes.length + 1),
      }));

      if (typeof window !== 'undefined' && window.location.search.includes('newEpisode=true')) {
        setShowCreateEpisode(true);
      }
    } catch (err) {
      setError(err instanceof Error ? `Failed to load story details: ${err.message}` : 'Failed to load story details');
    } finally {
      setPageLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'creator')) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (storyId && user?.role === 'creator') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadData();
    }
  }, [storyId, user?.role, loadData]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 6000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleMultipleVideosSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (isEdit) {
      setEditVideoSections((prev) => {
        const existing = prev.filter((p) => p.file || p.videoUrl.trim());
        const startIdx = existing.length;
        const newParts = files.map((file, i) => ({
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || `Part ${startIdx + i + 1}`,
          videoUrl: '',
          file,
        }));
        return [...existing, ...newParts];
      });
    } else {
      setNewVideoSections((prev) => {
        const existing = prev.filter((p) => p.file || p.videoUrl.trim());
        const startIdx = existing.length;
        const newParts = files.map((file, i) => ({
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || `Part ${startIdx + i + 1}`,
          videoUrl: '',
          file,
        }));
        return [...existing, ...newParts];
      });
    }

    e.target.value = '';
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId) return;

    try {
      setSavingStory(true);
      setError('');
      setSuccessMessage('');

      if (storyData.contentType === 'video' && storyVideoFile) {
        if (storyVideoFile.size > 100 * 1024 * 1024) {
          setError(`Video "${storyVideoFile.name}" is ${(storyVideoFile.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed file size is 100MB.`);
          setSavingStory(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('description', storyData.description);
      formData.append('contentType', storyData.contentType);

      if (storyData.contentType === 'video') {
        if (storyVideoFile) {
          formData.append('video', storyVideoFile);
        } else if (storyData.videoUrl) {
          formData.append('videoUrl', storyData.videoUrl);
        }
      }

      if (newBackgroundMusic) {
        formData.append('backgroundMusic', newBackgroundMusic);
      }

      const res = await storiesAPI.update(storyId, formData);
      setStory(res.story);
      setStoryData((prev) => ({
        ...prev,
        contentType: res.story.contentType || prev.contentType,
        videoUrl: res.story.videoUrl || prev.videoUrl,
        backgroundMusic: res.story.backgroundMusic || prev.backgroundMusic,
      }));
      setStoryVideoFile(null);
      setNewBackgroundMusic(null);
      setSuccessMessage('Story details saved successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update story');
    } finally {
      setSavingStory(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!storyId) return;
    try {
      setTogglingPublish(true);
      setError('');
      setSuccessMessage('');
      const res = await storiesAPI.togglePublish(storyId);
      setStory(res.story);
      setSuccessMessage(
        res.story.status === 'published'
          ? 'Story published successfully! It is now live.'
          : 'Story set to draft. It is now hidden from public view.'
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to toggle publish status');
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
      setSuccessMessage('');

      if (newEpisode.contentType === 'video') {
        let hasVideoContent = false;
        for (const sec of newVideoSections) {
          if (sec.file) {
            hasVideoContent = true;
            if (sec.file.size > 100 * 1024 * 1024) {
              setError(`Part video "${sec.file.name}" is ${(sec.file.size / (1024 * 1024)).toFixed(1)}MB. Cloudinary and server maximum allowed is 100MB per video file.`);
              setCreatingEpisode(false);
              return;
            }
          } else if (sec.videoUrl.trim()) {
            hasVideoContent = true;
          }
        }
        if (!hasVideoContent) {
          setError('Please upload at least one video file or provide a video URL for this Motion Comic episode.');
          setCreatingEpisode(false);
          return;
        }
      }

      for (const img of episodeImages) {
        if (img.size > 10 * 1024 * 1024) {
          setError(`Image "${img.name}" is ${(img.size / (1024 * 1024)).toFixed(1)}MB. Cloudinary and server maximum allowed image size is 10MB.`);
          setCreatingEpisode(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('episodeNumber', String(newEpisode.episodeNumber));
      formData.append('title', newEpisode.title);
      formData.append('content', newEpisode.content);
      formData.append('contentType', newEpisode.contentType);

      if (newEpisode.contentType === 'video') {
        const payloadSections: Array<{ title: string; videoUrl: string }> = [];
        newVideoSections.forEach((sec) => {
          if (sec.file) {
            payloadSections.push({ title: sec.title, videoUrl: `file_placeholder:${sec.title}` });
            formData.append('video', sec.file);
          } else if (sec.videoUrl.trim()) {
            payloadSections.push({ title: sec.title, videoUrl: sec.videoUrl.trim() });
          }
        });
        formData.append('videoSections', JSON.stringify(payloadSections));
      }

      episodeImages.forEach((file) => formData.append('images', file));

      const createdTitle = newEpisode.title;
      const createdNumber = newEpisode.episodeNumber;

      await episodesAPI.create(storyId, formData);

      setShowCreateEpisode(false);
      setEpisodeImages([]);
      setNewVideoSections([{ title: 'Part 1', videoUrl: '', file: null }]);
      setNewEpisode({ ...initialEpisodeForm, episodeNumber: episodes.length + 2 });
      await loadData();
      setSuccessMessage(`✓ Episode ${createdNumber} ("${createdTitle}") was uploaded and created successfully!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create episode');
    } finally {
      setCreatingEpisode(false);
    }
  };

  const startEditEpisode = (episode: Episode) => {
    setEditingEpisodeId(episode._id);
    setEditEpisodeData({
      episodeNumber: episode.episodeNumber,
      title: episode.title,
      content: episode.content || '',
      contentType: episode.contentType || 'text',
      videoUrl: episode.videoUrl || '',
    });

    if (episode.videoSections && episode.videoSections.length > 0) {
      setEditVideoSections(
        episode.videoSections.map((sec, idx) => ({
          title: sec.title || `Part ${idx + 1}`,
          videoUrl: sec.videoUrl || '',
          file: null,
        }))
      );
    } else {
      setEditVideoSections([
        { title: 'Part 1', videoUrl: episode.videoUrl || '', file: null }
      ]);
    }

    setEditEpisodeImages([]);
  };

  const cancelEditEpisode = () => {
    setEditingEpisodeId(null);
    setEditEpisodeData(initialEpisodeForm);
    setEditVideoSections([]);
    setEditEpisodeImages([]);
  };

  const handleUpdateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId || !editingEpisodeId) return;

    try {
      setUpdatingEpisode(true);
      setError('');
      setSuccessMessage('');

      if (editEpisodeData.contentType === 'video') {
        let hasVideoContent = false;
        for (const sec of editVideoSections) {
          if (sec.file) {
            hasVideoContent = true;
            if (sec.file.size > 100 * 1024 * 1024) {
              setError(`Part video "${sec.file.name}" is ${(sec.file.size / (1024 * 1024)).toFixed(1)}MB. Cloudinary and server maximum allowed is 100MB per video file.`);
              setUpdatingEpisode(false);
              return;
            }
          } else if (sec.videoUrl.trim()) {
            hasVideoContent = true;
          }
        }
        if (!hasVideoContent && !editEpisodeData.videoUrl) {
          setError('Please upload at least one video file or provide a video URL for this Motion Comic episode.');
          setUpdatingEpisode(false);
          return;
        }
      }

      for (const img of editEpisodeImages) {
        if (img.size > 10 * 1024 * 1024) {
          setError(`Image "${img.name}" is ${(img.size / (1024 * 1024)).toFixed(1)}MB. Cloudinary and server maximum allowed image size is 10MB.`);
          setUpdatingEpisode(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('episodeNumber', String(editEpisodeData.episodeNumber));
      formData.append('title', editEpisodeData.title);
      formData.append('content', editEpisodeData.content);
      formData.append('contentType', editEpisodeData.contentType);

      if (editEpisodeData.contentType === 'video') {
        const payloadSections: Array<{ title: string; videoUrl: string }> = [];
        editVideoSections.forEach((sec) => {
          if (sec.file) {
            payloadSections.push({ title: sec.title, videoUrl: `file_placeholder:${sec.title}` });
            formData.append('video', sec.file);
          } else if (sec.videoUrl.trim()) {
            payloadSections.push({ title: sec.title, videoUrl: sec.videoUrl.trim() });
          }
        });
        formData.append('videoSections', JSON.stringify(payloadSections));
      }

      editEpisodeImages.forEach((file) => formData.append('images', file));

      const updatedTitle = editEpisodeData.title;
      const updatedNumber = editEpisodeData.episodeNumber;

      await episodesAPI.update(storyId, editingEpisodeId, formData);
      cancelEditEpisode();
      await loadData();
      setSuccessMessage(`✓ Episode ${updatedNumber} ("${updatedTitle}") updated successfully!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update episode');
    } finally {
      setUpdatingEpisode(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!storyId) return;
    if (!confirm('Delete this episode?')) return;

    try {
      setError('');
      setSuccessMessage('');
      await episodesAPI.delete(storyId, episodeId);
      await loadData();
      setSuccessMessage('✓ Episode deleted successfully.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete episode');
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

        {error && (
          <div className='mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-start justify-between gap-3'>
            <div className='flex items-start gap-2.5'>
              <span className='text-lg leading-none mt-0.5'>⚠️</span>
              <div>
                <p className='font-semibold text-red-300 font-mono text-xs uppercase'>Notice / Error</p>
                <p className='mt-1 text-xs text-white/90 leading-relaxed'>{error}</p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => setError('')}
              className='text-white/60 hover:text-white px-2 py-0.5 rounded text-xs hover:bg-white/10 font-mono'
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className='mb-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-sm flex items-start justify-between gap-3'>
            <div className='flex items-start gap-2.5'>
              <span className='text-lg leading-none mt-0.5'>✅</span>
              <div>
                <p className='font-semibold text-emerald-300 font-mono text-xs uppercase'>Success / Confirmed</p>
                <p className='mt-1 text-xs text-white/90 leading-relaxed'>{successMessage}</p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => setSuccessMessage('')}
              className='text-white/60 hover:text-white px-2 py-0.5 rounded text-xs hover:bg-white/10 font-mono'
            >
              ✕
            </button>
          </div>
        )}

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

            {/* Story Format Selector */}
            <div>
              <label className='block mb-2 text-sm text-white/80 font-mono text-xs tracking-wider uppercase'>
                Story Default Format
              </label>
              <div className='grid grid-cols-2 gap-3 max-w-md'>
                <button
                  type='button'
                  onClick={() => setStoryData((prev) => ({ ...prev, contentType: 'text' }))}
                  className={`py-2 px-3 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                    storyData.contentType === 'text'
                      ? 'bg-red-500/20 border-red-500 text-white font-bold'
                      : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  <span>📝 Text / Comic Reader</span>
                </button>
                <button
                  type='button'
                  onClick={() => setStoryData((prev) => ({ ...prev, contentType: 'video' }))}
                  className={`py-2 px-3 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                    storyData.contentType === 'video'
                      ? 'bg-red-500/20 border-red-500 text-white font-bold'
                      : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  <span>🎬 Motion Comic Video</span>
                </button>
              </div>
            </div>

            {storyData.contentType === 'video' && (
              <div className='p-4 rounded border border-red-500/40 bg-red-500/10 space-y-3'>
                <p className='font-mono text-xs text-red-300 font-bold uppercase'>🎬 Main Story Motion Comic Video</p>
                {storyData.videoUrl && (
                  <div className='mb-2'>
                    <p className='text-xs text-white/60 mb-1'>Current Video Preview:</p>
                    <video controls playsInline preload='metadata' className='w-full max-h-48 rounded bg-black'>
                      <source src={getOptimizedVideoUrl(storyData.videoUrl)} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <div>
                  <label className='block text-xs text-white/80 mb-1'>Upload Video File (.mp4, .webm, .mov):</label>
                  <input
                    type='file'
                    accept='video/*'
                    onChange={(e) => setStoryVideoFile(e.target.files?.[0] || null)}
                    className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 text-xs outline-none file:mr-3 file:rounded file:border-0 file:bg-red-500/20 file:px-2.5 file:py-1 file:text-red-200'
                  />
                  {storyVideoFile && <p className='text-xs text-green-400 mt-1'>Selected: {storyVideoFile.name}</p>}
                </div>
                <div className='text-center font-mono text-xs text-white/40'>OR</div>
                <div>
                  <label className='block text-xs text-white/80 mb-1'>Direct Video URL:</label>
                  <input
                    type='url'
                    placeholder='https://example.com/video.mp4'
                    value={storyData.videoUrl}
                    onChange={(e) => setStoryData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 text-xs outline-none focus:border-red-400'
                  />
                </div>
              </div>
            )}

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

            {/* Episode Format Selector */}
            <div>
              <label className='block mb-2 text-sm text-white/80 font-mono text-xs tracking-wider uppercase'>
                Episode Content Format
              </label>
              <div className='grid grid-cols-2 gap-3 max-w-md'>
                <button
                  type='button'
                  onClick={() => setNewEpisode((prev) => ({ ...prev, contentType: 'text' }))}
                  className={`py-2 px-3 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                    newEpisode.contentType === 'text'
                      ? 'bg-red-500/20 border-red-500 text-white font-bold'
                      : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  <span>📝 Text / Panel Story</span>
                </button>
                <button
                  type='button'
                  onClick={() => setNewEpisode((prev) => ({ ...prev, contentType: 'video' }))}
                  className={`py-2 px-3 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                    newEpisode.contentType === 'video'
                      ? 'bg-red-500/20 border-red-500 text-white font-bold'
                      : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  <span>🎬 Motion Comic Video</span>
                </button>
              </div>
            </div>

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

            {newEpisode.contentType === 'video' ? (
              <div className='p-4 rounded border border-red-500/40 bg-red-500/10 space-y-4'>
                <div className='flex flex-wrap items-center justify-between gap-2 border-b border-red-500/20 pb-3'>
                  <div>
                    <p className='font-mono text-xs text-red-300 font-bold uppercase flex items-center gap-2'>
                      <span>🎬</span> MULTI-PART MOTION COMIC VIDEOS (PART 1, PART 2...)
                    </p>
                    <p className='text-[11px] text-white/60 font-mono mt-0.5'>
                      Select multiple videos at once from your device, or add/edit parts individually.
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {/* Batch multi-video file picker */}
                    <label className='px-3 py-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-mono uppercase font-bold rounded cursor-pointer transition-all flex items-center gap-1.5 shadow'>
                      <input
                        type='file'
                        multiple
                        accept='video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v'
                        onChange={(e) => handleMultipleVideosSelect(e, false)}
                        className='sr-only'
                      />
                      <span>📁 Select Multiple Videos</span>
                    </label>
                    <button
                      type='button'
                      onClick={() =>
                        setNewVideoSections((prev) => [
                          ...prev,
                          { title: `Part ${prev.length + 1}`, videoUrl: '', file: null },
                        ])
                      }
                      className='px-3 py-1.5 bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-mono uppercase hover:bg-red-500/30 rounded'
                    >
                      + Add Single Part
                    </button>
                  </div>
                </div>

                <div className='space-y-3'>
                  {newVideoSections.map((sec, idx) => (
                    <div key={idx} className='p-3 bg-black/40 border border-white/15 rounded space-y-2'>
                      <div className='flex items-center justify-between gap-3'>
                        <input
                          type='text'
                          value={sec.title}
                          onChange={(e) =>
                            setNewVideoSections((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item))
                            )
                          }
                          placeholder={`Part ${idx + 1} Title (e.g. Part ${idx + 1})`}
                          className='w-full px-3 py-1.5 bg-black/60 border border-white/20 text-xs text-white rounded font-mono'
                          required
                        />
                        {newVideoSections.length > 1 && (
                          <button
                            type='button'
                            onClick={() => setNewVideoSections((prev) => prev.filter((_, i) => i !== idx))}
                            className='px-2 py-1 text-xs text-red-400 hover:text-red-300 font-mono uppercase'
                          >
                            REMOVE
                          </button>
                        )}
                      </div>

                      <div className='grid gap-2 md:grid-cols-2'>
                        <div>
                          <span className='block font-mono text-[10px] text-white/60 mb-1'>Upload Part Video (.mp4, .webm):</span>
                          <input
                            type='file'
                            accept='video/*'
                            onChange={(e) =>
                              setNewVideoSections((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, file: e.target.files?.[0] || null } : item))
                              )
                            }
                            className='w-full rounded border border-white/20 bg-black/50 px-2 py-1 text-xs text-white file:mr-2 file:py-0.5 file:px-2 file:border-0 file:bg-red-500/20 file:text-red-300 font-mono'
                          />
                          {sec.file && (
                            <p className={`text-[10px] mt-1 font-mono ${sec.file.size > 100 * 1024 * 1024 ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                              Selected: {sec.file.name} ({(sec.file.size / (1024 * 1024)).toFixed(1)} MB)
                              {sec.file.size > 100 * 1024 * 1024 ? ' ⚠️ Exceeds 100MB limit!' : ''}
                            </p>
                          )}
                        </div>

                        <div>
                          <span className='block font-mono text-[10px] text-white/60 mb-1'>OR Direct Video URL:</span>
                          <input
                            type='url'
                            placeholder='https://example.com/part-video.mp4'
                            value={sec.videoUrl}
                            onChange={(e) =>
                              setNewVideoSections((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, videoUrl: e.target.value } : item))
                              )
                            }
                            className='w-full rounded border border-white/20 bg-black/50 px-2 py-1.5 text-xs text-white outline-none focus:border-red-400 font-mono'
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Normal Comic Section */
              <div className='p-4 rounded border border-blue-500/40 bg-blue-500/10 space-y-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-xl'>📖</span>
                  <div>
                    <p className='font-mono text-xs text-blue-300 font-bold uppercase'>
                      NORMAL COMIC / MANGA / WEBTOON CHAPTER PANELS
                    </p>
                    <p className='text-[11px] text-white/60 font-mono mt-0.5'>
                      Upload image panels, pages, or vertical strips (multi-select up to 10MB each).
                    </p>
                  </div>
                </div>
                <ImageUpload
                  onImagesSelected={setEpisodeImages}
                  multiple={true}
                  maxSize={10}
                  preview={true}
                  label='Select comic pages / manga panels (PNG, JPG, WEBP)'
                />
              </div>
            )}

            <div>
              <label htmlFor='new-episode-content' className='block mb-2 text-sm text-white/80 font-mono text-xs uppercase'>
                {newEpisode.contentType === 'video' ? 'Episode Summary / Description (Optional)' : 'Content / Dialogue / Script (Optional if comic images uploaded)'}
              </label>
              <textarea
                id='new-episode-content'
                value={newEpisode.content}
                onChange={(e) => setNewEpisode((prev) => ({ ...prev, content: e.target.value }))}
                placeholder={newEpisode.contentType === 'video' ? 'Brief summary of this episode...' : 'Enter story text, dialogue, or script...'}
                className='w-full min-h-28 rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400 text-sm font-mono'
              />
            </div>

            {newEpisode.contentType === 'video' && (
              <div>
                <p className='mb-2 text-sm text-white/80 font-mono text-xs tracking-wider uppercase'>
                  Episode Images / Artwork (Optional)
                </p>
                <ImageUpload onImagesSelected={setEpisodeImages} multiple={true} preview={true} label='Upload companion artwork / screenshots' />
              </div>
            )}

            {creatingEpisode && (
              <div className='p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-200 flex items-center gap-3'>
                <span className='inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin flex-shrink-0' />
                <div>
                  <p className='font-bold uppercase text-red-300'>Uploading Episode Media...</p>
                  <p className='text-white/70 mt-0.5'>Please wait while your files are uploaded and processed. Do not close or refresh this tab.</p>
                </div>
              </div>
            )}

            <div className='flex items-center gap-3'>
              <button
                type='submit'
                disabled={creatingEpisode}
                className='rounded border border-red-400/70 px-4 py-2 text-red-300 hover:bg-red-500/10 disabled:opacity-60 font-mono text-xs uppercase flex items-center gap-2'
              >
                {creatingEpisode ? (
                  <>
                    <span className='inline-block w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin' />
                    <span>Uploading Episode (Please wait)...</span>
                  </>
                ) : (
                  'Create Episode'
                )}
              </button>
              <button
                type='button'
                disabled={creatingEpisode}
                onClick={() => {
                  setShowCreateEpisode(false);
                  setEpisodeImages([]);
                  setNewVideoSections([{ title: 'Part 1', videoUrl: '', file: null }]);
                }}
                className='rounded border border-white/30 px-4 py-2 text-white/80 hover:bg-white/10 font-mono text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed'
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
              const isVideoEp = episode.contentType === 'video' || Boolean(episode.videoUrl);

              return (
                <article key={episode._id} className='rounded-lg border border-white/15 bg-white/5 p-5'>
                  {!isEditingThis ? (
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1 flex-wrap'>
                          <span className='text-sm text-red-300 font-mono'>Episode {episode.episodeNumber}</span>
                          {isVideoEp && (
                            <span className='px-2 py-0.5 text-[10px] font-mono tracking-wider bg-red-500/20 border border-red-500/60 text-red-300 rounded uppercase flex items-center gap-1'>
                              🎬 MOTION COMIC VIDEO {episode.videoSections && episode.videoSections.length > 1 ? `(${episode.videoSections.length} PARTS)` : ''}
                            </span>
                          )}
                        </div>
                        <h3 className='text-xl font-medium'>{episode.title}</h3>

                        {isVideoEp && (
                          <div className='mt-3 max-w-xl space-y-3'>
                            {episode.videoSections && episode.videoSections.length > 0 ? (
                              <div className='space-y-3'>
                                {episode.videoSections.map((sec, secIdx) => (
                                  <div key={secIdx} className='rounded border border-red-500/30 bg-black/60 overflow-hidden'>
                                    <div className='px-3 py-1.5 bg-red-500/20 border-b border-red-500/30 flex items-center justify-between font-mono text-xs text-red-200'>
                                      <span>🎬 {sec.title || `Part ${secIdx + 1}`}</span>
                                      <span className='text-[10px] text-white/50'>Part {secIdx + 1} of {episode.videoSections?.length || 1}</span>
                                    </div>
                                    {sec.videoUrl ? (
                                      <video controls playsInline preload='metadata' className='w-full max-h-56 bg-black'>
                                        <source src={getOptimizedVideoUrl(sec.videoUrl)} type='video/mp4' />
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : (
                                      <div className='p-3 text-xs text-white/40 font-mono'>No video file uploaded for this part</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : episode.videoUrl ? (
                              <div className='rounded overflow-hidden border border-red-500/30 bg-black'>
                                <div className='px-3 py-1 bg-red-500/20 text-xs font-mono text-red-200 border-b border-red-500/30'>
                                  🎬 Part 1
                                </div>
                                <video controls playsInline preload='metadata' className='w-full max-h-56'>
                                  <source src={getOptimizedVideoUrl(episode.videoUrl)} type='video/mp4' />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : null}
                          </div>
                        )}

                        {episode.content && (
                          <p className='mt-3 text-white/75 whitespace-pre-wrap line-clamp-3 text-sm'>{episode.content}</p>
                        )}
                        
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
                          className='rounded border border-blue-400/70 px-3 py-1.5 text-blue-200 hover:bg-blue-500/10 text-xs font-mono uppercase'
                        >
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDeleteEpisode(episode._id)}
                          className='rounded border border-red-400/70 px-3 py-1.5 text-red-300 hover:bg-red-500/10 text-xs font-mono uppercase'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateEpisode} className='space-y-4'>
                      <h3 className='text-lg font-medium'>Edit Episode</h3>

                      {/* Episode Format Selector */}
                      <div>
                        <label className='block mb-2 text-sm text-white/80 font-mono text-xs tracking-wider uppercase'>
                          Episode Content Format
                        </label>
                        <div className='grid grid-cols-2 gap-3 max-w-md'>
                          <button
                            type='button'
                            onClick={() => setEditEpisodeData((prev) => ({ ...prev, contentType: 'text' }))}
                            className={`py-2 px-3 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                              editEpisodeData.contentType === 'text'
                                ? 'bg-red-500/20 border-red-500 text-white font-bold'
                                : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                            }`}
                          >
                            <span>📝 Text / Panel Story</span>
                          </button>
                          <button
                            type='button'
                            onClick={() => setEditEpisodeData((prev) => ({ ...prev, contentType: 'video' }))}
                            className={`py-2 px-3 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                              editEpisodeData.contentType === 'video'
                                ? 'bg-red-500/20 border-red-500 text-white font-bold'
                                : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                            }`}
                          >
                            <span>🎬 Motion Comic Video</span>
                          </button>
                        </div>
                      </div>

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

                      {editEpisodeData.contentType === 'video' && (
                        <div className='p-4 rounded border border-red-500/40 bg-red-500/10 space-y-4'>
                          <div className='flex flex-wrap items-center justify-between gap-2 border-b border-red-500/20 pb-3'>
                            <div>
                              <p className='font-mono text-xs text-red-300 font-bold uppercase flex items-center gap-2'>
                                <span>🎬</span> EDIT MULTI-PART MOTION COMIC VIDEOS (PART 1, PART 2...)
                              </p>
                              <p className='text-[11px] text-white/60 font-mono mt-0.5'>
                                Select multiple videos at once to append new parts, or manage individual parts below.
                              </p>
                            </div>
                            <div className='flex items-center gap-2'>
                              <label className='px-3 py-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-mono uppercase font-bold rounded cursor-pointer transition-all flex items-center gap-1.5 shadow'>
                                <input
                                  type='file'
                                  multiple
                                  accept='video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v'
                                  onChange={(e) => handleMultipleVideosSelect(e, true)}
                                  className='sr-only'
                                />
                                <span>📁 Select Multiple Videos</span>
                              </label>
                              <button
                                type='button'
                                onClick={() =>
                                  setEditVideoSections((prev) => [
                                    ...prev,
                                    { title: `Part ${prev.length + 1}`, videoUrl: '', file: null },
                                  ])
                                }
                                className='px-3 py-1.5 bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-mono uppercase hover:bg-red-500/30 rounded'
                              >
                                + Add Single Part
                              </button>
                            </div>
                          </div>

                          <div className='space-y-3'>
                            {editVideoSections.map((sec, idx) => (
                              <div key={idx} className='p-3 bg-black/40 border border-white/15 rounded space-y-2'>
                                <div className='flex items-center justify-between gap-3'>
                                  <input
                                    type='text'
                                    value={sec.title}
                                    onChange={(e) =>
                                      setEditVideoSections((prev) =>
                                        prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item))
                                      )
                                    }
                                    placeholder={`Part ${idx + 1} Title`}
                                    className='w-full px-3 py-1.5 bg-black/60 border border-white/20 text-xs text-white rounded font-mono'
                                    required
                                  />
                                  {editVideoSections.length > 1 && (
                                    <button
                                      type='button'
                                      onClick={() => setEditVideoSections((prev) => prev.filter((_, i) => i !== idx))}
                                      className='px-2 py-1 text-xs text-red-400 hover:text-red-300 font-mono uppercase'
                                    >
                                      REMOVE
                                    </button>
                                  )}
                                </div>

                                <div className='grid gap-2 md:grid-cols-2'>
                                  <div>
                                    <span className='block font-mono text-[10px] text-white/60 mb-1'>Replace File (.mp4, .webm):</span>
                                    <input
                                      type='file'
                                      accept='video/*'
                                      onChange={(e) =>
                                        setEditVideoSections((prev) =>
                                          prev.map((item, i) => (i === idx ? { ...item, file: e.target.files?.[0] || null } : item))
                                        )
                                      }
                                      className='w-full rounded border border-white/20 bg-black/50 px-2 py-1 text-xs text-white file:mr-2 file:py-0.5 file:px-2 file:border-0 file:bg-red-500/20 file:text-red-300 font-mono'
                                    />
                                    {sec.file && (
                                      <p className={`text-[10px] mt-1 font-mono ${sec.file.size > 100 * 1024 * 1024 ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                                        Selected: {sec.file.name} ({(sec.file.size / (1024 * 1024)).toFixed(1)} MB)
                                        {sec.file.size > 100 * 1024 * 1024 ? ' ⚠️ Exceeds 100MB limit!' : ''}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <span className='block font-mono text-[10px] text-white/60 mb-1'>OR Video URL:</span>
                                    <input
                                      type='url'
                                      placeholder='https://example.com/part-video.mp4'
                                      value={sec.videoUrl}
                                      onChange={(e) =>
                                        setEditVideoSections((prev) =>
                                          prev.map((item, i) => (i === idx ? { ...item, videoUrl: e.target.value } : item))
                                        )
                                      }
                                      className='w-full rounded border border-white/20 bg-black/50 px-2 py-1.5 text-xs text-white outline-none focus:border-red-400 font-mono'
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor={`edit-content-${episode._id}`} className='block mb-2 text-sm text-white/80'>
                          {editEpisodeData.contentType === 'video' ? 'Description / Transcript (Optional)' : 'Content / Script'}
                        </label>
                        <textarea
                          id={`edit-content-${episode._id}`}
                          value={editEpisodeData.content}
                          onChange={(e) => setEditEpisodeData((prev) => ({ ...prev, content: e.target.value }))}
                          className='w-full min-h-36 rounded border border-white/20 bg-black/50 px-3 py-2 outline-none focus:border-red-400'
                          required={editEpisodeData.contentType !== 'video'}
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

                      {updatingEpisode && (
                        <div className='p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-200 flex items-center gap-3'>
                          <span className='inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0' />
                          <div>
                            <p className='font-bold uppercase text-blue-300'>Saving Changes & Uploading Media...</p>
                            <p className='text-white/70 mt-0.5'>Please wait while your changes are saved. Do not close this tab.</p>
                          </div>
                        </div>
                      )}

                      <div className='flex items-center gap-3'>
                        <button
                          type='submit'
                          disabled={updatingEpisode}
                          className='rounded border border-blue-400/70 px-4 py-2 text-blue-200 hover:bg-blue-500/10 disabled:opacity-60 flex items-center gap-2 font-mono text-xs uppercase'
                        >
                          {updatingEpisode ? (
                            <>
                              <span className='inline-block w-3 h-3 border-2 border-blue-300 border-t-transparent rounded-full animate-spin' />
                              <span>Saving Changes (Please wait)...</span>
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                        <button
                          type='button'
                          disabled={updatingEpisode}
                          onClick={cancelEditEpisode}
                          className='rounded border border-white/30 px-4 py-2 text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
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

      {/* Floating Toast Notification */}
      {successMessage && (
        <div className='fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-xl bg-neutral-900/95 border border-emerald-500/60 text-emerald-200 shadow-2xl backdrop-blur-md flex items-start justify-between gap-3'>
          <div className='flex items-start gap-3'>
            <div className='p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5'>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <div>
              <p className='font-bold text-emerald-300 text-xs font-mono uppercase tracking-wide'>Confirmed</p>
              <p className='mt-0.5 text-xs text-white/90 leading-relaxed'>{successMessage}</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => setSuccessMessage('')}
            className='text-white/40 hover:text-white p-1 rounded hover:bg-white/10 font-mono text-xs'
            aria-label='Close notification'
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}