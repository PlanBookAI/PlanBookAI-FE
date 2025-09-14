import type { DeThi, TrangThai, DeThiFilter } from '@/types/exam';
import type { ApiResponse, PaginatedData } from '@/types/api';
import { API_CONFIG } from '@/config/api';
import { AuthService } from '@/services/auth';

type ExamPaginatedResponse = PaginatedData<DeThi>;

export class ExamService {
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
    };
  }

  private makeUrl(endpoint: string, params?: Record<string, any>): string {
    try {
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
    const text = await response.text();
    if (!text && response.status !== 204) {
      console.warn('Empty response:', {
        endpoint,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error('Máy chủ không trả về dữ liệu. Vui lòng thử lại sau một lát.');
    }

    try {
      const apiResponse: ApiResponse<T> = JSON.parse(text);
      console.log('API Response:', { endpoint, apiResponse });
      
      if (apiResponse.maTrangThai >= 200 && apiResponse.maTrangThai < 300) {
        return apiResponse.duLieu;
      }

      throw new Error(apiResponse.thongBao || 'Có lỗi xảy ra');
    } catch (parseError) {
      console.error('Failed to parse response:', { text, parseError });
      throw new Error('Dữ liệu không hợp lệ từ máy chủ. Vui lòng thử lại.');
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = 2,
    retryDelay: number = 1000
  ): Promise<Response> {
    options.headers = {
      ...this.getHeaders(),
      ...options.headers,
    };
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          console.warn(`Lần thử kết nối thứ ${attempt}/${retries}...`);
        }
        
        if (!navigator.onLine) {
          throw new Error('Mất kết nối mạng');
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok && response.status !== 404) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < retries) {
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
  ): Promise<ExamPaginatedResponse> {
    try {
      const params = {
        pageNumber: page,
        pageSize: pageSize,
        ...(filters || {})
      };

      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
      );

      const endpoint = API_CONFIG.ENDPOINTS.EXAM.LIST;
      const url = this.makeUrl(endpoint, filteredParams);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await this.fetchWithRetry(
          url,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);
        return this.handleResponse<ExamPaginatedResponse>(response, endpoint);
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      throw error;
    }
  }

  async searchExams(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ExamPaginatedResponse> {
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
        }
      }
    );
    return this.handleResponse<ExamPaginatedResponse>(response, endpoint);
  }

  async filterBySubject(
    subject: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ExamPaginatedResponse> {
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
        }
      }
    );
    return this.handleResponse<ExamPaginatedResponse>(response, endpoint);
  }

  async filterByGrade(
    grade: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ExamPaginatedResponse> {
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
        }
      }
    );
    return this.handleResponse<ExamPaginatedResponse>(response, endpoint);
  }

  async filterByStatus(
    status: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ExamPaginatedResponse> {
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
        }
      }
    );
    return this.handleResponse<ExamPaginatedResponse>(response, endpoint);
  }

  async getExamById(id: number): Promise<DeThi> {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM.DETAIL(id);
    const response = await this.fetchWithRetry(
      this.makeUrl(endpoint),
      {
        headers: {
          'Accept': 'application/json',
        }
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
        }
      }
    );
    await this.handleResponse<void>(response, endpoint);
  }


}

export const examService = new ExamService();