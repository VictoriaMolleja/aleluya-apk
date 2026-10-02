/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Testament = 'OT' | 'NT';

export type BookCategory = 
  | 'pentateuco'
  | 'historicos'
  | 'poeticos'
  | 'profetas_mayores'
  | 'profetas_menores'
  | 'evangelios'
  | 'hechos'
  | 'epistolas_paulinas'
  | 'epistolas_generales'
  | 'profecia';

export interface BibleBook {
  id: string;
  nameEs: string;
  nameEn: string;
  abbrevEs: string;
  abbrevEn: string;
  testament: Testament;
  category: BookCategory;
  chaptersCount: number;
}

export interface Verse {
  bookId: string;
  chapter: number;
  verse: number;
  textEs: string;
  textEn: string;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';

export interface Highlight {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  date: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  tag: string;
  date: string;
}

export interface Note {
  id: string;
  bookId: string;
  chapter: number;
  verse?: number;
  title: string;
  content: string;
  date: string;
}

export type AppTheme = 'day' | 'sepia' | 'oled' | 'bosque' | 'mar' | 'olivo' | 'atardecer' | 'rosa_baby';
export type AppFontFamily = 'serif' | 'cinzel' | 'sans' | 'dyslexic';
export type LineSpacing = 'compact' | 'normal' | 'relaxed';

export type VoiceProfileId = 'sofia' | 'mateo' | 'gabriel' | 'system';

export interface VoiceOption {
  id: VoiceProfileId;
  name: string;
  gender: 'female' | 'male';
  description: string;
  pitch: number; // 0.8 - 1.2
  rateMod: number; // 0.85 - 1.05
}

export interface WidgetFixedVerse {
  bookId: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
  updatedAt: string;
}

export interface ReaderSettings {
  userName: string;
  hasCompletedOnboarding: boolean;
  language: 'es' | 'en';
  theme: AppTheme;
  fontFamily: AppFontFamily;
  fontSize: number; // 14 to 32
  lineSpacing: LineSpacing;
  showVerseNumbers: boolean;
  textAlign: 'left' | 'justify';
  ambientVolume: number;
  activeSound: string | null;
  ttsRate: number; // 0.75, 1, 1.25, 1.5
  ttsVoiceProfile: VoiceProfileId;
  ttsVoiceURI: string | null;
  morningReminderTime: string; // e.g. "07:00"
  nightReminderTime: string; // e.g. "21:30"
  remindersEnabled: boolean;
  hasAddedFixedWidget: boolean;
  hasAddedDailyWidget: boolean;
  widgetFixedVerse: WidgetFixedVerse | null;
}

export interface SpiritualStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string; // YYYY-MM-DD
  readHistory: string[]; // List of YYYY-MM-DD
  totalDaysRead: number;
}

export interface BookProgress {
  bookId: string;
  readChapters: number[];
}

export interface Devotional {
  id: string;
  type: 'morning' | 'night';
  title: string;
  verseRef: string;
  verseText: string;
  reflection: string;
  prayer: string;
  reflectionQuestion: string;
}

export interface ThemedPrayer {
  id: string;
  category: 'ansiedad' | 'gratitud' | 'familia' | 'sanidad' | 'perdon' | 'proteccion';
  title: string;
  verseRef: string;
  body: string;
}
