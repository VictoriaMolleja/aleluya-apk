/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showToast && isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 pointer-events-none">
      {!isOnline ? (
        <div className="flex items-center gap-2 rounded-xl bg-[#2A2D34] text-white px-3.5 py-2 text-xs font-medium shadow-lg border border-white/10 animate-fade-in">
          <WifiOff className="w-4 h-4 text-[#FDE68A]" />
          <span>Modo 100% Offline — Biblia y sonidos disponibles sin internet</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-[#4A5D4E] text-white px-3.5 py-2 text-xs font-medium shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#A7F3D0]" />
          <span>Conexión restablecida</span>
        </div>
      )}
    </div>
  );
};
