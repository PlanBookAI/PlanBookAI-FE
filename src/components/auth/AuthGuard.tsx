'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      // Store the attempted URL to redirect back after login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      router.push('/login');
    }
  }, [router]);

  // If not authenticated, don't render children
  if (!AuthService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;