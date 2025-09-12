'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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