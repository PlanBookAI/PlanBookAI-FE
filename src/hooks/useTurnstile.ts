import { useState, useCallback, useEffect } from 'react';
import { TurnstileSessionManager } from '@/lib/turnstile-session';
import { useTurnstileVerification } from './useTurnstileVerification';

interface UseTurnstileReturn {
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  shouldShow: boolean;
  verifyToken: (token: string) => Promise<boolean>;
  reset: () => void;
  forceVerify: () => void;
}

export function useTurnstile(shouldForceVerify: boolean = false): UseTurnstileReturn {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShow, setShouldShow] = useState(false);
  
  const { verifyToken: verifyWithCloudflare, isVerifying } = useTurnstileVerification();

  // Check session on mount
  useEffect(() => {
    const sessionVerified = TurnstileSessionManager.isVerified();
    setIsVerified(sessionVerified);
    
    // Show Turnstile if needed
    const needsVerification = TurnstileSessionManager.shouldVerify(shouldForceVerify);
    setShouldShow(needsVerification);
  }, [shouldForceVerify]);

  const verifyToken = useCallback(async (token: string): Promise<boolean> => {
    setError(null);

    const result = await verifyWithCloudflare(token);

    if (result.success) {
      // Save to session
      TurnstileSessionManager.setSession(token);
      setIsVerified(true);
      setShouldShow(false);
      return true;
    } else {
      setError(result.error || 'Verification failed');
      return false;
    }
  }, [verifyWithCloudflare]);

  const reset = useCallback(() => {
    setIsVerified(false);
    setError(null);
    TurnstileSessionManager.clearSession();
    setShouldShow(true);
  }, []);

  const forceVerify = useCallback(() => {
    setIsVerified(false);
    setError(null);
    setShouldShow(true);
  }, []);

  return {
    isVerified,
    isLoading: isVerifying,
    error,
    shouldShow,
    verifyToken,
    reset,
    forceVerify,
  };
}
