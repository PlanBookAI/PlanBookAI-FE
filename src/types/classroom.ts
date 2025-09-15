export interface LopHocDto {
  id: string;
  name: string;
  grade: number;
  academicYear: string;
  homeroomTeacherId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LopHocCreateRequest {
  name: string;
  grade: number;
  academicYear: string;
  homeroomTeacherId?: string;
}

export interface LopHocUpdateRequest {
  id: string;
  name?: string;
  grade?: number;
  academicYear?: string;
  isActive?: boolean;
}

export interface HocSinhDto {
  id: string;
  fullName: string;
  studentCode: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  classId: string;
  ownerTeacherId?: string;
  isActive?: boolean;
}

export interface HocSinhCreateRequest {
  fullName: string;
  studentCode: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  classId: string;
  ownerTeacherId?: string;
}

export interface HocSinhUpdateRequest {
  id: string;
  fullName?: string;
  studentCode?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  classId?: string;
  isActive?: boolean;
}

export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}


