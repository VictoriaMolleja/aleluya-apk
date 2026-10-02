/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Devotional, ThemedPrayer } from '../types/bible';

export const DAILY_DEVOTIONALS: Devotional[] = [
  // Mañana 1
  {
    id: 'dev_morn_1',
    type: 'morning',
    title: 'Nuevas son cada mañana',
    verseRef: 'Lamentaciones 3:22-23',
    verseText: 'Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.',
    reflection: 'Cada amanecer no es simplemente una vuelta más del reloj, sino una declaración visible del perdón y la fidelidad de Dios. Hoy tus errores del pasado quedan atrás; Dios te entrega una página en blanco bañada en su gracia. Respira profundo, entrega tus preocupaciones antes de levantarte y recuerda que no caminas en tus propias fuerzas, sino sostenido por el Creador.',
    prayer: 'Padre Celestial, gracias por el regalo de este nuevo día y por el aire en mis pulmones. Te entrego mis proyectos, mis palabras y mis decisiones de hoy. Lléname de tu paz que sobrepasa todo entendimiento y que tu luz brille a través de mí en cada encuentro. En el nombre de Jesús, Amén.',
    reflectionQuestion: '¿Qué carga de ayer puedes soltar hoy en las manos de Dios?'
  },
  // Mañana 2
  {
    id: 'dev_morn_2',
    type: 'morning',
    title: 'Caminar sin afán ni ansiedad',
    verseRef: 'Mateo 6:33-34',
    verseText: 'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas. Así que, no os congojéis por el día de mañana.',
    reflection: 'La mente humana tiende a adelantarse a los problemas que aún no existen. Jesús nos recuerda con ternura: basta a cada día su afán. El mismo Dios que alimenta a las aves del cielo y viste con esplendor los lirios del campo cuida de ti en este instante.',
    prayer: 'Señor Jesús, renuncio hoy al afán, al control excesivo y a la prisa destructiva. Ayúdame a buscar primero tu presencia y a confiar en que cada provisión necesaria llegará en tu perfecto tiempo.',
    reflectionQuestion: '¿En qué área de tu vida necesitas dejar de intentar controlarlo todo?'
  },
  // Noche 1
  {
    id: 'dev_night_1',
    type: 'night',
    title: 'En paz me acostaré y dormiré',
    verseRef: 'Salmos 4:8',
    verseText: 'En paz me acostaré, y asimismo dormiré; Porque solo tú, Jehová, me haces estar confiado.',
    reflection: 'El día ha concluido. Todo lo que pudiste hacer, hecho está; lo que quedó pendiente, Dios lo cuida mientras descansas. Dormir en paz es un acto sagrado de fe: implica declarar que Dios sigue siendo soberano sobre el universo aun cuando tú cierras los ojos.',
    prayer: 'Amado Padre, al terminar esta jornada, suelto todas mis angustias, cansancios y pensamientos turbulentos en tu regazo. Perdona mis fallas de hoy, limpia mi corazón y envía tus ángeles alrededor de mi hogar. Dame un descanso reparador y sereno. Amén.',
    reflectionQuestion: '¿Por qué tres bendiciones del día de hoy puedes darle gracias a Dios antes de dormir?'
  },
  // Noche 2
  {
    id: 'dev_night_2',
    type: 'night',
    title: 'Bajo la sombra del Omnipotente',
    verseRef: 'Salmos 91:4-5',
    verseText: 'Con sus plumas te cubrirá, y debajo de sus alas estarás seguro: Escudo y adarga es su verdad. No tendrás temor de espanto nocturno.',
    reflection: 'La noche suele ser el momento en que los temores magnifican su voz. Pero la promesa de Dios no cambia en la oscuridad: Él es tu refugio, tu torre fuerte. No estás desamparado ni a la deriva.',
    prayer: 'Señor todopoderoso, bajo la sombra de tus alas me cobijo esta noche. Aleja todo temor, pesadilla o inquietud de mi mente. Declaro paz sobre mi mente y descanso sobre mi cuerpo. En tus manos encomiendo mi espíritu.',
    reflectionQuestion: '¿Qué pensamiento de paz sustituirá hoy a tus dudas nocturnas?'
  }
];

