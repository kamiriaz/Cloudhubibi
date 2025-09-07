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
// Initialize OpenAI
// ---------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------------------
// Serve Vite build
// ---------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));

// ---------------------
// Health check endpoint
// ---------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ---------------------
// Chat endpoint
// ---------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = {
      role: "system",
      content: `
You are a professional AI assistant for CloudHubibi (https://www.cloudhubibi.com/), 
a leading Go-to-Market Strategy consultancy firm.

🎯 Mission:
Help potential clients understand how CloudHubibi accelerates business growth through 
strategic market entry, expansion, and GTM excellence.

✅ Services to highlight:
- Go-to-Market Strategy Development
- Market Research & Analysis
- Product Positioning & Messaging
- Sales Strategy & Process Optimization
- Digital Marketing & Lead Generation
- Business Growth Consulting
- Market Entry Planning

📌 Rules:
- Keep answers concise, strategic, and business-focused.
- Always link user challenges to CloudHubibi’s value proposition.
- Pricing: packages customized by business size, industry, GTM challenges.
- Case studies: mention 2–5x growth through GTM implementation.
- Book consultation: reply with request for company name, industry, GTM challenge.
- Redirect any off-topic questions to CloudHubibi’s services.

🎙️ Tone:
Professional, strategic, results-oriented. Highlight ROI, revenue growth, scalability, competitive advantage.
`
    };

    const messages = [
      systemPrompt,
      ...conversation,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const botReply = response.choices[0]?.message?.content || "I'm here to help with your GTM strategy.";

    res.json({ message: botReply, success: true });

  } catch (error) {
    console.error('OpenAI API error:', error?.response?.data || error.message);
    const status = error?.response?.status === 429 ? 429 : 500;
    res.status(status).json({ error: error.message || 'Failed to get AI response', success: false });
  }
});

// ---------------------
// Catch-all route for SPA (non-API)
// ---------------------
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ---------------------
// Start server
// ---------------------
app.listen(port, () => {
  console.log(`🚀 Backend + Frontend running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);
  console.log(`🔑 OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? "Yes" : "No"}`);
});
