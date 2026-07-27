'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

/**
 * Client-side auth guard — fixes the browser back-button issue.
 * Even if the browser serves a cached page, this component
 * immediately redirects unauthenticated / wrong-role users.
 */
export default function AuthGuard({ children, requiredRole }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Not logged in → go to login, replace so back button can't return
      router.replace('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Wrong role → send to their correct home
      router.replace(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, isLoading, requiredRole, router]);

  // Show spinner while loading or before redirect
  if (isLoading || !user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}