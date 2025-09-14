interface LoginData {
  email: string;
  matKhau: string;
  rememberMe?: boolean;
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
    token?: string;
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
      // Map form data (camelCase) -> API payload (PascalCase)
      const payload = {
        Email: data.email,
        MatKhau: data.matKhau,
        // Note: rememberMe is client-side only, not sent to API
      };

      const response = await fetch(`${this.baseUrl}/api/v1/xac-thuc/dang-nhap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: AuthResponse = await response.json();

      if (response.ok && result.thanhCong) {
        // Store tokens in localStorage
        if (result.token) {
          // Calculate session expiry based on remember me
          const sessionDuration = data.rememberMe ? 
            5 * 24 * 60 * 60 * 1000 : // 5 days
            5 * 60 * 1000; // 5 minutes
          const sessionExpiry = Date.now() + sessionDuration;

          localStorage.setItem('access_token', result.token);
          localStorage.setItem('refresh_token', result.refreshToken || '');
          localStorage.setItem('session_expiry', sessionExpiry.toString());
          localStorage.setItem('user', JSON.stringify({
            id: result.thongTinNguoiDung?.id,
            name: result.thongTinNguoiDung?.hoTen,
            email: result.thongTinNguoiDung?.email,
            role: result.thongTinNguoiDung?.tenVaiTro,
            vaiTroId: result.thongTinNguoiDung?.vaiTroId,
          }));
        } else if (result.duLieu?.token) {
          // Handle result.duLieu.token format
          const sessionDuration = data.rememberMe ? 
            5 * 24 * 60 * 60 * 1000 : // 5 days
            5 * 60 * 1000; // 5 minutes
          const sessionExpiry = Date.now() + sessionDuration;

          localStorage.setItem('access_token', result.duLieu.token);
          localStorage.setItem('refresh_token', result.duLieu.refreshToken || '');
          localStorage.setItem('session_expiry', sessionExpiry.toString());
          localStorage.setItem('user', JSON.stringify({
            id: result.thongTinNguoiDung?.id || result.duLieu.userId,
            name: result.thongTinNguoiDung?.hoTen || result.duLieu.hoTen,
            email: result.thongTinNguoiDung?.email || result.duLieu.email,
            role: result.thongTinNguoiDung?.tenVaiTro || result.duLieu.vaiTro,
            vaiTroId: result.thongTinNguoiDung?.vaiTroId,
          }));
        } else if (result.duLieu?.accessToken) {
          // Handle result.duLieu.accessToken format
          const sessionDuration = data.rememberMe ? 
            5 * 24 * 60 * 60 * 1000 : // 5 days
            5 * 60 * 1000; // 5 minutes
          const sessionExpiry = Date.now() + sessionDuration;

          localStorage.setItem('access_token', result.duLieu.accessToken);
          localStorage.setItem('refresh_token', result.duLieu.refreshToken || '');
          localStorage.setItem('session_expiry', sessionExpiry.toString());
          localStorage.setItem('user', JSON.stringify({
            id: result.duLieu.userId,
            name: result.duLieu.hoTen,
            email: result.duLieu.email,
            role: result.duLieu.vaiTro,
          }));
        }
        
        // Dispatch custom event to notify components of auth state change
        window.dispatchEvent(new CustomEvent('auth:changed'));
        
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
    localStorage.removeItem('session_expiry');
    localStorage.removeItem('user');
    
    // Dispatch custom event to notify components of auth state change
    window.dispatchEvent(new CustomEvent('auth:changed'));
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const sessionExpiry = localStorage.getItem('session_expiry');
    
    if (!token || !sessionExpiry) {
      return false;
    }
    
    const expiryTime = parseInt(sessionExpiry, 10);
    const currentTime = Date.now();
    
    if (currentTime >= expiryTime) {
      // Session has expired, clear tokens
      this.clearTokens();
      return false;
    }
    
    return true;
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