export const THEMED_PRAYERS: ThemedPrayer[] = [
  {
    id: 'pray_ansiedad',
    category: 'ansiedad',
    title: 'Oración para vencer la ansiedad y el temor',
    verseRef: 'Filipenses 4:6-7',
    body: 'Señor, en este momento el peso del futuro y la incertidumbre quieren robarme la calma. Pero tu Palabra me invita a no afanarme, sino a presentar mis peticiones con acción de gracias. Traigo ante ti mi respiración agitada, mis pensamientos acelerados y mis temores. Lléname de esa paz divina que ninguna circunstancia externa puede quitar. Declaro que en tus manos mi vida está segura.'
  },
  {
    id: 'pray_gratitud',
    category: 'gratitud',
    title: 'Oración de gratitud por la vida y el sustento',
    verseRef: '1 Tesalonicenses 5:18',
    body: 'Padre amado, hoy no vengo a pedir, sino a agradecer. Gracias por el aire, por el pan en mi mesa, por la salud y por las personas que me rodean. Incluso en medio de los retos, puedo ver tu mano protectora guiándome. Gracias por amarme incondicionalmente y por no dejarme nunca solo.'
  },
  {
    id: 'pray_familia',
    category: 'familia',
    title: 'Oración por la bendición y armonía del hogar',
    verseRef: 'Josué 24:15',
    body: 'Señor Dios, consagro mi hogar y a mi familia a tu cuidado. Derrama sabiduría en nuestras conversaciones, paciencia en los momentos de tensión y amor genuino que perdone cualquier ofensa. Protege a cada uno de mis seres queridos al salir y al entrar, y que en nuestra casa reine tu paz.'
  },
  {
    id: 'pray_sanidad',
    category: 'sanidad',
    title: 'Oración por sanidad física, mental y espiritual',
    verseRef: 'Jeremías 17:14',
    body: 'Sáname, oh Jehová, y seré sano; sálvame, y seré salvo; porque tú eres mi alabanza. Pongo en tus manos cada dolor físico, cada cansancio acumulado y cada herida en mi alma. Tú eres el Gran Médico; renueva mis células, restaura mis fuerzas y devuélveme el gozo de la salvación.'
  },
  {
    id: 'pray_perdon',
    category: 'perdon',
    title: 'Oración para liberar el perdón y sanar heridas',
    verseRef: 'Colosenses 3:13',
    body: 'Padre celestial, reconozco que guardar rencor es una prisión para mi propio corazón. Así como tú me perdonaste tantas faltas en la cruz, hoy decido por fe perdonar a quienes me han lastimado. Los bendigo y los suelto. Limpia mi corazón de toda amargura y llénalo de tu compasión.'
  },
  {
    id: 'pray_proteccion',
    category: 'proteccion',
    title: 'Oración de protección para la noche y el descanso',
    verseRef: 'Salmos 121:7-8',
    body: 'Jehová me guardará de todo mal; Él guardará mi alma. Al caer la noche, apago las luces del mundo terrenal y confío en tu vigilia eterna. Guarda a mi familia, aleja las asechanzas del enemigo y permíteme despertar mañana renovado para alabarte con alegría.'
  }
];

export interface DailyVerseItem {
  reference: string;
  bookId: string;
  chapter: number;
  verse: number;
  textEs: string;
  textEn: string;
  theme: string;
}

export const DAILY_VERSES_COLLECTION: DailyVerseItem[] = [
  {
    reference: 'Salmos 23:1',
    bookId: 'PSA',
    chapter: 23,
    verse: 1,
    textEs: 'Jehová es mi pastor; nada me faltará.',
    textEn: 'The LORD is my shepherd; I shall not want.',
    theme: 'Provisión y Descanso'
  },
  {
    reference: 'Filipenses 4:13',
    bookId: 'PHP',
    chapter: 4,
    verse: 13,
    textEs: 'Todo lo puedo en Cristo que me fortalece.',
    textEn: 'I can do all things through Christ which strengtheneth me.',
    theme: 'Fortaleza Interior'
  },
  {
    reference: 'Isaías 40:31',
    bookId: 'ISA',
    chapter: 40,
    verse: 31,
    textEs: 'Mas los que esperan á Jehová tendrán nuevas fuerzas; levantarán las alas como águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.',
    textEn: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    theme: 'Renovación y Esperanza'
  },
  {
    reference: 'Jeremías 29:11',
    bookId: 'JER',
    chapter: 29,
    verse: 11,
    textEs: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    textEn: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
    theme: 'Propósito y Futuro'
  },
  {
    reference: 'Salmos 46:1',
    bookId: 'PSA',
    chapter: 46,
    verse: 1,
    textEs: 'Dios es nuestro amparo y fortaleza, Nuestro pronto auxilio en las tribulaciones.',
    textEn: 'God is our refuge and strength, a very present help in trouble.',
    theme: 'Amparo y Refugio'
  },
  {
    reference: 'Proverbios 3:5-6',
    bookId: 'PRO',
    chapter: 3,
    verse: 5,
    textEs: 'Fíate de Jehová de todo tu corazón, y no estribes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.',
    textEn: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
    theme: 'Confianza Absoluta'
  },
  {
    reference: 'Juan 14:27',
    bookId: 'JHN',
    chapter: 14,
    verse: 27,
    textEs: 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy. No se turbe vuestro corazón, ni tenga miedo.',
    textEn: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.',
    theme: 'Paz de Cristo'
  }
];

export function getTodayVerse(): DailyVerseItem {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs(dayOfYear) % DAILY_VERSES_COLLECTION.length;
  return DAILY_VERSES_COLLECTION[index];
}
