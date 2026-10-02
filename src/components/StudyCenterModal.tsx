/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Bookmark as BookmarkIcon, Edit3, Highlighter, Trash2, ChevronRight, Plus, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { getChapterVerses } from '../data/bibleVerses';
import { Bookmark, Highlight, Note, HighlightColor } from '../types/bible';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
  onJumpToVerse: (bookId: string, chapter: number, verse: number) => void;
  onOpenCardGenerator?: (ref: string, text: string) => void;
}

export const StudyCenterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  onJumpToVerse,
  onOpenCardGenerator
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes' | 'highlights'>('bookmarks');
  const [selectedColorFilter, setSelectedColorFilter] = useState<HighlightColor | 'all'>('all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [copiedHighlightId, setCopiedHighlightId] = useState<string | null>(null);
  const [sharingHighlightId, setSharingHighlightId] = useState<string | null>(null);

  if (!isOpen) return null;

  const bookmarks = storageService.getBookmarks();
  const notes = storageService.getNotes();
  const highlights = storageService.getHighlights();

  const getBookName = (id: string) => {
    const b = BIBLE_BOOKS.find(item => item.id === id);
    return b ? (language === 'es' ? b.nameEs : b.nameEn) : id;
  };

  const getColorHex = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return '#FDE68A';
      case 'green': return '#A7F3D0';
      case 'blue': return '#BAE6FD';
      case 'pink': return '#FECDD3';
    }
  };

  const handleSaveNote = () => {
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;

    if (editingNote) {
      storageService.saveNote({
        id: editingNote.id,
        bookId: editingNote.bookId,
        chapter: editingNote.chapter,
        verse: editingNote.verse,
        title: newNoteTitle.trim() || (language === 'es' ? 'Nota Bíblica' : 'Bible Note'),
        content: newNoteContent.trim()
      });
    } else {
      storageService.saveNote({
        bookId: 'GEN',
        chapter: 1,
        title: newNoteTitle.trim() || (language === 'es' ? 'Nota de Reflexión' : 'Reflection Note'),
        content: newNoteContent.trim()
      });
    }

    setEditingNote(null);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const filteredHighlights = selectedColorFilter === 'all'
    ? highlights
    : highlights.filter(h => h.color === selectedColorFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl h-[88vh] rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-base sm:text-lg font-bold font-cinzel text-[var(--accent)]">
              {language === 'es' ? 'Centro de Estudio Personal' : 'Personal Study Center'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[var(--border-subtle)] bg-black/[0.02] px-4 pt-2">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookmarkIcon className="w-4 h-4" />
            <span>{language === 'es' ? 'Marcadores' : 'Bookmarks'} ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{language === 'es' ? 'Notas Personales' : 'Notes'} ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('highlights')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'highlights'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Highlighter className="w-4 h-4" />
            <span>{language === 'es' ? 'Resaltados' : 'Highlights'} ({highlights.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: MARCADORES */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="text-center py-16 text-[var(--text-secondary)]">
                  <BookmarkIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-[var(--accent)]" />
                  <p className="text-sm font-medium">
                    {language === 'es' ? 'No tienes marcadores guardados aún.' : 'No saved bookmarks yet.'}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {language === 'es' ? 'Toca cualquier versículo mientras lees para marcarlo como favorito.' : 'Tap any verse while reading to bookmark it.'}
                  </p>
                </div>
              ) : (
                bookmarks.map(bm => (
                  <div
                    key={bm.id}
                    className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] flex items-center justify-between gap-3 hover:bg-black/[0.04] transition-all group"
                  >
                    <button
                      onClick={() => {
                        onJumpToVerse(bm.bookId, bm.chapter, bm.verse);
                        onClose();
                      }}
                      className="text-left flex-1"
                    >
                      <span className="font-bold text-sm text-[var(--accent)] block">
                        {getBookName(bm.bookId)} {bm.chapter}:{bm.verse}
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        {language === 'es' ? 'Guardado el' : 'Saved on'} {bm.date} · {bm.tag}
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          storageService.toggleBookmark({
                            bookId: bm.bookId,
                            chapter: bm.chapter,
                            verse: bm.verse,
                            tag: bm.tag
                          });
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title={language === 'es' ? 'Eliminar marcador' : 'Delete bookmark'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: NOTAS */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Note Editor Form */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {editingNote 
                      ? (language === 'es' ? `Editando Nota (${getBookName(editingNote.bookId)} ${editingNote.chapter})` : `Editing Note (${getBookName(editingNote.bookId)} ${editingNote.chapter})`)
                      : (language === 'es' ? 'Nueva Anotación' : 'New Note')}
                  </h4>
                  {editingNote && (
                    <button
                      onClick={() => {
                        setEditingNote(null);
                        setNewNoteTitle('');
                        setNewNoteContent('');
                      }}
                      className="text-xs text-[var(--text-secondary)] hover:underline"
                    >
                      {language === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder={language === 'es' ? 'Título de la nota o tema...' : 'Note title or topic...'}
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-[var(--border-subtle)] bg-white/70 outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                />

                <textarea
                  rows={3}
                  placeholder={language === 'es' ? 'Escribe aquí tu meditación, revelación o motivo de oración...' : 'Write your reflection, insight, or prayer here...'}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-[var(--border-subtle)] bg-white/70 outline-none focus:border-[var(--accent)] text-[var(--text-primary)] resize-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{editingNote ? (language === 'es' ? 'Actualizar Nota' : 'Update Note') : (language === 'es' ? 'Guardar Nota' : 'Save Note')}</span>
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {notes.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-secondary)]">
                  <p className="text-xs">{language === 'es' ? 'Aún no has escrito notas personales.' : 'No personal notes written yet.'}</p>
                </div>
              ) : (
                notes.map(note => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.01] hover:bg-black/[0.03] transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-[var(--text-primary)]">{note.title}</h4>
                        <span className="text-[11px] text-[var(--accent)] font-semibold">
                          {getBookName(note.bookId)} {note.chapter}{note.verse ? `:${note.verse}` : ''} · {note.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingNote(note);
                            setNewNoteTitle(note.title);
                            setNewNoteContent(note.content);
                          }}
                          className="p-1 rounded text-[var(--text-secondary)] hover:bg-black/5"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => storageService.deleteNote(note.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: RESALTADOS */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              {/* Filter by color */}
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
                <button
                  onClick={() => setSelectedColorFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedColorFilter === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-black/5 text-[var(--text-secondary)]'
                  }`}
                >
                  {language === 'es' ? 'Todos' : 'All'}
                </button>
                {(['yellow', 'green', 'blue', 'pink'] as HighlightColor[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColorFilter(c)}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      selectedColorFilter === c ? 'scale-125 ring-2 ring-black/30' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: getColorHex(c) }}
                    title={c}
                  />
                ))}
              </div>

              {filteredHighlights.length === 0 ? (
                <div className="text-center py-16 text-[var(--text-secondary)]">
                  <Highlighter className="w-10 h-10 mx-auto mb-2 opacity-30 text-[var(--accent)]" />
                  <p className="text-sm font-medium">
                    {language === 'es' ? 'No hay versículos resaltados en esta categoría.' : 'No highlights in this category.'}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {language === 'es' ? 'Selecciona cualquier versículo para resaltarlo con tus colores favoritos.' : 'Select any verse to highlight with your chosen colors.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredHighlights.map(h => {
                    const bName = getBookName(h.bookId);
                    const vList = getChapterVerses(h.bookId, h.chapter);
                    const verseObj = vList.find(v => v.verse === h.verse);
                    const vText = verseObj ? (language === 'es' ? verseObj.textEs : verseObj.textEn) : '';
                    const shareMsg = `${bName} ${h.chapter}:${h.verse}\n«${vText}»\n— Aleluya Biblia`;

                    const handleCopy = async () => {
                      await navigator.clipboard.writeText(shareMsg);
                      setCopiedHighlightId(h.id);
                      setTimeout(() => setCopiedHighlightId(null), 1800);
                    };

                    const handleSocial = (platform: 'whatsapp' | 'telegram' | 'native') => {
                      if (platform === 'whatsapp') {
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`, '_blank');
                      } else if (platform === 'telegram') {
                        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareMsg)}`, '_blank');
                      } else if (navigator.share) {
                        navigator.share({ title: `${bName} ${h.chapter}:${h.verse}`, text: shareMsg }).catch(() => {});
                      } else {
                        handleCopy();
                      }
                      setSharingHighlightId(null);
                    };

                    return (
                      <div
                        key={h.id}
                        className="p-3.5 rounded-2xl border border-[var(--border-subtle)] space-y-2 transition-all relative"
                        style={{ backgroundColor: `${getColorHex(h.color)}24` }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => {
                              onJumpToVerse(h.bookId, h.chapter, h.verse);
                              onClose();
                            }}
                            className="text-left flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: getColorHex(h.color) }} />
                              <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                                {bName} {h.chapter}:{h.verse}
                              </span>
                              <span className="text-[10px] text-[var(--text-secondary)]">· {h.date}</span>
                            </div>
                            <p className="text-xs text-[var(--text-primary)] mt-1.5 italic font-serif-biblical line-clamp-2">
                              «{vText}»
                            </p>
                          </button>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Copy button */}
                            <button
                              onClick={handleCopy}
                              title="Copiar texto"
                              className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--text-secondary)] transition-colors"
                            >
                              {copiedHighlightId === h.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Share menu */}
                            <div className="relative">
                              <button
                                onClick={() => setSharingHighlightId(sharingHighlightId === h.id ? null : h.id)}
                                title="Compartir versículo resaltado"
                                className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--accent)] transition-colors"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              {sharingHighlightId === h.id && (
                                <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl p-2 z-30 space-y-1 animate-fade-in text-left">
                                  <button
                                    onClick={() => handleSocial('whatsapp')}
                                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                                  >
                                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                    <span>WhatsApp</span>
                                  </button>
                                  <button
                                    onClick={() => handleSocial('telegram')}
                                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                                  >
                                    <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                                    <span>Telegram</span>
                                  </button>
                                  <button
                                    onClick={() => handleSocial('native')}
                                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                                  >
                                    <Share2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                                    <span>Más opciones...</span>
                                  </button>
                                  {onOpenCardGenerator && (
                                    <button
                                      onClick={() => {
                                        onOpenCardGenerator(`${bName} ${h.chapter}:${h.verse}`, vText);
                                        setSharingHighlightId(null);
                                      }}
                                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-medium"
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                      <span>Crear Tarjeta Imagen</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => storageService.removeHighlight(h.bookId, h.chapter, h.verse)}
                              title="Eliminar resaltado"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
