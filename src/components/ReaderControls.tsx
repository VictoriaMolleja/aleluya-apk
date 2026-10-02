/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Gauge,
  Mic,
  Bookmark,
  Globe
} from 'lucide-react';
import { ReaderSettings, VoiceProfileId } from '../types/bible';
import { VOICE_PROFILES } from '../services/ttsService';

interface Props {
  isReadingAudio: boolean;
  isAudioPaused: boolean;
  ttsRate: number;
  currentVerseIndex: number;
  totalVerses: number;
  isChapterRead: boolean;
  settings: ReaderSettings;
  onPlayTTS: () => void;
  onPauseTTS: () => void;
  onStopTTS: () => void;
  onNextVerseTTS: () => void;
  onPrevVerseTTS: () => void;
  onChangeRateTTS: (rate: number) => void;
  onChangeVoiceProfile?: (profileId: VoiceProfileId) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onToggleChapterRead: () => void;
  onUpdateFontSize: (delta: number) => void;
  onOpenStudyCenter?: () => void;
  onToggleLanguage?: () => void;
  isImmersive?: boolean;
}

export const ReaderControls: React.FC<Props> = ({
  isReadingAudio,
  isAudioPaused,
  ttsRate,
  currentVerseIndex,
  totalVerses,
  settings,
  onPlayTTS,
  onPauseTTS,
  onStopTTS,
  onNextVerseTTS,
  onPrevVerseTTS,
  onChangeRateTTS,
  onChangeVoiceProfile,
  onPrevChapter,
  onNextChapter,
  onToggleChapterRead,
  onUpdateFontSize,
  onOpenStudyCenter,
  onToggleLanguage,
  isImmersive = false,
  isChapterRead
}) => {
  const rates = [0.8, 1.0, 1.3, 1.6];
  const voiceProfilesList: VoiceProfileId[] = ['sofia', 'mateo', 'gabriel'];

  const handleNextRate = () => {
    const currentIdx = rates.indexOf(ttsRate);
    const nextIdx = (currentIdx + 1) % rates.length;
    onChangeRateTTS(rates[nextIdx]);
  };

  const handleNextVoice = () => {
    if (!onChangeVoiceProfile) return;
    const currentIdx = voiceProfilesList.indexOf(settings.ttsVoiceProfile);
    const nextIdx = (currentIdx + 1) % voiceProfilesList.length;
    onChangeVoiceProfile(voiceProfilesList[nextIdx]);
  };

  const currentVoiceObj = VOICE_PROFILES.find(p => p.id === settings.ttsVoiceProfile) || VOICE_PROFILES[0];
  const voiceShortName = currentVoiceObj.name.split(' ')[0];

  return (
    <div className={`fixed ${isImmersive ? 'bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]' : 'bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-20'} left-0 right-0 z-40 px-2 sm:px-4 pointer-events-none transition-all duration-300`}>
      <div className={`max-w-2xl mx-auto rounded-2xl bg-[var(--bg-card)]/95 backdrop-blur-md border shadow-2xl p-2 sm:p-2.5 pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 transition-all ${
        isReadingAudio 
          ? 'border-amber-500/60 ring-2 ring-amber-500/25 shadow-amber-900/10' 
          : 'border-[var(--border-subtle)]'
      }`}>
        {/* Previous Chapter */}
        <button
          onClick={onPrevChapter}
          title={settings.language === 'es' ? 'Capítulo Anterior' : 'Previous Chapter'}
          className="p-1.5 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center: Audio Player Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Previous Verse */}
          <button
            onClick={onPrevVerseTTS}
            disabled={!isReadingAudio}
            title={settings.language === 'es' ? 'Versículo anterior' : 'Previous verse'}
            className="p-1 sm:p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Main Play / Pause Synchronized */}
          <button
            onClick={isReadingAudio && !isAudioPaused ? onPauseTTS : onPlayTTS}
            title={isReadingAudio && !isAudioPaused ? (settings.language === 'es' ? 'Pausar lectura' : 'Pause audio') : (settings.language === 'es' ? 'Escuchar en voz alta' : 'Listen aloud')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isReadingAudio && !isAudioPaused
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40 animate-pulse'
                : 'bg-[var(--accent)] text-white hover:opacity-90 shadow-sm'
            }`}
          >
            {isReadingAudio && !isAudioPaused ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            )}
          </button>

          {/* Next Verse */}
          <button
            onClick={onNextVerseTTS}
            disabled={!isReadingAudio}
            title={settings.language === 'es' ? 'Versículo siguiente' : 'Next verse'}
            className="p-1 sm:p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Stop Button */}
          {isReadingAudio && (
            <button
              onClick={onStopTTS}
              title={settings.language === 'es' ? 'Detener lectura' : 'Stop'}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Reading verse badge when active */}
          {isReadingAudio && (
            <div className="hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-[10px] font-bold text-amber-800">
              <span>v.{currentVerseIndex + 1}/{totalVerses}</span>
            </div>
          )}

          {/* Voice Selector button (Sofía / Mateo / Gabriel) */}
          {onChangeVoiceProfile && (
            <button
              onClick={handleNextVoice}
              title={settings.language === 'es' ? `Lector de voz: ${currentVoiceObj.name} (Toca para cambiar)` : `Reader voice: ${currentVoiceObj.name}`}
              className="px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10 text-[11px] font-semibold text-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Mic className="w-3 h-3 text-amber-600" />
              <span className="hidden xs:inline">{voiceShortName}</span>
            </button>
          )}

          {/* Speed Rate Pill */}
          <button
            onClick={handleNextRate}
            title={settings.language === 'es' ? 'Velocidad de voz' : 'Voice speed'}
            className="px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10 text-[11px] font-mono font-bold text-[var(--accent)] transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <Gauge className="w-3 h-3" />
            <span>{ttsRate}x</span>
          </button>
        </div>

        {/* Right Tools: Marcadores, Idioma, Font Size & Mark Read */}
        <div className="flex items-center gap-1">
          {/* Marcadores / Study Center (Moved down as user requested) */}
          {onOpenStudyCenter && (
            <button
              onClick={onOpenStudyCenter}
              title={settings.language === 'es' ? 'Marcadores, notas y resaltados' : 'Bookmarks & Notes'}
              className="p-1.5 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          )}

          {/* Language Toggle (ES/EN) (Moved down as user requested) */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              title={settings.language === 'es' ? 'Cambiar a English KJV' : 'Cambiar a Español'}
              className="px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10 text-[10px] sm:text-[11px] font-bold text-[var(--accent)] transition-colors flex items-center gap-0.5 cursor-pointer uppercase"
            >
              <Globe className="w-3 h-3 text-[var(--accent)]" />
              <span>{settings.language}</span>
            </button>
          )}

          {/* Font Size A- / A+ (Desktop) */}
          <div className="hidden md:flex items-center border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-black/[0.02]">
            <button
              onClick={() => onUpdateFontSize(-1)}
              title="Reducir letra"
              className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-black/5 cursor-pointer"
            >
              A-
            </button>
            <button
              onClick={() => onUpdateFontSize(1)}
              title="Aumentar letra"
              className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-black/5 font-bold cursor-pointer"
            >
              A+
            </button>
          </div>

          {/* Mark Chapter Read */}
          <button
            onClick={onToggleChapterRead}
            title={isChapterRead ? (settings.language === 'es' ? 'Capítulo leído' : 'Chapter read') : (settings.language === 'es' ? 'Marcar como leído' : 'Mark as read')}
            className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
              isChapterRead
                ? 'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
            }`}
          >
            <CheckCircle2 className="w-4.5 h-4.5" />
          </button>

          {/* Next Chapter */}
          <button
            onClick={onNextChapter}
            title={settings.language === 'es' ? 'Capítulo Siguiente' : 'Next Chapter'}
            className="p-1.5 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
