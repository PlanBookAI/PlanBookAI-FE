import { useState } from 'react';
import Button from '@/components/ui/button';
import { LessonPlan, Topic } from '@/types/lesson';

interface LessonFormModalProps {
  lesson?: LessonPlan; // Nếu có lesson thì là edit, không có là create
  topics: Topic[];
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function LessonFormModal({ lesson, topics, onSubmit, onClose, isLoading = false }: LessonFormModalProps) {
  const isEditing = !!lesson;
  
  // Form state
  const [formData, setFormData] = useState({
    tieuDe: lesson?.tieuDe || '',
    mucTieu: lesson?.mucTieu || '',
    khoi: lesson?.khoi || 10,
    monHoc: lesson?.monHoc || 1, // 1 = HOA_HOC
    thoiLuongTiet: lesson?.thoiLuongTiet || 1,
    lopHoc: lesson?.lopHoc || '',
    ghiChu: lesson?.ghiChu || '',
    suDungAI: lesson?.suDungAI || false,
    yeuCauDacBiet: lesson?.yeuCauDacBiet || '',
    chuDeId: lesson?.chuDeId || undefined,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'khoi' || name === 'monHoc' || name === 'thoiLuongTiet') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }

    if (name === 'chuDeId') {
      setFormData(prev => ({ ...prev, chuDeId: value === '' ? undefined : Number(value) }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tieuDe.trim()) {
      newErrors.tieuDe = 'Tiêu đề không được để trống';
    }
    
    if (formData.thoiLuongTiet < 1) {
      newErrors.thoiLuongTiet = 'Thời lượng tiết phải lớn hơn 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        // Nếu đang edit thì gửi id
        ...(isEditing ? { id: lesson.id } : {})
      };
      
      await onSubmit(apiData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isEditing ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  )}
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Chỉnh sửa giáo án' : 'Tạo giáo án mới'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? 'Cập nhật thông tin giáo án' : 'Nhập thông tin cho giáo án mới'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Tiêu đề */}
            <div className="space-y-2">
              <label htmlFor="tieuDe" className="block text-sm font-medium text-gray-700">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tieuDe"
                name="tieuDe"
                value={formData.tieuDe}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.tieuDe ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading}
              />
              {errors.tieuDe && (
                <p className="text-red-500 text-xs">{errors.tieuDe}</p>
              )}
            </div>

            {/* Mục tiêu */}
            <div className="space-y-2">
              <label htmlFor="mucTieu" className="block text-sm font-medium text-gray-700">
                Mục tiêu
              </label>
              <textarea
                id="mucTieu"
                name="mucTieu"
                value={formData.mucTieu}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* Thông tin cơ bản - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Khối */}
              <div className="space-y-2">
                <label htmlFor="khoi" className="block text-sm font-medium text-gray-700">
                  Khối <span className="text-red-500">*</span>
                </label>
                <select
                  id="khoi"
                  name="khoi"
                  value={formData.khoi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value={10}>Khối 10</option>
                  <option value={11}>Khối 11</option>
                  <option value={12}>Khối 12</option>
                </select>
              </div>

              {/* Chủ đề */}
              <div className="space-y-2">
                <label htmlFor="chuDeId" className="block text-sm font-medium text-gray-700">
                  Chủ đề
                </label>
                <select
                  id="chuDeId"
                  name="chuDeId"
                  value={formData.chuDeId ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={isLoading}
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.ten}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thời lượng tiết */}
              <div className="space-y-2">
                <label htmlFor="thoiLuongTiet" className="block text-sm font-medium text-gray-700">
                  Thời lượng tiết <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="thoiLuongTiet"
                  name="thoiLuongTiet"
                  value={formData.thoiLuongTiet}
                  onChange={handleChange}
                  min={1}
                  className={`w-full px-3 py-2 border ${errors.thoiLuongTiet ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={isLoading}
                />
                {errors.thoiLuongTiet && (
                  <p className="text-red-500 text-xs">{errors.thoiLuongTiet}</p>
                )}
              </div>

              {/* Lớp học */}
              <div className="space-y-2">
                <label htmlFor="lopHoc" className="block text-sm font-medium text-gray-700">
                  Lớp học
                </label>
                <input
                  type="text"
                  id="lopHoc"
                  name="lopHoc"
                  value={formData.lopHoc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <label htmlFor="ghiChu" className="block text-sm font-medium text-gray-700">
                Ghi chú
              </label>
              <textarea
                id="ghiChu"
                name="ghiChu"
                value={formData.ghiChu}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* Yêu cầu đặc biệt */}
            <div className="space-y-2">
              <label htmlFor="yeuCauDacBiet" className="block text-sm font-medium text-gray-700">
                Yêu cầu đặc biệt
              </label>
              <input
                type="text"
                id="yeuCauDacBiet"
                name="yeuCauDacBiet"
                value={formData.yeuCauDacBiet}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* Sử dụng AI */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="suDungAI"
                name="suDungAI"
                checked={formData.suDungAI}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="suDungAI" className="ml-2 block text-sm text-gray-700">
                Sử dụng AI hỗ trợ
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                isEditing ? 'Cập nhật' : 'Tạo giáo án'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
