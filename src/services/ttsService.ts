/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Verse, VoiceOption, VoiceProfileId } from '../types/bible';

export interface ExtendedVoiceOption extends VoiceOption {
  aiVoiceName: string;
  isAiVoice: boolean;
}

export const VOICE_PROFILES: ExtendedVoiceOption[] = [
  {
    id: 'mateo',
    name: 'Mateo',
    gender: 'male',
    description: 'Voz solemne, profunda y reposada',
    pitch: 0.65,
    rateMod: 1.0,
    aiVoiceName: 'Puck',
    isAiVoice: true
  },
  {
    id: 'gabriel',
    name: 'Gabriel',
    gender: 'male',
    description: 'Voz clara, serena y cercana',
    pitch: 0.75,
    rateMod: 1.0,
    aiVoiceName: 'Charon',
    isAiVoice: true
  },
  {
    id: 'sofia',
    name: 'Sofía',
    gender: 'female',
    description: 'Voz serena, dulce y reconfortante',
    pitch: 1.05,
    rateMod: 1.0,
    aiVoiceName: 'Kore',
    isAiVoice: true
  }
];

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentIndex: number;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  activeProfile: VoiceProfileId;
  rate: number;
  isGeneratingAudio: boolean;
}

function sanitizeTextForSpeech(text: string, lang: 'es' | 'en'): string {
  if (lang === 'es') {
    return text
      .replace(/\bá\b/gi, 'a')
      .replace(/\bó\b/gi, 'o')
      .replace(/\bé\b/gi, 'e')
      .replace(/[«»""''„”]/g, '')
      .replace(/;/g, ',')
      .replace(/—/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return text.replace(/[«»""''„”]/g, '').replace(/\s+/g, ' ').trim();
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private verses: Verse[] = [];
  private currentLanguage: 'es' | 'en' = 'es';
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private rate: number = 1.0;
  private activeProfileId: VoiceProfileId = 'mateo';
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private customVoiceURI: string | null = null;

  // Web Audio Context para reproducción libre de bloqueos de autoplay
  private audioCtx: AudioContext | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private audioCache = new Map<string, ArrayBuffer>(); // key -> ArrayBuffer binario
  private isGeneratingAudio: boolean = false;

  private onVerseChangeCallback: ((index: number, verse: Verse | null) => void) | null = null;
  private onStateChangeCallback: ((state: { isPlaying: boolean; isPaused: boolean; currentIndex: number; isGeneratingAudio: boolean }) => void) | null = null;
  private onChapterEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        const loadVoices = () => {
          this.initVoice(this.currentLanguage, this.activeProfileId);
        };
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = loadVoices;
        }
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      }
    }
  }

  // Desbloquea el AudioContext en el evento del usuario (click)
  public ensureAudioUnlocked() {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      // Reanudar síntesis de voz en caso de estar pausada por el navegador
      if (this.synth && this.synth.paused) {
        this.synth.resume();
      }
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public setVoiceProfile(profileId: VoiceProfileId) {
    this.activeProfileId = profileId;
    this.initVoice(this.currentLanguage, profileId);
  }

  public getActiveVoiceProfile(): VoiceProfileId {
    return this.activeProfileId;
  }

  public setCustomVoiceURI(uri: string | null) {
    this.customVoiceURI = uri;
    if (uri && this.synth) {
      const v = this.synth.getVoices().find(item => item.voiceURI === uri);
      if (v) this.selectedVoice = v;
    }
  }

  public getCustomVoiceURI(): string | null {
    return this.customVoiceURI;
  }

  public initVoice(lang: 'es' | 'en' = this.currentLanguage, profileId: VoiceProfileId = this.activeProfileId) {
    this.currentLanguage = lang;
    this.activeProfileId = profileId;
    const voices = this.getVoices();
    if (voices.length === 0) return;

    if (this.customVoiceURI) {
      const custom = voices.find(v => v.voiceURI === this.customVoiceURI);
      if (custom) {
        this.selectedVoice = custom;
        return;
      }
    }

    const langPrefix = lang === 'es' ? 'es' : 'en';
    const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));

    const femaleKeywords = [
      'google español', 'google es-es', 'google es-us', 'sofia', 'monica', 'mónica', 'paulina', 
      'helena', 'victoria', 'elena', 'female', 'mujer', 'sabina', 'lucia', 'lucía', 
      'samantha', 'zira', 'karen', 'laura', 'maria', 'maría', 'rosa', 'hilda', 'carmen', 
      'mia', 'mía', 'penelope', 'penélope', 'angelica', 'angélica', 'soledad', 'conchita', 
      'fabiola', 'girl', 'woman', 'ana'
    ];

    const maleKeywords = [
      'pablo', 'raul', 'raúl', 'jorge', 'diego', 'carlos', 'david', 'miguel', 'alvaro', 
      'álvaro', 'enrique', 'pedro', 'manuel', 'andres', 'andrés', 'hector', 'héctor', 
      'victor', 'víctor', 'antonio', 'francisco', 'jose', 'josé', 'luis', 'javier', 
      'gonzalo', 'tomas', 'tomás', 'mateo', 'gabriel', 'alberto', 'cristian', 'guillermo', 
      'ignacio', 'martin', 'martín', 'felipe', 'ramon', 'ramón', 'alonso', 'santiago', 
      'emilio', 'joaquin', 'joaquín', 'arturo', 'male', 'hombre', 'varon', 'varón', 
      'guy', 'boy', 'daniel', 'alex', 'george', 'mark', 'fred', 'eddy', 'reed', 'rocko'
    ];

    if (profileId === 'sofia') {
      const foundFemale = langVoices.find(v => {
        const str = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        return femaleKeywords.some(k => str.includes(k));
      });
      this.selectedVoice = foundFemale || langVoices[0] || voices[0];
    } else {
      const foundMale = langVoices.find(v => {
        const str = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        return maleKeywords.some(k => str.includes(k)) && !femaleKeywords.some(fk => str.includes(fk));
      });

      if (foundMale) {
        this.selectedVoice = foundMale;
      } else {
        const anySpanishMale = voices.filter(v => v.lang.toLowerCase().startsWith('es')).find(v => {
          const str = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
          return maleKeywords.some(k => str.includes(k));
        });
        this.selectedVoice = anySpanishMale || langVoices[0] || voices[0];
      }
    }
  }

  // Previsualización instantánea de voz (botón Probar)
  public async previewVoice(profileId: VoiceProfileId, lang: 'es' | 'en') {
    this.stopAudioSource();
    if (this.synth) this.synth.cancel();

    this.activeProfileId = profileId;
    this.currentLanguage = lang;
    this.ensureAudioUnlocked();

    const sampleText = lang === 'es'
      ? (profileId === 'sofia' 
          ? 'Jehová es mi pastor, nada me faltará.' 
          : (profileId === 'mateo' 
              ? 'Jehová es mi luz y mi salvación, ¿de quién temeré?' 
              : 'Clama a mí y yo te responderé, y te enseñaré cosas grandes.'))
      : 'The Lord is my shepherd, I shall not want.';

    const cleanText = sanitizeTextForSpeech(sampleText, lang);

    // Reproducir directamente como muestra audible (isAudition = true)
    const success = await this.playAiAudioForText(cleanText, profileId, lang, true);
    if (!success) {
      this.speakWithSpeechSynthesis(cleanText, profileId, lang, true);
    }
  }

  public setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }

  public setRate(newRate: number) {
    this.rate = newRate;
    if (this.isPlaying && !this.isPaused) {
      this.speakCurrentVerse();
    }
  }

  public registerCallbacks(
    onVerseChange: (index: number, verse: Verse | null) => void,
    onStateChange: (state: { isPlaying: boolean; isPaused: boolean; currentIndex: number; isGeneratingAudio: boolean }) => void,
    onChapterEnd?: () => void
  ) {
    this.onVerseChangeCallback = onVerseChange;
    this.onStateChangeCallback = onStateChange;
    if (onChapterEnd) {
      this.onChapterEndCallback = onChapterEnd;
    }
  }

  public loadChapter(verses: Verse[], lang: 'es' | 'en', startFromIndex: number = 0) {
    this.stop();
    this.verses = verses;
    this.currentLanguage = lang;
    this.currentIndex = Math.max(0, Math.min(startFromIndex, verses.length - 1));
    this.initVoice(lang, this.activeProfileId);
  }

  public play() {
    if (this.verses.length === 0) return;
    this.ensureAudioUnlocked();

    if (this.isPaused) {
      this.isPaused = false;
      this.isPlaying = true;

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
        this.notifyState();
        return;
      }

      if (this.synth && this.synth.paused) {
        try {
          this.synth.resume();
          this.notifyState();
          return;
        } catch {
          // fallback
        }
      }

      this.speakCurrentVerse();
      return;
    }

    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.speakCurrentVerse();
  }

  public async speakCustomText(text: string, lang: 'es' | 'en' = this.currentLanguage, profileId: VoiceProfileId = this.activeProfileId) {
    this.stopAudioSource();
    if (this.synth) this.synth.cancel();
    this.ensureAudioUnlocked();

    this.activeProfileId = profileId;
    this.currentLanguage = lang;
    const cleanText = sanitizeTextForSpeech(text, lang);
    const aiSuccess = await this.playAiAudioForText(cleanText, profileId, lang, true);
    if (!aiSuccess) {
      this.speakWithSpeechSynthesis(cleanText, profileId, lang, true);
    }
  }

  public pause() {
    this.isPaused = true;
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
    if (this.synth) {
      this.synth.pause();
    }
    this.notifyState();
  }

  public togglePlayPause() {
    if (this.isPlaying && !this.isPaused) {
      this.pause();
    } else {
      this.play();
    }
  }

  public toggleVerse(index: number) {
    this.ensureAudioUnlocked();
    if (this.isPlaying && !this.isPaused && this.currentIndex === index) {
      this.pause();
    } else if (this.isPaused && this.currentIndex === index) {
      this.play();
    } else {
      this.jumpToVerse(index);
    }
  }

  private stopAudioSource() {
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
      } catch {}
      this.currentSourceNode = null;
    }
  }

  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.isGeneratingAudio = false;

    this.stopAudioSource();

    if (this.synth) {
      this.synth.cancel();
    }

    this.notifyState();
    if (this.onVerseChangeCallback) {
      this.onVerseChangeCallback(-1, null);
    }
  }

  public next() {
    if (this.currentIndex < this.verses.length - 1) {
      this.currentIndex++;
      if (this.isPlaying && !this.isPaused) {
        this.speakCurrentVerse();
      } else {
        this.notifyVerse();
      }
    }
  }

  public previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.isPlaying && !this.isPaused) {
        this.speakCurrentVerse();
      } else {
        this.notifyVerse();
      }
    }
  }

  public jumpToVerse(index: number) {
    if (index >= 0 && index < this.verses.length) {
      this.ensureAudioUnlocked();
      this.currentIndex = index;
      this.isPlaying = true;
      this.isPaused = false;
      this.speakCurrentVerse();
    }
  }

  // Reproducción del versículo actual
  private async speakCurrentVerse() {
    if (!this.isPlaying) return;

    const verse = this.verses[this.currentIndex];
    if (!verse) {
      this.stop();
      return;
    }

    this.notifyVerse();
    this.notifyState();

    const rawText = this.currentLanguage === 'es' ? verse.textEs : verse.textEn;
    const cleanText = sanitizeTextForSpeech(rawText, this.currentLanguage);

    const aiSuccess = await this.playAiAudioForText(cleanText, this.activeProfileId, this.currentLanguage, false);
    if (!aiSuccess && this.isPlaying && !this.isPaused) {
      this.speakWithSpeechSynthesis(cleanText, this.activeProfileId, this.currentLanguage, false);
    }

    // Precargar en segundo plano el siguiente versículo
    if (this.currentIndex < this.verses.length - 1) {
      const nextVerse = this.verses[this.currentIndex + 1];
      if (nextVerse) {
        const nextRaw = this.currentLanguage === 'es' ? nextVerse.textEs : nextVerse.textEn;
        this.prefetchAiAudio(sanitizeTextForSpeech(nextRaw, this.currentLanguage), this.activeProfileId, this.currentLanguage);
      }
    }
  }

  // Llama a /api/tts y reproduce el WAV con Web Audio API o HTML5 Audio garantizado
  private async playAiAudioForText(
    text: string, 
    profileId: VoiceProfileId, 
    lang: 'es' | 'en', 
    isAudition: boolean = false
  ): Promise<boolean> {
    try {
      this.ensureAudioUnlocked();
      this.isGeneratingAudio = true;
      this.notifyState();

      const cacheKey = `${profileId}_${lang}_${text.trim()}`;
      let arrayBuffer = this.audioCache.get(cacheKey);

      if (!arrayBuffer) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, profileId, lang })
        });

        if (!response.ok) {
          this.isGeneratingAudio = false;
          this.notifyState();
          return false;
        }

        const data = await response.json();
        if (!data.audioBase64) {
          this.isGeneratingAudio = false;
          this.notifyState();
          return false;
        }

        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        arrayBuffer = bytes.buffer;
        this.audioCache.set(cacheKey, arrayBuffer);
      }

      this.isGeneratingAudio = false;
      this.notifyState();

      // Si es lectura de capítulo y el usuario pausó o detuvo mientras descargaba, salir
      if (!isAudition && (!this.isPlaying || this.isPaused)) {
        return true;
      }

      // Reproducir mediante Web Audio API (inmune a bloqueo de autoplay tras interacción)
      if (this.audioCtx) {
        this.stopAudioSource();
        // Duplicar el ArrayBuffer para permitir decodificaciones repetidas
        const bufferCopy = arrayBuffer.slice(0);
        const audioBuffer = await this.audioCtx.decodeAudioData(bufferCopy);

        const source = this.audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.setValueAtTime(this.rate, this.audioCtx.currentTime);

        const gainNode = this.audioCtx.createGain();
        gainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        source.onended = () => {
          if (!isAudition) {
            this.handleAudioEnded();
          }
        };

        this.currentSourceNode = source;
        source.start(0);
        return true;
      }

      return false;
    } catch (e) {
      console.warn('Error en reproducción de audio IA, activando fallback:', e);
      this.isGeneratingAudio = false;
      this.notifyState();
      return false;
    }
  }

  private async prefetchAiAudio(text: string, profileId: VoiceProfileId, lang: 'es' | 'en') {
    const cacheKey = `${profileId}_${lang}_${text.trim()}`;
    if (this.audioCache.has(cacheKey)) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, profileId, lang })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const binary = atob(data.audioBase64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          this.audioCache.set(cacheKey, bytes.buffer);
        }
      }
    } catch {
      // Ignorar errores de precarga silenciosa
    }
  }

  private handleAudioEnded() {
    if (this.isPlaying && !this.isPaused) {
      if (this.currentIndex < this.verses.length - 1) {
        this.currentIndex++;
        this.speakCurrentVerse();
      } else {
        if (this.onChapterEndCallback) {
          this.onChapterEndCallback();
        } else {
          this.stop();
        }
      }
    }
  }

  // Síntesis de voz nativa del dispositivo (Respaldo offline 100%)
  private speakWithSpeechSynthesis(
    text: string, 
    profileId: VoiceProfileId, 
    lang: 'es' | 'en',
    isAudition: boolean = false
  ) {
    if (!this.synth) return;
    this.synth.cancel();

    if (this.synth.paused) {
      try { this.synth.resume(); } catch {}
    }

    this.initVoice(lang, profileId);
    const utterance = new SpeechSynthesisUtterance(text);
    const profile = VOICE_PROFILES.find(p => p.id === profileId) || VOICE_PROFILES[0];

    utterance.rate = Math.max(0.6, Math.min(2.0, this.rate));
    utterance.pitch = profile.pitch;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';

    utterance.onend = () => {
      if (!isAudition) {
        this.handleAudioEnded();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        if (!isAudition) {
          this.stop();
        }
      }
    };

    this.synth.speak(utterance);
  }

  private notifyVerse() {
    if (this.onVerseChangeCallback) {
      const v = this.verses[this.currentIndex] || null;
      this.onVerseChangeCallback(this.currentIndex, v);
    }
  }

  private notifyState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        currentIndex: this.currentIndex,
        isGeneratingAudio: this.isGeneratingAudio
      });
    }
  }
}

export const ttsService = new TTSService();
