/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, ChevronRight } from 'lucide-react';
import { searchBible } from '../data/bibleVerses';
import { BibleBook } from '../types/bible';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
  onSelectVerse: (bookId: string, chapter: number, verse: number) => void;
}

export const SearchModal: React.FC<Props> = ({ isOpen, onClose, language, onSelectVerse }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    return searchBible(query, language);
  }, [query, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-fade-in"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border-subtle)]">
          <Search className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'es' ? 'Buscar en la Biblia (ej: pastor, amor, luz, Génesis)...' : 'Search the Bible (e.g. shepherd, love, light, Genesis)...'}
            className="w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-[var(--text-secondary)]/60"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-md text-[var(--text-secondary)] hover:bg-black/5 shrink-0"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {query.trim().length < 2 ? (
            <div className="text-center py-12 text-sm text-[var(--text-secondary)]">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
              <p>{language === 'es' ? 'Escribe al menos 2 letras para buscar versículos o libros.' : 'Type at least 2 characters to search verses or books.'}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {['Paz', 'Amor', 'Pastor', 'Luz', 'Fuerza', 'Salmos'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-sm text-[var(--text-secondary)]">
              <p>{language === 'es' ? `No se encontraron resultados para "${query}".` : `No results found for "${query}".`}</p>
              <p className="text-xs opacity-75 mt-1">{language === 'es' ? 'Prueba con otra palabra clave o libro.' : 'Try another keyword or book.'}</p>
            </div>
          ) : (
            results.map((res, idx) => (
              <button
                key={`${res.book.id}_${res.chapter}_${res.verse}_${idx}`}
                onClick={() => {
                  onSelectVerse(res.book.id, res.chapter, res.verse);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl bg-black/[0.02] hover:bg-black/[0.06] border border-transparent hover:border-[var(--border-subtle)] transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
                    <span>{language === 'es' ? res.book.nameEs : res.book.nameEn} {res.chapter}:{res.verse}</span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-normal">
                      ({res.book.testament === 'OT' ? (language === 'es' ? 'Antiguo Testamento' : 'Old Testament') : (language === 'es' ? 'Nuevo Testamento' : 'New Testament')})
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-[var(--text-primary)] leading-relaxed">
                    {res.text}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
