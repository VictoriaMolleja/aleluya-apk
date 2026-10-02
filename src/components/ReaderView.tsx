/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Highlighter, 
  Bookmark, 
  Edit3, 
  Play, 
  Pause,
  Copy, 
  Share2, 
  Check, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Pin
} from 'lucide-react';
import { BibleBook, HighlightColor, ReaderSettings, Verse } from '../types/bible';
import { storageService } from '../services/storageService';

interface Props {
  book: BibleBook;
  chapter: number;
  verses: Verse[];
  settings: ReaderSettings;
  activeTTSVerseIndex: number;
  isReadingAudio: boolean;
  isAudioPaused: boolean;
  onToggleVerseAudio: (index: number) => void;
  onJumpToVerseAudio: (index: number) => void;
  onOpenCardGenerator: (ref: string, text: string) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onToggleChapterRead: () => void;
  isChapterRead: boolean;
  onPinVerseToWidget?: (ref: string, text: string, bookId: string, chapter: number, verse: number) => void;
}

export const ReaderView: React.FC<Props> = ({
  book,
  chapter,
  verses,
  settings,
  activeTTSVerseIndex,
  isReadingAudio,
  isAudioPaused,
  onToggleVerseAudio,
  onJumpToVerseAudio,
  onOpenCardGenerator,
  onPrevChapter,
  onNextChapter,
  onToggleChapterRead,
  isChapterRead,
  onPinVerseToWidget
}) => {
  const [selectedVerseIndex, setSelectedVerseIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [quickNoteText, setQuickNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showShareMenuForVerse, setShowShareMenuForVerse] = useState<number | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const activeVerseRef = useRef<HTMLDivElement | null>(null);

  const highlights = storageService.getHighlights();
  const bookmarks = storageService.getBookmarks();
  const notes = storageService.getNotes();

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  // Scroll active TTS verse into view smoothly
  useEffect(() => {
    if (isReadingAudio && activeTTSVerseIndex >= 0 && activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeTTSVerseIndex, isReadingAudio]);

  const bookName = settings.language === 'es' ? book.nameEs : book.nameEn;

  const getVerseHighlight = (vNum: number) => {
    return highlights.find(h => h.bookId === book.id && h.chapter === chapter && h.verse === vNum);
  };

  const isVerseBookmarked = (vNum: number) => {
    return bookmarks.some(b => b.bookId === book.id && b.chapter === chapter && b.verse === vNum);
  };

  const getVerseNotes = (vNum: number) => {
    return notes.filter(n => n.bookId === book.id && n.chapter === chapter && n.verse === vNum);
  };

  const handleApplyHighlight = (color: HighlightColor) => {
    if (selectedVerseIndex === null) return;
    const verse = verses[selectedVerseIndex];
    storageService.saveHighlight({
      bookId: book.id,
      chapter: chapter,
      verse: verse.verse,
      color: color
    });
    const colorNames = {
      yellow: 'Amarillo',
      green: 'Verde',
      blue: 'Azul',
      pink: 'Rosa'
    };
    showToast(`Versículo resaltado en ${colorNames[color]}`);
  };

  const handleRemoveHighlight = () => {
    if (selectedVerseIndex === null) return;
    const verse = verses[selectedVerseIndex];
    storageService.removeHighlight(book.id, chapter, verse.verse);
    showToast('Resaltado eliminado');
  };

  const handleToggleBookmark = () => {
    if (selectedVerseIndex === null) return;
    const verse = verses[selectedVerseIndex];
    const added = storageService.toggleBookmark({
      bookId: book.id,
      chapter: chapter,
      verse: verse.verse,
      tag: settings.language === 'es' ? 'Favorito' : 'Favorite'
    });
    showToast(added ? 'Guardado en marcadores' : 'Marcador eliminado');
  };

  const handleSaveQuickNote = () => {
    if (selectedVerseIndex === null || !quickNoteText.trim()) return;
    const verse = verses[selectedVerseIndex];
    storageService.saveNote({
      bookId: book.id,
      chapter: chapter,
      verse: verse.verse,
      title: `${bookName} ${chapter}:${verse.verse}`,
      content: quickNoteText.trim()
    });
    setQuickNoteText('');
    setShowNoteInput(false);
    showToast('Nota personal guardada');
  };

  const handleShareToPlatform = (vIndex: number, platform: 'whatsapp' | 'telegram' | 'native') => {
    const v = verses[vIndex];
    const text = settings.language === 'es' ? v.textEs : v.textEn;
    const message = `${bookName} ${chapter}:${v.verse}\n«${text}»\n— Aleluya Biblia`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(message)}`, '_blank');
    } else if (navigator.share) {
      navigator.share({
        title: `${bookName} ${chapter}:${v.verse}`,
        text: message
      }).catch(() => {});
    } else {
      handleCopyVerse(vIndex);
    }
    setShowShareMenuForVerse(null);
  };

  const handleCopyVerse = async (index: number) => {
    const v = verses[index];
    const text = settings.language === 'es' ? v.textEs : v.textEn;
    const copyContent = `${bookName} ${chapter}:${v.verse}\n«${text}»\n— Aleluya Biblia`;
    await navigator.clipboard.writeText(copyContent);
    setCopiedIndex(index);
    showToast('Texto copiado al portapapeles');
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  // Font family css class
  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'font-serif-biblical';
      case 'cinzel': return 'font-cinzel';
      case 'sans': return 'font-sans-clean';
      case 'dyslexic': return 'font-dyslexic';
    }
  };

  // Line spacing
  const getLineHeightClass = () => {
    switch (settings.lineSpacing) {
      case 'compact': return 'leading-normal';
      case 'normal': return 'leading-relaxed';
      case 'relaxed': return 'leading-loose';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-32">
      {/* Chapter Title / Heading */}
      <div className="text-center mb-8 sm:mb-12 border-b border-[var(--border-subtle)] pb-6">
        <span className="text-xs uppercase font-cinzel font-bold tracking-widest text-[var(--accent)] block mb-1">
          {book.testament === 'OT' ? (settings.language === 'es' ? 'Antiguo Testamento' : 'Old Testament') : (settings.language === 'es' ? 'Nuevo Testamento' : 'New Testament')}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-cinzel text-[var(--text-primary)] tracking-wide">
          {bookName} {chapter}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5 font-serif">
          {settings.language === 'es' ? 'Biblia Reina-Valera (1909)' : 'Holy Bible (King James Version)'}
        </p>
      </div>

      {/* Verses Reading Flow */}
      <div 
        className={`space-y-4 ${getFontFamilyClass()} ${getLineHeightClass()}`}
        style={{ 
          fontSize: `${settings.fontSize}px`,
          textAlign: settings.textAlign
        }}
      >
        {verses.map((verseItem, idx) => {
          const isSelected = selectedVerseIndex === idx;
          const isTTSActive = isReadingAudio && activeTTSVerseIndex === idx;
          const highlight = getVerseHighlight(verseItem.verse);
          const isBookmarked = isVerseBookmarked(verseItem.verse);
          const verseNotes = getVerseNotes(verseItem.verse);
          const text = settings.language === 'es' ? verseItem.textEs : verseItem.textEn;

          // Highlight background
          let highlightBg = 'transparent';
          if (highlight) {
            switch (highlight.color) {
              case 'yellow': highlightBg = 'rgba(253, 230, 138, 0.45)'; break;
              case 'green': highlightBg = 'rgba(167, 243, 208, 0.45)'; break;
              case 'blue': highlightBg = 'rgba(186, 230, 253, 0.45)'; break;
              case 'pink': highlightBg = 'rgba(254, 205, 211, 0.45)'; break;
            }
          }

          return (
            <div
              key={verseItem.verse}
              ref={isTTSActive ? activeVerseRef : null}
              onClick={() => setSelectedVerseIndex(isSelected ? null : idx)}
              className={`relative rounded-xl p-2.5 sm:p-3 transition-all cursor-pointer ${
                isTTSActive 
                  ? 'bg-amber-500/20 ring-2 ring-amber-500/50 shadow-sm'
                  : isSelected
                  ? 'ring-1 ring-[var(--accent)]/40 bg-black/[0.03]'
                  : 'hover:bg-black/[0.02]'
              }`}
              style={{
                backgroundColor: isTTSActive ? undefined : (highlight ? highlightBg : undefined)
              }}
            >
              {/* Verse text & number */}
              <div className="flex items-baseline gap-2">
                {settings.showVerseNumbers && (
                  <span className="text-[0.75em] font-sans font-bold text-[var(--accent)] select-none opacity-80 shrink-0">
                    {verseItem.verse}
                  </span>
                )}
                <span className="text-[var(--text-primary)] select-text flex-1">
                  {text}
                </span>

                {/* Bookmark indicator */}
                {isBookmarked && (
                  <Bookmark className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)] shrink-0 self-center opacity-85 ml-1" />
                )}

                {/* Active audio play/pause status button on verse */}
                {isTTSActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVerseAudio(idx);
                    }}
                    title={isAudioPaused ? (settings.language === 'es' ? 'Reanudar lectura' : 'Resume reading') : (settings.language === 'es' ? 'Pausar lectura' : 'Pause reading')}
                    className="p-1 rounded-lg bg-amber-500/25 text-amber-900 hover:bg-amber-500/35 transition-all ml-1.5 shrink-0 self-center cursor-pointer shadow-xs"
                  >
                    {isAudioPaused ? (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    ) : (
                      <Pause className="w-3.5 h-3.5 fill-current animate-pulse" />
                    )}
                  </button>
                )}
              </div>

              {/* Personal Notes Badges below verse */}
              {verseNotes.length > 0 && (
                <div className="mt-2 pl-4 border-l-2 border-[var(--accent)] text-xs text-[var(--text-secondary)] font-sans italic space-y-1">
                  {verseNotes.map(n => (
                    <div key={n.id} className="flex items-center gap-1.5">
                      <Edit3 className="w-3 h-3 text-[var(--accent)]" />
                      <span>{n.content}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Sheet when Verse is Tapped */}
              {isSelected && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs font-sans animate-fade-in"
                >
                  {/* Color Highlighters */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleApplyHighlight('yellow')}
                      title="Resaltar Amarillo"
                      className="w-6 h-6 rounded-full bg-[#FDE68A] border border-amber-300 hover:scale-115 transition-transform"
                    />
                    <button
                      onClick={() => handleApplyHighlight('green')}
                      title="Resaltar Verde"
                      className="w-6 h-6 rounded-full bg-[#A7F3D0] border border-emerald-300 hover:scale-115 transition-transform"
                    />
                    <button
                      onClick={() => handleApplyHighlight('blue')}
                      title="Resaltar Azul"
                      className="w-6 h-6 rounded-full bg-[#BAE6FD] border border-sky-300 hover:scale-115 transition-transform"
                    />
                    <button
                      onClick={() => handleApplyHighlight('pink')}
                      title="Resaltar Rosa"
                      className="w-6 h-6 rounded-full bg-[#FECDD3] border border-rose-300 hover:scale-115 transition-transform"
                    />
                    {highlight && (
                      <button
                        onClick={handleRemoveHighlight}
                        title="Quitar resaltado"
                        className="px-1.5 py-0.5 rounded text-[10px] text-red-500 hover:bg-red-50"
                      >
                        {settings.language === 'es' ? 'Quitar' : 'Remove'}
                      </button>
                    )}
                  </div>

                  {/* Action icons */}
                  <div className="flex items-center gap-1 relative">
                    {/* Bookmark */}
                    <button
                      onClick={handleToggleBookmark}
                      title={isBookmarked ? 'Quitar marcador' : 'Guardar marcador'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked ? 'bg-[var(--accent)] text-white' : 'hover:bg-black/5 text-[var(--text-secondary)]'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    {/* Note toggle */}
                    <button
                      onClick={() => setShowNoteInput(!showNoteInput)}
                      title="Añadir nota"
                      className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--text-secondary)] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Pin to Widget button */}
                    <button
                      onClick={() => {
                        if (onPinVerseToWidget) {
                          onPinVerseToWidget(
                            `${bookName} ${chapter}:${verseItem.verse}`,
                            text,
                            book.id,
                            chapter,
                            verseItem.verse
                          );
                        }
                      }}
                      title="Poner en el Widget de inicio"
                      className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--accent)] transition-colors"
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    {/* Synchronized Play / Pause TTS for this verse */}
                    {(() => {
                      const isThisVersePlaying = isReadingAudio && !isAudioPaused && activeTTSVerseIndex === idx;
                      return (
                        <button
                          onClick={() => onToggleVerseAudio(idx)}
                          title={
                            isThisVersePlaying
                              ? (settings.language === 'es' ? 'Pausar lectura' : 'Pause audio')
                              : (settings.language === 'es' ? 'Escuchar versículo' : 'Listen aloud')
                          }
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isThisVersePlaying
                              ? 'bg-amber-500/20 text-amber-700 ring-1 ring-amber-500/40'
                              : 'hover:bg-black/5 text-[var(--accent)]'
                          }`}
                        >
                          {isThisVersePlaying ? (
                            <Pause className="w-4 h-4 text-amber-700 animate-pulse fill-current" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      );
                    })()}

                    {/* Copy */}
                    <button
                      onClick={() => handleCopyVerse(idx)}
                      title="Copiar versículo"
                      className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--text-secondary)] transition-colors"
                    >
                      {copiedIndex === idx ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Share Menu Trigger */}
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenuForVerse(showShareMenuForVerse === idx ? null : idx)}
                        title="Compartir versículo en redes o mensajería"
                        className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--accent)] transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {showShareMenuForVerse === idx && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl p-2 z-30 space-y-1 animate-fade-in text-left">
                          <button
                            onClick={() => handleShareToPlatform(idx, 'whatsapp')}
                            className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                          >
                            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleShareToPlatform(idx, 'telegram')}
                            className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                          >
                            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                            <span>Telegram</span>
                          </button>
                          <button
                            onClick={() => handleShareToPlatform(idx, 'native')}
                            className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                          >
                            <Share2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                            <span>Más opciones...</span>
                          </button>
                          <button
                            onClick={() => {
                              onOpenCardGenerator(`${bookName} ${chapter}:${verseItem.verse}`, text);
                              setShowShareMenuForVerse(null);
                            }}
                            className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Crear Tarjeta Imagen</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Close action bar */}
                    <button
                      onClick={() => setSelectedVerseIndex(null)}
                      className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--text-secondary)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Inline Note Composer */}
                  {showNoteInput && (
                    <div className="w-full mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={settings.language === 'es' ? 'Escribe una reflexión breve...' : 'Write a short reflection...'}
                        value={quickNoteText}
                        onChange={(e) => setQuickNoteText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveQuickNote()}
                        className="w-full p-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-white/70 outline-none focus:border-[var(--accent)]"
                      />
                      <button
                        onClick={handleSaveQuickNote}
                        className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold shrink-0"
                      >
                        {settings.language === 'es' ? 'Guardar' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End of Chapter Actions */}
      <div className="mt-14 pt-8 border-t border-[var(--border-subtle)] flex flex-col items-center gap-4 text-center">
        <button
          onClick={onToggleChapterRead}
          className={`px-5 py-2.5 rounded-2xl font-sans font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs ${
            isChapterRead
              ? 'bg-emerald-600 text-white'
              : 'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {isChapterRead
              ? (settings.language === 'es' ? '✓ Capítulo leído' : '✓ Chapter read')
              : (settings.language === 'es' ? 'Marcar capítulo como leído' : 'Mark chapter as read')}
          </span>
        </button>

        <div className="flex items-center gap-4 text-xs font-sans text-[var(--text-secondary)]">
          <button
            onClick={onPrevChapter}
            className="flex items-center gap-1 hover:text-[var(--text-primary)]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{settings.language === 'es' ? 'Anterior' : 'Previous'}</span>
          </button>
          <span>·</span>
          <button
            onClick={onNextChapter}
            className="flex items-center gap-1 hover:text-[var(--text-primary)]"
          >
            <span>{settings.language === 'es' ? 'Siguiente' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action feedback toast */}
      {feedbackToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[var(--accent)] text-white text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2 pointer-events-none">
          <Check className="w-4 h-4 text-[#FDE68A]" />
          <span>{feedbackToast}</span>
        </div>
      )}
    </div>
  );
};
