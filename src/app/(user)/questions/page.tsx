'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function QuestionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ngân hàng câu hỏi
              </h1>
              <p className="text-gray-600">
                Quản lý và tổ chức câu hỏi cho các bài kiểm tra môn Hóa học
              </p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tính năng đang phát triển</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chức năng quản lý ngân hàng câu hỏi sẽ sớm được bổ sung với các tính năng:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="text-left p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Tạo câu hỏi</h3>
              <p className="text-sm text-gray-600">Thêm câu hỏi trắc nghiệm và tự luận</p>
            </div>
            <div className="text-left p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Phân loại</h3>
              <p className="text-sm text-gray-600">Tổ chức theo chủ đề và độ khó</p>
            </div>
            <div className="text-left p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Import/Export</h3>
              <p className="text-sm text-gray-600">Nhập xuất từ file Excel, Word</p>
            </div>
            <div className="text-left p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Chia sẻ</h3>
              <p className="text-sm text-gray-600">Chia sẻ với đồng nghiệp</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => router.back()}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Quay lại
            </Button>
            <Button variant="primary" onClick={() => router.push('/lesson-plans')}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Đến Quản lý giáo án
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
