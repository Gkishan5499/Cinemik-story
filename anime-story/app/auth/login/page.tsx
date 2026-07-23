'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login, error: authError } = useAuth();
  const adminRedirectUrl = process.env.NEXT_PUBLIC_ADMIN_REDIRECT_URL || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || authError || 'Login failed');
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
          <h1 className="font-display text-4xl tracking-[0.2em] text-ash mb-3">LOGIN</h1>
          <p className="font-mono text-xs tracking-widest text-ash/60 uppercase">
            Enter your credentials
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-ash/60 mb-3">Don't have an account?</p>
          <Link
            href="/auth/signup"
            className="text-crimson hover:underline font-mono text-xs tracking-widest uppercase"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </main>
  );
}
