'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [stats] = useState({
    totalLessonPlans: 0,
    drafts: 0,
    published: 0,
    aiGenerated: 0,
    weeklyProgress: 0,
    monthlyGoal: 20
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - DYNAMIC Content */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-900 text-white">
        <div className="px-10 py-12">
          <div className="max-w-7xl">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-blue-200 mb-6">
              <span className="text-white font-medium">Tổng quan</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">Tổng quan</h1>
                  <p className="text-blue-100 text-lg">Dashboard giáo viên Hóa học THPT</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-3">
                <Button 
                  variant="secondary"
                  className="bg-white bg-opacity-15 hover:bg-opacity-25 text-white border-white border-opacity-30"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Xem báo cáo
                </Button>
                <Button 
                  variant="primary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Tạo giáo án mới
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <span className="text-xs bg-white bg-opacity-30 text-white px-2 py-1 rounded">+2</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalLessonPlans}</div>
                <div className="text-blue-200 text-sm">Tổng giáo án</div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">{stats.drafts}</div>
                <div className="text-blue-200 text-sm">Đang soạn</div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-3xl font-bold text-green-300 mb-1">{stats.published}</div>
                <div className="text-blue-200 text-sm">Đã xuất bản</div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <span className="text-xs bg-purple-400 bg-opacity-40 text-purple-200 px-2 py-1 rounded">AI</span>
                </div>
                <div className="text-3xl font-bold text-purple-300 mb-1">{stats.aiGenerated}</div>
                <div className="text-blue-200 text-sm">Dùng AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - DYNAMIC Content */}
      <div className="px-10 py-8">
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
              <Button variant="ghost" size="sm">
                <span className="text-blue-600">Xem tất cả</span>
              </Button>
            </div>
            
            {/* Empty state */}
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hoạt động nào</h3>
              <p className="text-gray-500 mb-4">Bắt đầu tạo giáo án đầu tiên để thấy hoạt động tại đây</p>
              <Button variant="primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                Tạo giáo án mới
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch giảng dạy</h3>
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Lịch giảng dạy sẽ hiển thị tại đây</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Tạo giáo án mới
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Dùng mẫu có sẵn
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Soạn với AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
