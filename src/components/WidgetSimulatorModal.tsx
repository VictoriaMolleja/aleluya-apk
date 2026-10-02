/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Flame, BookOpen, Copy, Check, Sparkles } from 'lucide-react';
import { getTodayVerse } from '../data/devotionals';
import { storageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
}

export const WidgetSimulatorModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  const [widgetSize, setWidgetSize] = useState<'4x2' | '2x2'>('4x2');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const todayVerse = getTodayVerse();
  const streak = storageService.getStreak();
  const lastPos = storageService.getLastPosition();

  const glanceKotlinCode = `
// Jetpack Glance Widget Implementation for Android
// Package: com.aleluyabiblia.glance

class AleluyaDailyVerseWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                Box(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .background(ColorProvider(Color(0xFFFAF8F5), Color(0xFF1B2126)))
                        .cornerRadius(24.dp)
                        .padding(16.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "ALELUYA BIBLIA",
                                style = TextStyle(fontWeight = FontWeight.Bold, color = ColorProvider(Color(0xFF5C4033)))
                            )
                            Spacer(modifier = GlanceModifier.defaultWeight())
                            Text(text = "🔥 ${streak.currentStreak} días")
                        }
                        Spacer(modifier = GlanceModifier.height(8.dp))
                        Text(
                            text = "«${language === 'es' ? todayVerse.textEs : todayVerse.textEn}»",
                            maxLines = 3,
                            style = TextStyle(fontSize = 14.sp)
                        )
                        Text(
                            text = "${todayVerse.reference}",
                            style = TextStyle(fontWeight = FontWeight.Bold, color = ColorProvider(Color(0xFF7C4A3A)))
                        )
                    }
                }
            }
        }
    }
}
`.trim();

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(glanceKotlinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl max-h-[90vh] rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-bold font-cinzel text-[var(--accent)]">
              {language === 'es' ? 'Widget de Pantalla de Inicio (Glance)' : 'Home Screen Widget (Jetpack Glance)'}
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Size switcher */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setWidgetSize('4x2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                widgetSize === '4x2'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-black/5 text-[var(--text-secondary)]'
              }`}
            >
              {language === 'es' ? 'Widget Panorámico (4x2)' : 'Panoramic Widget (4x2)'}
            </button>
            <button
              onClick={() => setWidgetSize('2x2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                widgetSize === '2x2'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-black/5 text-[var(--text-secondary)]'
              }`}
            >
              {language === 'es' ? 'Widget Cuadrado (2x2)' : 'Square Widget (2x2)'}
            </button>
          </div>

          {/* Android Home Screen Simulator Backdrop */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-sky-900/80 via-emerald-950/70 to-slate-900/90 border border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* Clock at top of simulated launcher */}
            <div className="absolute top-2.5 left-0 right-0 text-center text-[10px] text-white/60 font-mono">
              12:30 · Miércoles, 28 Septiembre
            </div>

            {/* Simulated Jetpack Glance Widget */}
            {widgetSize === '4x2' ? (
              <div className="w-full max-w-sm mt-4 rounded-3xl bg-[#FAF8F5] text-[#3D322C] p-4 shadow-xl border border-white/40 flex flex-col justify-between gap-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-[#5C4033] text-white flex items-center justify-center text-[9px] font-bold">AB</span>
                    <span className="text-[11px] font-bold tracking-wider font-cinzel text-[#5C4033]">ALELUYA BIBLIA</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-600" />
                    <span>{streak.currentStreak} {language === 'es' ? 'días' : 'days'}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs italic font-serif-biblical leading-relaxed line-clamp-3 text-[#2E241E]">
                    «{language === 'es' ? todayVerse.textEs : todayVerse.textEn}»
                  </p>
                  <span className="text-[11px] font-bold text-[#7C4A3A] block mt-1">
                    {todayVerse.reference}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between text-[10px] text-[#7A6B5D]">
                  <span>{language === 'es' ? 'Versículo del Día' : 'Daily Verse'}</span>
                  <span className="font-semibold text-[#5C4033]">100% Offline</span>
                </div>
              </div>
            ) : (
              <div className="w-44 h-44 mt-4 rounded-3xl bg-[#FAF8F5] text-[#3D322C] p-3.5 shadow-xl border border-white/40 flex flex-col justify-between animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="w-4 h-4 rounded-md bg-[#5C4033] text-white flex items-center justify-center text-[9px] font-bold">AB</span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded-full">
                    <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                    <span>{streak.currentStreak}d</span>
                  </div>
                </div>

                <div className="text-center my-auto">
                  <span className="text-[10px] uppercase font-bold text-[#7A6B5D] block">
                    {language === 'es' ? 'Racha Espiritual' : 'Prayer Streak'}
                  </span>
                  <span className="text-3xl font-extrabold text-[#5C4033]">
                    {streak.currentStreak}
                  </span>
                  <span className="text-[9px] text-[#7A6B5D] block mt-0.5">
                    {language === 'es' ? 'Días constantes' : 'Active days'}
                  </span>
                </div>

                <div className="text-[9px] text-center font-bold text-[#7C4A3A] truncate">
                  {todayVerse.reference}
                </div>
              </div>
            )}
          </div>

          {/* Description & Developer Code */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {language === 'es' ? 'Integración Android Jetpack Glance' : 'Android Jetpack Glance Integration'}
            </h4>
            <p className="text-xs text-[var(--text-primary)] leading-relaxed">
              {language === 'es'
                ? 'Este widget se comunica directamente con la base de datos local SQLite/Room y WorkManager para actualizar automáticamente el versículo matutino sin necesidad de conexión.'
                : 'This widget communicates directly with local SQLite/Room storage and WorkManager to automatically refresh the morning verse without any internet connection.'}
            </p>

            <div className="pt-2">
              <button
                onClick={handleCopyCode}
                className="w-full py-2 px-3 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? (language === 'es' ? '¡Código Kotlin Copiado!' : 'Kotlin Code Copied!') : (language === 'es' ? 'Copiar Código Kotlin de Glance' : 'Copy Glance Kotlin Code')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
