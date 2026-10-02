/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

interface Props {
  variant?: 'header' | 'button' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone PWA, suppress
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'header') {
      return (
        <button
          onClick={install}
          title="Instalar Aleluya Biblia en el dispositivo"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#5C4033] text-white hover:bg-[#4A3228] transition-colors shadow-sm ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-[#5C4033] text-white hover:bg-[#4A3228] shadow-sm transition-all ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Instalar App 100% Offline</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#D8D2C6] text-[#5C4033] hover:bg-black/5 transition-colors ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-[#FAF8F5] p-6 shadow-2xl border border-[#E2DDD5] text-[#3D322C]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
                <h3 className="text-base font-semibold">Instalar en iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#7A6B5D] hover:bg-black/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-[#5C4033] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="font-semibold text-xs bg-[#EFECE6] w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                  <span>Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-semibold text-xs bg-[#EFECE6] w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                  <span>Desplázate hacia abajo y selecciona <strong>«Agregar al inicio»</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-semibold text-xs bg-[#EFECE6] w-5 h-5 rounded-full flex items-center justify-center shrink-0">3</span>
                  <span>¡Listo! Aleluya Biblia se abrirá a pantalla completa y 100% offline.</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#5C4033] py-2.5 text-sm font-medium text-white hover:bg-[#4A3228]"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
