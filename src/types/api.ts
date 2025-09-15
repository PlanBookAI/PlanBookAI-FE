export interface ApiResponse<T> {
  maTrangThai: number;
  thongBao: string;
  duLieu: T;
  thoiGian: string;
}

export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}