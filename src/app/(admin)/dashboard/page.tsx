'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AuthService } from '@/services/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user info
    const userInfo = AuthService.getUser();
    setUser(userInfo);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PlanBook AI Dashboard</h1>
              <p className="text-gray-600">Chào mừng, {user.name}!</p>
            </div>
            <Button onClick={handleLogout} variant="ghost">
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard đang phát triển
              </h2>
              <p className="text-gray-600 mb-4">
                Đây là trang dashboard sau khi đăng nhập thành công.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Thông tin user:</strong><br />
                  ID: {user.id}<br />
                  Tên: {user.name}<br />
                  Email: {user.email}<br />
                  Vai trò: {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
