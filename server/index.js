import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// ---------------------
// Config
// ---------------------
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: '*', // ⚠️ For production, restrict to your frontend URL
  credentials: true
}));
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------------------
// Serve frontend
// ---------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all to support React router
app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

// ---------------------
// Health check
// ---------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ---------------------
// Chat endpoint
// ---------------------
const systemPrompt = {
  role: "system",
  content: `
You are a professional AI assistant for CloudHubibi (https://www.cloudhubibi.com/).

🎯 Mission:
Help potential clients understand CloudHubibi's GTM services, strategic market entry, and business growth.

✅ Services:
- GTM Strategy Development
- Market Research & Analysis
- Product Positioning & Messaging
- Sales Strategy & Process Optimization
- Digital Marketing & Lead Generation
- Business Growth Consulting
- Market Entry Planning

📌 Rules:
- Keep answers concise, business-focused, strategic.
- Pricing: customized packages, suggest a discovery call.
- Case studies: mention 2–5x growth.
- Booking consultation: ask company name, industry, GTM challenge.
- Non-business questions: redirect politely.

🎙️ Tone:
- Professional, strategic, results-oriented.
- Highlight ROI, scalability, revenue growth.
`
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const messages = [systemPrompt, ...conversation, { role: "user", content: message }];

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
    res.status(500).json({
      error: 'Failed to get AI response. Please try again.',
      success: false
    });
  }
});

// ---------------------
// Start server
// ---------------------
app.listen(port, () => {
  console.log(`🚀 Backend + Frontend running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);
  console.log(`🔑 OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? "Yes" : "No"}`);
});
