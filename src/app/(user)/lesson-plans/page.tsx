'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type TabType = 'all' | 'draft' | 'completed' | 'published' | 'archived' | 'public-templates' | 'my-templates' | 'topics';
type StatusType = 'draft' | 'completed' | 'published' | 'archived';

interface LessonPlan {
  id: number;
  title: string;
  grade: string;
  chapter: string;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  subject?: string;
  topicId?: number;
  topicName?: string;
  useAI?: boolean;
}

interface Topic {
  id: number;
  name: string;
  description: string;
  subject: string;
}

interface Template {
  id: number;
  title: string;
  description: string;
  grade: string;
  subject: string;
  isPublic: boolean;
  authorName?: string;
  createdAt: string;
}

export default function TeacherLessonPlansPage() {
  // DYNAMIC State for Hero Body content
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('HOA_HOC');
  
  // Mock data - sẽ thay bằng API calls
  const [stats, setStats] = useState({
    total: 5,
    drafts: 2, 
    completed: 2,
    published: 1,
    archived: 0,
    templates_public: 25,
    templates_mine: 3
  });

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([
    {
      id: 1,
      title: "Bài 1: Nguyên tử - Phân tử",
      grade: "10",
      chapter: "Chương 1: Nguyên tử",
      status: "draft",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      subject: "HOA_HOC",
      topicId: 1,
      topicName: "Cấu tạo nguyên tử",
      useAI: false
    },
    {
      id: 2,
      title: "Bài 2: Liên kết hóa học",
      grade: "10", 
      chapter: "Chương 2: Liên kết",
      status: "completed",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      subject: "HOA_HOC",
      topicId: 2,
      topicName: "Liên kết hóa học",
      useAI: true
    },
    {
      id: 3,
      title: "Bài 5: Phản ứng oxi hóa khử",
      grade: "11",
      chapter: "Chương 3: Phản ứng hóa học", 
      status: "published",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-12",
      subject: "HOA_HOC",
      topicId: 3,
      topicName: "Phản ứng oxi hóa khử",
      useAI: false
    },
    {
      id: 4,
      title: "Bài 3: Bảng tuần hoàn",
      grade: "10",
      chapter: "Chương 1: Nguyên tử",
      status: "completed", 
      createdAt: "2024-01-08",
      updatedAt: "2024-01-16",
      subject: "HOA_HOC",
      topicId: 1,
      topicName: "Cấu tạo nguyên tử",
      useAI: true
    },
    {
      id: 5,
      title: "Bài 7: Hợp chất hữu cơ",
      grade: "12",
      chapter: "Chương 4: Hóa hữu cơ",
      status: "draft",
      createdAt: "2024-01-12", 
      updatedAt: "2024-01-22",
      subject: "HOA_HOC",
      topicId: 4,
      topicName: "Hóa học hữu cơ",
      useAI: false
    }
  ]);

  // Mock topics data - từ API GET /api/v1/chu-de/theo-mon/HOA_HOC
  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, name: "Cấu tạo nguyên tử", description: "Nghiên cứu cấu tạo và tính chất nguyên tử", subject: "HOA_HOC" },
    { id: 2, name: "Liên kết hóa học", description: "Các loại liên kết và tính chất phân tử", subject: "HOA_HOC" },
    { id: 3, name: "Phản ứng oxi hóa khử", description: "Phản ứng và cân bằng electron", subject: "HOA_HOC" },
    { id: 4, name: "Hóa học hữu cơ", description: "Hợp chất carbon và phản ứng", subject: "HOA_HOC" },
    { id: 5, name: "Điện hóa học", description: "Pin, acquy và điện phân", subject: "HOA_HOC" }
  ]);

  // Mock templates data - từ API GET /api/v1/mau-giao-an/cong-khai và /cua-toi
  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, title: "Mẫu giáo án chuẩn Bộ GD&ĐT", description: "Mẫu chuẩn theo quy định", grade: "10", subject: "HOA_HOC", isPublic: true, authorName: "Bộ GD&ĐT", createdAt: "2024-01-01" },
    { id: 2, title: "Giáo án tích hợp STEM", description: "Phương pháp dạy học tích hợp", grade: "11", subject: "HOA_HOC", isPublic: true, authorName: "TS. Nguyễn Văn A", createdAt: "2024-01-05" },
    { id: 3, title: "Mẫu giáo án cá nhân - Khối 12", description: "Template tự tạo cho khối 12", grade: "12", subject: "HOA_HOC", isPublic: false, authorName: "Tôi", createdAt: "2024-01-10" }
  ]);

  // DYNAMIC Content based on activeTab and filters
  const getFilteredLessonPlans = () => {
    let filtered = lessonPlans;
    
    // Filter by status (corresponds to API endpoints)
    if (activeTab !== 'all' && activeTab !== 'public-templates' && activeTab !== 'my-templates' && activeTab !== 'topics') {
      filtered = filtered.filter(plan => plan.status === activeTab);
    }
    
    // Filter by grade (API: /api/v1/giao-an/loc-theo-khoi/{khoi})
    if (selectedGrade) {
      filtered = filtered.filter(plan => plan.grade === selectedGrade);
    }
    
    // Filter by topic (API: /api/v1/giao-an/loc-theo-chu-de/{chuDeId})
    if (selectedTopic) {
      filtered = filtered.filter(plan => plan.topicId === selectedTopic);
    }
    
    // Filter by subject (API: /api/v1/giao-an/loc-theo-mon/{monHoc})
    if (selectedSubject) {
      filtered = filtered.filter(plan => plan.subject === selectedSubject);
    }
    
    // Search filter (API: /api/v1/giao-an/tim-kiem?keyword=...)
    if (searchQuery) {
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plan.topicName && plan.topicName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  // Get filtered templates based on activeTab
  const getFilteredTemplates = () => {
    let filtered = templates;
    
    if (activeTab === 'public-templates') {
      filtered = templates.filter(t => t.isPublic);
    } else if (activeTab === 'my-templates') {
      filtered = templates.filter(t => !t.isPublic);
    }
    
    // Apply same grade and search filters
    if (selectedGrade) {
      filtered = filtered.filter(t => t.grade === selectedGrade);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGrade('');
    setSelectedTopic(null);
    setActiveTab('all');
  };

  const filteredPlans = getFilteredLessonPlans();
  const filteredTemplates = getFilteredTemplates();

  // DYNAMIC Hero Body Content
  const getHeroBodyContent = () => {
    const contentMap: Record<TabType, {
      title: string;
      description: string;
      count: number;
      breadcrumb: string;
      emptyMessage: string;
      emptyDescription: string;
    }> = {
      all: {
        title: 'Tất cả giáo án',
        description: 'Toàn bộ giáo án Hóa học của bạn',
        count: stats.total,
        breadcrumb: 'Tất cả giáo án',
        emptyMessage: 'Chưa có giáo án nào',
        emptyDescription: 'Bắt đầu tạo giáo án Hóa học đầu tiên của bạn hoặc sử dụng mẫu có sẵn để tiết kiệm thời gian'
      },
      draft: {
        title: 'Bản nháp',
        description: 'Giáo án đang soạn dở',
        count: stats.drafts,
        breadcrumb: 'Bản nháp',
        emptyMessage: 'Chưa có bản nháp nào',
        emptyDescription: 'Tạo giáo án mới hoặc chỉnh sửa giáo án hiện có để tạo bản nháp'
      },
      completed: {
        title: 'Hoàn thành',
        description: 'Giáo án đã hoàn thành',
        count: stats.completed,
        breadcrumb: 'Hoàn thành',
        emptyMessage: 'Chưa có giáo án hoàn thành',
        emptyDescription: 'Hoàn thành các bản nháp để chúng xuất hiện ở đây'
      },
      published: {
        title: 'Đã xuất bản',
        description: 'Giáo án đã được xuất bản',
        count: stats.published,
        breadcrumb: 'Đã xuất bản',
        emptyMessage: 'Chưa có giáo án được xuất bản',
        emptyDescription: 'Xuất bản các giáo án hoàn thành để chia sẻ với đồng nghiệp'
      },
      archived: {
        title: 'Đã lưu trữ',
        description: 'Giáo án đã được lưu trữ',
        count: stats.archived,
        breadcrumb: 'Đã lưu trữ',
        emptyMessage: 'Chưa có giáo án lưu trữ',
        emptyDescription: 'Lưu trữ các giáo án cũ để giữ workspace gọn gàng'
      },
      'public-templates': {
        title: 'Mẫu công khai',
        description: 'Khám phá mẫu giáo án từ cộng đồng',
        count: stats.templates_public,
        breadcrumb: 'Mẫu công khai',
        emptyMessage: 'Không tìm thấy mẫu nào',
        emptyDescription: 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm'
      },
      'my-templates': {
        title: 'Mẫu của tôi',
        description: 'Quản lý mẫu giáo án cá nhân',
        count: stats.templates_mine,
        breadcrumb: 'Mẫu của tôi',
        emptyMessage: 'Chưa có mẫu cá nhân',
        emptyDescription: 'Tạo mẫu giáo án để tái sử dụng cho các lớp khác'
      },
      'topics': {
        title: 'Quản lý chủ đề',
        description: 'Tổ chức giáo án theo chủ đề môn học',
        count: topics.length,
        breadcrumb: 'Chủ đề',
        emptyMessage: 'Chưa có chủ đề nào',
        emptyDescription: 'Tạo chủ đề để phân loại và tổ chức giáo án hiệu quả hơn'
      }
    };
    return contentMap[activeTab];
  };

  const currentContent = getHeroBodyContent();

  const getStatusBadge = (status: StatusType) => {
    const statusMap: Record<StatusType, { label: string; className: string }> = {
      draft: { label: 'Bản nháp', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
      published: { label: 'Đã xuất bản', className: 'bg-blue-100 text-blue-800' },
      archived: { label: 'Lưu trữ', className: 'bg-gray-100 text-gray-800' }
    };
    return statusMap[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-900 text-white">
        <div className="flex">
          
          {/* 🔒 STATIC: Hero Sidebar - Structure không đổi */}
          <aside className="w-72 bg-black bg-opacity-20 min-h-screen backdrop-blur-sm border-r border-white border-opacity-10">
            <nav className="p-6">
              <div className="space-y-1">
                {/* Header - STATIC */}
                <div className="flex items-center space-x-2 px-3 py-3 mb-4">
                  <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Quản lý giáo án</h3>
                    <p className="text-xs text-blue-200">Hóa học THPT</p>
                  </div>
                </div>

                {/* Navigation - STATIC Structure, DYNAMIC Active State */}
                <div className="mb-6">
                  <div className="px-3 py-2 text-xs font-medium text-blue-200 uppercase tracking-wider mb-2">
                    Giáo án của tôi
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors mb-1 ${
                      activeTab === 'all' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <span>Tất cả giáo án</span>
                    <span className="ml-auto text-xs bg-white bg-opacity-30 px-2 py-1 rounded">{stats.total}</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('draft')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors mb-1 ${
                      activeTab === 'draft' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span>Bản nháp</span>
                    <span className="ml-auto text-xs bg-yellow-400 bg-opacity-80 text-yellow-900 px-2 py-1 rounded">{stats.drafts}</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('completed')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors mb-1 ${
                      activeTab === 'completed' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Hoàn thành</span>
                    <span className="ml-auto text-xs bg-green-400 bg-opacity-80 text-green-900 px-2 py-1 rounded">{stats.completed}</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('published')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors mb-1 ${
                      activeTab === 'published' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Đã xuất bản</span>
                    <span className="ml-auto text-xs bg-blue-400 bg-opacity-80 text-blue-900 px-2 py-1 rounded">{stats.published}</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('archived')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                      activeTab === 'archived' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8l6 6m0 0l6-6m-6 6V3"/>
                    </svg>
                    <span>Đã lưu trữ</span>
                    <span className="ml-auto text-xs bg-gray-400 bg-opacity-80 text-gray-900 px-2 py-1 rounded">{stats.archived}</span>
                  </button>
                </div>

                {/* Mẫu giáo án - STATIC */}
                <div className="mb-6">
                  <div className="px-3 py-2 text-xs font-medium text-blue-200 uppercase tracking-wider mb-2">
                    Mẫu giáo án
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('public-templates')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors mb-1 ${
                      activeTab === 'public-templates' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>Mẫu công khai</span>
                    <span className="ml-auto text-xs bg-purple-400 bg-opacity-80 text-purple-900 px-2 py-1 rounded">{stats.templates_public}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('my-templates')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                      activeTab === 'my-templates' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span>Mẫu của tôi</span>
                    <span className="ml-auto text-xs bg-orange-400 bg-opacity-80 text-orange-900 px-2 py-1 rounded">{stats.templates_mine}</span>
                  </button>
                </div>

                {/* Chủ đề - STATIC */}
                <div className="mb-6">
                  <div className="px-3 py-2 text-xs font-medium text-blue-200 uppercase tracking-wider mb-2">
                    Chủ đề
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('topics')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                      activeTab === 'topics' 
                        ? 'bg-white bg-opacity-20 text-white font-medium' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span>Quản lý chủ đề</span>
                    <span className="ml-auto text-xs bg-indigo-400 bg-opacity-80 text-indigo-900 px-2 py-1 rounded">{topics.length}</span>
                  </button>
                </div>

                {/* Phân loại - STATIC Structure */}
                <div className="border-t border-white border-opacity-20 pt-4">
                  <div className="px-3 py-2 text-xs font-medium text-blue-200 uppercase tracking-wider mb-2">
                    Phân loại theo khối
                  </div>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setSelectedGrade(selectedGrade === '10' ? '' : '10')}
                      className={`flex items-center justify-between px-3 py-2 text-sm w-full rounded transition-colors ${
                        selectedGrade === '10' 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Khối 10 - Cơ bản</span>
                      </div>
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                        {lessonPlans.filter(p => p.grade === '10').length}
                      </span>
                    </button>
                    <button 
                      onClick={() => setSelectedGrade(selectedGrade === '11' ? '' : '11')}
                      className={`flex items-center justify-between px-3 py-2 text-sm w-full rounded transition-colors ${
                        selectedGrade === '11' 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Khối 11 - Nâng cao</span>
                      </div>
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                        {lessonPlans.filter(p => p.grade === '11').length}
                      </span>
                    </button>
                    <button 
                      onClick={() => setSelectedGrade(selectedGrade === '12' ? '' : '12')}
                      className={`flex items-center justify-between px-3 py-2 text-sm w-full rounded transition-colors ${
                        selectedGrade === '12' 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Khối 12 - Tổng hợp</span>
                      </div>
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                        {lessonPlans.filter(p => p.grade === '12').length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* 🔄 DYNAMIC: Hero Body - Content thay đổi hoàn toàn */}
          <div className="flex-1 px-10 py-12">
            <div className="max-w-5xl">
              {/* DYNAMIC: Interactive Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-blue-200 mb-6">
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="hover:text-white transition-colors hover:underline"
                >
                  Trang chủ
                </button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
                <button 
                  onClick={() => setActiveTab('all')}
                  className="hover:text-white transition-colors hover:underline"
                >
                  Quản lý giáo án
                </button>
                {activeTab !== 'all' && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span className="text-white font-medium">{currentContent.breadcrumb}</span>
                  </>
                )}
                {selectedGrade && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span className="text-blue-300">Khối {selectedGrade}</span>
                  </>
                )}
                {selectedTopic && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span className="text-blue-300">{topics.find(t => t.id === selectedTopic)?.name}</span>
                  </>
                )}
              </nav>

              {/* DYNAMIC: Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-1">{currentContent.title}</h1>
                      <p className="text-blue-100 text-lg">{currentContent.description}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button 
                    variant="secondary"
                    onClick={() => setShowTemplateModal(true)}
                    className="bg-white bg-opacity-15 hover:bg-opacity-25 text-white border-white border-opacity-30"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Tạo từ mẫu
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Tạo giáo án mới
                  </Button>
                </div>
              </div>

              {/* DYNAMIC: Stats for current selection */}
              <div className="mb-8">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{filteredPlans.length}</span>
                      </div>
    <div>
                        <h3 className="text-lg font-semibold text-white">{currentContent.title}</h3>
                        <p className="text-blue-200">{currentContent.description}</p>
                        {selectedGrade && (
                          <p className="text-blue-300 text-sm">Khối {selectedGrade}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{filteredPlans.length}</div>
                      <div className="text-blue-200 text-sm">kết quả</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC: Content Area */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl border border-white border-opacity-20 min-h-[500px]">
                {/* Header with search */}
                <div className="border-b border-white border-opacity-20 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-semibold text-white">{currentContent.title}</h2>
                      <span className="text-xs bg-white bg-opacity-30 text-white px-3 py-1 rounded-full">
                        {filteredPlans.length} kết quả
                      </span>
                      {selectedGrade && (
                        <span className="text-xs bg-blue-400 bg-opacity-80 text-blue-900 px-3 py-1 rounded-full">
                          Khối {selectedGrade}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Search input */}
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Tìm kiếm giáo án..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-64 px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        />
                        <svg className="absolute right-3 top-2.5 w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                      </div>

                      {/* Topic filter - chỉ hiển thị cho lesson plans */}
                      {(activeTab === 'all' || activeTab === 'draft' || activeTab === 'completed' || activeTab === 'published' || activeTab === 'archived') && (
                        <div className="relative">
                          <select
                            value={selectedTopic || ''}
                            onChange={(e) => setSelectedTopic(e.target.value ? Number(e.target.value) : null)}
                            className="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm"
                          >
                            <option value="" className="text-gray-900">Tất cả chủ đề</option>
                            {topics.map(topic => (
                              <option key={topic.id} value={topic.id} className="text-gray-900">
                                {topic.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Clear filters */}
                      {(searchQuery || selectedGrade || selectedTopic) && (
                        <Button 
                          variant="secondary"
                          size="sm"
                          onClick={clearAllFilters}
                          className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                          Xóa bộ lọc
                        </Button>
                      )}
                    </div>
                  </div>
                </div>


                {/* DYNAMIC: Content Body */}
                <div className="p-8">
                  {/* Lesson Plans Content */}
                  {(activeTab === 'all' || activeTab === 'draft' || activeTab === 'completed' || activeTab === 'published' || activeTab === 'archived') && (
                    <>
                      {filteredPlans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredPlans.map((plan) => {
                            const statusInfo = getStatusBadge(plan.status);
                            return (
                              <div key={plan.id} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex space-x-2">
                                    <span className={`text-xs px-2 py-1 rounded ${statusInfo.className}`}>
                                      {statusInfo.label}
                                    </span>
                                    {plan.useAI && (
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">AI</span>
                                    )}
                                  </div>
                                  <span className="text-xs bg-blue-400 bg-opacity-80 text-blue-900 px-2 py-1 rounded">
                                    Khối {plan.grade}
                                  </span>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-white mb-2">{plan.title}</h3>
                                <p className="text-blue-200 text-sm mb-2">{plan.chapter}</p>
                                {plan.topicName && (
                                  <p className="text-blue-300 text-xs mb-4">📚 {plan.topicName}</p>
                                )}
                                
                                <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
                                  <span>Tạo: {new Date(plan.createdAt).toLocaleDateString('vi-VN')}</span>
                                  <span>Sửa: {new Date(plan.updatedAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                    </svg>
                                    Sửa
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                    Xem
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                          </div>
                          <h3 className="text-xl font-medium text-white mb-3">{currentContent.emptyMessage}</h3>
                          <p className="text-blue-200 mb-8 max-w-md mx-auto">{currentContent.emptyDescription}</p>
                          <div className="flex justify-center space-x-4">
                            <Button 
                              variant="primary"
                              onClick={() => setShowCreateModal(true)}
                              className="bg-white text-blue-600 hover:bg-gray-100"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                              </svg>
                              Tạo giáo án mới
                            </Button>
                            <Button 
                              variant="secondary"
                              onClick={() => setShowTemplateModal(true)}
                              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                              Tạo từ mẫu
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Templates Content */}
                  {(activeTab === 'public-templates' || activeTab === 'my-templates') && (
                    <>
                      {filteredTemplates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredTemplates.map((template) => (
                            <div key={template.id} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer">
                              <div className="flex items-start justify-between mb-4">
                                <span className={`text-xs px-2 py-1 rounded ${template.isPublic ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                                  {template.isPublic ? 'Công khai' : 'Cá nhân'}
                                </span>
                                <span className="text-xs bg-blue-400 bg-opacity-80 text-blue-900 px-2 py-1 rounded">
                                  Khối {template.grade}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
                              <p className="text-blue-200 text-sm mb-4">{template.description}</p>
                              
                              <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
                                <span>Tác giả: {template.authorName}</span>
                                <span>{new Date(template.createdAt).toLocaleDateString('vi-VN')}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                  </svg>
                                  Xem
                                </Button>
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                  </svg>
                                  Dùng mẫu
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                          </div>
                          <h3 className="text-xl font-medium text-white mb-3">{currentContent.emptyMessage}</h3>
                          <p className="text-blue-200 mb-8 max-w-md mx-auto">{currentContent.emptyDescription}</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Topics Content */}
                  {activeTab === 'topics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topics.map((topic) => (
                        <div key={topic.id} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                              </svg>
                            </div>
                            <span className="text-xs bg-indigo-400 bg-opacity-80 text-indigo-900 px-2 py-1 rounded">
                              {lessonPlans.filter(p => p.topicId === topic.id).length} giáo án
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-white mb-2">{topic.name}</h3>
                          <p className="text-blue-200 text-sm mb-4">{topic.description}</p>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white hover:bg-opacity-20"
                              onClick={() => setSelectedTopic(topic.id)}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"/>
                              </svg>
                              Lọc theo chủ đề
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                              </svg>
                              Sửa
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add new topic card */}
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border-2 border-dashed border-white border-opacity-30 hover:bg-opacity-20 transition-all cursor-pointer flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Tạo chủ đề mới</h3>
                        <p className="text-blue-200 text-sm">Thêm chủ đề để phân loại giáo án</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals - DYNAMIC */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Tạo giáo án mới</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Tính năng đang phát triển</h4>
                <p className="text-gray-600">
                  Chức năng tạo giáo án mới sẽ sớm được bổ sung với các tính năng:
                </p>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm text-gray-700">Soạn giáo án theo khung chương trình mới</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm text-gray-700">Tích hợp AI hỗ trợ soạn thảo</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm text-gray-700">Lưu và chia sẻ với đồng nghiệp</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Đóng
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setShowCreateModal(false);
                    // Redirect to AI lesson planner when available
                    window.location.href = '/workspace/plangenerator';
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Thử AI Workspace
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Tạo từ mẫu có sẵn</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowTemplateModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Tính năng đang phát triển</h4>
                <p className="text-gray-600">
                  Chức năng chọn mẫu giáo án sẽ sớm được bổ sung với:
                </p>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm text-gray-700">Thư viện mẫu giáo án Hóa học</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm text-gray-700">Tùy chỉnh theo lớp và chủ đề</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm text-gray-700">Chia sẻ mẫu với cộng đồng</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="secondary"
                  onClick={() => setShowTemplateModal(false)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Đóng
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setShowTemplateModal(false);
                    setActiveTab('templates' as TabType);
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Xem mẫu có sẵn
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
