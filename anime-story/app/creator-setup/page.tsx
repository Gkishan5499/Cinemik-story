'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { authAPI } from '@/lib/api';
import { DEFAULT_CATEGORIES } from '@/lib/categories';

export default function CreatorSetup() {
  const router = useRouter();
  const { user, loading: authLoading, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    country: '',
    bio: '',
    interests: [] as string[],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated or not a reader
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/auth/login');
    } else if (user.role !== 'reader' && user.role !== 'creator') {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryToggle = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(categoryName)
        ? prev.interests.filter(c => c !== categoryName)
        : [...prev.interests, categoryName],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.address.trim() || !formData.city.trim() || !formData.country.trim()) {
        setError('Address, city, and country are required');
        setLoading(false);
        return;
      }

      if (formData.interests.length === 0) {
        setError('Please select at least one category of interest');
        setLoading(false);
        return;
      }

      const response = await authAPI.updateCreatorProfile({
        address: formData.address,
        city: formData.city,
        country: formData.country,
        bio: formData.bio,
        interests: formData.interests,
      });

      if (response.user) {
        setUser(response.user);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to complete creator setup');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <main className="min-h-screen bg-ink" />;
  }

  return (
    <main className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.15em] text-ash mb-4">
            CREATOR PROFILE
          </h1>
          <p className="font-mono text-sm tracking-widest text-ash/60">
            Complete your creator profile to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded px-4 py-3">
              <p className="text-red-400 font-mono text-sm">{error}</p>
            </div>
          )}

          {/* Read-Only Fields */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ash/70">Account Info</h2>
            
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ash/60 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user.username || ''}
                disabled
                className="w-full bg-ash/5 border border-crimson/30 rounded px-4 py-3 font-mono text-sm text-ash/60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ash/60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full bg-ash/5 border border-crimson/30 rounded px-4 py-3 font-mono text-sm text-ash/60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ash/70">Location</h2>
            
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-crimson mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
                className="w-full bg-ink border border-crimson/30 rounded px-4 py-3 font-mono text-sm text-ash placeholder-ash/30 focus:outline-none focus:border-crimson/70 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-crimson mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                  className="w-full bg-ink border border-crimson/30 rounded px-4 py-3 font-mono text-sm text-ash placeholder-ash/30 focus:outline-none focus:border-crimson/70 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-crimson mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  required
                  className="w-full bg-ink border border-crimson/30 rounded px-4 py-3 font-mono text-sm text-ash placeholder-ash/30 focus:outline-none focus:border-crimson/70 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bio Field */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ash/70">About You</h2>
            
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-crimson mb-2">
                Why Do You Want to Become a Creator?
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your creative vision and what inspire you..."
                rows={4}
                className="w-full bg-ink border border-crimson/30 rounded px-4 py-3 font-mono text-sm text-ash placeholder-ash/30 focus:outline-none focus:border-crimson/70 transition-colors resize-none"
              />
              <p className="font-mono text-[10px] text-ash/40 mt-1">{formData.bio.length}/500</p>
            </div>
          </div>

          {/* Category Interests */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ash/70">Interested Categories</h2>
            <p className="font-mono text-[10px] text-ash/50">Select at least one category of interest *</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEFAULT_CATEGORIES.map((category: { name: string; description: string; isDefault: boolean }) => (
                <label
                  key={category.name}
                  className="flex items-start gap-3 p-4 border border-crimson/20 rounded cursor-pointer hover:border-crimson/50 hover:bg-crimson/5 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                    className="mt-1 w-4 h-4 accent-crimson"
                  />
                  <div className="flex-1">
                    <p className="font-mono text-sm text-ash font-semibold">{category.name}</p>
                    <p className="font-mono text-[10px] text-ash/50">{category.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 font-mono text-[10px] tracking-[0.2em] uppercase border border-ash/30 text-ash/60 hover:text-ash hover:border-ash/60 px-6 py-3 rounded transition-all duration-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-mono text-[10px] tracking-[0.2em] uppercase bg-crimson text-ink hover:bg-crimson/90 disabled:bg-crimson/30 px-6 py-3 rounded transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? 'SETTING UP...' : 'COMPLETE SETUP'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
