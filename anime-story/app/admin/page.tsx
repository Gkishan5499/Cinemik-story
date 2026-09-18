'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { formatDate } from '@/lib/date';
import { useRouter } from 'next/navigation';
import { adminUsersAPI, storiesAPI, commentsAPI } from '@/lib/api';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'reader' | 'creator' | 'admin';
  isActive?: boolean;
  createdAt: string;
}

interface Story {
  _id: string;
  title: string;
  description: string;
  status?: 'draft' | 'published';
  category?: string;
  creator?: { username: string };
  episodesCount?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
}

interface Comment {
  _id: string;
  text: string;
  user?: { username?: string };
  story?: { title?: string };
  isApproved?: boolean;
  createdAt: string;
}

type AdminTab = 'users' | 'stories' | 'comments';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'creator' as 'reader' | 'creator' | 'admin',
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'users') {
        const res = await adminUsersAPI.list();
        setUsers(res.users || []);
      } else if (activeTab === 'stories') {
        const res = await storiesAPI.adminListAll();
        setStories(res.stories || []);
      } else if (activeTab === 'comments') {
        const res = await commentsAPI.adminListAll();
        setComments(res.comments || []);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete user? All their stories will be deleted.')) return;
    try {
      await adminUsersAPI.delete(userId);
      await loadData();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setError('Username, email and password are required');
      return;
    }

    try {
      setCreatingUser(true);
      await adminUsersAPI.create({
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
      });
      setNewUser({ username: '', email: '', password: '', role: 'creator' });
      await loadData();
    } catch {
      setError('Failed to create user');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleEditUser = async (u: User) => {
    const username = window.prompt('Username', u.username);
    if (username === null) return;

    const email = window.prompt('Email', u.email);
    if (email === null) return;

    const role = window.prompt('Role (reader / creator / admin)', u.role);
    if (role === null) return;

    const normalizedRole = role.trim().toLowerCase();
    if (!['reader', 'creator', 'admin'].includes(normalizedRole)) {
      setError('Invalid role');
      return;
    }

    try {
      await adminUsersAPI.update(u._id, {
        username: username.trim(),
        email: email.trim(),
        role: normalizedRole as 'reader' | 'creator' | 'admin',
      });
      await loadData();
    } catch {
      setError('Failed to update user');
    }
  };

  const handleEditStory = async (story: Story) => {
    const title = window.prompt('Story title', story.title);
    if (title === null) return;

    const description = window.prompt('Story description', story.description);
    if (description === null) return;

    const category = window.prompt('Category', story.category || 'General');
    if (category === null) return;

    const statusInput = window.prompt('Status (draft / published)', story.status || 'published');
    if (statusInput === null) return;

    const status = statusInput.trim().toLowerCase();
    if (!['draft', 'published'].includes(status)) {
      setError('Invalid story status');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category.trim());
      formData.append('status', status);

      await storiesAPI.update(story._id, formData);
      await loadData();
    } catch {
      setError('Failed to update story');
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Delete story?')) return;
    try {
      await storiesAPI.delete(storyId);
      await loadData();
    } catch (err) {
      setError('Failed to delete story');
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      await commentsAPI.adminToggleApprove(commentId);
      await loadData();
    } catch (err) {
      setError('Failed to approve comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete comment?')) return;
    try {
      await commentsAPI.adminDelete(commentId);
      await loadData();
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-ink text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-ink">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="border-r border-crimson/20 bg-ink/90 px-6 py-8 lg:sticky lg:top-0 lg:h-screen">
          <p className="font-mono text-[10px] tracking-[0.35em] text-crimson uppercase mb-4">Monogatari</p>
          <h1 className="font-display text-4xl tracking-[0.12em] text-ash mb-2">Admin Panel</h1>
          <p className="font-mono text-[11px] tracking-widest text-ash/50 uppercase mb-8">Private Control Center</p>

          <div className="space-y-2">
            {(['users', 'stories', 'comments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 font-mono text-xs tracking-[0.2em] uppercase border transition-all ${
                  activeTab === tab
                    ? 'border-crimson bg-crimson/15 text-crimson'
                    : 'border-crimson/20 text-ash/65 hover:border-crimson/45 hover:text-ash'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-10 border-t border-crimson/15 pt-4">
            <p className="font-mono text-xs text-ash/45">Logged in as</p>
            <p className="font-mono text-sm text-ash mt-1">{user?.username || 'admin'}</p>
            <button
              onClick={() => {
                logout();
                router.replace('/auth/login');
              }}
              className="mt-4 w-full px-4 py-3 font-mono text-xs tracking-[0.2em] uppercase border border-crimson/35 text-crimson hover:bg-crimson/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="px-4 md:px-8 py-8 md:py-10">
          <div className="max-w-7xl mx-auto">
            <header className="mb-6 md:mb-8">
              <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] text-ash mb-2 uppercase">{activeTab}</h2>
              <p className="font-mono text-[11px] tracking-widest text-ash/50 uppercase">
                Manage users, stories, and comments with full administrative access
              </p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-crimson/20 border border-crimson/50 text-crimson font-mono text-sm rounded">
                {error}
              </div>
            )}

        {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="font-display text-2xl text-ash mb-5">USERS ({users.length})</h3>
            <form onSubmit={handleCreateUser} className="mb-6 bg-ink/50 border border-crimson/25 p-4 md:p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-ash/70 mb-4">Add Creator / Admin / Reader</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  value={newUser.username}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Username"
                  className="px-3 py-2 bg-ink border border-crimson/30 text-ash focus:outline-none focus:border-crimson"
                />
                <input
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  type="email"
                  className="px-3 py-2 bg-ink border border-crimson/30 text-ash focus:outline-none focus:border-crimson"
                />
                <input
                  value={newUser.password}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Password"
                  type="password"
                  className="px-3 py-2 bg-ink border border-crimson/30 text-ash focus:outline-none focus:border-crimson"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as 'reader' | 'creator' | 'admin' }))}
                  className="px-3 py-2 bg-ink border border-crimson/30 text-ash focus:outline-none focus:border-crimson"
                >
                  <option value="creator">creator</option>
                  <option value="reader">reader</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-4 py-2 bg-crimson/20 border border-crimson/50 text-crimson hover:bg-crimson/30 disabled:opacity-50 font-mono text-xs uppercase"
                >
                  {creatingUser ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
                {loading ? (
                  <p className="text-ash/60 font-mono">Loading...</p>
                ) : users.length === 0 ? (
                  <p className="text-ash/60 font-mono">No users</p>
                ) : (
                  <div className="overflow-x-auto border border-crimson/20 bg-ink/45">
                <table className="w-full font-mono text-sm">
                  <thead>
                    <tr className="border-b border-crimson/30 text-ash/80 uppercase">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Joined</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-crimson/10 hover:bg-crimson/5">
                        <td className="px-4 py-3">{u.username}</td>
                        <td className="px-4 py-3 text-xs">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded ${u.role === 'admin' ? 'bg-crimson/30 text-crimson' : 'bg-ash/10 text-ash'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${u.isActive === false ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {u.isActive === false ? 'inactive' : 'active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-ash/60">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => handleEditUser(u)}
                            className="px-3 py-1 bg-ash/10 border border-ash/30 text-ash hover:bg-ash/20 text-xs uppercase"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 text-xs uppercase"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                )}
              </div>
            )}

        {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div>
                <h3 className="font-display text-2xl text-ash mb-5">STORIES ({stories.length})</h3>
            {loading ? (
              <p className="text-ash/60 font-mono">Loading...</p>
            ) : stories.length === 0 ? (
              <p className="text-ash/60 font-mono">No stories</p>
            ) : (
              <div className="space-y-4">
                {stories.map((story) => (
                  <div key={story._id} className="bg-ink/50 border border-crimson/20 p-4 hover:border-crimson/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-ash">{story.title}</h3>
                        <p className="font-mono text-xs text-ash/60 mb-2">By {story.creator?.username || 'Unknown'}</p>
                        <p className="font-mono text-[11px] text-crimson mb-2 uppercase tracking-widest">{story.status || 'published'} • {story.category || 'General'}</p>
                        <p className="font-mono text-sm text-ash/60 line-clamp-2">{story.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditStory(story)}
                          className="px-3 py-2 bg-ash/10 border border-ash/30 text-ash hover:bg-ash/20 text-xs font-mono uppercase"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story._id)}
                          className="px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 text-xs font-mono uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 pt-3 border-t border-crimson/10 text-xs">
                      <div>
                        <p className="text-ash/60 uppercase">Episodes</p>
                        <p className="text-crimson font-display text-lg">{story.episodesCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-ash/60 uppercase">Likes</p>
                        <p className="text-crimson font-display text-lg">{story.likesCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-ash/60 uppercase">Comments</p>
                        <p className="text-crimson font-display text-lg">{story.commentsCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-ash/60 uppercase">Created</p>
                        <p className="text-ash text-sm">{formatDate(story.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </div>
            )}

        {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div>
                <h3 className="font-display text-2xl text-ash mb-5">COMMENTS ({comments.length})</h3>
            {loading ? (
              <p className="text-ash/60 font-mono">Loading...</p>
            ) : comments.length === 0 ? (
              <p className="text-ash/60 font-mono">No comments</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-ink/50 border border-crimson/20 p-4 hover:border-crimson/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-display text-sm text-crimson">{comment.user?.username || 'Anonymous'}</p>
                          <span className={`pl-2 pr-2 py-1 text-xs rounded ${
                            comment.isApproved
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {comment.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-ash/60 mb-2">On: {comment.story?.title || 'Unknown'}</p>
                        <p className="font-mono text-sm text-ash ">{comment.text}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!comment.isApproved && (
                          <button
                            onClick={() => handleApproveComment(comment._id)}
                            className="px-3 py-2 bg-green-500/20 border border-green-500/50 text-green-500 hover:bg-green-500/30 text-xs font-mono uppercase"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 text-xs font-mono uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
