'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface TurnstileContextType {
  isScriptLoaded: boolean;
  setScriptLoaded: (loaded: boolean) => void;
}

const TurnstileContext = createContext<TurnstileContextType | undefined>(undefined);

export function TurnstileProvider({ children }: { children: React.ReactNode }) {
  const [isScriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if Turnstile script is already loaded
    if (window.turnstile) {
      setScriptLoaded(true);
      return;
    }

    // Load Turnstile script globally
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.turnstileLoaded = true;
      setScriptLoaded(true);
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <TurnstileContext.Provider value={{ isScriptLoaded, setScriptLoaded }}>
      {children}
    </TurnstileContext.Provider>
  );
}

export function useTurnstileContext() {
  const context = useContext(TurnstileContext);
  if (context === undefined) {
    throw new Error('useTurnstileContext must be used within a TurnstileProvider');
  }
  return context;
}
