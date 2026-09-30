import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// API: Veo 3 Video Generation (veo-3.1-fast-generate-preview)
// ==========================================
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', resolution = '720p' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const validAspect = aspectRatio === '9:16' ? '9:16' : '16:9';
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: resolution === '1080p' ? '1080p' : '720p',
        aspectRatio: validAspect as any,
      },
    });

    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: error?.message || 'Failed to start video generation' });
  }
});

app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: !!updated.done,
      hasVideo: !!updated.response?.generatedVideos?.[0]?.video?.uri,
      error: updated.error,
    });
  } catch (error: any) {
    console.error('Video status error:', error);
    res.status(500).json({ error: error?.message || 'Failed to check video status' });
  }
});

app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }
    if (!ai || !apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found or generation incomplete' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Failed to retrieve video stream' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Video download error:', error);
    res.status(500).json({ error: error?.message || 'Failed to download video stream' });
  }
});

// ==========================================
// API: Image Generation & Editing (gemini-3.1-flash-image-preview)
// ==========================================
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: '1K',
        },
      },
    });

    let imageUrl = '';
    let textResponse = '';
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image data returned from model', text: textResponse });
    }

    res.json({ imageUrl, text: textResponse });
  } catch (error: any) {
    console.error('Generate image error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate image' });
  }
});

app.post('/api/edit-image', async (req, res) => {
  try {
    const { prompt, base64ImageData, mimeType = 'image/jpeg', aspectRatio = '1:1' } = req.body;
    if (!prompt || !base64ImageData) {
      return res.status(400).json({ error: 'Prompt and base64ImageData are required' });
    }
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const cleanBase64 = base64ImageData.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: '1K',
        },
      },
    });

    let imageUrl = '';
    let textResponse = '';
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No edited image returned', text: textResponse });
    }

    res.json({ imageUrl, text: textResponse });
  } catch (error: any) {
    console.error('Edit image error:', error);
    res.status(500).json({ error: error?.message || 'Failed to edit image' });
  }
});

// ==========================================
// Vite Middleware & Static Serving
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
