/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sun, Moon, Heart, Sparkles, Share2, BookOpen, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { DAILY_DEVOTIONALS, THEMED_PRAYERS, getTodayVerse, DailyVerseItem } from '../data/devotionals';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
  onOpenCardGenerator: (ref: string, text: string) => void;
  onJumpToVerse: (bookId: string, chapter: number, verse: number) => void;
}

export const DevotionalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  onOpenCardGenerator,
  onJumpToVerse
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'devotionals' | 'prayers'>('daily');
  const [selectedPrayerCat, setSelectedPrayerCat] = useState<string>('ansiedad');
  const todayVerse: DailyVerseItem = getTodayVerse();

  if (!isOpen) return null;

  const currentPrayer = THEMED_PRAYERS.find(p => p.category === selectedPrayerCat) || THEMED_PRAYERS[0];
  const morningDev = DAILY_DEVOTIONALS.find(d => d.type === 'morning') || DAILY_DEVOTIONALS[0];
  const nightDev = DAILY_DEVOTIONALS.find(d => d.type === 'night') || DAILY_DEVOTIONALS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl h-[88vh] rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-base sm:text-lg font-bold font-cinzel text-[var(--accent)]">
              {language === 'es' ? 'Oraciones y Devocionales' : 'Prayers & Devotionals'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex border-b border-[var(--border-subtle)] bg-black/[0.02] px-4 pt-2">
          <button
            onClick={() => setActiveTab('daily')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>{language === 'es' ? 'Versículo del Día' : 'Verse of the Day'}</span>
          </button>

          <button
            onClick={() => setActiveTab('devotionals')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'devotionals'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{language === 'es' ? 'Mañana y Noche' : 'Morning & Night'}</span>
          </button>

          <button
            onClick={() => setActiveTab('prayers')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'prayers'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{language === 'es' ? 'Oraciones Guiadas' : 'Themed Prayers'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: VERSÍCULO DEL DÍA */}
          {activeTab === 'daily' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-200/10 to-transparent border border-amber-300/30 text-center relative overflow-hidden">
                <span className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider block mb-2">
                  {language === 'es' ? 'Pan Cotidiano para el Alma' : 'Daily Soul Nourishment'} · {todayVerse.theme}
                </span>

                <blockquote className="text-lg sm:text-2xl font-serif-biblical italic text-[var(--text-primary)] my-4 leading-relaxed">
                  «{language === 'es' ? todayVerse.textEs : todayVerse.textEn}»
                </blockquote>

                <span className="font-bold text-sm font-cinzel text-[var(--accent)] block mt-2">
                  {todayVerse.reference}
                </span>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={() => {
                      onOpenCardGenerator(todayVerse.reference, language === 'es' ? todayVerse.textEs : todayVerse.textEn);
                    }}
                    className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Crear Tarjeta para Compartir' : 'Create Shareable Card'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onJumpToVerse(todayVerse.bookId, todayVerse.chapter, todayVerse.verse);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 text-xs font-semibold text-[var(--text-primary)] transition-all flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Leer Capítulo en la Biblia' : 'Read Chapter in Bible'}</span>
                  </button>
                </div>
              </div>

              {/* Reflection Card */}
              <div className="p-5 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {language === 'es' ? 'Meditación para hoy' : 'Meditation for Today'}
                </h4>
                <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                  {language === 'es' 
                    ? 'Dedica dos minutos de silencio antes de comenzar tus labores. Deja que esta promesa resuene en tu espíritu y confía plenamente en que Dios sostiene cada detalle de tu camino.' 
                    : 'Spend two minutes of silence before starting your day. Let this promise settle in your spirit and trust fully that God sustains every detail of your path.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DEVOCIONALES DE MAÑANA Y NOCHE */}
          {activeTab === 'devotionals' && (
            <div className="space-y-6">
              {/* Devocional de la Mañana */}
              <div className="p-5 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wide">
                  <Sun className="w-4 h-4" />
                  <span>{language === 'es' ? 'Devocional de la Mañana' : 'Morning Devotional'}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  {morningDev.title}
                </h3>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs italic">
                  <p>«{morningDev.verseText}»</p>
                  <span className="font-bold not-italic block mt-1 text-[var(--accent)]">{morningDev.verseRef}</span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {morningDev.reflection}
                </p>
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--accent)] block mb-1">
                    {language === 'es' ? 'Oración de la Mañana:' : 'Morning Prayer:'}
                  </span>
                  <p className="text-xs italic text-[var(--text-secondary)] leading-relaxed">
                    {morningDev.prayer}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/5 text-xs text-[var(--text-primary)]">
                  <strong>{language === 'es' ? 'Pregunta de reflexión:' : 'Reflection question:'}</strong> {morningDev.reflectionQuestion}
                </div>
              </div>

              {/* Devocional de la Noche */}
              <div className="p-5 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs uppercase tracking-wide">
                  <Moon className="w-4 h-4" />
                  <span>{language === 'es' ? 'Devocional de la Noche' : 'Evening Devotional'}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  {nightDev.title}
                </h3>
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-xs italic">
                  <p>«{nightDev.verseText}»</p>
                  <span className="font-bold not-italic block mt-1 text-[var(--accent)]">{nightDev.verseRef}</span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {nightDev.reflection}
                </p>
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--accent)] block mb-1">
                    {language === 'es' ? 'Oración para Descansar en Paz:' : 'Night Rest Prayer:'}
                  </span>
                  <p className="text-xs italic text-[var(--text-secondary)] leading-relaxed">
                    {nightDev.prayer}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/5 text-xs text-[var(--text-primary)]">
                  <strong>{language === 'es' ? 'Pregunta de reflexión:' : 'Reflection question:'}</strong> {nightDev.reflectionQuestion}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORACIONES TEMÁTICAS */}
          {activeTab === 'prayers' && (
            <div className="space-y-5">
              {/* Category pill-free segmented buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-black/5">
                {[
                  { id: 'ansiedad', label: language === 'es' ? 'Ansiedad' : 'Anxiety' },
                  { id: 'gratitud', label: language === 'es' ? 'Gratitud' : 'Gratitude' },
                  { id: 'familia', label: language === 'es' ? 'Familia' : 'Family' },
                  { id: 'sanidad', label: language === 'es' ? 'Sanidad' : 'Healing' },
                  { id: 'perdon', label: language === 'es' ? 'Perdón' : 'Forgiveness' },
                  { id: 'proteccion', label: language === 'es' ? 'Protección' : 'Protection' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedPrayerCat(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedPrayerCat === cat.id
                        ? 'bg-[var(--accent)] text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Selected Prayer Content */}
              <div className="p-6 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    {currentPrayer.title}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                    {currentPrayer.verseRef}
                  </span>
                </div>

                <div className="text-sm sm:text-base leading-relaxed text-[var(--text-primary)] font-serif-biblical italic p-4 rounded-xl bg-white/40 border border-[var(--border-subtle)]">
                  {currentPrayer.body}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => onOpenCardGenerator(currentPrayer.verseRef, currentPrayer.title)}
                    className="px-3.5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Compartir Oración' : 'Share Prayer'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
