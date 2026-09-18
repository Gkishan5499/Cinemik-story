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

  // Redirect if not authenticated, or if user is ALREADY a creator / admin
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/auth/login');
    } else if (user.role === 'creator') {
      router.replace('/dashboard');
    } else if (user.role === 'admin') {
      router.replace('/admin');
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

  if (authLoading || !user || user.role === 'creator' || user.role === 'admin') {
    return <main className="min-h-screen bg-[#0A0A0A]" />;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] pt-28 pb-20 font-manrope">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#2596be] uppercase">
            BECOME A CINEMIKS CREATOR
          </span>
          <h1 className="font-bricolage text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mt-2">
            CREATOR PROFILE
          </h1>
          <p className="font-manrope text-sm font-medium text-white/60 mt-2">
            Complete your creator profile to launch your story studio
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#121216] border border-white/10 p-8 rounded-sm shadow-2xl">
          {/* Error Message */}
          {error && (
            <div className="bg-[#E63946]/10 border border-[#E63946]/50 rounded px-4 py-3">
              <p className="text-[#E63946] font-manrope text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Read-Only Account Info */}
          <div className="space-y-4">
            <h2 className="font-manrope text-xs font-bold uppercase tracking-widest text-[#FFC857]">ACCOUNT INFO</h2>
            
            <div>
              <label className="block font-manrope text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user.username || ''}
                disabled
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-4 py-3 font-manrope text-sm text-white/60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-manrope text-[11px] font-semibold tracking-wider uppercase text-white/60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-4 py-3 font-manrope text-sm text-white/60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-4">
            <h2 className="font-manrope text-xs font-bold uppercase tracking-widest text-[#FFC857]">LOCATION</h2>
            
            <div>
              <label className="block font-manrope text-[11px] font-semibold tracking-wider uppercase text-[#2596be] mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
                className="w-full bg-[#0A0A0A] border border-white/15 rounded px-4 py-3 font-manrope text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2596be] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-manrope text-[11px] font-semibold tracking-wider uppercase text-[#2596be] mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded px-4 py-3 font-manrope text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2596be] transition-colors"
                />
              </div>

              <div>
                <label className="block font-manrope text-[11px] font-semibold tracking-wider uppercase text-[#2596be] mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded px-4 py-3 font-manrope text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2596be] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bio Field */}
          <div className="space-y-4">
            <h2 className="font-manrope text-xs font-bold uppercase tracking-widest text-[#FFC857]">ABOUT YOUR CREATIVE VISION</h2>
            
            <div>
              <label className="block font-manrope text-[11px] font-semibold tracking-wider uppercase text-[#2596be] mb-2">
                Why Do You Want to Become a Creator?
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your creative vision, storytelling style, and original concepts..."
                rows={4}
                className="w-full bg-[#0A0A0A] border border-white/15 rounded px-4 py-3 font-manrope text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2596be] transition-colors resize-none"
              />
              <p className="font-manrope text-[10px] text-white/40 mt-1 text-right">{formData.bio.length}/500</p>
            </div>
          </div>

          {/* Category Interests */}
          <div className="space-y-4">
            <h2 className="font-manrope text-xs font-bold uppercase tracking-widest text-[#FFC857]">GENRE INTERESTS</h2>
            <p className="font-manrope text-[11px] text-white/50">Select at least one genre category for your stories *</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEFAULT_CATEGORIES.map((category: { name: string; description: string; isDefault: boolean }) => (
                <label
                  key={category.name}
                  className="flex items-start gap-3 p-4 border border-white/10 rounded cursor-pointer hover:border-[#2596be]/50 hover:bg-[#2596be]/5 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                    className="mt-1 w-4 h-4 accent-[#2596be]"
                  />
                  <div className="flex-1">
                    <p className="font-manrope text-sm text-white font-semibold">{category.name}</p>
                    <p className="font-manrope text-[10px] text-white/50 leading-relaxed mt-0.5">{category.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 font-manrope text-xs font-bold tracking-widest uppercase border border-white/20 text-white/70 hover:text-white hover:border-white/50 px-6 py-3.5 rounded transition-all duration-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-manrope text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-[#2596be] to-[#E63946] hover:from-[#FFC857] hover:to-[#2596be] text-white px-6 py-3.5 rounded transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#2596be]/20"
            >
              {loading ? 'SETTING UP...' : 'COMPLETE SETUP'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
