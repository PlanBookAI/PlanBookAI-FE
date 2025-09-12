import { useState, useCallback } from 'react';

interface UseRetryConfig {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export function useRetry<T>({ 
  maxAttempts = 3,
  baseDelay = 1000,
  maxDelay = 5000,
}: UseRetryConfig = {}) {
  const [attempts, setAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(async (
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void,
  ) => {
    let delay = baseDelay;
    
    try {
      setIsRetrying(true);
      const result = await operation();
      onSuccess?.(result);
      setAttempts(0);
      return result;
    } catch (error) {
      setAttempts((prev) => prev + 1);
      
      if (attempts < maxAttempts) {
        // Exponential backoff with jitter
        delay = Math.min(delay * Math.pow(2, attempts) + Math.random() * 1000, maxDelay);
        
        console.warn(`Retry attempt ${attempts + 1}/${maxAttempts} after ${delay}ms`);
        
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const result = await executeWithRetry(operation, onSuccess, onError);
              resolve(result);
            } catch (retryError) {
              onError?.(retryError as Error);
              throw retryError;
            }
          }, delay);
        });
      }
      
      onError?.(error as Error);
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [attempts, maxAttempts, baseDelay, maxDelay]);

  return {
    executeWithRetry,
    attempts,
    isRetrying,
    canRetry: attempts < maxAttempts,
    resetAttempts: () => setAttempts(0),
  };
}