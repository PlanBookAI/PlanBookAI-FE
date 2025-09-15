import { CauHoi, DeThi, MauDeThi } from '@/types/exam';

export const mockCauHois: CauHoi[] = [
  {
    id: 1,
    noiDung: "Chọn phát biểu đúng về cấu tạo nguyên tử:",
    monHoc: "HOA_HOC",
    loaiCauHoi: "MULTIPLE_CHOICE",
    chuDe: "Cấu tạo nguyên tử",
    doKho: "EASY",
    diem: 1.0,
    dapAnDung: "A",
    giaiThich: "Electron có khối lượng rất nhỏ so với khối lượng nguyên tử",
    luaChons: [
      {
        id: "A",
        noiDung: "Electron có khối lượng rất nhỏ so với khối lượng nguyên tử",
        laDapAnDung: true
      },
      {
        id: "B",
        noiDung: "Proton có khối lượng bằng electron",
        laDapAnDung: false
      },
      {
        id: "C",
        noiDung: "Nơtron mang điện tích âm",
        laDapAnDung: false
      },
      {
        id: "D",
        noiDung: "Hạt nhân nguyên tử mang điện tích âm",
        laDapAnDung: false
      }
    ]
  },
  {
    id: 2,
    noiDung: "Nguyên tử khối của một nguyên tố là:",
    monHoc: "HOA_HOC",
    loaiCauHoi: "MULTIPLE_CHOICE",
    chuDe: "Cấu tạo nguyên tử",
    doKho: "MEDIUM",
    diem: 1.0,
    dapAnDung: "C",
    giaiThich: "Nguyên tử khối là khối lượng trung bình của các đồng vị",
    luaChons: [
      {
        id: "A",
        noiDung: "Tổng số proton trong hạt nhân",
        laDapAnDung: false
      },
      {
        id: "B",
        noiDung: "Tổng số hạt trong hạt nhân",
        laDapAnDung: false
      },
      {
        id: "C",
        noiDung: "Khối lượng trung bình của các đồng vị",
        laDapAnDung: true
      },
      {
        id: "D",
        noiDung: "Số khối của đồng vị phổ biến nhất",
        laDapAnDung: false
      }
    ]
  },
  {
    id: 3,
    noiDung: "Trong chu kỳ, từ trái sang phải, tính kim loại của các nguyên tố:",
    monHoc: "HOA_HOC",
    loaiCauHoi: "MULTIPLE_CHOICE",
    chuDe: "Bảng tuần hoàn",
    doKho: "MEDIUM",
    diem: 1.0,
    dapAnDung: "B",
    giaiThich: "Trong chu kỳ, từ trái sang phải, tính kim loại giảm dần do electron hóa trị tăng",
    luaChons: [
      {
        id: "A",
        noiDung: "Tăng dần",
        laDapAnDung: false
      },
      {
        id: "B",
        noiDung: "Giảm dần",
        laDapAnDung: true
      },
      {
        id: "C",
        noiDung: "Không thay đổi",
        laDapAnDung: false
      },
      {
        id: "D",
        noiDung: "Tăng rồi giảm",
        laDapAnDung: false
      }
    ]
  },
  {
    id: 4,
    noiDung: "Số electron tối đa trên lớp electron ngoài cùng là:",
    monHoc: "HOA_HOC",
    loaiCauHoi: "MULTIPLE_CHOICE",
    chuDe: "Cấu tạo nguyên tử",
    doKho: "EASY",
    diem: 1.0,
    dapAnDung: "C",
    giaiThich: "Lớp electron ngoài cùng có tối đa 8 electron (octet)",
    luaChons: [
      {
        id: "A",
        noiDung: "2",
        laDapAnDung: false
      },
      {
        id: "B",
        noiDung: "6",
        laDapAnDung: false
      },
      {
        id: "C",
        noiDung: "8",
        laDapAnDung: true
      },
      {
        id: "D",
        noiDung: "10",
        laDapAnDung: false
      }
    ]
  }
];

export const mockMauDeThi: MauDeThi[] = [
  {
    id: 1,
    tieuDe: "Mẫu đề thi Hóa học 10 - Axit Bazơ Muối",
    moTa: "Mẫu đề thi cơ bản về chủ đề axit, bazơ, muối cho học sinh lớp 10",
    monHoc: "HOA_HOC",
    khoiLop: 10,
    cauTruc: [
      {
        chuDe: "Axit - Bazơ - Muối",
        doKho: "EASY",
        soLuong: 5
      },
      {
        chuDe: "Axit - Bazơ - Muối",
        doKho: "MEDIUM",
        soLuong: 3
      },
      {
        chuDe: "Axit - Bazơ - Muối",
        doKho: "HARD",
        soLuong: 2
      }
    ]
  }
];

