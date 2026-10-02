/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, ArrowRight, Check, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: (name: string, reminderTime: string) => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onComplete, onSkip }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [time, setTime] = useState('07:00');

  if (!isOpen) return null;

  const handleFinish = async () => {
    const trimmedName = name.trim();

    // Solicitar permiso de notificaciones si el navegador lo permite
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      try {
        await Notification.requestPermission();
      } catch {
        // ignore
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const title = trimmedName ? `¡Paz a ti, ${trimmedName}!` : 'Dios te está esperando';
        const body = trimmedName 
          ? `${trimmedName}, tu encuentro con Dios te espera. Dedica un momento de paz hoy.`
          : 'Tu encuentro con Dios te espera. Dedica un momento de paz hoy.';
        new Notification(title, { body, icon: '/icon.svg' });
      } catch {
        // ignore
      }
    }

    onComplete(trimmedName, time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top bar with Skip button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`w-6 h-1.5 rounded-full transition-colors ${step === 1 ? 'bg-[var(--accent)]' : 'bg-black/15'}`} />
            <span className={`w-6 h-1.5 rounded-full transition-colors ${step === 2 ? 'bg-[var(--accent)]' : 'bg-black/15'}`} />
          </div>
          <button
            onClick={onSkip}
            className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline flex items-center gap-1 px-2 py-1 rounded-lg"
          >
            <span>Omitir por ahora</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step 1: Welcome & Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center mx-auto shadow-md font-cinzel font-bold text-xl">
                AB
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-cinzel text-[var(--accent)] tracking-wide">
                Bienvenido a Aleluya Biblia
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Tu espacio de paz espiritual 100% offline, sin publicidad y con la Palabra viva.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                ¿Cómo te llamas? (Opcional)
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setStep(2)}
                placeholder="Escribe tu nombre (ej. Daniel, María)..."
                className="w-full p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white/70 text-sm sm:text-base outline-none focus:border-[var(--accent)] text-[var(--text-primary)] shadow-xs transition-all font-medium"
              />
              <p className="text-[11px] text-[var(--text-secondary)] leading-normal">
                Si lo omites, usaremos mensajes genéricos como <em>«Dios te está esperando»</em>. Puedes configurarlo en cualquier momento.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={onSkip}
                className="px-4 py-3.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-black/5 transition-colors"
              >
                Omitir
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Reminder Schedule & Notification */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-cinzel text-[var(--accent)]">
                Tu Momento con Dios
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {name ? `${name}, ` : ''}¿a qué hora prefieres tu recordatorio diario de oración y lectura?
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Horario diario
                </span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-white text-base font-mono font-bold text-center text-[var(--text-primary)] outline-none focus:border-[var(--accent)] shadow-xs"
                />
              </div>

              {/* Sample Notification Preview */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-300/30 text-xs">
                <span className="font-bold text-[var(--accent)] block">Vista previa del recordatorio:</span>
                <p className="italic text-[var(--text-primary)] mt-1">
                  «{name.trim() ? `${name.trim()}, tu encuentro con Dios te espera. Dedica un momento de paz hoy.` : 'Dios te está esperando: Tu encuentro con Dios te espera hoy.'}»
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-black/5"
              >
                Atrás
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Comenzar Mi Lectura</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
