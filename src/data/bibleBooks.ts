/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleBook, BookCategory } from '../types/bible';

export const BIBLE_BOOKS: BibleBook[] = [
  // --- ANTIGUO TESTAMENTO / OLD TESTAMENT ---
  // Pentateuco
  { id: 'GEN', nameEs: 'Génesis', nameEn: 'Genesis', abbrevEs: 'Gén', abbrevEn: 'Gen', testament: 'OT', category: 'pentateuco', chaptersCount: 50 },
  { id: 'EXO', nameEs: 'Éxodo', nameEn: 'Exodus', abbrevEs: 'Éx', abbrevEn: 'Exo', testament: 'OT', category: 'pentateuco', chaptersCount: 40 },
  { id: 'LEV', nameEs: 'Levítico', nameEn: 'Leviticus', abbrevEs: 'Lev', abbrevEn: 'Lev', testament: 'OT', category: 'pentateuco', chaptersCount: 27 },
  { id: 'NUM', nameEs: 'Números', nameEn: 'Numbers', abbrevEs: 'Núm', abbrevEn: 'Num', testament: 'OT', category: 'pentateuco', chaptersCount: 36 },
  { id: 'DEU', nameEs: 'Deuteronomio', nameEn: 'Deuteronomy', abbrevEs: 'Deut', abbrevEn: 'Deut', testament: 'OT', category: 'pentateuco', chaptersCount: 34 },
  
  // Históricos
  { id: 'JOS', nameEs: 'Josué', nameEn: 'Joshua', abbrevEs: 'Jos', abbrevEn: 'Josh', testament: 'OT', category: 'historicos', chaptersCount: 24 },
  { id: 'JDG', nameEs: 'Jueces', nameEn: 'Judges', abbrevEs: 'Jue', abbrevEn: 'Judg', testament: 'OT', category: 'historicos', chaptersCount: 21 },
  { id: 'RUT', nameEs: 'Rut', nameEn: 'Ruth', abbrevEs: 'Rut', abbrevEn: 'Ruth', testament: 'OT', category: 'historicos', chaptersCount: 4 },
  { id: '1SA', nameEs: '1 Samuel', nameEn: '1 Samuel', abbrevEs: '1 Sam', abbrevEn: '1 Sam', testament: 'OT', category: 'historicos', chaptersCount: 31 },
  { id: '2SA', nameEs: '2 Samuel', nameEn: '2 Samuel', abbrevEs: '2 Sam', abbrevEn: '2 Sam', testament: 'OT', category: 'historicos', chaptersCount: 24 },
  { id: '1KI', nameEs: '1 Reyes', nameEn: '1 Kings', abbrevEs: '1 Rey', abbrevEn: '1 Kgs', testament: 'OT', category: 'historicos', chaptersCount: 22 },
  { id: '2KI', nameEs: '2 Reyes', nameEn: '2 Kings', abbrevEs: '2 Rey', abbrevEn: '2 Kgs', testament: 'OT', category: 'historicos', chaptersCount: 25 },
  { id: '1CH', nameEs: '1 Crónicas', nameEn: '1 Chronicles', abbrevEs: '1 Crón', abbrevEn: '1 Chr', testament: 'OT', category: 'historicos', chaptersCount: 29 },
  { id: '2CH', nameEs: '2 Crónicas', nameEn: '2 Chronicles', abbrevEs: '2 Crón', abbrevEn: '2 Chr', testament: 'OT', category: 'historicos', chaptersCount: 36 },
  { id: 'EZR', nameEs: 'Esdras', nameEn: 'Ezra', abbrevEs: 'Esd', abbrevEn: 'Ezra', testament: 'OT', category: 'historicos', chaptersCount: 10 },
  { id: 'NEH', nameEs: 'Nehemías', nameEn: 'Nehemiah', abbrevEs: 'Neh', abbrevEn: 'Neh', testament: 'OT', category: 'historicos', chaptersCount: 13 },
  { id: 'EST', nameEs: 'Ester', nameEn: 'Esther', abbrevEs: 'Est', abbrevEn: 'Esth', testament: 'OT', category: 'historicos', chaptersCount: 10 },
  
  // Poéticos y Sapienciales
  { id: 'JOB', nameEs: 'Job', nameEn: 'Job', abbrevEs: 'Job', abbrevEn: 'Job', testament: 'OT', category: 'poeticos', chaptersCount: 42 },
  { id: 'PSA', nameEs: 'Salmos', nameEn: 'Psalms', abbrevEs: 'Sal', abbrevEn: 'Psa', testament: 'OT', category: 'poeticos', chaptersCount: 150 },
  { id: 'PRO', nameEs: 'Proverbios', nameEn: 'Proverbs', abbrevEs: 'Prov', abbrevEn: 'Prov', testament: 'OT', category: 'poeticos', chaptersCount: 31 },
  { id: 'ECC', nameEs: 'Eclesiastés', nameEn: 'Ecclesiastes', abbrevEs: 'Ecl', abbrevEn: 'Eccl', testament: 'OT', category: 'poeticos', chaptersCount: 12 },
  { id: 'SNG', nameEs: 'Cantares', nameEn: 'Song of Solomon', abbrevEs: 'Cant', abbrevEn: 'Song', testament: 'OT', category: 'poeticos', chaptersCount: 8 },

  // Profetas Mayores
  { id: 'ISA', nameEs: 'Isaías', nameEn: 'Isaiah', abbrevEs: 'Isa', abbrevEn: 'Isa', testament: 'OT', category: 'profetas_mayores', chaptersCount: 66 },
  { id: 'JER', nameEs: 'Jeremías', nameEn: 'Jeremiah', abbrevEs: 'Jer', abbrevEn: 'Jer', testament: 'OT', category: 'profetas_mayores', chaptersCount: 52 },
  { id: 'LAM', nameEs: 'Lamentaciones', nameEn: 'Lamentations', abbrevEs: 'Lam', abbrevEn: 'Lam', testament: 'OT', category: 'profetas_mayores', chaptersCount: 5 },
  { id: 'EZK', nameEs: 'Ezequiel', nameEn: 'Ezekiel', abbrevEs: 'Ezeq', abbrevEn: 'Ezek', testament: 'OT', category: 'profetas_mayores', chaptersCount: 48 },
  { id: 'DAN', nameEs: 'Daniel', nameEn: 'Daniel', abbrevEs: 'Dan', abbrevEn: 'Dan', testament: 'OT', category: 'profetas_mayores', chaptersCount: 12 },

  // Profetas Menores
  { id: 'HOS', nameEs: 'Oseas', nameEn: 'Hosea', abbrevEs: 'Os', abbrevEn: 'Hos', testament: 'OT', category: 'profetas_menores', chaptersCount: 14 },
  { id: 'JOL', nameEs: 'Joel', nameEn: 'Joel', abbrevEs: 'Jl', abbrevEn: 'Joel', testament: 'OT', category: 'profetas_menores', chaptersCount: 3 },
  { id: 'AMO', nameEs: 'Amós', nameEn: 'Amos', abbrevEs: 'Am', abbrevEn: 'Amos', testament: 'OT', category: 'profetas_menores', chaptersCount: 9 },
  { id: 'OBA', nameEs: 'Abdías', nameEn: 'Obadiah', abbrevEs: 'Abd', abbrevEn: 'Obad', testament: 'OT', category: 'profetas_menores', chaptersCount: 1 },
  { id: 'JON', nameEs: 'Jonás', nameEn: 'Jonah', abbrevEs: 'Jon', abbrevEn: 'Jonah', testament: 'OT', category: 'profetas_menores', chaptersCount: 4 },
  { id: 'MIC', nameEs: 'Miqueas', nameEn: 'Micah', abbrevEs: 'Miq', abbrevEn: 'Mic', testament: 'OT', category: 'profetas_menores', chaptersCount: 7 },
  { id: 'NAM', nameEs: 'Nahúm', nameEn: 'Nahum', abbrevEs: 'Nah', abbrevEn: 'Nah', testament: 'OT', category: 'profetas_menores', chaptersCount: 3 },
  { id: 'HAB', nameEs: 'Habacuc', nameEn: 'Habakkuk', abbrevEs: 'Hab', abbrevEn: 'Hab', testament: 'OT', category: 'profetas_menores', chaptersCount: 3 },
  { id: 'ZEP', nameEs: 'Sofonías', nameEn: 'Zephaniah', abbrevEs: 'Sof', abbrevEn: 'Zeph', testament: 'OT', category: 'profetas_menores', chaptersCount: 3 },
  { id: 'HAG', nameEs: 'Hageo', nameEn: 'Haggai', abbrevEs: 'Hag', abbrevEn: 'Hag', testament: 'OT', category: 'profetas_menores', chaptersCount: 2 },
  { id: 'ZEC', nameEs: 'Zacarías', nameEn: 'Zechariah', abbrevEs: 'Zac', abbrevEn: 'Zech', testament: 'OT', category: 'profetas_menores', chaptersCount: 14 },
  { id: 'MAL', nameEs: 'Malaquías', nameEn: 'Malachi', abbrevEs: 'Mal', abbrevEn: 'Mal', testament: 'OT', category: 'profetas_menores', chaptersCount: 4 },

  // --- NUEVO TESTAMENTO / NEW TESTAMENT ---
  // Evangelios
  { id: 'MAT', nameEs: 'Mateo', nameEn: 'Matthew', abbrevEs: 'Mat', abbrevEn: 'Matt', testament: 'NT', category: 'evangelios', chaptersCount: 28 },
  { id: 'MRK', nameEs: 'Marcos', nameEn: 'Mark', abbrevEs: 'Mar', abbrevEn: 'Mark', testament: 'NT', category: 'evangelios', chaptersCount: 16 },
  { id: 'LUK', nameEs: 'Lucas', nameEn: 'Luke', abbrevEs: 'Luc', abbrevEn: 'Luke', testament: 'NT', category: 'evangelios', chaptersCount: 24 },
  { id: 'JHN', nameEs: 'Juan', nameEn: 'John', abbrevEs: 'Jn', abbrevEn: 'John', testament: 'NT', category: 'evangelios', chaptersCount: 21 },

  // Histórico NT
  { id: 'ACT', nameEs: 'Hechos', nameEn: 'Acts', abbrevEs: 'Hch', abbrevEn: 'Acts', testament: 'NT', category: 'hechos', chaptersCount: 28 },

  // Epístolas Paulinas
  { id: 'ROM', nameEs: 'Romanos', nameEn: 'Romans', abbrevEs: 'Rom', abbrevEn: 'Rom', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 16 },
  { id: '1CO', nameEs: '1 Corintios', nameEn: '1 Corinthians', abbrevEs: '1 Cor', abbrevEn: '1 Cor', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 16 },
  { id: '2CO', nameEs: '2 Corintios', nameEn: '2 Corinthians', abbrevEs: '2 Cor', abbrevEn: '2 Cor', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 13 },
  { id: 'GAL', nameEs: 'Gálatas', nameEn: 'Galatians', abbrevEs: 'Gál', abbrevEn: 'Gal', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 6 },
  { id: 'EPH', nameEs: 'Efesios', nameEn: 'Ephesians', abbrevEs: 'Efe', abbrevEn: 'Eph', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 6 },
  { id: 'PHP', nameEs: 'Filipenses', nameEn: 'Philippians', abbrevEs: 'Fil', abbrevEn: 'Phil', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 4 },
  { id: 'COL', nameEs: 'Colosenses', nameEn: 'Colossians', abbrevEs: 'Col', abbrevEn: 'Col', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 4 },
  { id: '1TH', nameEs: '1 Tesalonicenses', nameEn: '1 Thessalonians', abbrevEs: '1 Tes', abbrevEn: '1 Thess', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 5 },
  { id: '2TH', nameEs: '2 Tesalonicenses', nameEn: '2 Thessalonians', abbrevEs: '2 Tes', abbrevEn: '2 Thess', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 3 },
  { id: '1TI', nameEs: '1 Timoteo', nameEn: '1 Timothy', abbrevEs: '1 Tim', abbrevEn: '1 Tim', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 6 },
  { id: '2TI', nameEs: '2 Timoteo', nameEn: '2 Timothy', abbrevEs: '2 Tim', abbrevEn: '2 Tim', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 4 },
  { id: 'TIT', nameEs: 'Tito', nameEn: 'Titus', abbrevEs: 'Tit', abbrevEn: 'Tit', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 3 },
  { id: 'PHM', nameEs: 'Filemón', nameEn: 'Philemon', abbrevEs: 'Flm', abbrevEn: 'Phlm', testament: 'NT', category: 'epistolas_paulinas', chaptersCount: 1 },

  // Epístolas Generales
  { id: 'HEB', nameEs: 'Hebreos', nameEn: 'Hebrews', abbrevEs: 'Heb', abbrevEn: 'Heb', testament: 'NT', category: 'epistolas_generales', chaptersCount: 13 },
  { id: 'JAS', nameEs: 'Santiago', nameEn: 'James', abbrevEs: 'Sant', abbrevEn: 'Jas', testament: 'NT', category: 'epistolas_generales', chaptersCount: 5 },
  { id: '1PE', nameEs: '1 Pedro', nameEn: '1 Peter', abbrevEs: '1 Pe', abbrevEn: '1 Pet', testament: 'NT', category: 'epistolas_generales', chaptersCount: 5 },
  { id: '2PE', nameEs: '2 Pedro', nameEn: '2 Peter', abbrevEs: '2 Pe', abbrevEn: '2 Pet', testament: 'NT', category: 'epistolas_generales', chaptersCount: 3 },
  { id: '1JN', nameEs: '1 Juan', nameEn: '1 John', abbrevEs: '1 Jn', abbrevEn: '1 John', testament: 'NT', category: 'epistolas_generales', chaptersCount: 5 },
  { id: '2JN', nameEs: '2 Juan', nameEn: '2 John', abbrevEs: '2 Jn', abbrevEn: '2 John', testament: 'NT', category: 'epistolas_generales', chaptersCount: 1 },
  { id: '3JN', nameEs: '3 Juan', nameEn: '3 John', abbrevEs: '3 Jn', abbrevEn: '3 John', testament: 'NT', category: 'epistolas_generales', chaptersCount: 1 },
  { id: 'JUD', nameEs: 'Judas', nameEn: 'Jude', abbrevEs: 'Jds', abbrevEn: 'Jude', testament: 'NT', category: 'epistolas_generales', chaptersCount: 1 },

  // Profecía
  { id: 'REV', nameEs: 'Apocalipsis', nameEn: 'Revelation', abbrevEs: 'Apoc', abbrevEn: 'Rev', testament: 'NT', category: 'profecia', chaptersCount: 22 }
];

export const CATEGORY_NAMES_ES: Record<BookCategory, string> = {
  pentateuco: 'Pentateuco / Ley',
  historicos: 'Libros Históricos',
  poeticos: 'Poéticos y Sapienciales',
  profetas_mayores: 'Profetas Mayores',
  profetas_menores: 'Profetas Menores',
  evangelios: 'Santos Evangelios',
  hechos: 'Historia de la Iglesia (Hechos)',
  epistolas_paulinas: 'Epístolas de Pablo',
  epistolas_generales: 'Epístolas Generales',
  profecia: 'Profecía (Apocalipsis)'
};

export const CATEGORY_NAMES_EN: Record<BookCategory, string> = {
  pentateuco: 'Pentateuch / Law',
  historicos: 'Historical Books',
  poeticos: 'Poetry & Wisdom',
  profetas_mayores: 'Major Prophets',
  profetas_menores: 'Minor Prophets',
  evangelios: 'The Gospels',
  hechos: 'Acts of the Apostles',
  epistolas_paulinas: 'Pauline Epistles',
  epistolas_generales: 'General Epistles',
  profecia: 'Prophecy (Revelation)'
};
