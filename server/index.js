import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// ---------------------
// Configuration
// ---------------------
const app = express();
const port = process.env.PORT || 3001;

// ---------------------
// Middleware
// ---------------------
app.use(cors({
  origin: '*', // ⚠️ For testing only — restrict in production
  credentials: true
}));
app.use(express.json());

// ---------------------
// OpenAI
// ---------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------------------
// Frontend: Serve Vite build
// ---------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all for SPA routes (non-API)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ---------------------
// Health check
// ---------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

// ---------------------
// Chat endpoint
// ---------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    const messages = [
      {
        role: 'system',
        content: `
You are a professional AI assistant for CloudHubibi.
Keep answers concise, business-focused, and link to CloudHubibi’s services.
`
      },
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const botReply = response.choices[0]?.message?.content || "I'm here to help with your GTM strategy.";

    res.json({ message: botReply, success: true });

  } catch (error) {
    console.error('OpenAI error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response', success: false });
  }
});

// ---------------------
// Start server
// ---------------------
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📡 Health: http://localhost:${port}/api/health`);
});
