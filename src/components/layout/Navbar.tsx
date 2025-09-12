'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/services/auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication state with event-driven updates
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        const userData = AuthService.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkAuthStatus();
    
    // Listen for localStorage changes (for cross-tab auth updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (['access_token', 'user', 'session_expiry'].includes(e.key || '')) {
        checkAuthStatus();
      }
    };
    
    // Listen for custom auth events (for same-tab auth updates)
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    // Set up session expiry timeout
    const setupSessionTimeout = () => {
      const sessionExpiry = localStorage.getItem('session_expiry');
      if (sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry, 10);
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        if (timeUntilExpiry > 0) {
          return setTimeout(() => {
            checkAuthStatus(); // This will clear expired session
          }, timeUntilExpiry);
        }
      }
      return null;
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:changed', handleAuthChange);
    const sessionTimeout = setupSessionTimeout();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:changed', handleAuthChange);
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, []);
  
  // Re-check auth status on route changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        const userData = AuthService.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    
    checkAuthStatus();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      AuthService.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      setIsUserMenuOpen(false);
      router.push('/');
    }
  };

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
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              /* User Menu */
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    "transition-colors duration-300 flex items-center space-x-2",
                    isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                  )}
                >
                  <span>Xin chào, {user.name || user.email}</span>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </Button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Register Buttons */
              <>
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
              </>
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
          <div className="py-4 space-y-4 bg-gradient-to-b from-white/90 via-white/80 to-white/70 backdrop-blur-lg shadow-xl border border-white/20 mx-4 rounded-xl mt-2">
            <Link
              href="#features"
              className="block px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tính năng
            </Link>
            <Link
              href="#about"
              className="block px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="#contact"
              className="block px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
            <div className="pt-4 space-y-2">
              {isAuthenticated && user ? (
                /* Mobile User Menu */
                <>
                  <div className="text-sm text-gray-700 mb-2 px-4 font-medium">
                    Xin chào, {user.name || user.email}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:text-red-600 hover:bg-white/50 rounded-lg transition-all duration-300"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                /* Mobile Login/Register Buttons */
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all duration-300 text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 text-center font-medium shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dùng thử miễn phí
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}