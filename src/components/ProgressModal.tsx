/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Flame, Trophy, Calendar, CheckCircle2, Award, Smartphone } from 'lucide-react';
import { storageService, getTodayDateString } from '../services/storageService';
import { BIBLE_BOOKS } from '../data/bibleBooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
  onOpenWidgetSimulator: () => void;
}

export const ProgressModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  onOpenWidgetSimulator
}) => {
  if (!isOpen) return null;

  const streak = storageService.getStreak();
  const otProgress = storageService.getTestamentProgress('OT');
  const ntProgress = storageService.getTestamentProgress('NT');
  const totalChapters = otProgress.total + ntProgress.total;
  const totalRead = otProgress.read + ntProgress.read;
  const totalPercent = totalChapters > 0 ? Math.round((totalRead / totalChapters) * 100) : 0;

  // Current month name
  const currentMonthName = new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', { month: 'long' }).format(new Date());

  // Past 7 days streak indicator
  const weekDays = language === 'es' ? ['D', 'L', 'M', 'M', 'J', 'V', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayName = weekDays[d.getDay()];
    const isRead = streak.readHistory.includes(dateStr);
    const isCurrent = dateStr === getTodayDateString();
    return { dateStr, dayName, isRead, isCurrent };
  });

  // Badges
  const badges = [
    { id: 1, title: language === 'es' ? 'Semilla de Fe' : 'Seed of Faith', days: 1, desc: language === 'es' ? 'Primer día de lectura' : 'First day of reading', unlocked: streak.totalDaysRead >= 1 },
    { id: 3, title: language === 'es' ? 'Lámpara a mis pies' : 'Lamp to my feet', days: 3, desc: language === 'es' ? '3 días constantes' : '3 days streak', unlocked: streak.longestStreak >= 3 },
    { id: 7, title: language === 'es' ? 'Raíces Fuertes' : 'Strong Roots', days: 7, desc: language === 'es' ? '1 semana en la Palabra' : '1 week in the Word', unlocked: streak.longestStreak >= 7 },
    { id: 14, title: language === 'es' ? 'Roca Firme' : 'Firm Rock', days: 14, desc: language === 'es' ? '2 semanas consecutivas' : '2 weeks streak', unlocked: streak.longestStreak >= 14 },
    { id: 30, title: language === 'es' ? 'Guardián de la Verdad' : 'Truth Guardian', days: 30, desc: language === 'es' ? '1 mes de devoción diaria' : '1 month of daily devotion', unlocked: streak.longestStreak >= 30 },
    { id: 365, title: language === 'es' ? 'Cristiano fiel' : 'Faithful Christian', days: 365, desc: language === 'es' ? '1 año completo perseverando en la Palabra de Dios' : '1 full year persevering in God\'s Word', unlocked: streak.longestStreak >= 365 || streak.totalDaysRead >= 365 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl h-[88vh] rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-base sm:text-lg font-bold font-cinzel text-[var(--accent)]">
              {language === 'es' ? 'Racha Espiritual y Progreso' : 'Spiritual Streak & Progress'}
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
          {/* Main Streak Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-600 shadow-inner">
                <Flame className="w-10 h-10 fill-amber-500 text-amber-600 animate-pulse" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)]">{streak.currentStreak}</span>
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
                    {language === 'es' ? 'Días Consecutivos' : 'Day Streak'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === 'es' ? '¡Tu racha se actualiza con la hora local de tu dispositivo!' : 'Calculated using your local device timezone!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center border-t sm:border-t-0 sm:border-l border-black/10 pt-3 sm:pt-0 sm:pl-4">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">{language === 'es' ? 'Récord Histórico' : 'Best Streak'}</span>
                <span className="text-xl font-bold text-[var(--accent)]">{streak.longestStreak} {language === 'es' ? 'días' : 'days'}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">{language === 'es' ? 'Total Días Leídos' : 'Total Days'}</span>
                <span className="text-xl font-bold text-[var(--accent)]">{streak.totalDaysRead}</span>
              </div>
            </div>
          </div>

          {/* 7 Days Mini Calendar */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {language === 'es' ? 'Actividad de los Últimos 7 Días' : 'Last 7 Days Activity'}
            </span>
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((d, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                    d.isRead
                      ? 'bg-amber-500/15 border-amber-400 text-amber-800'
                      : 'bg-black/[0.02] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  } ${d.isCurrent ? 'ring-2 ring-amber-500/50' : ''}`}
                >
                  <span className="text-[10px] font-semibold opacity-70">{d.dayName}</span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    {d.isRead ? (
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-black/10" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Reading Progress */}
          <div className="p-5 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {language === 'es' ? 'Progreso Bíblico Global' : 'Overall Bible Progress'}
                </h3>
                <span className="text-xs text-[var(--text-secondary)]">
                  {totalRead} {language === 'es' ? 'de' : 'of'} {totalChapters} {language === 'es' ? 'capítulos completados' : 'chapters completed'}
                </span>
              </div>
              <span className="text-lg font-bold text-[var(--accent)]">{totalPercent}%</span>
            </div>

            {/* Total progress bar */}
            <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                style={{ width: `${totalPercent}%` }}
              />
            </div>

            {/* Testaments breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/[0.02] border border-[var(--border-subtle)]">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{language === 'es' ? 'Antiguo Testamento' : 'Old Testament'}</span>
                  <span>{otProgress.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${otProgress.percent}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] block mt-1">
                  {otProgress.read} / {otProgress.total} {language === 'es' ? 'cap.' : 'ch.'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] border border-[var(--border-subtle)]">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{language === 'es' ? 'Nuevo Testamento' : 'New Testament'}</span>
                  <span>{ntProgress.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${ntProgress.percent}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] block mt-1">
                  {ntProgress.read} / {ntProgress.total} {language === 'es' ? 'cap.' : 'ch.'}
                </span>
              </div>
            </div>

            {/* Month note requested by user */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-900 flex items-center justify-between">
              <span>{language === 'es' ? `Lectura activa en ${currentMonthName}:` : `Active reading in ${currentMonthName}:`}</span>
              <span className="font-bold">{totalRead} {language === 'es' ? 'capítulos' : 'chapters'}</span>
            </div>
          </div>

          {/* Spiritual Badges */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {language === 'es' ? 'Insignias Espirituales' : 'Spiritual Milestone Badges'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    b.unlocked
                      ? 'bg-amber-500/10 border-amber-300 text-[var(--text-primary)]'
                      : 'bg-black/[0.01] border-[var(--border-subtle)] text-[var(--text-secondary)] opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    b.unlocked ? 'bg-amber-500 text-white shadow-xs' : 'bg-black/10 text-[var(--text-secondary)]'
                  }`}>
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{b.title}</h4>
                    <p className="text-[11px] opacity-80">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Android Home Widget Button */}
          <div className="p-4 rounded-2xl bg-black/[0.03] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--accent)] text-white">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">
                  {language === 'es' ? 'Widget de Pantalla de Inicio' : 'Home Screen Widget'}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {language === 'es' ? 'Simulador de Widget Android Jetpack Glance' : 'Jetpack Glance Android Widget preview'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenWidgetSimulator();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-all shrink-0"
            >
              {language === 'es' ? 'Ver Widget' : 'View Widget'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
