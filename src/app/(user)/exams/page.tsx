'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamsPage() {
  const router = useRouter();

  useEffect(() => {
    fetchExams();
  }, [activeTab, filters]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const trangThai = activeTab !== 'all' ? activeTab as TrangThai : undefined;
      const result = await examService.getExams({ 
        ...filters, 
        trangThai 
      });
      setExams(result.items);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      // Set a more user-friendly error message based on the error type
      if (!navigator.onLine) {
        setError('Vui lòng kiểm tra kết nối internet của bạn và thử lại.');
      } else {
        setError(
          error instanceof Error 
            ? error.message 
            : 'Có lỗi xảy ra khi tải danh sách đề thi. Vui lòng thử lại sau.'
        );
      }
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exam: DeThi) => {
    setSelectedExam(exam);
    setShowCreateModal(true);
  };

  const handleView = (exam: DeThi) => {
    setSelectedExam(exam);
    setShowPreview(true);
  };

  const handleDelete = async (exam: DeThi) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề thi này không?')) {
      try {
        await examService.deleteExam(exam.id);
        await fetchExams();
      } catch (error) {
        console.error('Failed to delete exam:', error);
      }
    }
  };


  const handleSubmit = async (examData: Partial<DeThi>) => {
    try {
      if (examData.id) {
        await examService.updateExam(examData.id, examData as DeThi);
      } else {
        const newExam: Omit<DeThi, 'id' | 'metadata'> = {
          tieuDe: examData.tieuDe || '',
          huongDan: examData.huongDan || '',
          khoiLop: examData.khoiLop || 10,
          monHoc: examData.monHoc || 'TOAN',
          thoiGianLamBai: examData.thoiGianLamBai || 45,
          tongDiem: examData.tongDiem || 10,
          trangThai: examData.trangThai || 'DRAFT',
          cauHois: examData.cauHois || []
        };
        await examService.createExam(newExam);
      }
      await fetchExams();
      setShowCreateModal(false);
      setSelectedExam(null);
    } catch (error) {
      console.error('Failed to save exam:', error);
      alert(error instanceof Error ? error.message : 'Không thể lưu đề thi');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Menu */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 space-y-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-blue-100">Trạng thái</h2>
          <div className="space-y-2">
            {[
              { id: 'all', label: 'Tất cả', count: exams?.length || 0 },
              { id: 'DRAFT', label: 'Bản nháp', count: exams?.filter(e => e.trangThai === 'DRAFT')?.length || 0 },
              { id: 'PUBLISHED', label: 'Đã xuất bản', count: exams?.filter(e => e.trangThai === 'PUBLISHED')?.length || 0 },
              { id: 'ARCHIVED', label: 'Lưu trữ', count: exams?.filter(e => e.trangThai === 'ARCHIVED')?.length || 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-700/50'
                }`}
              >
                <span>{tab.label}</span>
                <span className="float-right bg-blue-600 px-2 rounded-full text-sm">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-100">Bộ lọc</h2>
          <div className="space-y-4">
            <select
              value={filters.khoiLop?.toString() || ''}
              onChange={(e) => setFilters({ ...filters, khoiLop: Number(e.target.value) || undefined })}
              className="w-full bg-blue-800 text-blue-100 rounded px-3 py-2 border border-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả khối</option>
              {['6', '7', '8', '9', '10', '11', '12'].map(grade => (
                <option key={grade} value={grade}>Khối {grade}</option>
              ))}
            </select>

            <select
              value={filters.monHoc || ''}
              onChange={(e) => setFilters({ ...filters, monHoc: e.target.value as any })}
              className="w-full bg-blue-800 text-blue-100 rounded px-3 py-2 border border-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả môn học</option>
              {[
                { id: 'HOA_HOC', label: 'Hóa Học' },
                { id: 'TOAN', label: 'Toán' },
                { id: 'LY', label: 'Vật Lý' },
                { id: 'SINH', label: 'Sinh Học' },
                { id: 'VAN', label: 'Ngữ Văn' },
                { id: 'ANH', label: 'Tiếng Anh' },
                { id: 'SU', label: 'Lịch Sử' },
                { id: 'DIA', label: 'Địa Lý' }
              ].map(subject => (
                <option key={subject.id} value={subject.id}>{subject.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
              Quản lý đề thi
            </h1>
            <p className="text-blue-300 mt-2">
              {activeTab === 'all' ? 'Tất cả đề thi' : 
               activeTab === 'DRAFT' ? 'Đề thi nháp' :
               activeTab === 'PUBLISHED' ? 'Đề thi đã xuất bản' : 'Đề thi đã lưu trữ'}
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-500"
          >
            Tạo đề thi mới
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
            <div className="flex items-center text-red-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm đề thi..."
            value={filters.keyword || ''}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="w-full bg-blue-900/50 text-blue-100 placeholder-blue-400 rounded-lg px-4 py-3 border border-blue-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Exam List */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-300">Đang tải...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[200px] text-red-500">
            <p>{error}</p>
          </div>
        ) : (exams?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(exams || []).map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-blue-900/20 rounded-lg p-8 border border-blue-800">
            <p className="text-blue-300 text-lg">
              {error 
                ? 'Không thể tải danh sách đề thi.'
                : filters.keyword 
                  ? 'Không tìm thấy đề thi phù hợp với từ khóa tìm kiếm.' 
                  : 'Chưa có đề thi nào.'
              }
            </p>
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <ExamFormModal
            isOpen={true}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedExam(null);
            }}
            onSubmit={handleSubmit}
            exam={selectedExam || undefined}
          />
        )}

        {selectedExam && showPreview && (
          <ExamPreview
            exam={selectedExam}
            onClose={() => {
              setShowPreview(false);
              setSelectedExam(null);
            }}
          />
        )}
      </div>
    </div>
  );
}