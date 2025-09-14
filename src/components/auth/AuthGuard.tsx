'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = AuthService.isAuthenticated();
        const user = AuthService.getUser();
        
        if (authenticated && user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (requireAuth) {
            AuthService.clearTokens();
            router.push(redirectTo);
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        if (requireAuth) {
          AuthService.clearTokens();
          router.push(redirectTo);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-lg">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Yêu cầu đăng nhập</h2>
          <p className="text-red-200 mb-4">Bạn cần đăng nhập để truy cập trang này</p>
          <button
            onClick={() => router.push(redirectTo)}
            className="px-6 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGuard;