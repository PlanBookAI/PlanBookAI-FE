import type { DeThi, TrangThai, DeThiFilter } from '@/types/exam';
import { API_CONFIG } from '@/config/api';

interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

class ExamService {
  private makeUrl(endpoint: string, params?: Record<string, any>): string {
    try {
      // Ensure the base URL has the correct protocol
      let baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'http://' + baseUrl;
      }

      const url = new URL(endpoint, baseUrl);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      console.debug('Generated URL:', url.toString());
      return url.toString();
    } catch (error) {
      console.error('Error creating URL:', { baseUrl: API_CONFIG.BASE_URL, endpoint, error });
      throw new Error('Không thể tạo URL hợp lệ. Vui lòng kiểm tra cấu hình API.');
    }
  }

  private async handleResponse<T>(response: Response, endpoint: string): Promise<T> {
    if (!response.ok) {
      let errorMessage = '';
      
      switch (response.status) {
        case 404:
          errorMessage = `API endpoint không tồn tại: ${endpoint}`;
          console.error(`API endpoint not found: ${endpoint}`);
          break;
        case 401:
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          break;
        case 403:
          errorMessage = 'Bạn không có quyền truy cập tài nguyên này.';
          break;
        case 500:
          errorMessage = 'Đã có lỗi xảy ra từ phía máy chủ. Vui lòng thử lại sau.';
          break;
        default:
          errorMessage = `Lỗi không xác định (${response.status})`;
      }
      
      try {
        const text = await response.text();
        
        // Kiểm tra kết nối mạng
        if (!navigator.onLine) {
          throw new Error('Mất kết nối mạng. Vui lòng kiểm tra lại kết nối internet và thử lại.');
        }

        // Kiểm tra response rỗng
        if (!text && response.status !== 204) {  // 204 No Content là hợp lệ
          console.warn('Empty response:', {
            endpoint,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          });
          throw new Error('Máy chủ không trả về dữ liệu. Vui lòng thử lại sau một lát.');
        }

        if (text) {
          try {
            const errorData = JSON.parse(text);
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = typeof errorData.error === 'string' 
                ? errorData.error 
                : JSON.stringify(errorData.error);
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', text);
            throw new Error('Dữ liệu không hợp lệ từ máy chủ. Vui lòng thử lại.');
          }
        }

        console.error('API Error:', {
          status: response.status,
          endpoint,
          responseText: text,
          responseHeaders: Object.fromEntries(response.headers.entries())
        });
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).statusText = response.statusText;
      throw error;
    }

    try {
      if (response.status === 204) {
        console.debug('Server returned 204 No Content');
        return {} as T;
      }

      // Check Content-Length and Content-Type headers
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');

      // Log response metadata for debugging
      console.debug('Response metadata:', {
        status: response.status,
        contentLength,
        contentType,
        endpoint
      });

      const text = await response.text();
      if (!text && contentLength !== '0') {  // Only treat as error if we expected content
        console.warn('Empty response:', {
          endpoint,
          status: response.status,
          contentLength,
          contentType
        });
        throw new Error('Máy chủ không trả về dữ liệu. Vui lòng thử lại.');
      }

      // Empty response with content-length: 0 is valid
      if (!text) {
        return {} as T;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse success response:', { text, error: parseError });
        throw new Error('Dữ liệu từ máy chủ không hợp lệ. Vui lòng thử lại sau.');
      }
    } catch (e) {
      console.error('Failed to read response:', e);
      throw new Error('Không thể đọc dữ liệu từ máy chủ. Vui lòng thử lại sau.');
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = 2,
    retryDelay: number = 1000
  ): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          console.warn(`Lần thử kết nối thứ ${attempt}/${retries}...`);
        }
        
        // Kiểm tra kết nối mạng trước khi gửi request
        if (!navigator.onLine) {
          throw new Error('Mất kết nối mạng');
        }
        
        const response = await fetch(url, options);
        
        // Kiểm tra response
        if (!response.ok && response.status !== 404) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < retries) {
          // Tính thời gian chờ với thuật toán exponential backoff
          const delay = retryDelay * Math.pow(2, attempt);
          console.warn(`Lỗi: ${lastError.message}. Thử lại sau ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }
    
    throw new Error(`Không thể kết nối đến máy chủ sau ${retries} lần thử. Lỗi cuối cùng: ${lastError?.message}`);
  }

  async getExams(
    filters?: DeThiFilter,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<DeThi>> {
    try {
      const params = {
        PageNumber: page,
        PageSize: pageSize,
        ...(filters || {})
      };

      // Remove undefined values
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      );

      const endpoint = API_CONFIG.ENDPOINTS.EXAM.LIST;
      const url = this.makeUrl(endpoint, filteredParams);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      try {
        // Kiểm tra kết nối mạng trước khi gửi request
        if (!navigator.onLine) {
          throw new Error('Không có kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.');
        }

        const response = await this.fetchWithRetry(
          url,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal
          },
          2, // số lần thử lại
          2000 // độ trễ ban đầu (ms)
        );

        clearTimeout(timeoutId);
        return this.handleResponse<PaginatedResponse<DeThi>>(response, endpoint);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.');
          }
          throw error;
        }
        throw new Error('Có lỗi xảy ra khi tải danh sách đề thi. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Có lỗi xảy ra khi tải danh sách đề thi. Vui lòng thử lại sau.');
    }
  }

  async searchExams(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<DeThi>> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.SEARCH;
    const params = {
      Keyword: keyword,
      PageNumber: page,
      PageSize: pageSize,
    };

    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint, params),
      {
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );
    return this.handleResponse<PaginatedResponse<DeThi>>(response, endpoint);
  }

  async filterBySubject(
    subject: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<DeThi>> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.FILTER.SUBJECT;
    const params = {
      subject,
      PageNumber: page,
      PageSize: pageSize,
    };

    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint, params),
      {
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );
    return this.handleResponse<PaginatedResponse<DeThi>>(response, endpoint);
  }

  async filterByGrade(
    grade: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<DeThi>> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.FILTER.GRADE;
    const params = {
      grade,
      PageNumber: page,
      PageSize: pageSize,
    };

    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint, params),
      {
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );
    return this.handleResponse<PaginatedResponse<DeThi>>(response, endpoint);
  }

  async filterByStatus(
    status: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<DeThi>> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.FILTER.STATUS;
    const params = {
      status,
      PageNumber: page,
      PageSize: pageSize,
    };

    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint, params),
      {
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );
    return this.handleResponse<PaginatedResponse<DeThi>>(response, endpoint);
  }

  async getExamById(id: number): Promise<DeThi> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.DETAIL(id);
    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint),
      {
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );
    return this.handleResponse<DeThi>(response, endpoint);
  }

  async createExam(exam: Omit<DeThi, 'id' | 'metadata'>): Promise<DeThi> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.CREATE;
    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(exam),
      }
    );
    return this.handleResponse<DeThi>(response, endpoint);
  }

  async updateExam(id: number, exam: Partial<DeThi>): Promise<DeThi> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.UPDATE(id);
    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint),
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(exam),
      }
    );
    return this.handleResponse<DeThi>(response, endpoint);
  }

  async deleteExam(id: number): Promise<void> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.DELETE(id);
    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint),
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );
    await this.handleResponse<void>(response, endpoint);
  }

  async copyExam(id: number): Promise<DeThi> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.COPY(id);
    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    return this.handleResponse<DeThi>(response, endpoint);
  }
}

export const examService = new ExamService();