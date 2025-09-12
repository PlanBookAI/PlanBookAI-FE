export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'teacher' | 'student';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type NotificationType = 'Email' | 'SMS' | 'InApp' | 'Push';

export type NotificationStatus = 'Created' | 'Sent' | 'Read' | 'Expired';

export type NotificationPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface NotificationDto {
  id: string;
  tieuDe: string;
  noiDung: string;
  loai: NotificationType;
  trangThai: NotificationStatus;
  doUuTien: NotificationPriority;
  daDoc: boolean;
  thoiGianGui: string;
  thoiGianDoc: string | null;
  data?: Record<string, any>;
}

export interface NotificationFilter {
  page: number;
  pageSize: number;
  loai?: NotificationType;
  trangThai?: NotificationStatus;
  doUuTien?: NotificationPriority;
  tuNgay?: string;
  denNgay?: string;
}

export interface NotificationListResponse {
  thanhCong: boolean;
  thongBao: string;
  duLieu: {
    danhSach: NotificationDto[];
    tongSo: number;
    trangHienTai: number;
    soTrangToiDa: number;
  }
}

// Re-export types
export * from './lesson';
export * from './websocket';