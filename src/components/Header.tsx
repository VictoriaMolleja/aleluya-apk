/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Sparkles, 
  Bookmark, 
  Flame, 
  Settings, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  Globe 
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  bookName: string;
  chapter: number;
  currentStreak: number;
  isImmersive: boolean;
  language: 'es' | 'en';
  onToggleImmersive: () => void;
  onOpenBookSelector: () => void;
  onOpenSearch: () => void;
  onOpenStudyCenter: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
  onToggleLanguage: () => void;
}

export const Header: React.FC<Props> = ({
  bookName,
  chapter,
  currentStreak,
  isImmersive,
  language,
  onToggleImmersive,
  onOpenBookSelector,
  onOpenSearch,
  onOpenStudyCenter,
  onOpenProgress,
  onOpenSettings,
  onToggleLanguage
}) => {

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-main)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] transition-all">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Branding & Chapter Picker */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo Monogram */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-xs shrink-0 font-cinzel font-bold text-xs sm:text-sm">
            AB
          </div>

          {/* Current Scripture Navigation Trigger */}
          <button
            onClick={onOpenBookSelector}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-black/5 transition-colors text-left group"
          >
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm sm:text-base font-cinzel text-[var(--accent)]">
                  {bookName} {chapter}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--accent)] group-hover:translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] hidden sm:block">
                {language === 'es' ? 'Reina-Valera 1909' : 'King James Version'}
              </span>
            </div>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Language Toggle (ES / EN) - Hidden on mobile, moved to bottom controls */}
          <button
            onClick={onToggleLanguage}
            title={language === 'es' ? 'Cambiar a English KJV' : 'Switch to Spanish RVR1909'}
            className="px-2 py-1 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors hidden sm:flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            title={language === 'es' ? 'Buscar en la Biblia' : 'Search the Bible'}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Study Center (Bookmarks, Notes) - Shown on desktop; on mobile accessed in reader controls */}
          <button
            onClick={onOpenStudyCenter}
            title={language === 'es' ? 'Marcadores, Notas y Resaltados' : 'Bookmarks & Notes'}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors hidden sm:flex cursor-pointer"
          >
            <Bookmark className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Streak Flame Badge */}
          <button
            onClick={onOpenProgress}
            title={language === 'es' ? 'Racha Espiritual y Progreso' : 'Spiritual Streak & Progress'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 transition-colors font-bold text-xs shrink-0 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>{currentStreak}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title={language === 'es' ? 'Ajustes de Lectura' : 'Reading Settings'}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors hidden sm:flex cursor-pointer"
          >
            <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Modo Inmersivo Fullscreen Toggle - Spacious & prominent */}
          <button
            onClick={onToggleImmersive}
            title={isImmersive ? (language === 'es' ? 'Salir del modo inmersivo' : 'Exit Immersive') : (language === 'es' ? 'Modo Inmersivo (Pantalla Completa)' : 'Immersive Mode')}
            className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              isImmersive
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 border border-transparent sm:border-[var(--border-subtle)]/60'
            }`}
          >
            {isImmersive ? <Minimize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
          </button>

          {/* PWA Install */}
          <div className="hidden lg:block ml-1">
            <PWAInstallButton variant="header" />
          </div>
        </div>
      </div>
    </header>
  );
};
