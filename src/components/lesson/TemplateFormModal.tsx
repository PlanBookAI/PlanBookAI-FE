import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LessonTemplate, GradeLevel, Topic } from '@/types/lesson';

interface TemplateFormModalProps {
  template?: LessonTemplate; // Nếu có template thì là edit, không có là create
  topics: Topic[];
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function TemplateFormModal({ template, topics = [], onSubmit, onClose, isLoading = false }: TemplateFormModalProps) {
  const isEditing = !!template;
  
  // Form state
  const [formData, setFormData] = useState({
    tieuDe: template?.tieuDe || '',
    moTa: template?.moTa || '',
    monHoc: template?.monHoc || 'HOA_HOC',
    khoi: template?.khoi || 10,
    chuDeId: template?.chuDeId != null ? String(template.chuDeId) : '',
    trangThai: template?.trangThai || 'INACTIVE',
    mucTieuItems: template?.noiDungMau?.mucTieu ? template.noiDungMau.mucTieu.split(', ') : ['Kiến thức', 'Kỹ năng', 'Thái độ'],
    noiDungKhungItems: Array.isArray(template?.noiDungMau?.noiDung) ? template.noiDungMau.noiDung : ['Ổn định', 'Bài mới', 'Củng cố', 'Dặn dò'],
    thoiLuong: template?.noiDungMau?.thoiLuong || '2 tiết',
    phuongPhap: template?.noiDungMau?.phuongPhap || 'Thuyết trình, thí nghiệm',
    thietBiItems: Array.isArray(template?.noiDungMau?.thietBi) ? template.noiDungMau.thietBi : ['Máy chiếu', 'Bảng viết', 'Sách giáo khoa']
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'khoi') {
      setFormData(prev => ({ ...prev, [name]: Number(value) as GradeLevel }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Helpers cho list inputs
  const handleListChange = (field: 'mucTieuItems' | 'noiDungKhungItems' | 'thietBiItems', index: number, value: string) => {
    setFormData(prev => {
      const list = [...(prev as any)[field]] as string[];
      list[index] = value;
      return { ...prev, [field]: list } as any;
    });
  };

  const addListItem = (field: 'mucTieuItems' | 'noiDungKhungItems' | 'thietBiItems') => {
    setFormData(prev => ({ ...prev, [field]: [ ...(prev as any)[field], '' ] } as any));
  };
  
  const removeListItem = (field: 'mucTieuItems' | 'noiDungKhungItems' | 'thietBiItems', index: number) => {
    setFormData(prev => {
      const list = [ ...(prev as any)[field] ] as string[];
      list.splice(index, 1);
      return { ...prev, [field]: list } as any;
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tieuDe.trim()) {
      newErrors.tieuDe = 'Tiêu đề không được để trống';
    }
    
    if (!formData.moTa.trim()) {
      newErrors.moTa = 'Mô tả không được để trống';
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
      // Convert form to API format (camelCase) 
      const apiPayload = {
        ...(isEditing ? { id: template.id } : {}),
        tieuDe: formData.tieuDe,
        moTa: formData.moTa,
        monHoc: formData.monHoc,
        khoi: formData.khoi,
        chuDeId: formData.chuDeId ? Number(formData.chuDeId) : undefined,
        trangThai: formData.trangThai,
        noiDungMau: {
          mucTieu: formData.mucTieuItems.filter(Boolean).join(', '),
          thoiLuong: formData.thoiLuong,
          phuongPhap: formData.phuongPhap,
          noiDung: formData.noiDungKhungItems.filter(Boolean),
          thietBi: formData.thietBiItems.filter(Boolean)
        }
      };
      
      await onSubmit(apiPayload);
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isEditing ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  )}
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Chỉnh sửa mẫu giáo án' : 'Tạo mẫu giáo án mới'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? 'Cập nhật thông tin mẫu giáo án' : 'Nhập thông tin cho mẫu giáo án mới'}
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

            {/* Mô tả */}
            <div className="space-y-2">
              <label htmlFor="moTa" className="block text-sm font-medium text-gray-700">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                id="moTa"
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border ${errors.moTa ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading}
              />
              {errors.moTa && (
                <p className="text-red-500 text-xs">{errors.moTa}</p>
              )}
            </div>

            {/* Thông tin cơ bản - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Môn học */}
              <div className="space-y-2">
                <label htmlFor="monHoc" className="block text-sm font-medium text-gray-700">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  id="monHoc"
                  name="monHoc"
                  value={formData.monHoc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="HOA_HOC">Hóa học</option>
                </select>
              </div>

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
            </div>

            {/* Chủ đề */}
            <div className="space-y-2">
              <label htmlFor="chuDeId" className="block text-sm font-medium text-gray-700">
                Chủ đề
              </label>
              <select
                id="chuDeId"
                name="chuDeId"
                value={formData.chuDeId}
                onChange={(e) => {
                  setFormData({ ...formData, chuDeId: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">-- Chọn chủ đề --</option>
                {formData.chuDeId && !topics.some(t => String(t.id) === formData.chuDeId) && (
                  <option value={formData.chuDeId}>Đang chọn (ID {formData.chuDeId})</option>
                )}
                {topics.map((topic) => (
                  <option key={topic.id} value={String(topic.id)}>
                    {topic.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label htmlFor="trangThai" className="block text-sm font-medium text-gray-700">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                id="trangThai"
                name="trangThai"
                value={formData.trangThai}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="INACTIVE">Riêng tư (chỉ tôi thấy)</option>
                <option value="ACTIVE">Công khai (mọi người có thể sử dụng)</option>
              </select>
              <p className="text-xs text-gray-500">
                Mẫu công khai sẽ hiển thị trong danh sách mẫu cho tất cả giáo viên
              </p>
            </div>

            {/* Thời lượng */}
            <div className="space-y-2">
              <label htmlFor="thoiLuong" className="block text-sm font-medium text-gray-700">
                Thời lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="thoiLuong"
                name="thoiLuong"
                value={formData.thoiLuong}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="VD: 2 tiết, 45 phút"
              />
            </div>

            {/* Phương pháp */}
            <div className="space-y-2">
              <label htmlFor="phuongPhap" className="block text-sm font-medium text-gray-700">
                Phương pháp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phuongPhap"
                name="phuongPhap"
                value={formData.phuongPhap}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="VD: Thuyết trình, thí nghiệm, thảo luận"
              />
            </div>

            {/* Cấu trúc mẫu - UI thân thiện */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mục tiêu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu</label>
                <div className="space-y-2">
                  {formData.mucTieuItems.map((item: string, idx: number) => (
                    <div key={`mt-${idx}`} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListChange('mucTieuItems', idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem('mucTieuItems', idx)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={() => addListItem('mucTieuItems')} className="bg-gray-100 text-gray-700 hover:bg-gray-200">Thêm mục tiêu</Button>
                </div>
              </div>

              {/* Nội dung khung */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung khung</label>
                <div className="space-y-2">
                  {formData.noiDungKhungItems.map((item: string, idx: number) => (
                    <div key={`ndk-${idx}`} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListChange('noiDungKhungItems', idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem('noiDungKhungItems', idx)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={() => addListItem('noiDungKhungItems')} className="bg-gray-100 text-gray-700 hover:bg-gray-200">Thêm nội dung</Button>
                </div>
              </div>
            </div>

            {/* Thiết bị */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thiết bị cần thiết</label>
              <div className="space-y-2">
                {formData.thietBiItems.map((item: string, idx: number) => (
                  <div key={`tb-${idx}`} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('thietBiItems', idx, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem('thietBiItems', idx)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => addListItem('thietBiItems')} className="bg-gray-100 text-gray-700 hover:bg-gray-200">Thêm thiết bị</Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              style={{ visibility: 'visible', opacity: 1, display: 'block' }}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
              style={{ visibility: 'visible', opacity: 1, display: 'block' }}
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
                isEditing ? 'Cập nhật' : 'Tạo mẫu'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
