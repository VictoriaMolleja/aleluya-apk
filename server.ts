import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Iniciar cliente de Gemini para TTS con la clave provista en el entorno
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Caché en memoria para respuestas de audio TTS para acelerar lectura repetida
const audioCache = new Map<string, { audioBase64: string; mimeType: string }>();

// Endpoint de Text-To-Speech con IA
app.post('/api/tts', async (req, res) => {
  try {
    const { text, profileId = 'mateo', lang = 'es' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texto requerido para la síntesis de voz' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Servicio de IA de voz no configurado (falta API key)' });
    }

    // Mapeo riguroso de perfiles a voces masculinas y femeninas de Gemini TTS
    // Mateo: Voz masculina profunda y solemne (Puck)
    // Gabriel: Voz masculina clara y serena (Charon)
    // Sofía: Voz femenina dulce y dulce (Kore)
    let voiceName = 'Puck';
    if (profileId === 'mateo') {
      voiceName = 'Puck'; // Masculina solemne
    } else if (profileId === 'gabriel') {
      voiceName = 'Charon'; // Masculina clara
    } else if (profileId === 'sofia') {
      voiceName = 'Kore'; // Femenina serena
    }

    const cacheKey = `${profileId}_${lang}_${text.trim()}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return res.json({
        audioBase64: cached.audioBase64,
        mimeType: cached.mimeType,
        fromCache: true,
        voiceName,
        gender: profileId === 'sofia' ? 'female' : 'male',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: text.trim(),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName,
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType || 'audio/wav';

    if (!audioData) {
      return res.status(500).json({ error: 'No se generó audio' });
    }

    // Guardar en caché (limitar tamaño a 200 audios recientes)
    if (audioCache.size > 200) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, { audioBase64: audioData, mimeType });

    return res.json({
      audioBase64: audioData,
      mimeType,
      voiceName,
      gender: profileId === 'sofia' ? 'female' : 'male',
    });
  } catch (err: any) {
    console.error('Error generando audio TTS con IA:', err);
    return res.status(500).json({ error: err.message || 'Error en síntesis de audio' });
  }
});

// Endpoint de estado de voces
app.get('/api/tts/status', (_req, res) => {
  res.json({
    available: !!ai,
    profiles: [
      { id: 'mateo', name: 'Mateo', gender: 'male', voiceName: 'Puck', description: 'Voz masculina solemne, profunda y reposada' },
      { id: 'gabriel', name: 'Gabriel', gender: 'male', voiceName: 'Charon', description: 'Voz masculina clara, serena y cercana' },
      { id: 'sofia', name: 'Sofía', gender: 'female', voiceName: 'Kore', description: 'Voz femenina serena, dulce y reconfortante' }
    ]
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Server] Aleluya Biblia running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
