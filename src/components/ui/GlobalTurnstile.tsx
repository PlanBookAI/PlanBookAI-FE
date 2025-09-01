'use client';

import { useState, useEffect } from 'react';
import { Turnstile } from './Turnstile';
import { useTurnstile } from '@/hooks/useTurnstile';
import { TurnstileSessionManager } from '@/lib/turnstile-session';

export function GlobalTurnstile() {
  const [showModal, setShowModal] = useState(false);
  const { isVerified, shouldShow, verifyToken, reset } = useTurnstile(false);

  useEffect(() => {
    // Check if we need to show Turnstile on page load
    if (shouldShow && !isVerified) {
      setShowModal(true);
    }
  }, [shouldShow, isVerified]);

  const handleVerify = async (token: string) => {
    const success = await verifyToken(token);
    if (success) {
      setShowModal(false);
    }
  };

  const handleError = () => {
    // Retry after error
    reset();
  };

  const handleExpire = () => {
    // Retry after expiry
    reset();
  };

  // Don't show if already verified or not needed
  if (!shouldShow || isVerified) {
    return null;
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Xác minh bảo mật
              </h3>
              <p className="text-sm text-gray-600">
                Vui lòng xác minh để tiếp tục sử dụng PlanBook AI
              </p>
              
              <div className="flex justify-center">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                  onVerify={handleVerify}
                  onError={handleError}
                  onExpire={handleExpire}
                  className="flex justify-center"
                />
              </div>
              
              <p className="text-xs text-gray-500">
                Bảo vệ khỏi bot và tấn công tự động
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
