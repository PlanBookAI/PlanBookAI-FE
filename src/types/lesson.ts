// Lesson Plan Types

export type LessonStatus = 'DRAFT' | 'COMPLETED' | 'PUBLISHED' | 'ARCHIVED';
export type SubjectType = 'HOA_HOC' | 1; // API dùng number enum: 1 = HOA_HOC
export type GradeLevel = 10 | 11 | 12; // API dùng số

export interface LessonPlan {
  id: number;
  tieuDe: string;
  mucTieu?: string;
  khoi: GradeLevel;
  monHoc: number; // 1 = HOA_HOC
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
  duocTaoTuAI?: boolean; // field từ API response
}

export interface LessonPlanCreateRequest {
  TieuDe: string;
  MucTieu?: string;
  Khoi: GradeLevel;
  MonHoc: number; // 1 = HOA_HOC
  ThoiLuongTiet: number;
  LopHoc?: string;
  GhiChu?: string;
  SuDungAI?: boolean;
  YeuCauDacBiet?: string;
  MoTaChiTiet?: any; // JSON content
  ChuDeId?: number;
}

export interface LessonPlanUpdateRequest extends Partial<LessonPlanCreateRequest> {
  id: number;
}

// Template Types - theo API structure từ Postman collection
export interface LessonTemplate {
  id: number;
  tieuDe: string;
  moTa: string;
  monHoc: string; // "HOA_HOC"
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
  monHoc: string; // "HOA_HOC"
  khoi: GradeLevel;
  trangThai: 'ACTIVE' | 'INACTIVE';
  noiDungMau: {
    mucTieu: string;
    thoiLuong: string;
    phuongPhap: string;
    noiDung: string[];
    thietBi: string[];
  };
}

// Topic Types - theo API structure từ Postman collection
export interface Topic {
  id: number;
  ten: string;
  moTa?: string;
  monHoc: string; // "HOA_HOC"
  khoi?: GradeLevel;
  nguoiTaoId: number;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface TopicCreateRequest {
  Ten: string;
  MoTa?: string;
  MonHoc: string; // "HOA_HOC"
  Khoi: GradeLevel;
  ParentId?: number | null;
}

// Filter & Search Types - theo API endpoints từ Userflow.txt
export interface LessonPlanFilters {
  keyword?: string;
  monHoc?: string; // "HOA_HOC"
  khoi?: GradeLevel;
  chuDeId?: number;
  trangThai?: LessonStatus;
  suDungAI?: boolean;
  page?: number;
  limit?: number;
}

export interface TemplateFilters {
  keyword?: string;
  monHoc?: string; // "HOA_HOC"
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
