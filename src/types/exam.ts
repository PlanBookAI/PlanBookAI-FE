'use client';

export type MonHoc = 
  | 'HOA_HOC'
  | 'TOAN'
  | 'LY'
  | 'SINH'
  | 'VAN'
  | 'ANH'
  | 'SU'
  | 'DIA';

export type DoKho = 'EASY' | 'MEDIUM' | 'HARD';

export type TrangThai = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type LoaiCauHoi = 'MULTIPLE_CHOICE' | 'ESSAY' | 'FILL_IN_BLANK' | 'TRUE_FALSE';

export interface LuaChon {
  id: string;
  noiDung: string;
  laDapAnDung: boolean;
}

export interface CauHoi {
  id: number;
  noiDung: string;
  monHoc: MonHoc;
  loaiCauHoi: LoaiCauHoi;
  chuDe: string;
  doKho: DoKho;
  diem: number;
  dapAnDung?: string;
  giaiThich?: string;
  luaChons?: LuaChon[];
  dapAnTuLuan?: string;
  tieuChiChamDiem?: string;
}

export interface CauTrucDeThi {
  chuDe: string;
  doKho: DoKho;
  soLuong: number;
}

export interface MauDeThi {
  id: number;
  tieuDe: string;
  moTa: string;
  monHoc: MonHoc;
  khoiLop: number;
  cauTruc: CauTrucDeThi[];
}

export interface DeThi {
  id: number;
  tieuDe: string;
  monHoc: MonHoc;
  khoiLop: number;
  thoiGianLamBai: number;
  huongDan?: string;
  trangThai: TrangThai;
  cauHois: CauHoi[];
  templateId?: number;
  topicId?: number;
  tongDiem?: number;
  metadata?: {
    ngayTao: string;
    ngayCapNhat: string;
    nguoiTao: {
      id: number;
      ten: string;
    };
    tags?: string[];
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ThongKe {
  tongSoCauHoi: number;
  tongSoDeThi: number;
  theoChuDe: {
    chuDe: string;
    soLuong: number;
  }[];
  theoDoKho: {
    doKho: DoKho;
    soLuong: number;
  }[];
  theoMonHoc: {
    monHoc: MonHoc;
    soLuong: number;
  }[];
}

// Request types
export interface TaoDeThiRequest {
  tieuDe: string;
  monHoc: MonHoc;
  khoiLop: number;
  thoiGianLamBai: number;
  huongDan?: string;
  templateId?: number;
  topicId?: number;
}

export interface TaoDeThiNgauNhienRequest {
  tieuDe: string;
  monHoc: MonHoc;
  khoiLop: number;
  thoiGianLamBai: number;
  soLuongCauHoi: number;
  chuDe?: string;
  doKho?: DoKho;
}

export interface TaoDeThiTuCauHoiRequest {
  tieuDe: string;
  monHoc: MonHoc;
  khoiLop: number;
  thoiGianLamBai: number;
  danhSachCauHoiId: number[];
}

// Filter types
export interface DeThiFilter {
  keyword?: string;
  monHoc?: MonHoc;
  khoiLop?: number;
  trangThai?: TrangThai;
  pageNumber?: number;
  pageSize?: number;
}

export interface CauHoiFilter {
  keyword?: string;
  monHoc?: MonHoc;
  doKho?: DoKho;
  chuDe?: string;
  pageNumber?: number;
  pageSize?: number;
}