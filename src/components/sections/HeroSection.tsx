'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
      
      {/* Decorative grid */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-repeat" 
          style={{ 
            backgroundImage: 'url(/grid.svg)',
            opacity: 0.1,
            maskImage: 'linear-gradient(to bottom, white, transparent)'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-32 sm:px-6 lg:px-8 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
                Giáo dục thông minh
              </span>
              <span className="mt-4 block text-4xl font-bold tracking-tight text-blue-200 sm:text-5xl md:text-6xl xl:text-7xl">
                với sức mạnh AI
              </span>
            </h1>
            
            <p className="mt-6 text-base text-blue-100 sm:text-xl lg:text-2xl">
              Tối ưu hóa công việc giảng dạy với công cụ AI hỗ trợ tạo đề thi, 
              soạn giáo án và chấm điểm tự động.
            </p>

            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                variant="white"
                size="lg"
                asChild
              >
                <Link href="/register">
                  Dùng thử miễn phí
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="text-white border-2 border-white/20 hover:bg-white/10"
              >
                <Link href="#features">
                  Tìm hiểu thêm
                </Link>
              </Button>
            </div>

            {/* Feature tags */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 lg:justify-start">
              <span className="inline-flex items-center rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/20">
                ✨ AI Tạo đề thi
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/20">
                📚 Soạn giáo án
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/20">
                🎯 OCR chấm điểm
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mt-20 lg:col-span-6 lg:mt-0">
            <div className="relative mx-auto w-full rounded-lg shadow-xl md:max-w-md lg:max-w-none">
              <div className="relative block w-full overflow-hidden rounded-lg bg-white/5 backdrop-blur">
                <img
                  src="/hero-image.png"
                  alt="PlanBook AI Interface"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}