export type NotificationType = 'THONG_BAO' | 'CANH_BAO' | 'LOI';
export type NotificationStatus = 'CHUA_DOC' | 'DA_DOC';

export interface NotificationDto {
  id: string;
  tieuDe: string;
  noiDung: string;
  loai: NotificationType;
  trangThai: NotificationStatus;
  thoiGianTao: string;
  thoiGianDoc: string | null;
  duLieuBoSung: Record<string, any> | null;
}

export interface NotificationListResponse {
  thanhCong: boolean;
  thongBao: string;
  duLieu: {
    danhSach: NotificationDto[];
    tongSo: number;
    trang: number;
    soLuong: number;
  }
}

export interface NotificationSettings {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  preferences: {
    thongBaoKhoaHoc: boolean;
    thongBaoBaiTap: boolean;
    thongBaoKetQua: boolean;
    thongBaoHoatDong: boolean;
  }
}

export interface NotificationFilters {
  trang: number;
  soLuong: number;
  trangThai: 'TAT_CA' | 'CHUA_DOC' | 'DA_DOC';
  tuKhoa?: string;
  loai?: NotificationType;
  tuNgay?: string;
  denNgay?: string;
}