'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AuthService } from '@/services/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Tránh log token ra console để bảo mật
      if (!AuthService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Get user info
      const userInfo = AuthService.getUser();
      if (!userInfo) {
        router.push('/login');
        return;
      }
      // Nếu thiếu tên, gọi hồ sơ để bổ sung
      if ((!userInfo.name && !userInfo.hoTen) && userInfo.id) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          const res = await fetch(`${baseUrl}/api/v1/nguoi-dung/ho-so/${userInfo.id}` , {
            headers: {
              'Content-Type': 'application/json',
              ...AuthService.getAuthHeaders(),
            },
          });
          if (res.ok) {
            const data = await res.json();
            const profileName = data?.duLieu?.hoTen;
            if (profileName) {
              const updated = { ...userInfo, hoTen: profileName, name: userInfo.name || profileName };
              localStorage.setItem('user', JSON.stringify(updated));
              setUser(updated);
            } else {
              setUser(userInfo);
            }
          } else {
            setUser(userInfo);
          }
        } catch (_err) {
          setUser(userInfo);
        }
      } else {
        setUser(userInfo);
      }
      setIsLoading(false);
    };

    // Add a small delay to ensure token is saved
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  // Logout được xử lý bởi Navbar chung, không cần trong trang này

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Không tìm thấy thông tin người dùng</p>
          <Button 
            onClick={() => router.push('/login')} 
            className="mt-4"
          >
            Về trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.hoTen || (user?.email ? user.email.split('@')[0] : 'bạn');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">PlanBook AI Dashboard</h1>
              <p className="text-gray-600">Chào mừng, {displayName}!</p>
            </div>
            {/* Nút đăng xuất đã được chuyển sang Navbar dùng chung */}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">Tổng quan lớp học và tài nguyên</h2>
              <p className="mt-2 text-blue-100">Quản lý giáo án, đề thi và ngân hàng câu hỏi một cách tập trung.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => router.push('/lesson-plans')}>
                Xem giáo án
              </Button>
              <Button onClick={() => router.push('/exams')} variant="ghost">
                Đề thi
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Giáo án</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">12</p>
            <p className="mt-1 text-xs text-gray-500">Cập nhật gần đây</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Đề thi</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">5</p>
            <p className="mt-1 text-xs text-gray-500">Sẵn sàng</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Học sinh</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">128</p>
            <p className="mt-1 text-xs text-gray-500">Đã tham gia</p>
          </div>
        </div>
      </section>

      {/* User Info Brief */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 sm:p-5">
          <p className="text-sm text-blue-900">
            <strong>Thông tin tài khoản</strong><br />
            ID: {user.id} · Email: {user.email} · Vai trò: {user.role}
          </p>
        </div>
      </section>
    </div>
  );
}
