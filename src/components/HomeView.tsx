/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Share2, 
  BookOpen, 
  Volume2, 
  Pin, 
  Smartphone, 
  Copy, 
  Check, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { ReaderSettings, SpiritualStreak } from '../types/bible';
import { getTodayVerse, DailyVerseItem } from '../data/devotionals';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { storageService, getTodayDateString } from '../services/storageService';

interface Props {
  settings: ReaderSettings;
  streak: SpiritualStreak;
  onNavigateToBible: (bookId?: string, chapter?: number) => void;
  onOpenCardGenerator: (ref: string, text: string) => void;
  onOpenWidgetManager: () => void;
  onOpenProgress: () => void;
  onPlayTTSForText: (text: string) => void;
  onPinVerseToWidget: (ref: string, text: string, bookId: string, chapter: number, verse: number) => void;
  onMarkDailyVerseRead: () => void;
}

export const HomeView: React.FC<Props> = ({
  settings,
  streak,
  onNavigateToBible,
  onOpenCardGenerator,
  onOpenWidgetManager,
  onOpenProgress,
  onPlayTTSForText,
  onPinVerseToWidget,
  onMarkDailyVerseRead
}) => {
  const [copiedDaily, setCopiedDaily] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const todayVerse: DailyVerseItem = getTodayVerse();
  const lastPos = storageService.getLastPosition();
  const lastBook = BIBLE_BOOKS.find(b => b.id === lastPos.bookId) || BIBLE_BOOKS[18];

  const hasName = !!settings.userName && settings.userName.trim().length > 0;
  const userName = hasName ? settings.userName.trim() : '';
  const isReadToday = storageService.isDailyVerseReadToday();

  // Format today's date in user's local timezone
  const formattedDate = new Intl.DateTimeFormat(settings.language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  // Week days tracker
  const weekDays = settings.language === 'es' ? ['D', 'L', 'M', 'M', 'J', 'V', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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

  const dailyVerseText = settings.language === 'es' ? todayVerse.textEs : todayVerse.textEn;

  const handleCopyText = async () => {
    const shareMessage = `${todayVerse.reference}\n«${dailyVerseText}»\n— Aleluya Biblia`;
    await navigator.clipboard.writeText(shareMessage);
    setCopiedDaily(true);
    setTimeout(() => setCopiedDaily(false), 2000);
  };

  const handleShareSocial = (platform: 'whatsapp' | 'telegram' | 'native') => {
    const textToShare = `${todayVerse.reference}\n«${dailyVerseText}»\n— Compartido desde Aleluya Biblia`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(textToShare)}`, '_blank');
    } else if (navigator.share) {
      navigator.share({
        title: todayVerse.reference,
        text: textToShare
      }).catch(() => {});
    } else {
      handleCopyText();
    }
    setShowShareMenu(false);
  };

  const handleReadFullChapter = () => {
    onMarkDailyVerseRead();
    onNavigateToBible(todayVerse.bookId, todayVerse.chapter);
  };

  const handleListenAloud = () => {
    onMarkDailyVerseRead();
    onPlayTTSForText(dailyVerseText);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 pb-32 space-y-6 animate-tab-switch">
      {/* Top Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-medium tracking-wider text-[var(--text-secondary)] capitalize block">
            {formattedDate}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-[var(--accent)] mt-0.5">
            {hasName 
              ? (settings.language === 'es' ? `Paz a ti, ${userName}` : `Peace be with you, ${userName}`)
              : (settings.language === 'es' ? 'Dios te está esperando' : 'God is waiting for you')}
          </h1>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center font-cinzel font-bold text-sm shadow-sm">
          AB
        </div>
      </div>

      {/* 1. RACHA ESPIRITUAL (Spiritual Streak Card) */}
      <div 
        onClick={onOpenProgress}
        className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/35 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-600 shadow-inner shrink-0">
              <Flame className="w-8 h-8 fill-amber-500 text-amber-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-[var(--text-primary)]">
                  {streak.currentStreak}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {settings.language === 'es' ? 'Días de Racha' : 'Day Streak'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                {isReadToday
                  ? (settings.language === 'es' 
                      ? (hasName ? `¡Día ${streak.currentStreak} cumplido hoy, ${userName}!` : `¡Día ${streak.currentStreak} cumplido con fidelidad!`)
                      : `Day ${streak.currentStreak} fulfilled today!`)
                  : (settings.language === 'es'
                      ? 'Lee el versículo de hoy para mantener tu racha viva'
                      : 'Read today\'s verse to secure your streak')}
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] opacity-60 group-hover:translate-x-1 transition-transform shrink-0 mt-2" />
        </div>

        {/* 7 Days Mini Tracker */}
        <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between gap-1">
          {last7Days.map((d, idx) => (
            <div
              key={idx}
              className={`flex-1 py-1.5 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
                d.isRead
                  ? 'bg-amber-500/25 text-amber-950 font-bold'
                  : 'bg-black/[0.02] text-[var(--text-secondary)]'
              } ${d.isCurrent ? 'ring-2 ring-amber-500/60' : ''}`}
            >
              <span className="text-[10px] opacity-75">{d.dayName}</span>
              <div className="w-4 h-4 flex items-center justify-center">
                {d.isRead ? (
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-black/15" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. VERSÍCULO DEL DÍA CITADO PARA EL USUARIO Y SU RACHA */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              {settings.language === 'es' ? 'Versículo del Día' : 'Daily Verse'}
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800">
            {todayVerse.theme}
          </span>
        </div>

        {/* Dedication quote */}
        <p className="text-xs text-[var(--text-secondary)] italic">
          {hasName
            ? (settings.language === 'es'
                ? `Citado para ${userName} en su encuentro con Dios:`
                : `Quoted for ${userName} in personal reflection:`)
            : (settings.language === 'es'
                ? 'Versículo citado para tu momento de paz diaria:'
                : 'Scripture for your daily moment of peace:')
          }
        </p>

        {/* Scripture Text */}
        <blockquote className="text-base sm:text-lg font-serif-biblical italic text-[var(--text-primary)] leading-relaxed pl-3 border-l-2 border-[var(--accent)]">
          «{dailyVerseText}»
        </blockquote>

        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-xs sm:text-sm font-cinzel text-[var(--accent)]">
            {todayVerse.reference}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {settings.language === 'es' ? 'En tu Widget de inicio' : 'Synced with Home Widget'}
          </span>
        </div>

        {/* STATUS DE CUMPLIMIENTO DE RACHA */}
        <div className="pt-1">
          {isReadToday ? (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settings.language === 'es' ? '¡Versículo leído hoy! Racha cumplida' : 'Daily verse read! Streak secured'}</span>
              </div>
              <span className="text-[10px] text-emerald-800/80 font-medium">
                {settings.language === 'es' ? 'Paz asegurada' : 'Completed'}
              </span>
            </div>
          ) : (
            <button
              onClick={onMarkDailyVerseRead}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs sm:text-sm hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>{settings.language === 'es' ? 'Cumplir mi racha de hoy: Marcar leído' : 'Mark daily verse read & secure streak'}</span>
            </button>
          )}
        </div>

        {/* Action Buttons for Daily Verse */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2 text-xs">
          {/* Direct Share Dropdown / Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="px-3 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-95 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{settings.language === 'es' ? 'Compartir' : 'Share'}</span>
            </button>

            {showShareMenu && (
              <div className="absolute left-0 bottom-full mb-2 w-48 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl p-2 z-30 space-y-1 animate-fade-in">
                <button
                  onClick={() => handleShareSocial('whatsapp')}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShareSocial('telegram')}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Telegram</span>
                </button>
                <button
                  onClick={() => handleShareSocial('native')}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                >
                  <Share2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Más opciones...</span>
                </button>
                <button
                  onClick={handleCopyText}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                >
                  {copiedDaily ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDaily ? '¡Copiado!' : 'Copiar texto'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Create visual image card */}
          <button
            onClick={() => onOpenCardGenerator(todayVerse.reference, dailyVerseText)}
            className="px-3 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 font-semibold text-[var(--text-primary)] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{settings.language === 'es' ? 'Crear Tarjeta' : 'Create Card'}</span>
          </button>

          {/* Pin to Widget button */}
          <button
            onClick={() => onPinVerseToWidget(todayVerse.reference, dailyVerseText, todayVerse.bookId, todayVerse.chapter, todayVerse.verse)}
            className="px-3 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 font-semibold text-[var(--text-primary)] transition-all flex items-center gap-1.5"
          >
            <Pin className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{settings.language === 'es' ? 'Fijar en Widget' : 'Pin to Widget'}</span>
          </button>

          {/* Listen aloud */}
          <button
            onClick={handleListenAloud}
            title="Escuchar en voz alta"
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 text-[var(--text-primary)] transition-all ml-auto"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Read in Bible */}
          <button
            onClick={handleReadFullChapter}
            className="w-full mt-1 py-2 px-3 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] text-xs font-semibold text-[var(--accent)] transition-all flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{settings.language === 'es' ? `Leer todo ${todayVerse.reference}` : `Read full chapter`}</span>
          </button>
        </div>
      </div>

      {/* 3. CONTINUAR LECTURA (Quick Jump to last read chapter) */}
      <div 
        onClick={() => onNavigateToBible(lastBook.id, lastPos.chapter)}
        className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
              {settings.language === 'es' ? 'Continuar Lectura' : 'Continue Reading'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {settings.language === 'es' ? lastBook.nameEs : lastBook.nameEn} {lastPos.chapter}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
          <span>{settings.language === 'es' ? 'Abrir' : 'Open'}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 4. GESTIÓN DE WIDGETS */}
      <button
        onClick={onOpenWidgetManager}
        className="w-full p-4 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] hover:bg-black/5 text-left transition-all flex items-center justify-between group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              {settings.language === 'es' ? 'Gestión de Widgets Bíblicos' : 'Bible Widget Manager'}
            </h4>
            <span className="text-[11px] text-[var(--text-secondary)] block">
              {settings.language === 'es' ? 'Fija versículos y oraciones en tu pantalla de inicio' : 'Pin verses & prayers to your home screen'}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform shrink-0" />
      </button>
    </div>
  );
};
