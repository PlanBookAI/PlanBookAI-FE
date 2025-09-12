// Lesson Plan Types - theo API structure từ Userflow.txt

export type LessonStatus = 'DRAFT' | 'COMPLETED' | 'PUBLISHED' | 'ARCHIVED';
export type SubjectType = 'HOA_HOC'; // Có thể mở rộng cho các môn khác
export type GradeLevel = '10' | '11' | '12';

export interface LessonPlan {
  id: number;
  tieuDe: string;
  moTa?: string;
  khoi: GradeLevel;
  monHoc: SubjectType;
  thoiLuongTiet: number;
  lopHoc?: string;
  ghiChu?: string;
  suDungAI: boolean;
  yeuCauDacBiet?: string;
  trangThai: LessonStatus;
  noiDung: {
    noiDungChiTiet?: any; // JSON content
    [key: string]: any;
  };
  chuDeId?: number;
  chuDeTen?: string;
  nguoiTaoId: number;
  nguoiTaoTen?: string;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface LessonPlanCreateRequest {
  tieuDe: string;
  moTa?: string;
  khoi: GradeLevel;
  monHoc: SubjectType;
  thoiLuongTiet: number;
  lopHoc?: string;
  ghiChu?: string;
  suDungAI?: boolean;
  yeuCauDacBiet?: string;
  noiDungChiTiet?: any;
  chuDeId?: number;
}

export interface LessonPlanUpdateRequest extends Partial<LessonPlanCreateRequest> {
  id: number;
}

// Template Types - theo API structure
export interface LessonTemplate {
  id: number;
  tieuDe: string;
  moTa: string;
  monHoc: SubjectType;
  khoi: GradeLevel;
  trangThai: 'ACTIVE' | 'INACTIVE';
  noiDungMau: any; // JSON template content
  nguoiTaoId: number;
  nguoiTaoTen?: string;
  ngayTao: string;
  ngayCapNhat: string;
  isPublic: boolean; // derived from trangThai === 'ACTIVE'
}

export interface LessonTemplateCreateRequest {
  tieuDe: string;
  moTa: string;
  monHoc: SubjectType;
  khoi: GradeLevel;
  trangThai: 'ACTIVE' | 'INACTIVE';
  noiDungMau: any;
}

// Topic Types - theo API structure
export interface Topic {
  id: number;
  ten: string;
  moTa?: string;
  monHoc: SubjectType;
  nguoiTaoId: number;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface TopicCreateRequest {
  ten: string;
  moTa?: string;
  monHoc: SubjectType;
}

// Filter & Search Types
export interface LessonPlanFilters {
  keyword?: string;
  monHoc?: SubjectType;
  khoi?: GradeLevel;
  chuDeId?: number;
  trangThai?: LessonStatus;
  suDungAI?: boolean;
  page?: number;
  limit?: number;
}

export interface TemplateFilters {
  keyword?: string;
  monHoc?: SubjectType;
  khoi?: GradeLevel;
  type?: 'public' | 'mine';
  page?: number;
  limit?: number;
}

// UI State Types
export type LessonTabType = 'all' | 'draft' | 'completed' | 'published' | 'archived' | 'public-templates' | 'my-templates' | 'topics';

export interface LessonPlanStats {
  total: number;
  drafts: number;
  completed: number;
  published: number;
  archived: number;
  templates_public: number;
  templates_mine: number;
  ai_generated: number;
}

// API Response Types - theo backend format
export interface LessonPlanResponse {
  thanhCong: boolean;
  thongDiep: string;
  duLieu?: LessonPlan | LessonPlan[];
  tongSo?: number;
  trang?: number;
  kichThuoc?: number;
}

export interface TemplateResponse {
  thanhCong: boolean;
  thongDiep: string;
  duLieu?: LessonTemplate | LessonTemplate[];
  tongSo?: number;
  trang?: number;
  kichThuoc?: number;
}

export interface TopicResponse {
  thanhCong: boolean;
  thongDiep: string;
  duLieu?: Topic | Topic[];
}

// Status Transition Types - theo API endpoints
export interface StatusTransition {
  lessonId: number;
  from: LessonStatus;
  to: LessonStatus;
  action: 'phe-duyet' | 'xuat-ban' | 'luu-tru';
}
