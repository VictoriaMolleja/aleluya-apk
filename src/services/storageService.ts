/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bookmark, BookProgress, Highlight, Note, ReaderSettings, SpiritualStreak } from '../types/bible';
import { BIBLE_BOOKS } from '../data/bibleBooks';

const STORAGE_KEYS = {
  SETTINGS: 'ab_settings_v1',
  STREAK: 'ab_streak_v1',
  PROGRESS: 'ab_progress_v1',
  HIGHLIGHTS: 'ab_highlights_v1',
  BOOKMARKS: 'ab_bookmarks_v1',
  NOTES: 'ab_notes_v1',
  LAST_READ: 'ab_last_position_v1',
  DAILY_VERSE_READ: 'ab_daily_verse_read_v1'
};

export const DEFAULT_SETTINGS: ReaderSettings = {
  userName: '',
  hasCompletedOnboarding: false,
  language: 'es',
  theme: 'day',
  fontFamily: 'serif',
  fontSize: 18,
  lineSpacing: 'normal',
  showVerseNumbers: true,
  textAlign: 'left',
  ambientVolume: 0.5,
  activeSound: null,
  ttsRate: 1.0,
  ttsVoiceProfile: 'mateo',
  ttsVoiceURI: null,
  morningReminderTime: '07:00',
  nightReminderTime: '21:30',
  remindersEnabled: true,
  hasAddedFixedWidget: false,
  hasAddedDailyWidget: false,
  widgetFixedVerse: {
    bookId: 'PSA',
    chapter: 23,
    verse: 1,
    reference: 'Salmos 23:1',
    text: 'Jehová es mi pastor; nada me faltará.',
    updatedAt: '2026-09-28'
  }
};

