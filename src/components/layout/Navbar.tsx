'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { AuthState } from '@/types';

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuth({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (e) {
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuth({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={cn(
              'text-2xl font-bold transition-colors duration-300',
              isScrolled ? 'text-gray-900' : 'text-white'
            )}>
              PlanBook AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!auth.isAuthenticated ? (
              <>
                <Link 
                  href="#features" 
                  className={cn(
                    'transition-colors duration-300',
                    isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                  )}
                >
                  Tính năng
                </Link>
            <Link 
              href="#about" 
              className={cn(
                'transition-colors duration-300',
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              )}
            >
              Giới thiệu
            </Link>
            <Link 
              href="#contact" 
              className={cn(
                'transition-colors duration-300',
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              )}
            >
              Liên hệ
            </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    'transition-colors duration-300',
                    isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                  )}
                >
                  Bảng điều khiển
                </Link>
                <Link
                  href="/lesson-plans"
                  className={cn(
                    'transition-colors duration-300',
                    isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                  )}
                >
                  Giáo án
                </Link>
                <Link
                  href="/exams"
                  className={cn(
                    'transition-colors duration-300',
                    isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                  )}
                >
                  Đề thi
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!auth.isAuthenticated ? (
              // Show these buttons when not logged in
              <div className="flex items-center space-x-4">
                <Button
                  variant={isScrolled ? "ghost" : "ghost"}
                  className={cn(
                    "transition-colors duration-300",
                    isScrolled ? "text-gray-700" : "text-white hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  variant={isScrolled ? "primary" : "white"}
                  asChild
                >
                  <Link href="/register">Dùng thử miễn phí</Link>
                </Button>
              </div>
            ) : (
              // Show these items when logged in
              <div className="flex items-center space-x-4">
                <Link href="/notifications" className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "transition-colors duration-300",
                      isScrolled ? "text-gray-700" : "text-white hover:bg-white/10"
                    )}
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                      />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "transition-colors duration-300",
                    isScrolled ? "text-gray-700" : "text-white"
                  )}>
                    {auth.user?.fullName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      router.push('/login');
                    }}
                    className={cn(
                      "transition-colors duration-300",
                      isScrolled ? "text-gray-700" : "text-white hover:bg-white/10"
                    )}
                  >
                    Đăng xuất
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className={cn(
                'w-6 h-6 transition-colors duration-300',
                isScrolled ? 'text-gray-900' : 'text-white'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden transition-all duration-300 overflow-hidden',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 space-y-4">
            <Link
              href="#features"
              className={cn(
                'block transition-colors duration-300',
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tính năng
            </Link>
            <Link
              href="#about"
              className={cn(
                'block transition-colors duration-300',
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="#contact"
              className={cn(
                'block transition-colors duration-300',
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
            <div className="pt-4 space-y-2">
              <Button
                variant={isScrolled ? "ghost" : "ghost"}
                className={cn(
                  "w-full transition-colors duration-300",
                  isScrolled ? "text-gray-700" : "text-white hover:bg-white/10"
                )}
                asChild
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                variant={isScrolled ? "primary" : "white"}
                className="w-full"
                asChild
              >
                <Link href="/register">Dùng thử miễn phí</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}