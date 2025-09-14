'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroSidebar, HeroSidebarSection, HeroSidebarAction, HeroSidebarStats } from '@/components/layout/HeroSidebar';

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-900 text-white">
      {/* Hero Section - DUAL SIDEBAR Layout */}
      <div className="min-h-screen flex flex-col">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 lg:py-12 flex-1">
          <div className="max-w-7xl mx-auto h-full">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">Tổng quan</h1>
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Dashboard giáo viên Hóa học THPT</p>
                </div>
              </div>
            </div>

            {/* Quick Access - Mobile: Below header, Desktop: Side */}
            <div className="mb-8 xl:mb-0">
              {/* Quick Access for Mobile */}
              <div className="xl:hidden mb-8">
                <HeroSidebar position="right" width="md">
                {/* Quick Actions Section */}
                <HeroSidebarSection title="Thao tác nhanh">
                  <div className="space-y-2">
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      }
                      label="Tạo giáo án mới"
                      description="Bắt đầu soạn giáo án từ đầu"
                      badge="New"
                      href="/lesson-plans"
                    />
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      }
                      label="Dùng mẫu có sẵn"
                      description="Chọn từ thư viện mẫu"
                      href="/lesson-plans"
                    />
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      }
                      label="Soạn với AI"
                      description="Hỗ trợ AI tạo giáo án"
                      badge="AI"
                      href="/workspace/plangenerator"
                    />
                    {/* Nút chuyển qua trang thông báo */}
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      }
                      label="Thông báo"
                      description="Xem tất cả thông báo"
                      badge="New"
                      href="/notifications"
                    />
                  </div>
                </HeroSidebarSection>

                {/* Quick Reports */}
                <HeroSidebarSection title="Báo cáo">
                  <HeroSidebarAction
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    }
                    label="Xem báo cáo tháng"
                    description="Thống kê tháng này"
                    href="/reports"
                  />
                </HeroSidebarSection>
                </HeroSidebar>
              </div>

            {/* Main Content and Stats - Full width on mobile, flex on desktop */}
            <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
              {/* Stats Section */}
              <div className="flex-1">

                {/* Lesson Plans Stats */}
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Thống kê giáo án</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                          </svg>
                        </div>
                        <span className="text-xs bg-white bg-opacity-30 text-white px-2 py-1 rounded">-</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Tổng giáo án</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Đang soạn</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-green-300 mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Đã xuất bản</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <span className="text-xs bg-purple-400 bg-opacity-40 text-purple-200 px-2 py-1 rounded">AI</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-purple-300 mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Dùng AI</div>
                    </div>
                  </div>
                </div>

                {/* Exam Stats Grid */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Thống kê đề thi</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                          </svg>
                        </div>
                        <span className="text-xs bg-white bg-opacity-30 text-white px-2 py-1 rounded">-</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Tổng đề thi</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-orange-300 mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Đang soạn</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-teal-300 mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Đã xuất bản</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <span className="text-xs bg-pink-400 bg-opacity-40 text-pink-200 px-2 py-1 rounded">AI</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-pink-300 mb-1">-</div>
                      <div className="text-blue-200 text-xs sm:text-sm">Dùng AI</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Sidebar - Desktop only */}
              <div className="hidden xl:block xl:w-72">
                <HeroSidebar position="right" width="md">
                {/* Quick Actions Section */}
                <HeroSidebarSection title="Thao tác nhanh">
                  <div className="space-y-2">
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      }
                      label="Tạo giáo án mới"
                      description="Bắt đầu soạn giáo án từ đầu"
                      badge="New"
                      href="/lesson-plans"
                    />
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      }
                      label="Dùng mẫu có sẵn"
                      description="Chọn từ thư viện mẫu"
                      href="/lesson-plans"
                    />
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      }
                      label="Soạn với AI"
                      description="Hỗ trợ AI tạo giáo án"
                      badge="AI"
                      href="/workspace/plangenerator"
                    />
                    {/* Nút chuyển qua trang thông báo */}
                    <HeroSidebarAction
                      icon={
                        <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      }
                      label="Thông báo"
                      description="Xem tất cả thông báo"
                      badge="New"
                      href="/notifications"
                    />
                  </div>
                </HeroSidebarSection>


                {/* Quick Reports */}
                <HeroSidebarSection title="Báo cáo">
                  <HeroSidebarAction
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    }
                    label="Xem báo cáo tháng"
                    description="Thống kê tháng này"
                    href="/reports"
                  />
                </HeroSidebarSection>
                </HeroSidebar>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}