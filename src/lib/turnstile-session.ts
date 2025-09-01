interface TurnstileSession {
  verified: boolean;
  expiry: number;
  token: string;
}

const SESSION_KEY = 'turnstile_session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export class TurnstileSessionManager {
  static getSession(): TurnstileSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  static setSession(token: string): void {
    if (typeof window === 'undefined') return;
    
    const session: TurnstileSession = {
      verified: true,
      expiry: Date.now() + SESSION_DURATION,
      token,
    };
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  static isVerified(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    return session.verified && Date.now() < session.expiry;
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(SESSION_KEY);
  }

  static getRemainingTime(): number {
    const session = this.getSession();
    if (!session) return 0;
    
    return Math.max(0, session.expiry - Date.now());
  }

  static shouldVerify(forceVerify: boolean = false): boolean {
    // Always verify if forced (login/register)
    if (forceVerify) return true;
    
    // Check if session is valid
    return !this.isVerified();
  }
}
