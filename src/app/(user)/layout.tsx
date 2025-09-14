'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/services/auth';
import { Button } from '@/components/ui/button';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra authentication
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = AuthService.getUser();
    setUser(userData);
  }, [router]);

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await AuthService.logout();
      router.push('/');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="user-layout min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">PlanBookAI</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>Giáo viên môn Hóa học</span>
                <span>•</span>
                <span className="font-medium text-blue-600">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>{user?.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Layout - Navigation chính với khả năng mở rộng */}
        <aside className="w-72 bg-white shadow-sm min-h-screen border-r">
          <nav className="p-4">
            <div className="space-y-1">
              {/* Core Navigation */}
              <div className="mb-6">
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors mb-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  <span className="font-medium">Tổng quan</span>
                </Link>
              </div>

              {/* Service Categories */}
              <div className="space-y-6">
                {/* Giáo dục & Giảng dạy */}
                <div>
                  <div className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <span>Giáo dục & Giảng dạy</span>
                  </div>
                  <div className="space-y-1">
                    <Link 
                      href="/lesson-plans" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                      </svg>
                      <span>Quản lý giáo án</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Active</span>
                      </div>
                    </Link>
                    
                    {/* Chuẩn bị cho services tương lai */}
                    <Link 
                      href="/exams" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      <span>Đề thi & Kiểm tra</span>
                      <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Soon</span>
                    </Link>
                    
                    <Link 
                      href="/reports" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span>Báo cáo & Thống kê</span>
                      <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Soon</span>
                    </Link>
                  </div>
                </div>

                {/* AI Workspace */}
                <div>
                  <div className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span>AI Workspace</span>
                  </div>
                  <div className="space-y-1">
                    <Link 
                      href="/workspace/plangenerator" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      <span>Plan Generator</span>
                      <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">AI</span>
                    </Link>
                    
                    <Link 
                      href="/workspace/examgenerator" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                      </svg>
                      <span>Exam Generator</span>
                      <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">AI</span>
                    </Link>

                    <Link 
                      href="/ai/grading" 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Chấm bài tự động</span>
                      <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Soon</span>
                    </Link>
                  </div>
                </div>
              </div>


              <div className="border-t pt-4 mt-4">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khối lớp đang dạy
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Khối 10</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Cơ bản</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Khối 11</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Nâng cao</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Khối 12</span>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Tổng hợp</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
