/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Moon, Sun, Type, Bell, Check, BellRing, Volume2, User, Smartphone, Play } from 'lucide-react';
import { ReaderSettings, AppTheme, AppFontFamily, LineSpacing, VoiceProfileId } from '../types/bible';
import { PWAInstallButton } from './PWAInstallButton';
import { ttsService, VOICE_PROFILES } from '../services/ttsService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onOpenWidgetManager?: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenWidgetManager
}) => {
  const [notificationSent, setNotificationSent] = useState(false);
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const themes: { id: AppTheme; nameEs: string; nameEn: string; bg: string; text: string }[] = [
    { id: 'day', nameEs: 'Día (Luz)', nameEn: 'Day (Light)', bg: '#EFECE6', text: '#3D322C' },
    { id: 'sepia', nameEs: 'Sepia Suave', nameEn: 'Sepia Gentle', bg: '#F4EBE1', text: '#6E5034' },
    { id: 'oled', nameEs: 'Noche OLED', nameEn: 'Night OLED', bg: '#121619', text: '#E2E8F0' },
    { id: 'bosque', nameEs: 'Bosque', nameEn: 'Forest', bg: '#F3F1EC', text: '#5C4033' },
    { id: 'mar', nameEs: 'Mar de Galilea', nameEn: 'Sea of Galilee', bg: '#EEF3F6', text: '#2B4C5E' },
    { id: 'olivo', nameEs: 'Olivo Sereno', nameEn: 'Serene Olive', bg: '#F0F2EE', text: '#4A5D4E' },
    { id: 'atardecer', nameEs: 'Atardecer', nameEn: 'Sunset Glow', bg: '#F7EFEA', text: '#7C4A3A' },
    { id: 'rosa_baby', nameEs: 'Rosa Baby (Suave)', nameEn: 'Baby Pink (Soft)', bg: '#FDF2F5', text: '#3C2229' }
  ];

  const fonts: { id: AppFontFamily; name: string }[] = [
    { id: 'serif', name: 'Lora (Serif Sagrado)' },
    { id: 'cinzel', name: 'Cinzel (Solemne Clásico)' },
    { id: 'sans', name: 'Plus Jakarta (Sans Moderno)' },
    { id: 'dyslexic', name: 'Espaciado Fácil (Accesible)' }
  ];

  const handleTestVoice = (profileId: VoiceProfileId) => {
    setTestingVoiceId(profileId);
    ttsService.previewVoice(profileId, settings.language);
    setTimeout(() => setTestingVoiceId(null), 3000);
  };

  const handleTestNotification = async () => {
    const name = settings.userName || (settings.language === 'es' ? 'Daniel' : 'Friend');
    const title = settings.language === 'es' ? `¡Paz a ti, ${name}!` : `Peace be with you, ${name}!`;
    const body = settings.language === 'es'
      ? `${name}, tu encuentro con Dios te espera. Dedica un momento de paz hoy.`
      : `${name}, your moment with God awaits. Take a peaceful reflection today.`;

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icon.svg' });
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(title, { body, icon: '/icon.svg' });
        }
      }
    }
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg max-h-[90vh] rounded-3xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-base sm:text-lg font-bold font-cinzel text-[var(--accent)]">
              {settings.language === 'es' ? 'Personalización de Lectura' : 'Reading Settings'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* USER PROFILE SECTION */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--accent)]" />
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                {settings.language === 'es' ? 'Tu Nombre (Para Racha y Alertas)' : 'Your Name'}
              </label>
            </div>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => onUpdateSettings({ userName: e.target.value })}
              placeholder={settings.language === 'es' ? 'Escribe tu nombre (ej. Daniel)...' : 'Enter your name (e.g. Daniel)...'}
              className="w-full p-2.5 rounded-xl border border-[var(--border-subtle)] bg-white/70 text-xs sm:text-sm outline-none focus:border-[var(--accent)] text-[var(--text-primary)] font-medium"
            />
          </div>

          {/* LECTORES DE VOZ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  {settings.language === 'es' ? 'Lectores de Voz' : 'Voice Readers'}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {VOICE_PROFILES.map(vp => {
                const isSelected = settings.ttsVoiceProfile === vp.id;
                return (
                  <div
                    key={vp.id}
                    onClick={() => {
                      onUpdateSettings({ ttsVoiceProfile: vp.id });
                      ttsService.setVoiceProfile(vp.id);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]/30'
                        : 'border-[var(--border-subtle)] bg-black/[0.01] hover:bg-black/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                        {vp.name.slice(0, 1)}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-[var(--text-primary)] block">{vp.name}</span>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate">{vp.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoice(vp.id);
                        }}
                        title="Escuchar muestra de voz"
                        className="px-2.5 py-1.5 rounded-xl border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--accent)] hover:bg-black/5 transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{testingVoiceId === vp.id ? 'Hablando...' : 'Probar'}</span>
                      </button>
                      {isSelected && <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GESTOR DE WIDGETS SHORTCUT */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">
                  {settings.language === 'es' ? 'Gestión de Widgets de Pantalla' : 'Home Screen Widgets'}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {settings.language === 'es' ? 'Versículo del día y versículo fijo en tu móvil' : 'Daily and fixed scripture widgets'}
                </p>
              </div>
            </div>
            {onOpenWidgetManager && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWidgetManager();
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-all shrink-0"
              >
                {settings.language === 'es' ? 'Gestionar' : 'Manage'}
              </button>
            )}
          </div>

          {/* Language / Translation */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {settings.language === 'es' ? 'Versión e Idioma Bíblico' : 'Bible Version & Language'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ language: 'es' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.language === 'es'
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] ring-2 ring-[var(--accent)]/30 font-bold'
                    : 'border-[var(--border-subtle)] hover:bg-black/5 text-[var(--text-primary)]'
                }`}
              >
                <span className="block text-xs font-semibold">Español</span>
                <span className="text-[10px] text-[var(--text-secondary)] block">Reina-Valera 1960</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.language === 'en'
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] ring-2 ring-[var(--accent)]/30 font-bold'
                    : 'border-[var(--border-subtle)] hover:bg-black/5 text-[var(--text-primary)]'
                }`}
              >
                <span className="block text-xs font-semibold">English</span>
                <span className="text-[10px] text-[var(--text-secondary)] block">King James Version (KJV)</span>
              </button>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {settings.language === 'es' ? 'Paleta de Color y Tema' : 'Color Palette & Theme'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {themes.map(t => {
                const isActive = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onUpdateSettings({ theme: t.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/40 scale-102'
                        : 'border-[var(--border-subtle)] hover:bg-black/5'
                    }`}
                    style={{ backgroundColor: t.bg, color: t.text }}
                  >
                    <div>
                      <span className="text-xs font-bold block">{settings.language === 'es' ? t.nameEs : t.nameEn}</span>
                      <span className="text-[9px] opacity-75 font-mono">{t.bg}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {settings.language === 'es' ? 'Tipografía' : 'Font Family'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fonts.map(f => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontFamily: f.id })}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    settings.fontFamily === f.id
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-bold'
                      : 'border-[var(--border-subtle)] hover:bg-black/5 text-[var(--text-primary)]'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-black/[0.02] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-secondary)]">
                {settings.language === 'es' ? 'Tamaño de Texto' : 'Text Size'}
              </span>
              <span className="font-mono text-xs">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="30"
              step="1"
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
              <span>Pequeño (14px)</span>
              <span>Predeterminado (18px)</span>
              <span>Grande (30px)</span>
            </div>
          </div>

          {/* Line spacing & text alignment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {settings.language === 'es' ? 'Interlineado' : 'Line Spacing'}
              </label>
              <div className="flex rounded-xl bg-black/5 p-1 text-xs">
                {(['compact', 'normal', 'relaxed'] as LineSpacing[]).map(ls => (
                  <button
                    key={ls}
                    onClick={() => onUpdateSettings({ lineSpacing: ls })}
                    className={`flex-1 py-1 rounded-lg transition-colors font-medium capitalize ${
                      settings.lineSpacing === ls ? 'bg-white shadow-xs text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {ls === 'compact' ? '1.5x' : ls === 'normal' ? '1.8x' : '2.2x'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {settings.language === 'es' ? 'Alineación' : 'Alignment'}
              </label>
              <div className="flex rounded-xl bg-black/5 p-1 text-xs">
                <button
                  onClick={() => onUpdateSettings({ textAlign: 'left' })}
                  className={`flex-1 py-1 rounded-lg transition-colors font-medium ${
                    settings.textAlign === 'left' ? 'bg-white shadow-xs text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {settings.language === 'es' ? 'Izquierda' : 'Left'}
                </button>
                <button
                  onClick={() => onUpdateSettings({ textAlign: 'justify' })}
                  className={`flex-1 py-1 rounded-lg transition-colors font-medium ${
                    settings.textAlign === 'justify' ? 'bg-white shadow-xs text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {settings.language === 'es' ? 'Justificado' : 'Justify'}
                </button>
              </div>
            </div>
          </div>

          {/* Notificaciones Personalizadas Programadas */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-black/[0.02] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--accent)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  {settings.language === 'es' ? 'Recordatorios Diarios Personalizados' : 'Personalized Daily Reminders'}
                </h4>
              </div>
              <input
                type="checkbox"
                checked={settings.remindersEnabled}
                onChange={(e) => onUpdateSettings({ remindersEnabled: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {settings.remindersEnabled && (
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">
                    {settings.language === 'es' ? 'Mañana (Al despertar)' : 'Morning Reminder'}
                  </span>
                  <input
                    type="time"
                    value={settings.morningReminderTime}
                    onChange={(e) => onUpdateSettings({ morningReminderTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[var(--border-subtle)] bg-white/70 outline-none text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block mb-1">
                    {settings.language === 'es' ? 'Noche (Al descansar)' : 'Night Reminder'}
                  </span>
                  <input
                    type="time"
                    value={settings.nightReminderTime}
                    onChange={(e) => onUpdateSettings({ nightReminderTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[var(--border-subtle)] bg-white/70 outline-none text-[var(--text-primary)]"
                  />
                </div>
              </div>
            )}

            {/* Personalized sample reminder */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300/30 text-xs text-[var(--text-primary)] space-y-1">
              <span className="font-bold text-[var(--accent)] block">Mensaje de notificación:</span>
              <p className="italic">
                «{settings.userName || 'Daniel'}, tu encuentro con Dios te espera. Dedica un momento de paz hoy.»
              </p>
            </div>

            <button
              onClick={handleTestNotification}
              className="w-full py-2 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-black/5 text-xs font-medium text-[var(--text-secondary)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>{notificationSent ? (settings.language === 'es' ? '¡Notificación enviada al móvil!' : 'Dispatched to mobile!') : (settings.language === 'es' ? 'Probar Notificación en el Dispositivo' : 'Test Device Notification')}</span>
            </button>
          </div>

          {/* In-App PWA Install */}
          <div className="pt-2">
            <PWAInstallButton variant="full" />
          </div>
        </div>
      </div>
    </div>
  );
};

