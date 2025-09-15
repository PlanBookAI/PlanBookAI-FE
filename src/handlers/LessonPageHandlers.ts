import { LessonPlan, LessonTemplate } from '@/types/lesson';

export interface LessonPageHandlersProps {
  // Hook functions
  getLessonPlan: (id: number) => Promise<LessonPlan>;
  createLessonPlan: (data: any) => Promise<any>;
  updateLessonPlan: (id: number, data: any) => Promise<any>;
  deleteLessonPlan: (id: number) => Promise<boolean>;
  copyLessonPlan: (id: number) => Promise<any>;
  transitionStatus?: (id: number, action: 'phe-duyet' | 'xuat-ban' | 'luu-tru') => Promise<boolean>;
  createFromTemplate: (templateId: number, data: any) => Promise<any>;
  getTemplate: (id: number) => Promise<LessonTemplate>;
  createTemplate: (data: any) => Promise<any>;

  // Template functions 
  updateTemplate: (id: number, data: any) => Promise<any>;
  deleteTemplate: (id: string) => Promise<any>;
  getTemplates: () => Promise<void>;
  
  // State setters
  setSelectedLessonPlan: (lesson: LessonPlan | null) => void;
  setSelectedTemplate: (template: LessonTemplate | null) => void;
  setShowDetailModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowTemplateModal: (show: boolean) => void;
  setShowCreateTemplateModal: (show: boolean) => void;
  setShowCreateFromTemplateModal: (show: boolean) => void;

  // Modal state setter
  setModalState: (updater: (prev: any) => any) => void;
}

export class LessonPageHandlers {
  constructor(private props: LessonPageHandlersProps) {}

  // ================== LESSON PLAN HANDLERS ==================

  handleViewLessonPlan = async (lesson: LessonPlan) => {
    try {
      const detailLesson = await this.props.getLessonPlan(lesson.id);
      this.props.setSelectedLessonPlan(detailLesson);
      this.props.setShowDetailModal(true);
    } catch (error) {
      alert('Không thể tải chi tiết giáo án');
      console.error('Error viewing lesson plan:', error);
    }
  };

  handleEditLessonPlan = async (lesson: LessonPlan) => {
    try {
      const detailLesson = await this.props.getLessonPlan(lesson.id);
      this.props.setSelectedLessonPlan(detailLesson);
      this.props.setShowEditModal(true);
    } catch (error) {
      alert('Không thể tải giáo án để chỉnh sửa');
      console.error('Error editing lesson plan:', error);
    }
  };

  handleDeleteLessonPlan = async (lesson: LessonPlan) => {
    if (!confirm(`Bạn có chắc muốn xóa giáo án "${lesson.tieuDe}"?`)) {
      return;
    }

    try {
      await this.props.deleteLessonPlan(lesson.id);
      alert('Xóa giáo án thành công!');
    } catch (error) {
      alert('Không thể xóa giáo án');
      console.error('Error deleting lesson plan:', error);
    }
  };

  handleCopyLessonPlan = async (lesson: LessonPlan) => {
    // Đổi hành vi thành xóa có xác nhận
    if (!confirm(`Bạn có chắc muốn xóa giáo án "${lesson.tieuDe}"?`)) {
      return;
    }
    try {
      await this.props.deleteLessonPlan(lesson.id);
      alert('Xóa giáo án thành công!');
    } catch (error) {
      alert('Không thể xóa giáo án');
      console.error('Error deleting lesson plan:', error);
    }
  };

  handleCreateLessonPlan = async (data: any) => {
    try {
      await this.props.createLessonPlan(data);
      alert('Tạo giáo án thành công!');
      this.props.setShowCreateModal(false);
    } catch (error) {
      alert('Không thể tạo giáo án');
      console.error('Error creating lesson plan:', error);
      throw error; // Re-throw để modal có thể handle loading state
    }
  };

  handleUpdateLessonPlan = async (data: any) => {
    try {
      await this.props.updateLessonPlan(data.id, data);
      alert('Cập nhật giáo án thành công!');
      this.props.setShowEditModal(false);
      this.props.setSelectedLessonPlan(null);
    } catch (error) {
      alert('Không thể cập nhật giáo án');
      console.error('Error updating lesson plan:', error);
      throw error; // Re-throw để modal có thể handle loading state
    }
  };

  // Trạng thái
  handleApprove = async (lesson: LessonPlan) => {
    if (!this.props.transitionStatus) return;
    try {
      await this.props.transitionStatus(lesson.id, 'phe-duyet');
      alert('Đã phê duyệt giáo án');
    } catch (error) {
      alert('Không thể phê duyệt');
    }
  };

