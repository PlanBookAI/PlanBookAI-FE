'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TurnstileProvider } from '@/components/providers/TurnstileProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <TurnstileProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-repeat opacity-10" 
            style={{ 
              backgroundImage: 'url(/grid.svg)',
              maskImage: 'linear-gradient(to bottom, white, transparent)'
            }} 
          />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">PlanBook AI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === '/login'
                    ? 'text-white'
                    : 'text-blue-200 hover:text-white'
                )}
              >
                Đăng nhập
              </Link>
              <div className="h-4 w-px bg-blue-300/30" />
              <Link
                href="/register"
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === '/register'
                    ? 'text-white'
                    : 'text-blue-200 hover:text-white'
                )}
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {pathname === '/login' ? 'Đăng nhập vào tài khoản' : 'Tạo tài khoản mới'}
              </h2>
              <p className="mt-2 text-sm text-blue-200">
                {pathname === '/login' ? (
                  <>
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="font-medium text-white hover:text-blue-100">
                      Đăng ký ngay
                    </Link>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="font-medium text-white hover:text-blue-100">
                      Đăng nhập
                    </Link>
                  </>
                )}
              </p>
            </div>

            {/* Auth Form Container */}
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl ring-1 ring-white/20">
              {children}
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center text-sm text-blue-200">
              <Link href="/terms" className="hover:text-white">
                Điều khoản sử dụng
              </Link>
              <span className="mx-2">·</span>
              <Link href="/privacy" className="hover:text-white">
                Chính sách bảo mật
              </Link>
              <span className="mx-2">·</span>
              <Link href="/help" className="hover:text-white">
                Trợ giúp
              </Link>
            </div>
          </div>
        </main>
      </div>
    </TurnstileProvider>
  );
}