/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Pin, 
  Flame, 
  Bookmark, 
  BookOpen, 
  Check, 
  Copy, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { getChapterVerses } from '../data/bibleVerses';
import { storageService } from '../services/storageService';
import { ReaderSettings, WidgetFixedVerse } from '../types/bible';
import { getTodayVerse } from '../data/devotionals';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onSelectVerseToPin?: (fixed: WidgetFixedVerse) => void;
  initialWidgetTab?: 'fixed' | 'daily';
}

export const WidgetManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSelectVerseToPin,
  initialWidgetTab = 'fixed'
}) => {
  const [activeWidgetTab, setActiveWidgetTab] = useState<'fixed' | 'daily'>(initialWidgetTab);
  const [isPickingVerse, setIsPickingVerse] = useState(false);
  const [pickerSource, setPickerSource] = useState<'bookmarks' | 'bible'>('bookmarks');
  const [selectedBookId, setSelectedBookId] = useState('PSA');
  const [selectedChapter, setSelectedChapter] = useState(23);
  const [copiedCode, setCopiedCode] = useState(false);
  const [justPinnedSuccess, setJustPinnedSuccess] = useState(false);

  if (!isOpen) return null;

  const streak = storageService.getStreak();
  const bookmarks = storageService.getBookmarks();
  const todayVerse = getTodayVerse();
  const currentFixedVerse = settings.widgetFixedVerse;

  const currentBook = BIBLE_BOOKS.find(b => b.id === selectedBookId) || BIBLE_BOOKS[0];
  const versesInChapter = getChapterVerses(selectedBookId, selectedChapter);

  const handleSetFixedVerse = (verse: WidgetFixedVerse) => {
    onUpdateSettings({
      widgetFixedVerse: verse,
      hasAddedFixedWidget: true
    });
    setJustPinnedSuccess(true);
    setIsPickingVerse(false);
    setActiveWidgetTab('fixed');
    if (onSelectVerseToPin) {
      onSelectVerseToPin(verse);
    }
    setTimeout(() => setJustPinnedSuccess(false), 3500);
  };

  const glanceCode = `
// Jetpack Glance Widget: Aleluya Biblia - Versículo Fijo
class AleluyaFixedVerseWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val ref = "${currentFixedVerse?.reference || 'Salmos 23:1'}"
        val text = "${currentFixedVerse?.text || 'Jehová es mi pastor; nada me faltará.'}"
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
                            Text(text = "AB", style = TextStyle(fontWeight = FontWeight.Bold))
                            Spacer(modifier = GlanceModifier.width(8.dp))
                            Text(text = "VERSÍCULO FIJO", style = TextStyle(fontSize = 11.sp, color = ColorProvider(Color(0xFF7A6B5D))))
                        }
                        Spacer(modifier = GlanceModifier.height(8.dp))
                        Text(text = "«$text»", style = TextStyle(fontSize = 14.sp))
                        Spacer(modifier = GlanceModifier.height(4.dp))
                        Text(text = ref, style = TextStyle(fontWeight = FontWeight.Bold, color = ColorProvider(Color(0xFF5C4033))))
                    }
                }
            }
        }
    }
}
`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl max-h-[92vh] rounded-3xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent)] text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-cinzel text-[var(--accent)]">
                {settings.language === 'es' ? 'Gestión de Widgets Móviles' : 'Mobile Widgets'}
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {settings.language === 'es' ? 'Pantalla de inicio en Android & iOS' : 'Home screen on Android & iOS'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Widget Selector (Muestra 1 solo widget a la vez) */}
        {!isPickingVerse && (
          <div className="px-4 pt-3 pb-1 border-b border-[var(--border-subtle)]">
            <div className="flex p-1 rounded-2xl bg-black/5 text-xs font-semibold">
              <button
                onClick={() => setActiveWidgetTab('fixed')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeWidgetTab === 'fixed'
                    ? 'bg-white text-[var(--accent)] shadow-sm font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{settings.language === 'es' ? 'Versículo Fijo (Tu Elección)' : 'Fixed Verse (Pinned)'}</span>
              </button>

              <button
                onClick={() => setActiveWidgetTab('daily')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeWidgetTab === 'daily'
                    ? 'bg-white text-[var(--accent)] shadow-sm font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{settings.language === 'es' ? 'Versículo Diario Dinámico' : 'Daily Dynamic Verse'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* VISTA 1: VERSÍCULO FIJO (SOLO UNA VISTA PREVIA) */}
          {!isPickingVerse && activeWidgetTab === 'fixed' && (
            <div className="space-y-4 animate-fade-in">
              {/* Success Banner if recently pinned */}
              {justPinnedSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400 text-emerald-950 flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {settings.language === 'es'
                      ? '¡Versículo fijado en tu widget! Este texto aparecerá permanentemente en tu pantalla.'
                      : 'Verse pinned to widget! This will permanently appear on your home screen.'}
                  </span>
                </div>
              )}

              {/* Title & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5" />
                    <span>{settings.language === 'es' ? 'Vista Previa del Widget Fijo' : 'Fixed Widget Preview'}</span>
                  </h3>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {settings.language === 'es' ? 'Este es el único versículo que has fijado para tu pantalla' : 'This is the specific verse you pinned'}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{settings.language === 'es' ? 'Fijado por ti' : 'Pinned'}</span>
                </span>
              </div>

              {/* ÚNICA VISTA PREVIA: WIDGET FIJO PERSONALIZADO */}
              <div className="p-5 rounded-3xl bg-[#FAF8F5] text-[#3D322C] border border-[#E2DDD5] shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-cinzel font-bold text-[#5C4033]">
                    <span className="w-5 h-5 rounded-md bg-[#5C4033] text-white flex items-center justify-center text-[10px]">AB</span>
                    <span className="tracking-wide">VERSÍCULO FIJO</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#7A6B5D] uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded-full">
                    Widget 4x2
                  </span>
                </div>

                <p className="text-sm sm:text-base italic font-serif-biblical text-[#2E241E] leading-relaxed">
                  «{currentFixedVerse ? currentFixedVerse.text : 'Jehová es mi pastor; nada me faltará.'}»
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs sm:text-sm font-bold font-cinzel text-[#7C4A3A]">
                    {currentFixedVerse ? currentFixedVerse.reference : 'Salmos 23:1'}
                  </span>
                  <span className="text-[10px] text-[#7A6B5D]">
                    {settings.language === 'es' ? 'Fijo permanente' : 'Permanent'}
                  </span>
                </div>
              </div>

              {/* Botón para cambiar o buscar otro versículo */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPickingVerse(true)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[var(--accent)] text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>{settings.language === 'es' ? 'Cambiar o Elegir Otro Versículo' : 'Change Pinned Verse'}</span>
                </button>
              </div>

              {/* Guía simple para pasarlo a la pantalla de inicio del móvil */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                  <Info className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{settings.language === 'es' ? 'Cómo añadir este widget a la pantalla de tu móvil' : 'How to add to mobile screen'}</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1 text-[var(--text-secondary)] text-[11px] leading-relaxed">
                  <li>
                    {settings.language === 'es'
                      ? 'Mantén presionada cualquier área vacía en la pantalla de inicio de tu teléfono.'
                      : 'Long-press any empty space on your mobile home screen.'}
                  </li>
                  <li>
                    {settings.language === 'es'
                      ? 'Toca en «Widgets» y busca «Aleluya Biblia».'
                      : 'Tap «Widgets» and locate «Aleluya Biblia».'}
                  </li>
                  <li>
                    {settings.language === 'es'
                      ? 'Selecciona «Versículo Fijo» y arrástralo donde prefieras.'
                      : 'Select «Versículo Fijo» and drag it to your screen.'}
                  </li>
                </ol>
              </div>

              {/* Kotlin Glance Code para desarrolladores */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.01] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[var(--text-primary)]">Código Kotlin Jetpack Glance</h5>
                  <p className="text-[10px] text-[var(--text-secondary)]">Para integrar en Android Studio</p>
                </div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(glanceCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold hover:bg-black/5 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* VISTA 2: VERSÍCULO DIARIO Y RACHA (DINÁMICO) */}
          {!isPickingVerse && activeWidgetTab === 'daily' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{settings.language === 'es' ? 'Widget Diario y Racha' : 'Daily Verse & Streak Widget'}</span>
                  </h3>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {settings.language === 'es' ? 'Cambia automáticamente cada mañana con tu nueva racha' : 'Updates automatically every morning'}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800">
                  {settings.language === 'es' ? 'Dinámico Automático' : 'Dynamic'}
                </span>
              </div>

              {/* ÚNICA VISTA PREVIA: WIDGET DIARIO DINÁMICO */}
              <div className="p-5 rounded-3xl bg-[#FAF8F5] text-[#3D322C] border border-[#E2DDD5] shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-cinzel font-bold text-[#5C4033]">
                    <span className="w-5 h-5 rounded-md bg-[#5C4033] text-white flex items-center justify-center text-[10px]">AB</span>
                    <span className="tracking-wide">ALELUYA BIBLIA</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                    <span>{streak.currentStreak} {settings.language === 'es' ? 'días' : 'days'}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base italic font-serif-biblical text-[#2E241E] leading-relaxed">
                  «{settings.language === 'es' ? todayVerse.textEs : todayVerse.textEn}»
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs sm:text-sm font-bold font-cinzel text-[#7C4A3A]">
                    {todayVerse.reference}
                  </span>
                  <span className="text-[10px] text-[#7A6B5D]">
                    {todayVerse.theme}
                  </span>
                </div>
              </div>

              {/* Explicación y Guía para pasarlo a la pantalla de inicio */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-[var(--border-subtle)] space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                  <Smartphone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{settings.language === 'es' ? 'Disponible para la pantalla de inicio de tu móvil' : 'Available for your home screen'}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {settings.language === 'es'
                    ? 'Este widget no requiere que elijas un versículo específico: se renueva solo todos los días al amanecer junto con tu racha de lectura cumplida.'
                    : 'This widget automatically updates every morning with your spiritual streak and today’s scripture.'}
                </p>
                <div className="pt-1">
                  <span className="font-semibold text-[11px] text-[var(--accent)] block mb-1">
                    {settings.language === 'es' ? 'Cómo colocarlo:' : 'How to place it:'}
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {settings.language === 'es'
                      ? 'Mantén presionada la pantalla de inicio de tu teléfono > Widgets > Aleluya Biblia > Versículo Diario y Racha.'
                      : 'Long-press home screen > Widgets > Aleluya Biblia > Versículo Diario.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3: SELECTOR DE VERSÍCULO PARA FIJAR */}
          {isPickingVerse && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPickingVerse(false)}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← {settings.language === 'es' ? 'Volver a vista previa' : 'Back to preview'}
                </button>
                <span className="text-xs font-bold text-[var(--accent)] font-cinzel">
                  {settings.language === 'es' ? 'Elegir Versículo a Fijar' : 'Choose Verse to Pin'}
                </span>
              </div>

              {/* Source Switcher */}
              <div className="flex p-1 rounded-xl bg-black/5 text-xs font-medium">
                <button
                  onClick={() => setPickerSource('bookmarks')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    pickerSource === 'bookmarks' ? 'bg-white shadow-xs text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{settings.language === 'es' ? `Mis Marcadores (${bookmarks.length})` : `Bookmarks (${bookmarks.length})`}</span>
                </button>
                <button
                  onClick={() => setPickerSource('bible')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    pickerSource === 'bible' ? 'bg-white shadow-xs text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{settings.language === 'es' ? 'Toda la Biblia' : 'Entire Bible'}</span>
                </button>
              </div>

              {/* Source A: Bookmarks */}
              {pickerSource === 'bookmarks' && (
                <div className="space-y-2">
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[var(--text-secondary)]">
                      <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30 text-[var(--accent)]" />
                      <p>{settings.language === 'es' ? 'No tienes versículos marcados aún.' : 'No bookmarked verses yet.'}</p>
                      <button
                        onClick={() => setPickerSource('bible')}
                        className="mt-2 text-xs font-bold text-[var(--accent)] underline cursor-pointer"
                      >
                        {settings.language === 'es' ? 'Explorar libros de la Biblia' : 'Browse Bible Books'}
                      </button>
                    </div>
                  ) : (
                    bookmarks.map(bm => {
                      const book = BIBLE_BOOKS.find(b => b.id === bm.bookId);
                      const bName = book ? (settings.language === 'es' ? book.nameEs : book.nameEn) : bm.bookId;
                      const vList = getChapterVerses(bm.bookId, bm.chapter);
                      const verseItem = vList.find(v => v.verse === bm.verse);
                      const vText = verseItem ? (settings.language === 'es' ? verseItem.textEs : verseItem.textEn) : '';

                      return (
                        <button
                          key={bm.id}
                          onClick={() => {
                            handleSetFixedVerse({
                              bookId: bm.bookId,
                              chapter: bm.chapter,
                              verse: bm.verse,
                              reference: `${bName} ${bm.chapter}:${bm.verse}`,
                              text: vText,
                              updatedAt: new Date().toISOString()
                            });
                          }}
                          className="w-full text-left p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] hover:bg-black/[0.05] transition-all flex items-start justify-between gap-3 group cursor-pointer"
                        >
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-[var(--accent)] block">
                              {bName} {bm.chapter}:{bm.verse}
                            </span>
                            <p className="text-xs text-[var(--text-primary)] mt-1 line-clamp-2 italic">
                              «{vText}»
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {/* Source B: Whole Bible Browser */}
              {pickerSource === 'bible' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-semibold block mb-1 text-[var(--text-secondary)]">
                        {settings.language === 'es' ? 'Libro:' : 'Book:'}
                      </label>
                      <select
                        value={selectedBookId}
                        onChange={(e) => {
                          setSelectedBookId(e.target.value);
                          setSelectedChapter(1);
                        }}
                        className="w-full p-2 rounded-lg border border-[var(--border-subtle)] bg-white/80 text-[var(--text-primary)] font-medium outline-none"
                      >
                        {BIBLE_BOOKS.map(b => (
                          <option key={b.id} value={b.id}>
                            {settings.language === 'es' ? b.nameEs : b.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-[var(--text-secondary)]">
                        {settings.language === 'es' ? 'Capítulo:' : 'Chapter:'}
                      </label>
                      <select
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
                        className="w-full p-2 rounded-lg border border-[var(--border-subtle)] bg-white/80 text-[var(--text-primary)] font-medium outline-none"
                      >
                        {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map(ch => (
                          <option key={ch} value={ch}>
                            Capítulo {ch}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] block">
                      {settings.language === 'es' ? 'Toca un versículo para fijarlo en tu widget:' : 'Tap a verse to pin it:'}
                    </span>
                    {versesInChapter.map(v => {
                      const text = settings.language === 'es' ? v.textEs : v.textEn;
                      return (
                        <button
                          key={v.verse}
                          onClick={() => {
                            handleSetFixedVerse({
                              bookId: currentBook.id,
                              chapter: selectedChapter,
                              verse: v.verse,
                              reference: `${settings.language === 'es' ? currentBook.nameEs : currentBook.nameEn} ${selectedChapter}:${v.verse}`,
                              text: text,
                              updatedAt: new Date().toISOString()
                            });
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-transparent hover:border-[var(--border-subtle)] hover:bg-black/5 transition-all text-xs cursor-pointer"
                        >
                          <span className="font-bold text-[var(--accent)] mr-1.5">v.{v.verse}</span>
                          <span className="text-[var(--text-primary)]">{text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
