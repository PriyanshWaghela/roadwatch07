'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardRouter() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role === 'authority') {
        router.replace('/authority');
      } else {
        router.replace('/citizen');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-cyan-accent border-t-transparent rounded-full animate-spin"></div>
        <div className="text-on-surface-variant font-mono animate-pulse">Routing to secure dashboard...</div>
      </div>
    </div>
  );
}
