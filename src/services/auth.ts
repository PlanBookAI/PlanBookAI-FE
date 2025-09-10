interface LoginData {
  email: string;
  matKhau: string;
}

interface RegisterData {
  email: string;
  matKhau: string;
  xacNhanMatKhau: string;
  hoTen: string;
}

interface AuthResponse {
  thanhCong: boolean;
  thongBao: string;
  duLieu?: {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    email?: string;
    hoTen?: string;
    vaiTro?: string;
  };
  loi?: Array<{
    truong: string;
    thongBao: string;
  }>;
  token?: string;
  refreshToken?: string;
  thongTinNguoiDung?: {
    id: string;
    hoTen: string;
    email: string;
    tenVaiTro: string;
    vaiTroId: number;
  };
}

export class AuthService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/xac-thuc/dang-nhap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (response.ok && result.thanhCong) {
        // Store tokens in localStorage
        if (result.token) {
          localStorage.setItem('access_token', result.token);
          localStorage.setItem('refresh_token', result.refreshToken || '');
          localStorage.setItem('user', JSON.stringify({
            id: result.thongTinNguoiDung?.id,
            name: result.thongTinNguoiDung?.hoTen,
            email: result.thongTinNguoiDung?.email,
            role: result.thongTinNguoiDung?.tenVaiTro,
            vaiTroId: result.thongTinNguoiDung?.vaiTroId,
          }));
        } else if (result.duLieu?.accessToken) {
          // Fallback for old format
          localStorage.setItem('access_token', result.duLieu.accessToken);
          localStorage.setItem('refresh_token', result.duLieu.refreshToken || '');
          localStorage.setItem('user', JSON.stringify({
            id: result.duLieu.userId,
            name: result.duLieu.hoTen,
            email: result.duLieu.email,
            role: result.duLieu.vaiTro,
          }));
        }
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        thanhCong: false,
        thongBao: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Map form data (camelCase) -> API payload (PascalCase) with required VaiTroId
      const payload = {
        Email: data.email,
        MatKhau: data.matKhau,
        XacNhanMatKhau: data.xacNhanMatKhau,
        HoTen: data.hoTen,
        VaiTroId: 4,
      };

      const response = await fetch(`${this.baseUrl}/api/v1/xac-thuc/dang-ky`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: AuthResponse = await response.json();

      if (response.ok && result.thanhCong) {
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        thanhCong: false,
        thongBao: 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return {
          thanhCong: false,
          thongBao: 'Không có refresh token'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/xac-thuc/lam-moi-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result: AuthResponse = await response.json();

      if (response.ok && result.thanhCong && result.duLieu) {
        // Update tokens
        localStorage.setItem('access_token', result.duLieu.accessToken || '');
        localStorage.setItem('refresh_token', result.duLieu.refreshToken || '');
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        thanhCong: false,
        thongBao: 'Lỗi làm mới token'
      };
    }
  }

  static async logout(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        this.clearTokens();
        return {
          thanhCong: true,
          thongBao: 'Đăng xuất thành công'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/xac-thuc/dang-xuat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result: AuthResponse = await response.json();

      // Clear tokens regardless of response
      this.clearTokens();

      return result;
    } catch (error) {
      console.error('Logout error:', error);
      this.clearTokens();
      return {
        thanhCong: true,
        thongBao: 'Đăng xuất thành công'
      };
    }
  }

  static clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  static getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}
