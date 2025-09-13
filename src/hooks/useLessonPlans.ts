import { useState, useEffect, useCallback } from 'react';
import { LessonService } from '@/services/lesson';
import { LessonPlan, LessonPlanFilters, LessonStatus } from '@/types/lesson';

/**
 * Custom hook để quản lý state và logic cho danh sách giáo án
 */
export const useLessonPlans = () => {
  // State
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    drafts: 0,
    completed: 0, 
    published: 0,
    archived: 0,
  });

  // Fetch lesson plans với filters
  const fetchLessonPlans = useCallback(async (filters?: LessonPlanFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LessonService.getLessonPlans(filters);
      
      if (response.thanhCong && Array.isArray(response.duLieu)) {
        setLessonPlans(response.duLieu);
        
        // Tính toán stats từ dữ liệu
        const lessons = response.duLieu;
        setStats({
          total: lessons.length,
          drafts: lessons.filter(l => l.trangThai === 'DRAFT').length,
          completed: lessons.filter(l => l.trangThai === 'COMPLETED').length,
          published: lessons.filter(l => l.trangThai === 'PUBLISHED').length,
          archived: lessons.filter(l => l.trangThai === 'ARCHIVED').length,
        });
      } else {
        setError(response.thongDiep || 'Không thể tải danh sách giáo án');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách giáo án');
      console.error('Error fetching lesson plans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy chi tiết giáo án
  const getLessonPlan = useCallback(async (id: number) => {
    try {
      const response = await LessonService.getLessonPlan(id);
      
      if (response.thanhCong && response.duLieu) {
        return response.duLieu as LessonPlan;
      } else {
        throw new Error(response.thongDiep || 'Không thể tải chi tiết giáo án');
      }
    } catch (err) {
      console.error('Error getting lesson plan:', err);
      throw err;
    }
  }, []);

  // Tạo giáo án mới
  const createLessonPlan = useCallback(async (data: any) => {
    try {
      const response = await LessonService.createLessonPlan(data);
      
      if (response.thanhCong && response.duLieu) {
        // Refresh danh sách sau khi tạo thành công
        fetchLessonPlans();
        return response.duLieu;
      } else {
        throw new Error(response.thongDiep || 'Không thể tạo giáo án');
      }
    } catch (err) {
      console.error('Error creating lesson plan:', err);
      throw err;
    }
  }, [fetchLessonPlans]);

  // Cập nhật giáo án
  const updateLessonPlan = useCallback(async (id: number, data: any) => {
    try {
      const response = await LessonService.updateLessonPlan({
        id,
        ...data
      });
      
      if (response.thanhCong && response.duLieu) {
        // Refresh danh sách sau khi cập nhật thành công
        fetchLessonPlans();
        return response.duLieu;
      } else {
        throw new Error(response.thongDiep || 'Không thể cập nhật giáo án');
      }
    } catch (err) {
      console.error('Error updating lesson plan:', err);
      throw err;
    }
  }, [fetchLessonPlans]);

  // Xóa giáo án
  const deleteLessonPlan = useCallback(async (id: number) => {
    try {
      const response = await LessonService.deleteLessonPlan(id);
      
      if (response.thanhCong) {
        // Refresh danh sách sau khi xóa thành công
        fetchLessonPlans();
        return true;
      } else {
        throw new Error(response.thongDiep || 'Không thể xóa giáo án');
      }
    } catch (err) {
      console.error('Error deleting lesson plan:', err);
      throw err;
    }
  }, [fetchLessonPlans]);

  // Sao chép giáo án
  const copyLessonPlan = useCallback(async (id: number) => {
    try {
      const response = await LessonService.copyLessonPlan(id);
      
      if (response.thanhCong && response.duLieu) {
        // Refresh danh sách sau khi sao chép thành công
        fetchLessonPlans();
        return response.duLieu;
      } else {
        throw new Error(response.thongDiep || 'Không thể sao chép giáo án');
      }
    } catch (err) {
      console.error('Error copying lesson plan:', err);
      throw err;
    }
  }, [fetchLessonPlans]);

  // Chuyển trạng thái giáo án
  const transitionStatus = useCallback(async (id: number, action: 'phe-duyet' | 'xuat-ban' | 'luu-tru') => {
    try {
      let response;
      
      switch (action) {
        case 'phe-duyet':
          response = await LessonService.approveLessonPlan(id);
          break;
        case 'xuat-ban':
          response = await LessonService.publishLessonPlan(id);
          break;
        case 'luu-tru':
          response = await LessonService.archiveLessonPlan(id);
          break;
      }
      
      if (response && response.thanhCong) {
        // Refresh danh sách sau khi chuyển trạng thái thành công
        fetchLessonPlans();
        return true;
      } else {
        throw new Error(response?.thongDiep || 'Không thể chuyển trạng thái giáo án');
      }
    } catch (err) {
      console.error(`Error transitioning lesson plan status (${action}):`, err);
      throw err;
    }
  }, [fetchLessonPlans]);

  // Tạo giáo án từ mẫu
  const createFromTemplate = useCallback(async (templateId: number, data: any) => {
    try {
      const response = await LessonService.createLessonPlanFromTemplate(templateId, data);
      
      if (response.thanhCong && response.duLieu) {
        // Refresh danh sách sau khi tạo thành công
        fetchLessonPlans();
        return response.duLieu;
      } else {
        throw new Error(response.thongDiep || 'Không thể tạo giáo án từ mẫu');
      }
    } catch (err) {
      console.error('Error creating lesson plan from template:', err);
      throw err;
    }
  }, [fetchLessonPlans]);

  // Filter lesson plans theo trạng thái
  const filterByStatus = useCallback((status?: LessonStatus) => {
    if (!status) return lessonPlans;
    return lessonPlans.filter(plan => plan.trangThai === status);
  }, [lessonPlans]);

  return {
    lessonPlans,
    loading,
    error,
    stats,
    fetchLessonPlans,
    getLessonPlan,
    createLessonPlan,
    updateLessonPlan,
    deleteLessonPlan,
    copyLessonPlan,
    transitionStatus,
    createFromTemplate,
    filterByStatus
  };
};

export default useLessonPlans;
