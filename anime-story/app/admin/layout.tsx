'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/story');
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== 'admin') {
    return <main className="min-h-screen bg-ink" />;
  }

  return <>{children}</>;
}
