'use client';

import { useEffect, useRef } from 'react';
import { useTurnstileContext } from '@/components/providers/TurnstileProvider';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
  show?: boolean;
}

declare global {
  interface Window {
    turnstile: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact' | 'invisible';
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
    turnstileLoaded?: boolean;
  }
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  className = '',
  show = true,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');
  const { isScriptLoaded } = useTurnstileContext();

  useEffect(() => {
    if (isScriptLoaded && window.turnstile && show) {
      renderTurnstile();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        widgetIdRef.current = '';
      }
    };
  }, [isScriptLoaded, siteKey, show]);

  const renderTurnstile = () => {
    if (!containerRef.current || !window.turnstile || !show) return;

    containerRef.current.innerHTML = '';

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onVerify(token);
      },
      'error-callback': () => {
        onError?.();
      },
      'expired-callback': () => {
        onExpire?.();
      },
      theme: 'light',
      size: 'normal', // Changed back to normal mode
    });

    widgetIdRef.current = widgetId;
  };

  if (!show) {
    return null;
  }

  return (
    <div className={`turnstile-container ${className}`}>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
}
