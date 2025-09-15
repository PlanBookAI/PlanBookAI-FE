import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LessonTemplate, Topic } from '@/types/lesson';

interface CreateFromTemplateModalProps {
  template: LessonTemplate;
  topics: Topic[];
  onSubmit: (templateId: number, data: any) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  onEdit?: (template: LessonTemplate) => void;
  onDelete?: (templateId: string) => void;
}

export function CreateFromTemplateModal({ template, topics, onSubmit, onClose, isLoading = false, onEdit, onDelete }: CreateFromTemplateModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    tieuDe: `${template.tieuDe}`,
    khoi: template.khoi,
    monHoc: 1, // HOA_HOC
    thoiLuongTiet: 1,
    lopHoc: '',
    ghiChu: '',
    suDungAI: false,
    yeuCauDacBiet: '',
    chuDeId: '' as string,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'khoi' || name === 'monHoc' || name === 'thoiLuongTiet') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'chuDeId') {
      setFormData(prev => ({ ...prev, chuDeId: value })); 
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
        TieuDe: formData.tieuDe,
        Khoi: formData.khoi,
        MonHoc: formData.monHoc,
        ThoiLuongTiet: formData.thoiLuongTiet,
        LopHoc: formData.lopHoc || undefined,
        GhiChu: formData.ghiChu || undefined,
        SuDungAI: formData.suDungAI,
        YeuCauDacBiet: formData.yeuCauDacBiet || undefined,
        ChuDeId: formData.chuDeId ? Number(formData.chuDeId) : undefined
      };
      
      await onSubmit(template.id, apiData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  // Lọc chủ đề theo khối được chọn
  const filteredTopics = topics.filter(topic => 
    !formData.khoi || topic.khoi === formData.khoi
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Mẫu giáo án</h2>
                <p className="text-sm text-gray-500">{template.tieuDe}</p>
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

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1">
          {/* Template info */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin mẫu</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Tiêu đề:</span>
                  <p className="text-sm text-gray-900">{template.tieuDe}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Mô tả:</span>
                  <p className="text-sm text-gray-900">{template.moTa}</p>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Môn học:</span>
                    <p className="text-sm text-gray-900">{template.monHoc === 'HOA_HOC' ? 'Hóa học' : template.monHoc}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Khối:</span>
                    <p className="text-sm text-gray-900">{template.khoi}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Người tạo:</span>
                  <p className="text-sm text-gray-900">{template.nguoiTaoTen || 'Không có thông tin'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cấu trúc mẫu</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Mục tiêu học tập:</h4>
                  <p className="text-gray-700 bg-white p-3 rounded-md mt-1">
                    {template.noiDungMau?.mucTieu || 'Chưa có thông tin'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Thời lượng:</h4>
                  <p className="text-gray-700 bg-white p-3 rounded-md mt-1">
                    {template.noiDungMau?.thoiLuong || 'Chưa có thông tin'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Phương pháp giảng dạy:</h4>
                  <p className="text-gray-700 bg-white p-3 rounded-md mt-1">
                    {template.noiDungMau?.phuongPhap || 'Chưa có thông tin'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Nội dung bài học:</h4>
                  <div className="bg-white p-3 rounded-md mt-1">
                    {Array.isArray(template.noiDungMau?.noiDung) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {template.noiDungMau.noiDung.map((item: string, index: number) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">Chưa có thông tin</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Thiết bị cần thiết:</h4>
                  <div className="bg-white p-3 rounded-md mt-1">
                    {Array.isArray(template.noiDungMau?.thietBi) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {template.noiDungMau.thietBi.map((item: string, index: number) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">Chưa có thông tin</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="tieuDe" className="block text-sm font-medium text-gray-700">
                Tiêu đề giáo án <span className="text-red-500">*</span>
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="chuDeId" className="block text-sm font-medium text-gray-700">
                  Chủ đề
                </label>
                <select
                  id="chuDeId"
                  name="chuDeId"
                  value={formData.chuDeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, chuDeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {formData.chuDeId && !filteredTopics.some(t => String(t.id) === formData.chuDeId) && (
                    <option value={formData.chuDeId}>Đang chọn (ID {formData.chuDeId})</option>
                  )}
                  {filteredTopics.map(topic => (
                    <option key={topic.id} value={String(topic.id)}>
                      {topic.ten}
                    </option>
                  ))}
                </select>
              </div>

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

            <div className="space-y-2">
              <label htmlFor="ghiChu" className="block text-sm font-medium text-gray-700">
                Ghi chú
              </label>
              <textarea
                id="ghiChu"
                name="ghiChu"
                value={formData.ghiChu}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

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
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between bg-white relative z-10">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => onEdit?.(template)}
              disabled={isLoading}
              className="!visible !opacity-100 !block"
              style={{
                visibility: 'visible' as const,
                opacity: 1,
                display: 'block',
                color: 'blue',
                backgroundColor: 'white',
                borderColor: 'blue'
              }}
            >
              Sửa
            </Button>
            <Button
              variant="secondary"
              onClick={() => onDelete?.(template.id.toString())}
              disabled={isLoading}
              className="!visible !opacity-100 !block"
              style={{
                visibility: 'visible' as const,
                opacity: 1,
                display: 'block',
                color: 'red',
                backgroundColor: 'white',
                borderColor: 'red'
              }}
            >
              Xóa
            </Button>
          </div>
          
          <div className="flex space-x-2"> 

          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="!visible !opacity-100 !block"
            style={{
              visibility: 'visible' as const,
              opacity: 1,
              display: 'block',
              color: 'black',
              backgroundColor: 'white',
              }}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
            className="!visible !opacity-100 !block"
            style={{ 
              visibility: 'visible' as const, 
              opacity: 1,
              display: 'block',
              color: 'white',
              backgroundColor: 'blue',
            }}
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
              'Tạo giáo án từ mẫu'
            )}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