export const mockDeThi: DeThi[] = [
  {
    id: 1,
    tieuDe: "Kiểm tra trắc nghiệm 15 phút - Cấu tạo nguyên tử",
    monHoc: "HOA_HOC",
    khoiLop: 10,
    thoiGianLamBai: 15,
    huongDan: "- Đề thi gồm 4 câu trắc nghiệm, thời gian làm bài 15 phút\n- Học sinh chọn một đáp án đúng nhất cho mỗi câu\n- Không sử dụng tài liệu",
    trangThai: "PUBLISHED",
    cauHois: mockCauHois,
    tongDiem: 4.0,
    metadata: {
      ngayTao: "2025-09-13T08:00:00Z",
      ngayCapNhat: "2025-09-13T08:30:00Z",
      nguoiTao: {
        id: 1,
        ten: "Nguyễn Văn A"
      },
      tags: ["Trắc nghiệm", "15 phút", "Cấu tạo nguyên tử"]
    }
  },
  {
    id: 2,
    tieuDe: "Kiểm tra trắc nghiệm 1 tiết - Chương 1",
    monHoc: "HOA_HOC", 
    khoiLop: 10,
    thoiGianLamBai: 45,
    huongDan: "- Đề thi gồm 20 câu trắc nghiệm, thời gian làm bài 45 phút\n- Mỗi câu 0.5 điểm\n- Học sinh được sử dụng bảng tuần hoàn",
    trangThai: "DRAFT",
    cauHois: Array(20).fill(null).map((_, index) => ({
      ...mockCauHois[index % mockCauHois.length],
      id: index + 1
    })),
    tongDiem: 10.0,
    metadata: {
      ngayTao: "2025-09-12T10:00:00Z", 
      ngayCapNhat: "2025-09-13T09:00:00Z",
      nguoiTao: {
        id: 1,
        ten: "Nguyễn Văn A"
      },
      tags: ["Trắc nghiệm", "1 tiết", "Chương 1"]
    }
  }
];

// Fake delay để giả lập API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock services
export const mockExamService = {
  getExams: async () => {
    await delay(500);
    return {
      items: mockDeThi,
      totalItems: mockDeThi.length,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10
    };
  },

  getExamById: async (id: number) => {
    await delay(300);
    return mockDeThi.find(exam => exam.id === id);
  },

  createExam: async (exam: Partial<DeThi>) => {
    await delay(500);
    const newExam = {
      ...exam,
      id: Math.max(...mockDeThi.map(e => e.id)) + 1,
      trangThai: "DRAFT" as const,
      cauHois: [],
      metadata: {
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
        nguoiTao: {
          id: 1,
          ten: "Nguyễn Văn A"
        }
      }
    };
    mockDeThi.push(newExam as DeThi);
    return newExam;
  },

  updateExam: async (id: number, exam: Partial<DeThi>) => {
    await delay(500);
    const index = mockDeThi.findIndex(e => e.id === id);
    if (index > -1) {
      mockDeThi[index] = {
        ...mockDeThi[index],
        ...exam,
        metadata: {
          ...mockDeThi[index].metadata,
          ngayCapNhat: new Date().toISOString()
        }
      };
      return mockDeThi[index];
    }
    throw new Error('Exam not found');
  },

  deleteExam: async (id: number) => {
    await delay(300);
    const index = mockDeThi.findIndex(e => e.id === id);
    if (index > -1) {
      mockDeThi.splice(index, 1);
      return true;
    }
    return false;
  },

  // Các phương thức bổ sung
  publishExam: async (id: number) => {
    await delay(300);
    return mockExamService.updateExam(id, { trangThai: "PUBLISHED" });
  },

  archiveExam: async (id: number) => {
    await delay(300);
    return mockExamService.updateExam(id, { trangThai: "ARCHIVED" });
  },

  copyExam: async (id: number) => {
    await delay(500);
    const exam = await mockExamService.getExamById(id);
    if (!exam) throw new Error('Exam not found');
    
    return mockExamService.createExam({
      ...exam,
      tieuDe: `Bản sao của ${exam.tieuDe}`,
      trangThai: "DRAFT"
    });
  }
};