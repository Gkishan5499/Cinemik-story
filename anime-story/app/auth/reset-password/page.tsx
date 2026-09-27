'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(() => searchParams.get('email') || '');
  const [token, setToken] = useState(() => searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !token.trim()) {
      setError('Email and reset verification code are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.resetPassword({
        email: email.trim(),
        token: token.trim(),
        newPassword,
      });

      setSuccess(true);
      setMessage(res.message || 'Password has been reset successfully!');

      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Failed to reset password. Please verify your reset code or request a new one.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl tracking-[0.2em] text-ash mb-3 uppercase">
          RESET PASSWORD
        </h1>
        <p className="font-mono text-xs tracking-widest text-ash/60 uppercase">
          Choose a new password for your Cinemik account
        </p>
      </div>

      <div className="bg-[#121216] border border-crimson/30 rounded-xl p-6 md:p-8 shadow-2xl relative">
        {/* Success Alert */}
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 mx-auto flex items-center justify-center text-3xl">
              ✓
            </div>
            <h2 className="font-display text-xl text-white tracking-wider">
              PASSWORD RESET COMPLETED!
            </h2>
            <p className="text-xs text-white/70 font-mono leading-relaxed">
              {message || 'Your password has been updated. Redirecting to login in 3 seconds...'}
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2.5 bg-crimson hover:bg-crimson/80 text-white font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors"
              >
                Log In Now &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded bg-crimson/20 border border-crimson/50 text-crimson text-xs font-mono">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-mono text-xs tracking-wider text-white/80 mb-1.5 uppercase">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono focus:border-crimson outline-none transition-colors"
              />
            </div>

            {/* Verification Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-xs tracking-wider text-white/80 uppercase">
                  6-Digit Verification Code
                </label>
                {token && (
                  <span className="font-mono text-[10px] text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                    From Email Link
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono tracking-widest text-center focus:border-crimson outline-none transition-colors"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block font-mono text-xs tracking-wider text-white/80 mb-1.5 uppercase">
                New Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono focus:border-crimson outline-none transition-colors"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block font-mono text-xs tracking-wider text-white/80 mb-1.5 uppercase">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono focus:border-crimson outline-none transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-crimson hover:bg-crimson/80 text-white font-mono text-xs uppercase tracking-wider font-bold rounded disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(230,57,70,0.3)] mt-2"
            >
              {loading ? 'RESETTING PASSWORD...' : 'SET NEW PASSWORD'}
            </button>

            {/* Back to Login */}
            <div className="pt-2 text-center">
              <Link
                href="/auth/login"
                className="font-mono text-xs text-white/60 hover:text-white transition-colors"
              >
                &larr; Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-4 pt-28 pb-16">
      <Suspense
        fallback={
          <div className="font-mono text-xs text-white/60 tracking-widest uppercase">
            Loading reset form...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
