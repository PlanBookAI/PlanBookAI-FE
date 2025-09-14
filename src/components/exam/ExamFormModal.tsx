import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import type { DeThi, MonHoc, CauHoi } from '@/types/exam';
import { QuestionManager } from './QuestionManager';

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exam: Partial<DeThi>) => Promise<void>;
  exam?: DeThi;
}

export function ExamFormModal({
  isOpen,
  onClose,
  onSubmit,
  exam
}: ExamFormModalProps) {
  const [formData, setFormData] = useState<Partial<DeThi>>(() => ({
    tieuDe: exam?.tieuDe || '',
    huongDan: exam?.huongDan || '',
    khoiLop: exam?.khoiLop || 10,
    monHoc: exam?.monHoc || 'TOAN',
    thoiGianLamBai: exam?.thoiGianLamBai || 45,
    tongDiem: exam?.tongDiem || 10,
    trangThai: exam?.trangThai || 'DRAFT',
    cauHois: exam?.cauHois || []
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (exam && isOpen) {
      setFormData({
        tieuDe: exam.tieuDe,
        huongDan: exam.huongDan,
        khoiLop: exam.khoiLop,
        monHoc: exam.monHoc,
        thoiGianLamBai: exam.thoiGianLamBai,
        tongDiem: exam.tongDiem,
        trangThai: exam.trangThai,
        cauHois: exam.cauHois
      });
    }
  }, [exam, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof DeThi, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-blue-900 to-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-100">
              {exam ? 'Chỉnh sửa đề thi' : 'Tạo đề thi mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(30, 58, 138, 0.1);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(59, 130, 246, 0.5);
              border-radius: 4px;
              transition: all 0.2s;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(59, 130, 246, 0.7);
            }
            select option {
              background-color: rgb(30 58 138);
              color: white;
            }
          `}</style>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200">Tiêu đề</label>
                <Input
                  type="text"
                  value={formData.tieuDe || ''}
                  onChange={(e) => handleInputChange('tieuDe', e.target.value)}
                  placeholder="Nhập tiêu đề đề thi"
                  className="mt-1 w-full px-3 py-2 rounded-md bg-blue-950 border border-blue-500 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200">Hướng dẫn</label>
                <textarea
                  value={formData.huongDan || ''}
                  onChange={(e) => handleInputChange('huongDan', e.target.value)}
                  placeholder="Nhập hướng dẫn làm bài"
                  className="mt-1 w-full px-3 py-2 rounded-md bg-blue-950 border border-blue-500 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 min-h-[100px] resize-y"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200">Khối</label>
                  <div className="relative">
                    <select
                      value={formData.khoiLop || ''}
                      onChange={(e) => handleInputChange('khoiLop', parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 rounded-md bg-blue-950 border border-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer pr-8"
                      required
                    >
                      <option value="">Chọn khối</option>
                      {['6', '7', '8', '9', '10', '11', '12'].map(grade => (
                        <option key={grade} value={grade}>Khối {grade}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-1">
                      <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-blue-200">Môn học</label>
                  <div className="relative">
                    <select
                      value={formData.monHoc || ''}
                      onChange={(e) => handleInputChange('monHoc', e.target.value as MonHoc)}
                      className="mt-1 w-full px-3 py-2 rounded-md bg-blue-950 border border-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer pr-8"
                      required
                    >
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
                        <option key={subject.id} value={subject.id}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-1">
                      <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200">Thời gian (phút)</label>
                  <Input
                    type="number"
                    value={formData.thoiGianLamBai || 45}
                    onChange={(e) => handleInputChange('thoiGianLamBai', parseInt(e.target.value))}
                    min={1}
                    className="mt-1 w-full px-3 py-2 rounded-md bg-blue-950 border border-blue-500 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200">Tổng điểm</label>
                  <Input
                    type="number"
                    value={formData.tongDiem || 10}
                    onChange={(e) => handleInputChange('tongDiem', parseFloat(e.target.value))}
                    min={0}
                    step={0.5}
                    className="mt-1 w-full px-3 py-2 rounded-md bg-blue-950 border border-blue-500 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Question Manager */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-blue-100 mb-4">Danh sách câu hỏi</h3>
              <QuestionManager
                questions={formData.cauHois || []}
                onQuestionsChange={(questions) => handleInputChange('cauHois', questions)}
                monHoc={formData.monHoc || 'TOAN'}
              />
            </div>
          </form>
        </div>

        {/* Footer Buttons - Fixed */}
        <div className="bg-gradient-to-b from-blue-900 to-gray-900 p-6 border-t border-blue-800">
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              className="bg-blue-900 hover:bg-blue-800 text-blue-100 px-6"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]"
              onClick={handleSubmit}
            >
              {loading ? 'Đang xử lý...' : exam ? 'Lưu thay đổi' : 'Tạo đề thi'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}