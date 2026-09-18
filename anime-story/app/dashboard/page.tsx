'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { storiesAPI, episodesAPI } from '@/lib/api';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';
import CategorySelector from '@/components/ui/CategorySelector';

interface Story {
  _id: string;
  title: string;
  description: string;
  contentType?: 'text' | 'video';
  videoUrl?: string;
  coverImage?: string;
  backgroundMusic?: string;
  characterImages?: string[];
  scenicImages?: string[];
  status?: 'published' | 'draft';
  episodesCount?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStory, setNewStory] = useState({ 
    title: '', 
    description: '',
    category: 'Horror',
    contentType: 'text' as 'text' | 'video',
    videoUrl: ''
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<File | null>(null);
  const [characterImages, setCharacterImages] = useState<File[]>([]);
  const [scenicImages, setScenicImages] = useState<File[]>([]);
  const [creating, setCreating] = useState(false);

  // Redirect if not creator
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'creator')) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Load stories
  useEffect(() => {
    if (user?.role === 'creator') {
      loadStories();
    }
  }, [user]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const res = await storiesAPI.myStories();
      setStories(res.stories || []);
    } catch (err) {
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.title.trim() || !newStory.description.trim()) return;

    try {
      setCreating(true);
      const formData = new FormData();
      formData.append('title', newStory.title);
      formData.append('description', newStory.description);
      formData.append('category', newStory.category);
      formData.append('contentType', newStory.contentType);
      formData.append('status', 'published');

      if (newStory.contentType === 'video') {
        if (videoFile) {
          formData.append('video', videoFile);
        } else if (newStory.videoUrl) {
          formData.append('videoUrl', newStory.videoUrl);
        }
      }

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      if (backgroundMusic) {
        formData.append('backgroundMusic', backgroundMusic);
      }
      characterImages.forEach((file) => formData.append('characterImages', file));
      scenicImages.forEach((file) => formData.append('scenicImages', file));
      
      await storiesAPI.create(formData);
      setNewStory({ title: '', description: '', category: 'Horror', contentType: 'text', videoUrl: '' });
      setCoverImage(null);
      setVideoFile(null);
      setBackgroundMusic(null);
      setCharacterImages([]);
      setScenicImages([]);
      setShowCreateForm(false);
      await loadStories();
    } catch (err) {
      setError('Failed to create story');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Delete this story?')) return;
    try {
      await storiesAPI.delete(storyId);
      await loadStories();
    } catch (err) {
      setError('Failed to delete story');
    }
  };

  const handleTogglePublish = async (storyId: string) => {
    try {
      setError('');
      await storiesAPI.togglePublish(storyId);
      await loadStories();
    } catch (err) {
      setError('Failed to toggle publish status');
    }
  };

  if (authLoading) return <div className="min-h-screen bg-ink text-white flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-ink pt-32 px-6 md:px-12 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-5xl tracking-[0.2em] text-ash mb-3">CREATOR DASHBOARD</h1>
          <p className="font-mono text-xs tracking-widest text-ash/60 uppercase">
            Manage your stories, episodes, and engagement
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-8 p-4 bg-crimson/10 border border-crimson/30 rounded">
            <p className="font-mono text-sm text-ash">Welcome, <span className="text-crimson">{user.username}</span></p>
          </div>
        )}

        {/* Create Story Button */}
        <div className="mb-8">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-crimson/20 border border-crimson/50 text-crimson hover:bg-crimson/30 transition-colors font-mono text-sm tracking-widest uppercase"
            >
              + CREATE NEW STORY
            </button>
          ) : (
            <form onSubmit={handleCreateStory} className="max-w-2xl bg-ink/50 border border-crimson/30 p-6 space-y-4">
              {/* Content Type Selector */}
              <div>
                <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2">STORY FORMAT / CONTENT TYPE</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewStory({ ...newStory, contentType: 'text' })}
                    className={`py-3 px-4 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                      newStory.contentType === 'text'
                        ? 'bg-crimson/20 border-crimson text-white font-bold shadow-[0_0_15px_rgba(200,16,46,0.3)]'
                        : 'bg-ash/5 border-ash/20 text-ash/60 hover:border-ash/40'
                    }`}
                  >
                    <span>📝</span>
                    <span>TEXT / COMIC READER</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStory({ ...newStory, contentType: 'video' })}
                    className={`py-3 px-4 rounded border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                      newStory.contentType === 'video'
                        ? 'bg-crimson/20 border-crimson text-white font-bold shadow-[0_0_15px_rgba(200,16,46,0.3)]'
                        : 'bg-ash/5 border-ash/20 text-ash/60 hover:border-ash/40'
                    }`}
                  >
                    <span>🎬</span>
                    <span>MOTION COMIC VIDEO</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2">TITLE</label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  className="w-full px-4 py-2 bg-ink/50 border border-crimson/30 text-white focus:border-crimson outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2">DESCRIPTION</label>
                <textarea
                  value={newStory.description}
                  onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                  className="w-full px-4 py-2 bg-ink/50 border border-crimson/30 text-white focus:border-crimson outline-none"
                  rows={4}
                  required
                />
              </div>

              {/* Video upload / URL section if video is selected */}
              {newStory.contentType === 'video' && (
                <div className="p-4 bg-crimson/10 border border-crimson/30 rounded space-y-3">
                  <label className="block font-mono text-xs tracking-widest text-crimson font-bold uppercase">
                    🎬 MOTION COMIC VIDEO FILE OR URL
                  </label>
                  <div>
                    <span className="block font-mono text-[10px] text-ash/70 mb-1 uppercase">Upload Video File (.mp4, .webm, .mov):</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 bg-ink/80 border border-crimson/30 text-white file:mr-4 file:px-3 file:py-1 file:border-0 file:bg-crimson/30 file:text-crimson hover:file:bg-crimson/50 font-mono text-xs"
                    />
                    {videoFile && (
                      <p className="font-mono text-xs text-green-400 mt-1">Selected video file: {videoFile.name}</p>
                    )}
                  </div>
                  <div className="text-center font-mono text-xs text-ash/40 uppercase">OR</div>
                  <div>
                    <span className="block font-mono text-[10px] text-ash/70 mb-1 uppercase">Direct Video URL:</span>
                    <input
                      type="url"
                      placeholder="https://example.com/motion-comic.mp4"
                      value={newStory.videoUrl}
                      onChange={(e) => setNewStory({ ...newStory, videoUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-ink/80 border border-crimson/30 text-white focus:border-crimson outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <CategorySelector 
                  defaultCategory={newStory.category}
                  onCategorySelect={(category) => setNewStory({ ...newStory, category })}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2">COVER IMAGE</label>
                <ImageUpload 
                  onImagesSelected={(files) => setCoverImage(files[0] || null)}
                  multiple={false}
                  preview={true}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2">BACKGROUND MUSIC (OPTIONAL)</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setBackgroundMusic(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-ink/50 border border-crimson/30 text-white file:mr-4 file:px-3 file:py-1 file:border-0 file:bg-crimson/20 file:text-crimson hover:file:bg-crimson/30"
                />
                {backgroundMusic && (
                  <p className="font-mono text-xs text-ash/60 mt-2">Selected: {backgroundMusic.name}</p>
                )}
              </div>
              <div>
                <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2">CHARACTER PICTURES</label>
                <ImageUpload
                  onImagesSelected={setCharacterImages}
                  multiple={true}
                  preview={true}
                />
              </div>
              <div>
                <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2">SCENIC PICTURES</label>
                <ImageUpload
                  onImagesSelected={setScenicImages}
                  multiple={true}
                  preview={true}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-crimson/20 border border-crimson/50 text-crimson hover:bg-crimson/30 disabled:opacity-50 font-mono text-xs tracking-widest uppercase"
                >
                  {creating ? 'CREATING...' : 'CREATE'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-ash/10 border border-ash/30 text-ash hover:bg-ash/20 font-mono text-xs tracking-widest uppercase"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-crimson/20 border border-crimson/50 text-crimson font-mono text-sm rounded">
            {error}
          </div>
        )}

        {/* Stories List */}
        {loading ? (
          <p className="text-ash/60 font-mono">Loading stories...</p>
        ) : stories.length === 0 ? (
          <p className="text-ash/60 font-mono">No stories yet. Create your first one!</p>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div key={story._id} className="bg-ink/50 border border-crimson/20 p-6 hover:border-crimson/50 transition-colors">
                {/* Cover Image */}
                {story.coverImage && (
                  <div className="mb-4 rounded-sm overflow-hidden border border-crimson/20 hover:border-crimson/50 transition-colors">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className={story.coverImage ? '' : ''}>
                    <h3 className="font-display text-2xl text-ash mb-2">{story.title}</h3>
                    <p className="font-mono text-xs text-ash/60 uppercase line-clamp-2">{story.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-2 text-xs font-mono uppercase rounded border ${
                      story.status === 'published'
                        ? 'bg-green-500/20 border-green-500/50 text-green-500'
                        : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500'
                    }`}>
                      {story.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <Link
                      href={`/dashboard/stories/${story._id}`}
                      className="px-3 py-2 bg-crimson/20 border border-crimson/50 text-crimson hover:bg-crimson/30 text-xs font-mono uppercase"
                    >
                      EDIT
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(story._id)}
                      className="px-3 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 text-xs font-mono uppercase"
                    >
                      {story.status === 'published' ? 'UNPUBLISH' : 'PUBLISH'}
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story._id)}
                      className="px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 text-xs font-mono uppercase"
                    >
                      DELETE
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-crimson/10">
                  <div>
                    <p className="font-mono text-xs text-ash/60 uppercase">Episodes</p>
                    <p className="text-2xl text-crimson font-display">{story.episodesCount || 0}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-ash/60 uppercase">Likes</p>
                    <p className="text-2xl text-crimson font-display">{story.likesCount || 0}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-ash/60 uppercase">Comments</p>
                    <p className="text-2xl text-crimson font-display">{story.commentsCount || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
