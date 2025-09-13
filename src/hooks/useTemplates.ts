import { useState, useEffect, useCallback } from 'react';
import { LessonService } from '@/services/lesson';
import { LessonTemplate, TemplateFilters } from '@/types/lesson';

/**
 * Custom hook để quản lý state và logic cho mẫu giáo án (templates)
 */
export const useTemplates = () => {
  // State
  const [publicTemplates, setPublicTemplates] = useState<LessonTemplate[]>([]);
  const [myTemplates, setMyTemplates] = useState<LessonTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    templates_public: 0,
    templates_mine: 0
  });

  // Fetch public templates với filters
  const fetchPublicTemplates = useCallback(async (filters?: TemplateFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LessonService.getPublicTemplates(filters);
      
      if (response.thanhCong && Array.isArray(response.duLieu)) {
        const templates = response.duLieu.map(t => ({ ...t, isPublic: true }));
        setPublicTemplates(templates);
        setStats(prev => ({
          ...prev,
          templates_public: templates.length
        }));
      } else {
        setError(response.thongDiep || 'Không thể tải danh sách mẫu công khai');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách mẫu công khai');
      console.error('Error fetching public templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch my templates với filters
  const fetchMyTemplates = useCallback(async (filters?: TemplateFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LessonService.getMyTemplates(filters);
      
      if (response.thanhCong && Array.isArray(response.duLieu)) {
        const templates = response.duLieu.map(t => ({ ...t, isPublic: false }));
        setMyTemplates(templates);
        setStats(prev => ({
          ...prev,
          templates_mine: templates.length
        }));
      } else {
        setError(response.thongDiep || 'Không thể tải danh sách mẫu của tôi');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách mẫu của tôi');
      console.error('Error fetching my templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy chi tiết mẫu
  const getTemplate = useCallback(async (id: number) => {
    try {
      const response = await LessonService.getTemplate(id);
      
      if (response.thanhCong && response.duLieu) {
        return response.duLieu as LessonTemplate;
      } else {
        throw new Error(response.thongDiep || 'Không thể tải chi tiết mẫu');
      }
    } catch (err) {
      console.error('Error getting template:', err);
      throw err;
    }
  }, []);

  // Tạo mẫu mới
  const createTemplate = useCallback(async (data: any) => {
    try {
      const response = await LessonService.createTemplate(data);
      
      if (response.thanhCong && response.duLieu) {
        // Refresh danh sách sau khi tạo thành công
        fetchMyTemplates();
        return response.duLieu;
      } else {
        throw new Error(response.thongDiep || 'Không thể tạo mẫu');
      }
    } catch (err) {
      console.error('Error creating template:', err);
      throw err;
    }
  }, [fetchMyTemplates]);

  // Cập nhật mẫu
  const updateTemplate = useCallback(async (id: number, data: any) => {
    try {
      const response = await LessonService.updateTemplate({
        id,
        ...data
      });
      
      if (response.thanhCong && response.duLieu) {
        // Refresh danh sách sau khi cập nhật thành công
        fetchMyTemplates();
        return response.duLieu;
      } else {
        throw new Error(response.thongDiep || 'Không thể cập nhật mẫu');
      }
    } catch (err) {
      console.error('Error updating template:', err);
      throw err;
    }
  }, [fetchMyTemplates]);

  // Xóa mẫu
  const deleteTemplate = useCallback(async (id: number) => {
    try {
      const response = await LessonService.deleteTemplate(id);
      
      if (response.thanhCong) {
        // Refresh danh sách sau khi xóa thành công
        fetchMyTemplates();
        return true;
      } else {
        throw new Error(response.thongDiep || 'Không thể xóa mẫu');
      }
    } catch (err) {
      console.error('Error deleting template:', err);
      throw err;
    }
  }, [fetchMyTemplates]);

  // Chia sẻ/hủy chia sẻ mẫu
  const toggleTemplateSharing = useCallback(async (id: number, share: boolean) => {
    try {
      const response = await LessonService.toggleTemplateSharing(id, share);
      
      if (response.thanhCong) {
        // Refresh danh sách sau khi thay đổi trạng thái chia sẻ
        fetchMyTemplates();
        if (share) {
          fetchPublicTemplates();
        }
        return true;
      } else {
        throw new Error(response.thongDiep || 'Không thể thay đổi trạng thái chia sẻ mẫu');
      }
    } catch (err) {
      console.error('Error toggling template sharing:', err);
      throw err;
    }
  }, [fetchMyTemplates, fetchPublicTemplates]);

  // Lấy tất cả templates (public + my)
  const getAllTemplates = useCallback(() => {
    return [...publicTemplates, ...myTemplates];
  }, [publicTemplates, myTemplates]);

  return {
    publicTemplates,
    myTemplates,
    allTemplates: getAllTemplates(),
    loading,
    error,
    stats,
    fetchPublicTemplates,
    fetchMyTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateSharing
  };
};

export default useTemplates;
