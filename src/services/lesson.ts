import { AuthService } from './auth';
import type {
  LessonPlan,
  LessonTemplate,
  Topic,
  LessonPlanCreateRequest,
  LessonPlanUpdateRequest,
  LessonTemplateCreateRequest,
  TopicCreateRequest,
  LessonPlanFilters,
  TemplateFilters,
  LessonPlanResponse,
  TemplateResponse,
  TopicResponse,
  SubjectType,
  GradeLevel,
  LessonStatus
} from '@/types/lesson';

export class LessonService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Helper method để tạo headers với authorization
  private static getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
    };
  }

  // ================== LESSON PLANS ==================

  // GET /api/v1/giao-an - Danh sách giáo án của giáo viên
  static async getLessonPlans(filters?: LessonPlanFilters): Promise<LessonPlanResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.monHoc) params.append('monHoc', filters.monHoc);
      if (filters?.khoi) params.append('khoi', filters.khoi);
      if (filters?.trangThai) params.append('trangThai', filters.trangThai);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const url = `${this.baseUrl}/api/v1/giao-an${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Get lesson plans error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // GET /api/v1/giao-an/{id} - Chi tiết giáo án
  static async getLessonPlan(id: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Get lesson plan error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // POST /api/v1/giao-an - Tạo giáo án mới
  static async createLessonPlan(data: LessonPlanCreateRequest): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Create lesson plan error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // POST /api/v1/giao-an/tu-mau/{templateId} - Tạo giáo án từ mẫu
  static async createLessonPlanFromTemplate(
    templateId: number, 
    data: Partial<LessonPlanCreateRequest>
  ): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/tu-mau/${templateId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Create lesson plan from template error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // PUT /api/v1/giao-an/{id} - Cập nhật giáo án
  static async updateLessonPlan(data: LessonPlanUpdateRequest): Promise<LessonPlanResponse> {
    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Update lesson plan error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // DELETE /api/v1/giao-an/{id} - Xóa giáo án
  static async deleteLessonPlan(id: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Delete lesson plan error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // POST /api/v1/giao-an/{id}/copy - Sao chép giáo án
  static async copyLessonPlan(id: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}/copy`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Copy lesson plan error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // Status transition methods
  static async approveLessonPlan(id: number): Promise<LessonPlanResponse> {
    return this.transitionStatus(id, 'phe-duyet');
  }

  static async publishLessonPlan(id: number): Promise<LessonPlanResponse> {
    return this.transitionStatus(id, 'xuat-ban');
  }

  static async archiveLessonPlan(id: number): Promise<LessonPlanResponse> {
    return this.transitionStatus(id, 'luu-tru');
  }

  private static async transitionStatus(id: number, action: string): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}/${action}`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error(`${action} lesson plan error:`, error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // Filter methods - theo Userflow.txt
  static async searchLessonPlans(keyword: string): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/tim-kiem?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Search lesson plans error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  static async filterByTopic(topicId: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/loc-theo-chu-de/${topicId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Filter by topic error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  static async filterBySubject(subject: SubjectType): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/loc-theo-mon/${subject}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Filter by subject error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  static async filterByGrade(grade: GradeLevel): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/loc-theo-khoi/${grade}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: LessonPlanResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Filter by grade error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // ================== TEMPLATES ==================

  // GET /api/v1/mau-giao-an/cong-khai - Mẫu công khai (không cần token)
  static async getPublicTemplates(filters?: TemplateFilters): Promise<TemplateResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.monHoc) params.append('monHoc', filters.monHoc);
      if (filters?.khoi) params.append('khoi', filters.khoi);

      const url = `${this.baseUrl}/api/v1/mau-giao-an/cong-khai${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }, // Không cần auth
      });

      const result: TemplateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Get public templates error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // GET /api/v1/mau-giao-an/cua-toi - Mẫu của tôi (cần token)
  static async getMyTemplates(filters?: TemplateFilters): Promise<TemplateResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.monHoc) params.append('monHoc', filters.monHoc);
      if (filters?.khoi) params.append('khoi', filters.khoi);

      const url = `${this.baseUrl}/api/v1/mau-giao-an/cua-toi${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: TemplateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Get my templates error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // GET /api/v1/mau-giao-an/{id} - Chi tiết mẫu
  static async getTemplate(id: number): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: TemplateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Get template error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // POST /api/v1/mau-giao-an - Tạo mẫu mới
  static async createTemplate(data: LessonTemplateCreateRequest): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const result: TemplateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Create template error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // PUT /api/v1/mau-giao-an/{id} - Cập nhật mẫu
  static async updateTemplate(id: number, data: Partial<LessonTemplateCreateRequest>): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const result: TemplateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Update template error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // DELETE /api/v1/mau-giao-an/{id} - Xóa mẫu
  static async deleteTemplate(id: number): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const result: TemplateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Delete template error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // POST /api/v1/mau-giao-an/{id}/chia-se - Toggle chia sẻ mẫu
  static async toggleTemplateSharing(id: number, chiaSe: boolean): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${id}/chia-se?chiaSe=${chiaSe}`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const result: TemplateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Toggle template sharing error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // ================== TOPICS ==================

  // GET /api/v1/chu-de - Tất cả chủ đề
  static async getTopics(): Promise<TopicResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chu-de`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: TopicResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Get topics error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // GET /api/v1/chu-de/theo-mon/{monHoc} - Chủ đề theo môn học
  static async getTopicsBySubject(subject: SubjectType): Promise<TopicResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chu-de/theo-mon/${subject}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: TopicResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Get topics by subject error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  // POST /api/v1/chu-de - Tạo chủ đề mới
  static async createTopic(data: TopicCreateRequest): Promise<TopicResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chu-de`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const result: TopicResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Create topic error:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }
}
