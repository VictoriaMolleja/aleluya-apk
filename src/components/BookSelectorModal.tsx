/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, CheckCircle2, ChevronRight } from 'lucide-react';
import { BIBLE_BOOKS, CATEGORY_NAMES_ES, CATEGORY_NAMES_EN } from '../data/bibleBooks';
import { BibleBook, BookCategory, Testament } from '../types/bible';
import { storageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
  currentBookId: string;
  currentChapter: number;
  onSelectChapter: (bookId: string, chapter: number) => void;
}

export const BookSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  currentBookId,
  currentChapter,
  onSelectChapter
}) => {
  const [activeTestament, setActiveTestament] = useState<Testament>('OT');
  const [selectedBook, setSelectedBook] = useState<BibleBook>(
    () => BIBLE_BOOKS.find(b => b.id === currentBookId) || BIBLE_BOOKS[0]
  );
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredBooks = BIBLE_BOOKS.filter(b => {
    const matchesTestament = b.testament === activeTestament;
    const name = language === 'es' ? b.nameEs : b.nameEn;
    const matchesQuery = filterQuery ? name.toLowerCase().includes(filterQuery.toLowerCase()) : true;
    return matchesTestament && matchesQuery;
  });

  const progress = storageService.getProgress();
  const readChaptersInBook = progress[selectedBook.id] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-4xl h-[88vh] rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-cinzel text-[var(--accent)]">
              {language === 'es' ? 'Libros y Capítulos' : 'Books & Chapters'}
            </h2>
            <span className="text-xs text-[var(--text-secondary)]">· 66 Libros</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Testament segmented control */}
            <div className="flex items-center p-1 rounded-xl bg-black/5 text-xs font-medium">
              <button
                onClick={() => setActiveTestament('OT')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTestament === 'OT' ? 'bg-[var(--accent)] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {language === 'es' ? 'Antiguo T.' : 'Old Test.'}
              </button>
              <button
                onClick={() => setActiveTestament('NT')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTestament === 'NT' ? 'bg-[var(--accent)] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {language === 'es' ? 'Nuevo T.' : 'New Test.'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search inside selector */}
        <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-black/[0.01] flex items-center gap-2">
          <Search className="w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder={language === 'es' ? 'Filtrar libros...' : 'Filter books...'}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-[var(--text-secondary)]/60"
          />
          {filterQuery && (
            <button onClick={() => setFilterQuery('')} className="text-xs text-[var(--text-secondary)]">
              {language === 'es' ? 'Limpiar' : 'Clear'}
            </button>
          )}
        </div>

        {/* Dual Pane on larger screens, tabs on mobile */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Books Column */}
          <div className="md:col-span-5 border-r border-[var(--border-subtle)] overflow-y-auto p-2 space-y-1">
            {filteredBooks.map((book) => {
              const isSelected = selectedBook.id === book.id;
              const isCurrentReading = currentBookId === book.id;
              const percent = storageService.getBookCompletionPercent(book.id);

              return (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white shadow-sm'
                      : 'hover:bg-black/5 text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-8 text-[11px] font-mono font-medium ${isSelected ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
                      {language === 'es' ? book.abbrevEs : book.abbrevEn}
                    </span>
                    <span className="font-medium text-sm truncate">
                      {language === 'es' ? book.nameEs : book.nameEn}
                    </span>
                    {isCurrentReading && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                        {currentChapter}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {percent > 0 && (
                      <span className={`text-[11px] ${isSelected ? 'text-white/90' : 'text-[var(--text-secondary)]'}`}>
                        {percent}%
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-white translate-x-0.5' : 'text-[var(--text-secondary)] opacity-40'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapters Grid Column */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-black/[0.01]">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)]">
                  {language === 'es' ? selectedBook.nameEs : selectedBook.nameEn}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {language === 'es' ? CATEGORY_NAMES_ES[selectedBook.category] : CATEGORY_NAMES_EN[selectedBook.category]} · {selectedBook.chaptersCount} {language === 'es' ? 'capítulos' : 'chapters'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-[var(--accent)]">
                  {readChaptersInBook.length} / {selectedBook.chaptersCount} {language === 'es' ? 'leídos' : 'read'}
                </span>
                <div className="w-24 h-1.5 bg-black/10 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent)] transition-all"
                    style={{ width: `${storageService.getBookCompletionPercent(selectedBook.id)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Chapters list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map((ch) => {
                  const isCurrent = currentBookId === selectedBook.id && currentChapter === ch;
                  const isRead = readChaptersInBook.includes(ch);

                  return (
                    <button
                      key={ch}
                      onClick={() => {
                        onSelectChapter(selectedBook.id, ch);
                        onClose();
                      }}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all border ${
                        isCurrent
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md scale-105'
                          : isRead
                          ? 'bg-[var(--bg-main)] text-[var(--text-primary)] border-[#A7F3D0]/60 hover:border-[var(--accent)]'
                          : 'bg-black/[0.02] text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-black/5 hover:border-[var(--accent)]/50'
                      }`}
                    >
                      <span>{ch}</span>
                      {isRead && !isCurrent && (
                        <CheckCircle2 className="w-3 h-3 text-[#10B981] absolute bottom-1.5 right-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
