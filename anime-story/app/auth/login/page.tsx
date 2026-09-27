'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login, error: authError } = useAuth();
  const adminRedirectUrl = process.env.NEXT_PUBLIC_ADMIN_REDIRECT_URL || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot / Reset Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'sent' | 'reset'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : authError || 'Login failed. Please check your email and password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);

    try {
      const res = await authAPI.forgotPassword({ email: forgotEmail.trim() });
      setForgotMessage(res.message);
      setResetToken('');
      setForgotStep('sent');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to request password reset. Please try again.';
      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    try {
      const res = await authAPI.resetPassword({
        email: forgotEmail.trim(),
        token: resetToken.trim(),
        newPassword,
      });
      setForgotMessage(res.message);
      // Success: prefill email and close after short delay
      setEmail(forgotEmail.trim());
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('request');
        setForgotMessage(null);
        setError(null);
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reset password. Please verify the code.';
      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCopySupportEmail = () => {
    navigator.clipboard.writeText('cinemiks@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (authLoading || user) {
    return <main className="min-h-screen bg-ink" />;
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-4 pt-28 pb-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl tracking-[0.2em] text-ash mb-3">LOGIN</h1>
          <p className="font-mono text-xs tracking-widest text-ash/60 uppercase">
            Enter your credentials
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-black/40 border border-crimson/20 p-6 md:p-8 rounded-xl shadow-2xl">
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
              className="w-full px-4 py-3 bg-ink/70 border border-crimson/30 text-white focus:border-crimson focus:outline-none transition-colors font-mono text-sm rounded"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-xs tracking-widest text-ash/80 uppercase">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotError(null);
                  setForgotMessage(null);
                  setForgotStep('request');
                  setShowForgotModal(true);
                }}
                className="text-crimson hover:text-red-400 font-mono text-xs tracking-wider uppercase transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-ink/70 border border-crimson/30 text-white focus:border-crimson focus:outline-none transition-colors font-mono text-sm rounded"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-crimson/20 border border-crimson/50 text-crimson text-xs font-mono rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-crimson hover:bg-crimson/80 text-white transition-all disabled:opacity-50 font-mono text-sm tracking-widest uppercase rounded font-bold shadow-lg shadow-crimson/30 cursor-pointer"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-ash/60 mb-2">Don&apos;t have an account?</p>
          <Link
            href="/auth/signup"
            className="text-crimson hover:underline font-mono text-xs tracking-widest uppercase font-bold"
          >
            CREATE ACCOUNT →
          </Link>
        </div>

        {/* Need Help? / Contact Support Box */}
        <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 text-center space-y-3 font-mono">
          <p className="text-xs uppercase tracking-widest text-ash/80 font-bold flex items-center justify-center gap-1.5">
            <span>💬</span> NEED HELP / CONTACT SUPPORT?
          </p>
          <p className="text-[11px] text-ash/60 leading-relaxed">
            Having trouble logging in or need account assistance? Our team is here to help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopySupportEmail}
              className="px-3 py-1.5 rounded bg-crimson/20 border border-crimson/40 text-crimson hover:bg-crimson/30 text-xs transition-colors flex items-center gap-1.5"
            >
              <span>📧 cinemiks@gmail.com</span>
              <span className="text-[10px] text-white/70">
                {copiedEmail ? '(Copied! ✓)' : '(Copy)'}
              </span>
            </button>
            <a
              href="tel:+919008779309"
              className="px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white hover:bg-white/20 text-xs transition-colors"
            >
              📞 +91 90087 79309
            </a>
          </div>
          <div className="pt-1">
            <Link
              href="/contact"
              className="text-xs text-[#2596be] hover:underline uppercase tracking-wider"
            >
              Visit Support & Contact Page →
            </Link>
          </div>
        </div>

        {/* Forgot / Reset Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#121216] border border-crimson/50 rounded-xl p-6 md:p-8 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="font-display text-2xl text-white tracking-wider uppercase">
                  {forgotStep === 'request'
                    ? 'FORGOT PASSWORD'
                    : forgotStep === 'sent'
                    ? 'CHECK YOUR EMAIL'
                    : 'RESET PASSWORD'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="text-white/60 hover:text-white text-lg font-mono p-1"
                >
                  ✕
                </button>
              </div>

              {forgotMessage && forgotStep !== 'sent' && (
                <div className="p-3 rounded bg-green-500/20 border border-green-500/50 text-green-300 text-xs font-mono">
                  {forgotMessage}
                </div>
              )}

              {forgotError && (
                <div className="p-3 rounded bg-crimson/20 border border-crimson/50 text-crimson text-xs font-mono">
                  {forgotError}
                </div>
              )}

              {forgotStep === 'sent' ? (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center text-2xl">
                      ✓
                    </div>
                    <p className="font-mono text-xs text-white/90 leading-relaxed">
                      A password reset link has been dispatched to <strong className="text-white">{forgotEmail}</strong>.
                    </p>
                    <p className="font-mono text-[11px] text-white/60">
                      Please check your Gmail inbox (and Spam folder) and click the link to reset your password.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-full py-3 bg-crimson hover:bg-crimson/80 text-white font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors"
                    >
                      Got it / Back to Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotStep('reset')}
                      className="w-full py-2 text-white/60 hover:text-white font-mono text-xs underline text-center transition-colors"
                    >
                      Have a 6-digit code? Enter code manually &rarr;
                    </button>
                  </div>
                </div>
              ) : forgotStep === 'request' ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <p className="text-xs text-white/70 font-mono leading-relaxed">
                    Enter your registered email address below. We will send a secure password reset link to your Gmail/inbox.
                  </p>
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-white/80 mb-1.5 uppercase">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono focus:border-crimson outline-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 bg-crimson hover:bg-crimson/80 text-white font-mono text-xs uppercase tracking-wider font-bold rounded disabled:opacity-50 transition-colors"
                    >
                      {forgotLoading ? 'SENDING RESET LINK...' : 'SEND RESET LINK →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-3 border border-white/20 text-white/70 hover:bg-white/10 font-mono text-xs uppercase rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs tracking-wider text-white/80 mb-1.5 uppercase">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono tracking-widest text-center focus:border-crimson outline-none"
                    />
                  </div>

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
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono focus:border-crimson outline-none"
                    />
                  </div>

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
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded text-white text-sm font-mono focus:border-crimson outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 bg-crimson hover:bg-crimson/80 text-white font-mono text-xs uppercase tracking-wider font-bold rounded disabled:opacity-50 transition-colors"
                    >
                      {forgotLoading ? 'RESETTING...' : 'SET NEW PASSWORD'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotStep('request')}
                      className="px-4 py-3 border border-white/20 text-white/70 hover:bg-white/10 font-mono text-xs uppercase rounded transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