  handlePublish = async (lesson: LessonPlan) => {
    if (!this.props.transitionStatus) return;
    try {
      await this.props.transitionStatus(lesson.id, 'xuat-ban');
      alert('Đã xuất bản giáo án');
    } catch (error) {
      alert('Không thể xuất bản');
    }
  };

  handleArchive = async (lesson: LessonPlan) => {
    if (!this.props.transitionStatus) return;
    try {
      await this.props.transitionStatus(lesson.id, 'luu-tru');
      alert('Đã lưu trữ giáo án');
    } catch (error) {
      alert('Không thể lưu trữ');
    }
  };

  // ================== TEMPLATE HANDLERS ==================

  handleViewTemplate = async (template: LessonTemplate) => {
    try {
      const detailTemplate = await this.props.getTemplate(template.id);
      this.props.setSelectedTemplate(detailTemplate);
      this.props.setShowCreateFromTemplateModal(true);
    } catch (error) {
      alert('Không thể tải chi tiết mẫu');
      console.error('Error viewing template:', error); 
    }
  };

  handleCreateFromTemplate = async (templateId: number, data: any) => {
    try {
      await this.props.createFromTemplate(templateId, data);
      alert('Tạo giáo án từ mẫu thành công!');
      this.props.setShowCreateFromTemplateModal(false);
      this.props.setSelectedTemplate(null);
    } catch (error) {
      alert('Không thể tạo giáo án từ mẫu');
      console.error('Error creating from template:', error);
      throw error; // Re-throw để modal có thể handle loading state
    }
  };

  handleCreateTemplate = async (data: any) => {
    try {
      await this.props.createTemplate(data);
      alert('Tạo mẫu thành công!');
      this.props.setShowCreateTemplateModal(false);
    } catch (error) {
      alert('Không thể tạo mẫu');
      console.error('Error creating template:', error);
      throw error; // Re-throw để modal có thể handle loading state
    }
  };
  handleUpdateTemplate = async (data: any) => {
    try {
      await this.props.updateTemplate(data.id, data);
      alert('Cập nhật mẫu thành công!');
      this.props.setShowCreateTemplateModal(false);
      this.props.setSelectedTemplate(null);
    } catch (error) {
      alert('Không thể cập nhật mẫu');
      console.error('Error updating template:', error);
      throw error; // Re-throw để modal có thể handle loading state
    }
  };

  handleSelectTemplate = (template: LessonTemplate) => {
    this.props.setSelectedTemplate(template);
    this.props.setShowTemplateModal(false);
    this.props.setShowCreateFromTemplateModal(true);
  };

  // ================== MODAL HANDLERS ==================

  handleCloseDetailModal = () => {
    this.props.setShowDetailModal(false);
    this.props.setSelectedLessonPlan(null);
  };

  handleCloseEditModal = () => {
    this.props.setShowEditModal(false);
    this.props.setSelectedLessonPlan(null);
  };

  handleCloseCreateModal = () => {
    this.props.setShowCreateModal(false);
  };

  handleCloseTemplateModal = () => {
    this.props.setShowTemplateModal(false);
  };

  handleCloseCreateTemplateModal = () => {
    this.props.setShowCreateTemplateModal(false);
  };

  handleCloseCreateFromTemplateModal = () => {
    this.props.setShowCreateFromTemplateModal(false);
    this.props.setSelectedTemplate(null);
  };

  // Edit from detail modal
  handleEditFromDetailModal = (lesson: LessonPlan) => {
    this.props.setShowDetailModal(false);
    this.handleEditLessonPlan(lesson);
  };

  // Handle edit template
  handleEditTemplate = (template: LessonTemplate) => {
    console.log('Edit template:', template);
    // Mở modal edit template với dữ liệu hiện tại
    this.props.setModalState(prev => ({
      ...prev,
      showCreateFromTemplateModal: false,
      showTemplateModal: false,
      showCreateTemplateModal: true,
      selectedTemplate: template
    }));
  };

  // Handle delete template
  handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mẫu này?')) {
      return;
    }

    // Kiểm tra templateId hợp lệ (UUID format)
    if (!templateId || templateId.trim() === '') {
      alert('ID mẫu không hợp lệ!');
      return;
    }
    
    try {
      console.log('Deleting template:', templateId);
      const result = await this.props.deleteTemplate(templateId);
      
      if (result.thanhCong) {
        alert('Xóa mẫu thành công!');
        // Refresh danh sách mẫu
        await this.props.getTemplates();
        // Đóng modal
        this.props.setModalState(prev => ({
          ...prev,
          showCreateFromTemplateModal: false
        }));
      } else {
        alert('Xóa mẫu thất bại: ' + result.thongDiep);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Lỗi khi xóa mẫu');
    }
  };
}
