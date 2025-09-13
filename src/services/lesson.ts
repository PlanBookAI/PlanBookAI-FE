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

  // Helper method để tạo headers với authorization - BẮT BUỘC cho mọi lesson plan API
  private static getAuthHeaders(): Record<string, string> {
    const token = AuthService.getAccessToken();
    if (!token) {
      throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Helper method cho public endpoints (chỉ dành cho mẫu công khai)
  private static getPublicHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Helper method để check quyền truy cập
  private static checkAuthentication(): void {
    if (!AuthService.isAuthenticated()) {
      throw new Error('Bạn cần đăng nhập để thực hiện chức năng này.');
    }
  }

  // ================== LESSON PLANS ==================

  // GET /api/v1/giao-an - Danh sách giáo án của giáo viên (CHỈ CỦA MÌNH - ISOLATION)
  static async getLessonPlans(filters?: LessonPlanFilters): Promise<LessonPlanResponse> {
    try {
      // KIỂM TRA XÁC THỰC BẮT BUỘC
      this.checkAuthentication();

      // Build query params theo đúng API spec
      const params = new URLSearchParams();
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.monHoc) params.append('monHoc', filters.monHoc);
      if (filters?.khoi) params.append('khoi', filters.khoi.toString());
      if (filters?.trangThai) params.append('trangThai', filters.trangThai);
      if (filters?.chuDeId) params.append('chuDeId', filters.chuDeId.toString());

      const url = `${this.baseUrl}/api/v1/giao-an${params.toString() ? `?${params.toString()}` : ''}`;
      
      console.log('Fetching lesson plans:', { url, filters });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(), // BẮT BUỘC có token
      });

      const result = await response.json();
      
      console.log('📋 Lesson plans response:', { status: response.status, result });
      
      // KIỂM TRA RESPONSE THEO CHUẨN API
      if (response.ok && result.thanhCong) {
        // API trả về danh sách giáo án của user hiện tại (đã được lọc isolation ở backend)
        return {
          thanhCong: true,
          thongDiep: result.thongDiep || 'Tải danh sách giáo án thành công',
          duLieu: result.duLieu || []
        };
      } else {
        console.error('❌ API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tải danh sách giáo án',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('💥 Error fetching lesson plans:', error);
      
      // Nếu lỗi authentication, redirect về login
      if (error instanceof Error && error.message.includes('token')) {
        AuthService.clearTokens();
        window.location.href = '/login';
      }
      
      return {
        thanhCong: false,
        thongDiep: error instanceof Error ? error.message : 'Lỗi kết nối khi tải danh sách giáo án',
        duLieu: []
      };
    }
  }

  // GET /api/v1/giao-an/{id} - Chi tiết giáo án
  static async getLessonPlan(id: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tải chi tiết giáo án',
        };
      }
    } catch (error) {
      console.error('Error fetching lesson plan:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tải chi tiết giáo án',
      };
    }
  }

  // POST /api/v1/giao-an - Tạo giáo án thủ công
  static async createLessonPlan(data: LessonPlanCreateRequest): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tạo giáo án',
        };
      }
    } catch (error) {
      console.error('Error creating lesson plan:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tạo giáo án',
      };
    }
  }

  // POST /api/v1/giao-an/tu-mau/{templateId} - Tạo giáo án từ mẫu (SNAPSHOT)
  static async createLessonPlanFromTemplate(templateId: number, data: any): Promise<LessonPlanResponse> {
    try {
      // KIỂM TRA XÁC THỰC BẮT BUỘC
      this.checkAuthentication();

      console.log('📋 Creating lesson plan from template:', { templateId, data });

      // Prepare payload theo đúng API spec (PascalCase)
      const payload = {
        TieuDe: data.TieuDe || data.tieuDe,
        MucTieu: data.MucTieu || data.mucTieu || '',
        Khoi: data.Khoi || data.khoi,
        MonHoc: data.MonHoc || data.monHoc || 1, // 1 = HOA_HOC
        ThoiLuongTiet: data.ThoiLuongTiet || data.thoiLuongTiet || 1,
        LopHoc: data.LopHoc || data.lopHoc || '',
        GhiChu: data.GhiChu || data.ghiChu || '',
        SuDungAI: data.SuDungAI || data.suDungAI || false,
        YeuCauDacBiet: data.YeuCauDacBiet || data.yeuCauDacBiet || '',
        ChuDeId: data.ChuDeId || data.chuDeId || null
        // KHÔNG GỬI NoiDungChiTiet vì sẽ lấy từ mẫu (snapshot)
      };

      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/tu-mau/${templateId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      console.log('✅ Template to lesson response:', { status: response.status, result });
      
      if (response.ok && result.thanhCong) {
        // Giáo án được tạo với status="DRAFT" và nội dung được snapshot từ mẫu
        return {
          thanhCong: true,
          thongDiep: result.thongDiep || 'Tạo giáo án từ mẫu thành công',
          duLieu: result.duLieu
        };
      } else {
        console.error('❌ API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tạo giáo án từ mẫu',
        };
      }
    } catch (error) {
      console.error('💥 Error creating lesson plan from template:', error);
      
      if (error instanceof Error && error.message.includes('token')) {
        AuthService.clearTokens();
        window.location.href = '/login';
      }
      
      return {
        thanhCong: false,
        thongDiep: error instanceof Error ? error.message : 'Lỗi kết nối khi tạo giáo án từ mẫu',
      };
    }
  }

  // PUT /api/v1/giao-an/{id} - Cập nhật giáo án
  static async updateLessonPlan(data: LessonPlanUpdateRequest): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${data.id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể cập nhật giáo án',
        };
      }
    } catch (error) {
      console.error('Error updating lesson plan:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi cập nhật giáo án',
      };
    }
  }

  // DELETE /api/v1/giao-an/{id} - Xóa giáo án
  static async deleteLessonPlan(id: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể xóa giáo án',
        };
      }
    } catch (error) {
      console.error('Error deleting lesson plan:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi xóa giáo án',
      };
    }
  }

  // POST /api/v1/giao-an/{id}/copy - Sao chép giáo án
  static async copyLessonPlan(id: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}/copy`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể sao chép giáo án',
        };
      }
    } catch (error) {
      console.error('Error copying lesson plan:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi sao chép giáo án',
      };
    }
  }

  // POST /api/v1/giao-an/{id}/phe-duyet - Phê duyệt giáo án (DRAFT → COMPLETED)
  static async approveLessonPlan(id: number): Promise<LessonPlanResponse> {
    return this.transitionStatus(id, 'phe-duyet');
  }

  // POST /api/v1/giao-an/{id}/xuat-ban - Xuất bản giáo án (COMPLETED → PUBLISHED)
  static async publishLessonPlan(id: number): Promise<LessonPlanResponse> {
    return this.transitionStatus(id, 'xuat-ban');
  }

  // POST /api/v1/giao-an/{id}/luu-tru - Lưu trữ giáo án (PUBLISHED → ARCHIVED)
  static async archiveLessonPlan(id: number): Promise<LessonPlanResponse> {
    return this.transitionStatus(id, 'luu-tru');
  }

  // Helper method for status transitions
  private static async transitionStatus(id: number, action: string): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/${id}/${action}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || `Không thể thực hiện hành động ${action}`,
        };
      }
    } catch (error) {
      console.error(`Error transitioning status (${action}):`, error);
      return {
        thanhCong: false,
        thongDiep: `Lỗi kết nối khi thực hiện hành động ${action}`,
      };
    }
  }

  // GET /api/v1/giao-an/tim-kiem?keyword=... - Tìm kiếm giáo án
  static async searchLessonPlans(keyword: string): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/tim-kiem?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tìm kiếm giáo án',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error searching lesson plans:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tìm kiếm giáo án',
        duLieu: []
      };
    }
  }

  // GET /api/v1/giao-an/loc-theo-chu-de/{chuDeId} - Lọc giáo án theo chủ đề
  static async filterByTopic(topicId: number): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/loc-theo-chu-de/${topicId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể lọc giáo án theo chủ đề',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error filtering lesson plans by topic:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi lọc giáo án theo chủ đề',
        duLieu: []
      };
    }
  }

  // GET /api/v1/giao-an/loc-theo-mon/{monHoc} - Lọc giáo án theo môn học
  static async filterBySubject(subject: SubjectType): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/loc-theo-mon/${subject}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể lọc giáo án theo môn học',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error filtering lesson plans by subject:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi lọc giáo án theo môn học',
        duLieu: []
      };
    }
  }

  // GET /api/v1/giao-an/loc-theo-khoi/{khoi} - Lọc giáo án theo khối
  static async filterByGrade(grade: GradeLevel): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/giao-an/loc-theo-khoi/${grade}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể lọc giáo án theo khối',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error filtering lesson plans by grade:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi lọc giáo án theo khối',
        duLieu: []
      };
    }
  }

  // ================== TEMPLATES ==================

  // GET /api/v1/mau-giao-an/cong-khai - Danh sách mẫu công khai
  static async getPublicTemplates(filters?: TemplateFilters): Promise<TemplateResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.monHoc) params.append('monHoc', filters.monHoc);
      if (filters?.khoi) params.append('khoi', filters.khoi.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const url = `${this.baseUrl}/api/v1/mau-giao-an/cong-khai${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getPublicHeaders(), // Không cần auth
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tải danh sách mẫu công khai',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error fetching public templates:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tải danh sách mẫu công khai',
        duLieu: []
      };
    }
  }

  // GET /api/v1/mau-giao-an/cua-toi - Danh sách mẫu của tôi
  static async getMyTemplates(filters?: TemplateFilters): Promise<TemplateResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.monHoc) params.append('monHoc', filters.monHoc);
      if (filters?.khoi) params.append('khoi', filters.khoi.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const url = `${this.baseUrl}/api/v1/mau-giao-an/cua-toi${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tải danh sách mẫu của tôi',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error fetching my templates:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tải danh sách mẫu của tôi',
        duLieu: []
      };
    }
  }

  // GET /api/v1/mau-giao-an/{id} - Chi tiết mẫu
  static async getTemplate(id: number): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tải chi tiết mẫu',
        };
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tải chi tiết mẫu',
      };
    }
  }

  // POST /api/v1/mau-giao-an - Tạo mẫu mới
  static async createTemplate(data: LessonTemplateCreateRequest): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tạo mẫu',
        };
      }
    } catch (error) {
      console.error('Error creating template:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tạo mẫu',
      };
    }
  }

  // PUT /api/v1/mau-giao-an/{id} - Cập nhật mẫu
  static async updateTemplate(data: any): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${data.id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể cập nhật mẫu',
        };
      }
    } catch (error) {
      console.error('Error updating template:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi cập nhật mẫu',
      };
    }
  }

  // DELETE /api/v1/mau-giao-an/{id} - Xóa mẫu
  static async deleteTemplate(id: number): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể xóa mẫu',
        };
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi xóa mẫu',
      };
    }
  }

  // POST /api/v1/mau-giao-an/{id}/chia-se - Chia sẻ/hủy chia sẻ mẫu
  static async toggleTemplateSharing(id: number, share: boolean): Promise<TemplateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/mau-giao-an/${id}/chia-se?chiaSe=${share}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || `Không thể ${share ? 'chia sẻ' : 'hủy chia sẻ'} mẫu`,
        };
      }
    } catch (error) {
      console.error('Error toggling template sharing:', error);
      return {
        thanhCong: false,
        thongDiep: `Lỗi kết nối khi ${share ? 'chia sẻ' : 'hủy chia sẻ'} mẫu`,
      };
    }
  }

  // ================== TOPICS ==================

  // GET /api/v1/chu-de - Danh sách chủ đề
  static async getTopics(): Promise<TopicResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chu-de`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tải danh sách chủ đề',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tải danh sách chủ đề',
        duLieu: []
      };
    }
  }

  // GET /api/v1/chu-de/theo-mon/{monHoc} - Lọc chủ đề theo môn học
  static async getTopicsBySubject(subject: SubjectType): Promise<TopicResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chu-de/theo-mon/${subject}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tải danh sách chủ đề theo môn học',
          duLieu: []
        };
      }
    } catch (error) {
      console.error('Error fetching topics by subject:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tải danh sách chủ đề theo môn học',
        duLieu: []
      };
    }
  }

  // POST /api/v1/chu-de - Tạo chủ đề mới
  static async createTopic(data: TopicCreateRequest): Promise<TopicResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chu-de`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.thanhCong) {
        return result;
      } else {
        console.error('API error:', result);
        return {
          thanhCong: false,
          thongDiep: result.thongDiep || 'Không thể tạo chủ đề',
        };
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      return {
        thanhCong: false,
        thongDiep: 'Lỗi kết nối khi tạo chủ đề',
      };
    }
  }
}