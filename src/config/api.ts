const defaultApiUrl = 'http://localhost:8080';

export const API_CONFIG = {
  // Ensure we have a valid API URL without trailing slashes
  BASE_URL: (process.env.NEXT_PUBLIC_API_URL || defaultApiUrl).replace(/\/+$/, ''),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/xac-thuc/dang-nhap',
      REGISTER: '/api/v1/xac-thuc/dang-ky',
      VERIFY_TOKEN: '/api/v1/xac-thuc/xac-minh-token'
    },
    EXAM: {
      LIST: '/api/v1/de-thi',
      DETAIL: (id: number | string) => `/api/v1/de-thi/${id}`,
      CREATE: '/api/v1/de-thi',
      UPDATE: (id: number | string) => `/api/v1/de-thi/${id}`,
      DELETE: (id: number | string) => `/api/v1/de-thi/${id}`,
      CREATE_FROM_QUESTION_IDS: '/api/v1/tao-de-thi/tu-cau-hoi',
      COPY: (id: number | string) => `/api/v1/de-thi/${id}/sao-chep`,
      SEARCH: '/api/v1/de-thi/tim-kiem',
      FILTER: {
        SUBJECT: '/api/v1/de-thi/loc-mon-hoc',
        GRADE: '/api/v1/de-thi/loc-khoi-lop',
        STATUS: '/api/v1/de-thi/loc-trang-thai'
      },
      EXPORT: {
        PDF: (id: number | string) => `/api/v1/de-thi/${id}/xuat-pdf`,
        WORD: (id: number | string) => `/api/v1/de-thi/${id}/xuat-word`
      }
    },
    CLASSROOM: {
      LIST: '/api/v1/lop-hoc',
      DETAIL: (id: string) => `/api/v1/lop-hoc/${id}`,
      CREATE: '/api/v1/lop-hoc',
      UPDATE: (id: string) => `/api/v1/lop-hoc/${id}`,
      DELETE: (id: string) => `/api/v1/lop-hoc/${id}`,
      STUDENT: {
        LIST: '/api/v1/lop-hoc/hoc-sinh',
        DETAIL: (id: string) => `/api/v1/lop-hoc/hoc-sinh/${id}`,
        BY_CLASS: (classId: string) => `/api/v1/lop-hoc/hoc-sinh/lop/${classId}`,
        CREATE: '/api/v1/lop-hoc/hoc-sinh',
        UPDATE: (id: string) => `/api/v1/lop-hoc/hoc-sinh/${id}`,
        DELETE: (id: string) => `/api/v1/lop-hoc/hoc-sinh/${id}`,
      },
      RESULT: {
        CREATE: '/api/v1/lop-hoc/ket-qua-hoc-sinh',
        BY_STUDENT: (studentId: string) => `/api/v1/lop-hoc/ket-qua-hoc-sinh/hoc-sinh/${studentId}`,
        BY_EXAM: (examId: string) => `/api/v1/lop-hoc/ket-qua-hoc-sinh/de-thi/${examId}`,
      },
      ANSWER_SHEET: {
        CREATE: '/api/v1/lop-hoc/answer-sheet',
        BY_STUDENT: (studentId: string) => `/api/v1/lop-hoc/answer-sheet/hoc-sinh/${studentId}`,
        BY_EXAM: (examId: string) => `/api/v1/lop-hoc/answer-sheet/de-thi/${examId}`,
      }
    }
  }
};