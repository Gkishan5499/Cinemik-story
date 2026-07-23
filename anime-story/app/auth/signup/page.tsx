'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading, signup, error: authError } = useAuth();
  const adminRedirectUrl = process.env.NEXT_PUBLIC_ADMIN_REDIRECT_URL || '/admin';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    if (user.role === 'admin') {
      if (adminRedirectUrl.startsWith('http://') || adminRedirectUrl.startsWith('https://')) {
        window.location.href = adminRedirectUrl;
      } else {
        router.replace(adminRedirectUrl);
      }
    } else if (user.role === 'creator') {
      router.replace('/dashboard');
    } else {
      router.replace('/story');
    }
  }, [adminRedirectUrl, authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, username);
    } catch (err: any) {
      setError(err?.message || authError || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return <main className="min-h-screen bg-ink" />;
  };

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-4 pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl tracking-[0.2em] text-ash mb-3">CREATE ACCOUNT</h1>
          <p className="font-mono text-xs tracking-widest text-ash/60 uppercase">
            Join as a story creator
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2 uppercase">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-ink/50 border border-crimson/30 text-white focus:border-crimson focus:outline-none transition-colors"
              placeholder="Choose your username"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2 uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-ink/50 border border-crimson/30 text-white focus:border-crimson focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-ink/50 border border-crimson/30 text-white focus:border-crimson focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block font-mono text-xs tracking-widest text-ash/80 mb-2 uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-ink/50 border border-crimson/30 text-white focus:border-crimson focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-crimson/20 border border-crimson/50 text-crimson text-sm font-mono rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-crimson/20 border border-crimson/50 text-crimson hover:bg-crimson/30 transition-colors disabled:opacity-50 font-mono text-sm tracking-widest uppercase"
          >
            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-ash/60 mb-3">Already have an account?</p>
          <Link
            href="/auth/login"
            className="text-crimson hover:underline font-mono text-xs tracking-widest uppercase"
          >
            LOGIN HERE
          </Link>
        </div>
      </div>
    </main>
  );
}
