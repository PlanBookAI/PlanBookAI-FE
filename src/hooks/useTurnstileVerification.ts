import { useState, useCallback } from 'react';

interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
  details?: string[];
}

export function useTurnstileVerification() {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyToken = useCallback(async (token: string): Promise<TurnstileVerificationResult> => {
    setIsVerifying(true);

    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Verification failed',
          details: result.details
        };
      }
    } catch (error) {
      console.error('Turnstile verification error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return {
    verifyToken,
    isVerifying,
  };
}
