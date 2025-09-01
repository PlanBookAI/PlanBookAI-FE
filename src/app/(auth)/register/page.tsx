'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Turnstile } from '@/components/ui/Turnstile';
import { useTurnstile } from '@/hooks/useTurnstile';
import { AuthService } from '@/services/auth';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Force verify for register (critical point)
  const { isVerified, isLoading: isTurnstileLoading, error: turnstileError, verifyToken, reset } = useTurnstile(true);

  // Check if user is already authenticated
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      setError('Vui lòng xác minh CAPTCHA trước khi đăng ký');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await AuthService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        setSuccess(result.message || 'Đăng ký thành công!');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTurnstileVerify = async (token: string) => {
    const success = await verifyToken(token);
    if (!success) {
      setError('Xác minh CAPTCHA thất bại. Vui lòng thử lại.');
    }
  };

  const handleTurnstileError = () => {
    setError('Xác minh CAPTCHA thất bại. Vui lòng thử lại.');
  };

  const handleTurnstileExpire = () => {
    setError('CAPTCHA đã hết hạn. Vui lòng xác minh lại.');
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-200">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-blue-100">
            Họ và tên
          </label>
          <div className="mt-1">
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border-white/10 text-white placeholder-blue-200"
              placeholder="Nguyễn Văn A"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-blue-100">
            Email
          </label>
          <div className="mt-1">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border-white/10 text-white placeholder-blue-200"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-blue-100">
            Mật khẩu
          </label>
          <div className="mt-1">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border-white/10 text-white placeholder-blue-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-100">
            Xác nhận mật khẩu
          </label>
          <div className="mt-1">
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-white/5 border-white/10 text-white placeholder-blue-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-blue-100">
            Tôi đồng ý với{' '}
            <Link href="/terms" className="font-medium text-white hover:text-blue-100">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="font-medium text-white hover:text-blue-100">
              Chính sách bảo mật
            </Link>
          </label>
        </div>
      </div>

      {/* Turnstile CAPTCHA - Always show for register */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-blue-100">
          Xác minh bảo mật
        </label>
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          onVerify={handleTurnstileVerify}
          onError={handleTurnstileError}
          onExpire={handleTurnstileExpire}
          className="flex justify-center"
          show={true}
        />
        {turnstileError && (
          <p className="text-sm text-red-200">{turnstileError}</p>
        )}
      </div>

      <div>
        <Button
          type="submit"
          variant="white"
          fullWidth
          className={cn(
            'transition-all duration-200',
            (isLoading || isTurnstileLoading) && 'opacity-70 cursor-not-allowed'
          )}
          disabled={isLoading || isTurnstileLoading || !isVerified}
        >
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-transparent px-2 text-blue-200">Hoặc đăng ký với</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="ghost"
          className="bg-white/5 hover:bg-white/10 text-white"
          onClick={() => {}}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="bg-white/5 hover:bg-white/10 text-white"
          onClick={() => {}}
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          Facebook
        </Button>
      </div>
    </form>
  );
}