export function getTodayDateString(): string {
  // Uses device's local timezone for accurate calendar days
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const storageService = {
  // --- SETTINGS ---
  getSettings(): ReaderSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<ReaderSettings>): ReaderSettings {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  // --- SPIRITUAL STREAK (RACHA ESPIRITUAL) ---
  getStreak(): SpiritualStreak {
    const defaultStreak: SpiritualStreak = {
      currentStreak: 1,
      longestStreak: 1,
      lastReadDate: getTodayDateString(),
      readHistory: [getTodayDateString()],
      totalDaysRead: 1
    };

    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (!data) return defaultStreak;
      return JSON.parse(data);
    } catch {
      return defaultStreak;
    }
  },

  recordReadingDay(): SpiritualStreak {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const streak = this.getStreak();

    if (streak.lastReadDate === today) {
      // Already recorded for today
      return streak;
    }

    let newCurrentStreak = 1;
    if (streak.lastReadDate === yesterday) {
      // Consecutive day!
      newCurrentStreak = streak.currentStreak + 1;
    } else {
      // Streak broken, restarts at 1
      newCurrentStreak = 1;
    }

    const updatedHistory = Array.from(new Set([...streak.readHistory, today])).sort();
    const updatedLongest = Math.max(streak.longestStreak, newCurrentStreak);

    const updated: SpiritualStreak = {
      currentStreak: newCurrentStreak,
      longestStreak: updatedLongest,
      lastReadDate: today,
      readHistory: updatedHistory,
      totalDaysRead: updatedHistory.length
    };

    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
    } catch {
      // ignore
    }

    return updated;
  },

  isDailyVerseReadToday(): boolean {
    try {
      const recorded = localStorage.getItem(STORAGE_KEYS.DAILY_VERSE_READ);
      return recorded === getTodayDateString();
    } catch {
      return false;
    }
  },

  markDailyVerseRead(): SpiritualStreak {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_VERSE_READ, getTodayDateString());
    } catch {
      // ignore
    }
    return this.recordReadingDay();
  },

  // --- READING PROGRESS ---
  getProgress(): Record<string, number[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : { GEN: [1] };
    } catch {
      return { GEN: [1] };
    }
  },

  toggleChapterRead(bookId: string, chapter: number): Record<string, number[]> {
    const progress = this.getProgress();
    const chapters = progress[bookId] ? [...progress[bookId]] : [];
    const index = chapters.indexOf(chapter);

    if (index >= 0) {
      chapters.splice(index, 1);
    } else {
      chapters.push(chapter);
      // Mark reading streak active for today
      this.recordReadingDay();
    }

    progress[bookId] = chapters;
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch {
      // ignore
    }

    return progress;
  },

  getBookCompletionPercent(bookId: string): number {
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (!book) return 0;
    const progress = this.getProgress();
    const readCount = progress[bookId]?.length || 0;
    return Math.min(100, Math.round((readCount / book.chaptersCount) * 100));
  },

  getTestamentProgress(testament: 'OT' | 'NT'): { read: number; total: number; percent: number } {
    const books = BIBLE_BOOKS.filter(b => b.testament === testament);
    const totalChapters = books.reduce((acc, b) => acc + b.chaptersCount, 0);
    const progress = this.getProgress();

    let readChapters = 0;
    for (const b of books) {
      readChapters += (progress[b.id]?.length || 0);
    }

    const percent = totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0;
    return { read: readChapters, total: totalChapters, percent };
  },

  // --- HIGHLIGHTS ---
  getHighlights(): Highlight[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHighlight(highlight: Omit<Highlight, 'id' | 'date'>): Highlight {
    const highlights = this.getHighlights();
    // remove existing highlight on this verse if any
    const filtered = highlights.filter(h => !(h.bookId === highlight.bookId && h.chapter === highlight.chapter && h.verse === highlight.verse));
    const newHighlight: Highlight = {
      ...highlight,
      id: `${highlight.bookId}_${highlight.chapter}_${highlight.verse}_${Date.now()}`,
      date: getTodayDateString()
    };
    filtered.push(newHighlight);
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(filtered));
    } catch {
      // ignore
    }
    return newHighlight;
  },

  removeHighlight(bookId: string, chapter: number, verse: number) {
    const highlights = this.getHighlights().filter(h => !(h.bookId === bookId && h.chapter === chapter && h.verse === verse));
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
    } catch {
      // ignore
    }
  },

  // --- BOOKMARKS ---
  getBookmarks(): Bookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(bookmark: Omit<Bookmark, 'id' | 'date'>): boolean {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.findIndex(b => b.bookId === bookmark.bookId && b.chapter === bookmark.chapter && b.verse === bookmark.verse);

    if (index >= 0) {
      bookmarks.splice(index, 1);
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      } catch {
        // ignore
      }
      return false; // removed
    } else {
      const newBm: Bookmark = {
        ...bookmark,
        id: `bm_${bookmark.bookId}_${bookmark.chapter}_${bookmark.verse}`,
        date: getTodayDateString()
      };
      bookmarks.unshift(newBm);
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      } catch {
        // ignore
      }
      return true; // added
    }
  },

  // --- NOTES ---
  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveNote(note: Omit<Note, 'id' | 'date'> & { id?: string }): Note {
    const notes = this.getNotes();
    let updatedNote: Note;

    if (note.id) {
      const index = notes.findIndex(n => n.id === note.id);
      updatedNote = {
        ...note,
        id: note.id,
        date: getTodayDateString()
      };
      if (index >= 0) {
        notes[index] = updatedNote;
      } else {
        notes.unshift(updatedNote);
      }
    } else {
      updatedNote = {
        ...note,
        id: `note_${Date.now()}`,
        date: getTodayDateString()
      };
      notes.unshift(updatedNote);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch {
      // ignore
    }
    return updatedNote;
  },

  deleteNote(id: string) {
    const notes = this.getNotes().filter(n => n.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch {
      // ignore
    }
  },

  // --- LAST READ POSITION ---
  getLastPosition(): { bookId: string; chapter: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_READ);
      return data ? JSON.parse(data) : { bookId: 'PSA', chapter: 23 };
    } catch {
      return { bookId: 'PSA', chapter: 23 };
    }
  },

  saveLastPosition(bookId: string, chapter: number) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify({ bookId, chapter }));
    } catch {
      // ignore
    }
  }
};
