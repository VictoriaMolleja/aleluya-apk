/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Settings as SettingsIcon, 
  Check, 
  Smartphone,
  Bookmark,
  Bell,
  Minimize2
} from 'lucide-react';
import { BIBLE_BOOKS } from './data/bibleBooks';
import { getChapterVerses } from './data/bibleVerses';
import { storageService } from './services/storageService';
import { ttsService, VOICE_PROFILES } from './services/ttsService';
import { ReaderSettings, BibleBook, WidgetFixedVerse, VoiceProfileId } from './types/bible';

import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ReaderView } from './components/ReaderView';
import { ReaderControls } from './components/ReaderControls';
import { BookSelectorModal } from './components/BookSelectorModal';
import { SearchModal } from './components/SearchModal';
import { ProgressModal } from './components/ProgressModal';
import { StudyCenterModal } from './components/StudyCenterModal';
import { SettingsModal } from './components/SettingsModal';
import { VerseCardGeneratorModal } from './components/VerseCardGeneratorModal';
import { WidgetManagerModal } from './components/WidgetManagerModal';
import { WidgetSimulatorModal } from './components/WidgetSimulatorModal';
import { OnboardingModal } from './components/OnboardingModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Settings & Theme
  const [settings, setSettings] = useState<ReaderSettings>(() => storageService.getSettings());

  // 3 Mobile Main Screens: 'home' | 'bible' | 'settings' (Starts at 'home' as requested)
  const [activeTab, setActiveTab] = useState<'home' | 'bible' | 'settings'>('home');

  // Onboarding Modal for First Time Launch (Option to skip or configure)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !settings.hasCompletedOnboarding);

  // Book & Chapter State (restore last position)
  const [currentBookId, setCurrentBookId] = useState<string>(() => {
    const last = storageService.getLastPosition();
    return last.bookId || 'GEN';
  });
  const [currentChapter, setCurrentChapter] = useState<number>(() => {
    const last = storageService.getLastPosition();
    return last.chapter || 1;
  });

  // Immersive Mode (distraction-free screen)
  const [isImmersive, setIsImmersive] = useState<boolean>(false);

  // Audio / TTS State
  const [isReadingAudio, setIsReadingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [activeTTSVerseIndex, setActiveTTSVerseIndex] = useState(-1);
  const isAutoAdvancingAudioRef = useRef<boolean>(false);

  // Spiritual Streak State
  const [streak, setStreak] = useState(() => storageService.getStreak());

  // Modals State
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isStudyCenterOpen, setIsStudyCenterOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isWidgetManagerOpen, setIsWidgetManagerOpen] = useState(false);
  const [isWidgetSimulatorOpen, setIsWidgetSimulatorOpen] = useState(false);

  // Card Generator Modal State
  const [cardVerseInfo, setCardVerseInfo] = useState<{ ref: string; text: string } | null>(null);

  // Global Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Current Book and Verses
  const currentBook: BibleBook = BIBLE_BOOKS.find(b => b.id === currentBookId) || BIBLE_BOOKS[0];
  const verses = getChapterVerses(currentBookId, currentChapter);

  // Progress read chapters in current book
  const progress = storageService.getProgress();
  const isChapterRead = (progress[currentBookId] || []).includes(currentChapter);

  // Sync theme attribute to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Save last read position
  useEffect(() => {
    storageService.saveLastPosition(currentBookId, currentChapter);
  }, [currentBookId, currentChapter]);

  // Chapter Navigation
  const handlePrevChapter = useCallback(() => {
    if (currentChapter > 1) {
      setCurrentChapter(c => c - 1);
    } else {
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === currentBookId);
      if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        setCurrentBookId(prevBook.id);
        setCurrentChapter(prevBook.chaptersCount);
      }
    }
  }, [currentBookId, currentChapter]);

  const handleNextChapter = useCallback(() => {
    if (currentChapter < currentBook.chaptersCount) {
      setCurrentChapter(c => c + 1);
    } else {
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === currentBookId);
      if (bookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIndex + 1];
        setCurrentBookId(nextBook.id);
        setCurrentChapter(1);
      }
    }
  }, [currentBook, currentBookId, currentChapter]);

  // Load verses into TTS engine whenever chapter, language, or voice changes
  useEffect(() => {
    const shouldContinueReading = isAutoAdvancingAudioRef.current;
    isAutoAdvancingAudioRef.current = false;

    ttsService.loadChapter(verses, settings.language, 0);
    ttsService.setVoiceProfile(settings.ttsVoiceProfile);

    if (shouldContinueReading) {
      // Pasar automáticamente al siguiente y seguir leyendo con la voz
      const timer = setTimeout(() => {
        ttsService.setRate(settings.ttsRate);
        ttsService.play();
      }, 400);
      showToast(
        settings.language === 'es'
          ? `Continuando lectura con ${currentBook.nameEs} ${currentChapter}`
          : `Continuing reading ${currentBook.nameEn} ${currentChapter}`
      );
      return () => clearTimeout(timer);
    } else {
      setIsReadingAudio(false);
      setIsAudioPaused(false);
      setActiveTTSVerseIndex(-1);
    }
  }, [currentBookId, currentChapter, settings.language, settings.ttsVoiceProfile, settings.ttsRate]);

  // Register TTS callbacks
  useEffect(() => {
    ttsService.registerCallbacks(
      (index) => {
        setActiveTTSVerseIndex(index);
      },
      (state) => {
        setIsReadingAudio(state.isPlaying);
        setIsAudioPaused(state.isPaused);
      },
      () => {
        // Al terminar un capítulo con el lector de voz: marcar leído, pasar al siguiente automáticamente y seguir leyendo con la voz
        storageService.toggleChapterRead(currentBookId, currentChapter);
        const updated = storageService.recordReadingDay();
        setStreak(updated);
        isAutoAdvancingAudioRef.current = true;
        handleNextChapter();
      }
    );
  }, [currentBookId, currentChapter, handleNextChapter]);

  // Update Settings
  const handleUpdateSettings = (newPartial: Partial<ReaderSettings>) => {
    const updated = storageService.saveSettings(newPartial);
    setSettings(updated);
    if (newPartial.ttsVoiceProfile) {
      ttsService.setVoiceProfile(newPartial.ttsVoiceProfile);
    }
  };

  // Onboarding Complete
  const handleOnboardingComplete = (name: string, reminderTime: string) => {
    handleUpdateSettings({
      userName: name,
      morningReminderTime: reminderTime,
      hasCompletedOnboarding: true,
      remindersEnabled: true
    });
    setIsOnboardingOpen(false);
    showToast(name ? `¡Bienvenido, ${name}! Tu espacio bíblico está listo.` : '¡Bienvenido a Aleluya Biblia!');
  };

  // Onboarding Skip
  const handleOnboardingSkip = () => {
    handleUpdateSettings({
      userName: '',
      hasCompletedOnboarding: true,
      remindersEnabled: false
    });
    setIsOnboardingOpen(false);
    showToast('¡Bienvenido! Puedes configurar recordatorios y tu nombre en Ajustes cuando quieras.');
  };

  // Mark Daily Verse as Read (Fulfills Streak for today)
  const handleMarkDailyVerseRead = () => {
    const updated = storageService.markDailyVerseRead();
    setStreak(updated);
    showToast('¡Gloria a Dios! Racha de hoy cumplida.');
  };

  const handleSelectChapter = (bookId: string, chapter: number) => {
    setCurrentBookId(bookId);
    setCurrentChapter(chapter);
    setActiveTab('bible');
  };

  const handleSelectVerseFromSearchOrStudy = (bookId: string, chapter: number) => {
    setCurrentBookId(bookId);
    setCurrentChapter(chapter);
    setActiveTab('bible');
  };

  // Toggle Immersive
  const handleToggleImmersive = () => {
    const next = !isImmersive;
    setIsImmersive(next);
    if (next && document.documentElement.requestFullscreen) {
      try {
        document.documentElement.requestFullscreen().catch(() => {});
      } catch {
        // ignore
      }
    } else if (!next && document.fullscreenElement) {
      try {
        document.exitFullscreen().catch(() => {});
      } catch {
        // ignore
      }
    }
  };

  // Toggle Chapter Read
  const handleToggleChapterRead = () => {
    storageService.toggleChapterRead(currentBookId, currentChapter);
    const updated = storageService.recordReadingDay();
    setStreak(updated);
  };

  // TTS Actions
  const handlePlayTTS = () => {
    ttsService.setRate(settings.ttsRate);
    ttsService.setVoiceProfile(settings.ttsVoiceProfile);
    ttsService.play();
  };

  const handlePauseTTS = () => {
    ttsService.pause();
  };

  const handleStopTTS = () => {
    ttsService.stop();
  };

  const handleNextVerseTTS = () => {
    ttsService.next();
  };

  const handlePrevVerseTTS = () => {
    ttsService.previous();
  };

  const handleChangeRateTTS = (rate: number) => {
    handleUpdateSettings({ ttsRate: rate });
    ttsService.setRate(rate);
  };

  const handleChangeVoiceProfile = (profileId: VoiceProfileId) => {
    handleUpdateSettings({ ttsVoiceProfile: profileId });
    ttsService.setVoiceProfile(profileId);
    const prof = VOICE_PROFILES.find(p => p.id === profileId);
    showToast(`Voz de lectura: ${prof ? prof.name : 'Sofía'}`);
  };

  const handleJumpToVerseAudio = (verseIndex: number) => {
    ttsService.setRate(settings.ttsRate);
    ttsService.setVoiceProfile(settings.ttsVoiceProfile);
    ttsService.jumpToVerse(verseIndex);
  };

  const handleToggleVerseAudio = (verseIndex: number) => {
    ttsService.setRate(settings.ttsRate);
    ttsService.setVoiceProfile(settings.ttsVoiceProfile);
    ttsService.toggleVerse(verseIndex);
  };

  const handlePlayTTSForArbitraryText = (text: string) => {
    ttsService.stop();
    ttsService.speakCustomText(text, settings.language, settings.ttsVoiceProfile);
  };

  // Open Card Generator
  const handleOpenCardGenerator = (ref: string, text: string) => {
    setCardVerseInfo({ ref, text });
  };

  // Pin Verse to Widget Flow
  const handlePinVerseToWidget = (ref: string, text: string, bookId: string, chapter: number, verse: number) => {
    const fixedObj: WidgetFixedVerse = {
      bookId,
      chapter,
      verse,
      reference: ref,
      text,
      updatedAt: new Date().toISOString()
    };

    handleUpdateSettings({ widgetFixedVerse: fixedObj, hasAddedFixedWidget: true });
    setIsWidgetManagerOpen(true);
    showToast(
      settings.language === 'es'
        ? `«${ref}» fijado en tu Widget de pantalla de inicio`
        : `«${ref}» pinned to your home screen Widget`
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors selection:bg-[#FDE68A] selection:text-[#3D322C] flex flex-col relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[var(--accent)] text-white text-xs font-semibold shadow-xl border border-white/20 animate-fade-in flex items-center gap-2 pointer-events-none">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Exit Immersive Floating Pill */}
      {isImmersive && (
        <button
          onClick={handleToggleImmersive}
          title={settings.language === 'es' ? 'Salir del modo inmersivo' : 'Exit Immersive'}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-md transition-all text-xs font-semibold flex items-center gap-1.5"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>{settings.language === 'es' ? 'Salir de Pantalla Completa' : 'Exit Fullscreen'}</span>
        </button>
      )}

      {/* ---------------- PANTALLA 1: INICIO / HOME ---------------- */}
      {activeTab === 'home' && (
        <div className="flex-1 w-full animate-tab-switch">
          <HomeView
            settings={settings}
            streak={streak}
            onNavigateToBible={(bId, ch) => {
              if (bId) setCurrentBookId(bId);
              if (ch) setCurrentChapter(ch);
              setActiveTab('bible');
            }}
            onOpenCardGenerator={handleOpenCardGenerator}
            onOpenWidgetManager={() => setIsWidgetManagerOpen(true)}
            onOpenProgress={() => setIsProgressOpen(true)}
            onPlayTTSForText={handlePlayTTSForArbitraryText}
            onPinVerseToWidget={handlePinVerseToWidget}
            onMarkDailyVerseRead={handleMarkDailyVerseRead}
          />
        </div>
      )}

      {/* ---------------- PANTALLA 2: BIBLIA / LECTOR ---------------- */}
      {activeTab === 'bible' && (
        <div className="flex-1 w-full flex flex-col animate-tab-switch">
          {/* Header (conditionally hidden in strict fullscreen immersive) */}
          {!isImmersive && (
            <Header
              bookName={settings.language === 'es' ? currentBook.nameEs : currentBook.nameEn}
              chapter={currentChapter}
              currentStreak={streak.currentStreak}
              isImmersive={isImmersive}
              language={settings.language}
              onToggleImmersive={handleToggleImmersive}
              onOpenBookSelector={() => setIsBookSelectorOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenStudyCenter={() => setIsStudyCenterOpen(true)}
              onOpenProgress={() => setIsProgressOpen(true)}
              onOpenSettings={() => setActiveTab('settings')}
              onToggleLanguage={() => handleUpdateSettings({ language: settings.language === 'es' ? 'en' : 'es' })}
            />
          )}

          {/* Main Scripture Reader View */}
          <main className="flex-1 w-full">
            <ReaderView
              book={currentBook}
              chapter={currentChapter}
              verses={verses}
              settings={settings}
              activeTTSVerseIndex={activeTTSVerseIndex}
              isReadingAudio={isReadingAudio}
              isAudioPaused={isAudioPaused}
              onToggleVerseAudio={handleToggleVerseAudio}
              onJumpToVerseAudio={handleJumpToVerseAudio}
              onOpenCardGenerator={handleOpenCardGenerator}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
              onToggleChapterRead={handleToggleChapterRead}
              isChapterRead={isChapterRead}
              onPinVerseToWidget={handlePinVerseToWidget}
            />
          </main>
        </div>
      )}

      {/* ---------------- CONTROLES DE AUDIO STICKY / FIJOS EN PANTALLA ---------------- */}
      {(activeTab === 'bible' || isReadingAudio) && (
        <ReaderControls
          isReadingAudio={isReadingAudio}
          isAudioPaused={isAudioPaused}
          ttsRate={settings.ttsRate}
          currentVerseIndex={activeTTSVerseIndex}
          totalVerses={verses.length}
          isChapterRead={isChapterRead}
          settings={settings}
          onPlayTTS={handlePlayTTS}
          onPauseTTS={handlePauseTTS}
          onStopTTS={handleStopTTS}
          onNextVerseTTS={handleNextVerseTTS}
          onPrevVerseTTS={handlePrevVerseTTS}
          onChangeRateTTS={handleChangeRateTTS}
          onChangeVoiceProfile={handleChangeVoiceProfile}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          onToggleChapterRead={handleToggleChapterRead}
          onUpdateFontSize={(delta) => handleUpdateSettings({ fontSize: Math.max(14, Math.min(32, settings.fontSize + delta)) })}
          onOpenStudyCenter={() => setIsStudyCenterOpen(true)}
          onToggleLanguage={() => handleUpdateSettings({ language: settings.language === 'es' ? 'en' : 'es' })}
          isImmersive={isImmersive}
        />
      )}

      {/* ---------------- PANTALLA 3: CONFIGURACIÓN ---------------- */}
      {activeTab === 'settings' && (
        <div className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 pb-32 space-y-6 animate-tab-switch">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-[var(--accent)]">
                {settings.language === 'es' ? 'Configuración y Gestión' : 'Settings & Management'}
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                {settings.language === 'es' ? 'Personaliza tu espacio sagrado de lectura' : 'Customize your sacred reading space'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center font-cinzel font-bold text-sm shadow-sm">
              AB
            </div>
          </div>

          {/* User Profile & Name (Matches CSS selector 2: div#root > div > div > div:nth-of-type(2)) */}
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] block">
                {settings.language === 'es' ? 'Tu Nombre (Opcional)' : 'Your Name (Optional)'}
              </label>
              <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                {settings.userName && settings.userName.trim() ? 'Personalizado' : 'Modo Genérico'}
              </span>
            </div>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => handleUpdateSettings({ userName: e.target.value })}
              placeholder={settings.language === 'es' ? 'Escribe tu nombre (ej. Daniel)...' : 'Enter your name (e.g. Daniel)...'}
              className="w-full p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white/70 text-sm font-semibold outline-none focus:border-[var(--accent)] text-[var(--text-primary)] transition-all shadow-xs"
            />
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {settings.language === 'es'
                ? 'Si no pones tu nombre, nos dirigiremos a ti con mensajes serenos como «Dios te está esperando» sin mención de nombre.'
                : 'If left blank, messages like "God is waiting for you" will be used gently without names.'}
            </p>
          </div>

          {/* Daily Reminder Notification (Matches CSS selector 1: div#root > div > div > div:nth-of-type(3)) */}
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-xs">
            {/* Child 1 of Child 3 contains input:nth-of-type(1) (Matches CSS selector 3) */}
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-700 shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] block">
                    {settings.language === 'es' ? 'Hora del Recordatorio' : 'Reminder Time'}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {settings.remindersEnabled
                      ? (settings.language === 'es' ? 'Momento de tu cita diaria con Dios' : 'Your daily moment with God')
                      : (settings.language === 'es' ? 'Recordatorio actualmente desactivado' : 'Reminder currently disabled')}
                  </span>
                </div>
              </div>

              <input
                type="time"
                disabled={!settings.remindersEnabled}
                value={settings.morningReminderTime}
                onChange={(e) => handleUpdateSettings({ morningReminderTime: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-white text-base font-mono font-bold text-[var(--text-primary)] outline-none focus:border-[var(--accent)] shadow-xs disabled:opacity-40 transition-all text-center sm:text-left"
              />
            </div>

            {/* Toggle Switch to Enable or Disable Daily Reminder */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] block">
                  {settings.language === 'es' ? 'Estado del recordatorio diario' : 'Daily reminder status'}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  {settings.remindersEnabled
                    ? (settings.language === 'es' ? 'Una sola notificación al día sin presionar' : 'One peaceful notification per day')
                    : (settings.language === 'es' ? 'Desactivado (sin notificaciones)' : 'Disabled (no alerts)')}
                </span>
              </div>

              <button
                onClick={() => {
                  const nextState = !settings.remindersEnabled;
                  handleUpdateSettings({ remindersEnabled: nextState });
                  showToast(nextState ? 'Recordatorio diario activado' : 'Recordatorio diario desactivado');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  settings.remindersEnabled
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-black/10 text-[var(--text-secondary)] hover:bg-black/15'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${settings.remindersEnabled ? 'bg-white' : 'bg-black/40'}`} />
                <span>{settings.remindersEnabled ? 'Activado' : 'Desactivado'}</span>
              </button>
            </div>

            {/* Preview Box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/30 text-xs space-y-2">
              <span className="font-bold text-[var(--accent)] block">Vista previa del recordatorio:</span>
              <p className="italic text-[var(--text-primary)]">
                {settings.remindersEnabled ? (
                  settings.userName && settings.userName.trim() ? (
                    `«${settings.userName.trim()}, tu encuentro con Dios te espera. Dedica un momento de paz hoy.»`
                  ) : (
                    '«Dios te está esperando: Tu encuentro con Dios te espera. Dedica un momento de paz hoy.»'
                  )
                ) : (
                  '«Recordatorios desactivados. Tu espacio bíblico estará siempre listo para cuando desees entrar en paz.»'
                )}
              </p>
              {settings.remindersEnabled && (
                <button
                  onClick={async () => {
                    const hasName = settings.userName && settings.userName.trim();
                    const title = hasName ? `¡Paz a ti, ${settings.userName.trim()}!` : 'Dios te está esperando';
                    const body = hasName 
                      ? `${settings.userName.trim()}, tu encuentro con Dios te espera. Dedica un momento de paz hoy.`
                      : 'Tu encuentro con Dios te espera. Dedica un momento de paz hoy.';
                    if ('Notification' in window) {
                      if (Notification.permission === 'granted') {
                        new Notification(title, { body, icon: '/icon.svg' });
                        showToast('Recordatorio de prueba enviado');
                      } else if (Notification.permission !== 'denied') {
                        const res = await Notification.requestPermission();
                        if (res === 'granted') {
                          new Notification(title, { body, icon: '/icon.svg' });
                          showToast('Recordatorio de prueba enviado');
                        }
                      } else {
                        showToast('Habilita las notificaciones en tu navegador');
                      }
                    } else {
                      showToast('Notificaciones no soportadas en este navegador');
                    }
                  }}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-[11px] font-semibold hover:opacity-90 transition-all cursor-pointer"
                >
                  Probar notificación
                </button>
              )}
            </div>
          </div>

          {/* Quick Hub: Widgets & Study Center */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setIsWidgetManagerOpen(true)}
              className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">
                    {settings.language === 'es' ? 'Gestión de Widgets' : 'Widget Manager'}
                  </h4>
                  <span className="text-[10px] text-[var(--text-secondary)]">Versículo diario y fijo</span>
                </div>
              </div>
              <Check className="w-4 h-4 text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setIsStudyCenterOpen(true)}
              className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-700">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">
                    {settings.language === 'es' ? 'Centro de Estudio' : 'Study Center'}
                  </h4>
                  <span className="text-[10px] text-[var(--text-secondary)]">Notas, marcadores y resaltados</span>
                </div>
              </div>
              <Check className="w-4 h-4 text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Full Reading Settings Modal Trigger */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[var(--accent)] text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>{settings.language === 'es' ? 'Personalizar Voces, Fuentes y Paletas' : 'Customize Voices, Fonts & Themes'}</span>
          </button>
        </div>
      )}

      {/* ---------------- MOBILE BOTTOM NAVIGATION BAR ---------------- */}
      {!isImmersive && (
        <nav 
          aria-label="Navegación principal"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)]/98 backdrop-blur-md border-t border-[var(--border-subtle)] shadow-2xl pb-[max(env(safe-area-inset-bottom),0.5rem)]"
        >
          <div className="max-w-xl mx-auto grid grid-cols-3 h-16 px-2 sm:px-6">
            {/* Tab 1: Inicio */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center gap-1 transition-all h-full cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-[var(--accent)] font-bold' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-amber-500/15' : ''}`}>
                <Sparkles className={`w-5 h-5 ${activeTab === 'home' ? 'text-amber-600 fill-amber-500/30' : ''}`} />
              </div>
              <span className="text-[11px] font-semibold tracking-tight">
                {settings.language === 'es' ? 'Inicio' : 'Home'}
              </span>
            </button>

            {/* Tab 2: Biblia */}
            <button
              onClick={() => setActiveTab('bible')}
              className={`flex flex-col items-center justify-center gap-1 transition-all h-full cursor-pointer ${
                activeTab === 'bible' 
                  ? 'text-[var(--accent)] font-bold' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'bible' ? 'bg-[var(--accent)]/15' : ''}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold tracking-tight">
                {settings.language === 'es' ? 'Biblia' : 'Bible'}
              </span>
            </button>

            {/* Tab 3: Configuración */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center gap-1 transition-all h-full cursor-pointer ${
                activeTab === 'settings' 
                  ? 'text-[var(--accent)] font-bold' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-[var(--accent)]/15' : ''}`}>
                <SettingsIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold tracking-tight">
                {settings.language === 'es' ? 'Configuración' : 'Settings'}
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* MODALS */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      <BookSelectorModal
        isOpen={isBookSelectorOpen}
        onClose={() => setIsBookSelectorOpen(false)}
        language={settings.language}
        currentBookId={currentBookId}
        currentChapter={currentChapter}
        onSelectChapter={handleSelectChapter}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={settings.language}
        onSelectVerse={handleSelectVerseFromSearchOrStudy}
      />

      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        language={settings.language}
        onOpenWidgetSimulator={() => setIsWidgetSimulatorOpen(true)}
      />

      <StudyCenterModal
        isOpen={isStudyCenterOpen}
        onClose={() => setIsStudyCenterOpen(false)}
        language={settings.language}
        onJumpToVerse={handleSelectVerseFromSearchOrStudy}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <WidgetManagerModal
        isOpen={isWidgetManagerOpen}
        onClose={() => setIsWidgetManagerOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onSelectVerseToPin={(fixed) => {
          showToast(`«${fixed.reference}» fijado en tu Widget`);
        }}
      />

      {cardVerseInfo && (
        <VerseCardGeneratorModal
          isOpen={!!cardVerseInfo}
          onClose={() => setCardVerseInfo(null)}
          verseReference={cardVerseInfo.ref}
          verseText={cardVerseInfo.text}
          language={settings.language}
        />
      )}

      <WidgetSimulatorModal
        isOpen={isWidgetSimulatorOpen}
        onClose={() => setIsWidgetSimulatorOpen(false)}
        language={settings.language}
      />
    </div>
  );
}
