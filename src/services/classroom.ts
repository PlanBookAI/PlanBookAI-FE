import { API_CONFIG } from '@/config/api';
import { AuthService } from '@/services/auth';
import type {
  LopHocDto,
  LopHocCreateRequest,
  LopHocUpdateRequest,
  HocSinhDto,
  HocSinhCreateRequest,
  HocSinhUpdateRequest,
  PaginatedResponse
} from '@/types/classroom';

class ClassroomService {
  private normalizeBirthDate(value: string | Date): string {
    if (!value) return '' as any;
    try {
      if (value instanceof Date) {
        const d = new Date(value);
        d.setUTCHours(0, 0, 0, 0);
        return d.toISOString();
      }
      // If already ISO with 'T' and 'Z'
      if (/T.*Z$/.test(value)) return value;
      // If in YYYY-MM-DD, append midnight UTC
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00Z`;
      // Try Date parse fallback
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        parsed.setUTCHours(0, 0, 0, 0);
        return parsed.toISOString();
      }
      return value;
    } catch {
      return typeof value === 'string' ? value : '' as any;
    }
  }
  private makeUrl(endpoint: string, params?: Record<string, any>): string {
    let baseUrl = API_CONFIG.BASE_URL;
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'http://' + baseUrl;
    }
    const url = new URL(endpoint, baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      try {
        AuthService.clearTokens();
      } finally {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    const text = await response.text();
    if (!text && response.status !== 204) {
      throw new Error('Máy chủ không trả về dữ liệu');
    }
    try {
      const parsed = JSON.parse(text);
      // Chấp nhận format { success/thanhCong, data/duLieu } hoặc ApiResponse
      if (parsed.maTrangThai) {
        if (parsed.maTrangThai >= 200 && parsed.maTrangThai < 300) return parsed.duLieu as T;
        throw new Error(parsed.thongBao || 'Có lỗi xảy ra');
      }
      if (parsed.success === true || parsed.thanhCong === true) {
        return (parsed.data || parsed.duLieu) as T;
      }
      if (parsed.success === false || parsed.thanhCong === false) {
        const msg: string = parsed.message || parsed.thongDiep || 'Dữ liệu không hợp lệ';
        const errs: string[] = parsed.errors || parsed.loi || [];
        const detail = Array.isArray(errs) ? errs.join(', ') : '';
        throw new Error(detail ? `${msg}: ${detail}` : msg);
      }
      return (parsed.data || parsed.duLieu) as T;
    } catch (e) {
      throw new Error('Dữ liệu không hợp lệ từ máy chủ');
    }
  }

  async getClasses(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<LopHocDto>> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.LIST, { page, pageSize });
    const res = await fetch(url, { headers: this.getHeaders() });
    return this.handleResponse<PaginatedResponse<LopHocDto>>(res);
  }

  async getClassById(id: string): Promise<LopHocDto> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.DETAIL(id));
    const res = await fetch(url, { headers: this.getHeaders() });
    return this.handleResponse<LopHocDto>(res);
  }

  async createClass(payload: LopHocCreateRequest): Promise<LopHocDto> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.CREATE);
    const currentUser = AuthService.getUser();
    const payloadWithTeacher: LopHocCreateRequest = {
      ...payload,
      homeroomTeacherId: payload.homeroomTeacherId || currentUser?.id,
    };
    const res = await fetch(url, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(payloadWithTeacher) });
    return this.handleResponse<LopHocDto>(res);
  }

  async updateClass(id: string, payload: LopHocUpdateRequest): Promise<LopHocDto> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.UPDATE(id));
    const res = await fetch(url, { method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(payload) });
    return this.handleResponse<LopHocDto>(res);
  }

  async deleteClass(id: string): Promise<void> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.DELETE(id));
    const res = await fetch(url, { method: 'DELETE', headers: this.getHeaders() });
    await this.handleResponse<null>(res);
  }

  async getStudents(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<HocSinhDto>> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.STUDENT.LIST, { page, pageSize });
    const res = await fetch(url, { headers: this.getHeaders() });
    return this.handleResponse<PaginatedResponse<HocSinhDto>>(res);
  }

  async getStudentsByClass(classId: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<HocSinhDto>> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.STUDENT.BY_CLASS(classId), { page, pageSize });
    const res = await fetch(url, { headers: this.getHeaders() });
    return this.handleResponse<PaginatedResponse<HocSinhDto>>(res);
  }

  async createStudentInClass(
    classId: string,
    payload: Omit<HocSinhCreateRequest, 'classId' | 'ownerTeacherId'> & Partial<Pick<HocSinhCreateRequest, 'ownerTeacherId'>>
  ): Promise<HocSinhDto> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.STUDENT.CREATE);
    const currentUser = AuthService.getUser();
    // Build payload with strict field order as API expects
    const payloadWithOwnerAndClass: HocSinhCreateRequest = {
      fullName: payload.fullName,
      studentCode: payload.studentCode,
      birthDate: this.normalizeBirthDate(payload.birthDate as any),
      gender: payload.gender,
      classId: classId,
      ownerTeacherId: payload.ownerTeacherId || currentUser?.id,
    };
    const res = await fetch(url, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(payloadWithOwnerAndClass) });
    return this.handleResponse<HocSinhDto>(res);
  }

  // Backward compatibility: if called with full payload including classId
  async createStudent(payload: HocSinhCreateRequest): Promise<HocSinhDto> {
    return this.createStudentInClass(payload.classId, {
      fullName: payload.fullName,
      studentCode: payload.studentCode,
      birthDate: payload.birthDate,
      gender: payload.gender,
      ownerTeacherId: payload.ownerTeacherId,
    });
  }

  async updateStudent(id: string, payload: HocSinhUpdateRequest): Promise<HocSinhDto> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.STUDENT.UPDATE(id));
    // Build payload with consistent field order and normalized birthDate
    const ordered: HocSinhUpdateRequest = {
      id: payload.id,
      fullName: payload.fullName,
      studentCode: payload.studentCode,
      birthDate: payload.birthDate ? this.normalizeBirthDate(payload.birthDate as any) : undefined as any,
      gender: payload.gender,
      classId: payload.classId,
      isActive: payload.isActive,
    } as HocSinhUpdateRequest;
    const res = await fetch(url, { method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(ordered) });
    return this.handleResponse<HocSinhDto>(res);
  }

  async deleteStudent(id: string): Promise<void> {
    const url = this.makeUrl(API_CONFIG.ENDPOINTS.CLASSROOM.STUDENT.DELETE(id));
    const res = await fetch(url, { method: 'DELETE', headers: this.getHeaders() });
    await this.handleResponse<null>(res);
  }
}

export const classroomService = new ClassroomService();


