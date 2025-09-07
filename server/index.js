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
// Frontend: Serve Vite build
// ---------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all for non-API routes (React SPA routing)
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

// ---------------------
// Health check endpoint
// ---------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ---------------------
// System Prompt
// ---------------------
const systemPrompt = {
  role: "system",
  content: `
You are a professional AI assistant for **CloudHubibi** (https://www.cloudhubibi.com/), 
a leading Go-to-Market Strategy consultancy firm. 

🎯 Mission:
Help potential clients understand how CloudHubibi accelerates business growth through 
strategic market entry, expansion, and GTM excellence. Always connect answers back to 
CloudHubibi’s expertise and services.

✅ Services to highlight:
- Go-to-Market Strategy Development
- Market Research & Analysis
- Product Positioning & Messaging
- Sales Strategy & Process Optimization
- Digital Marketing & Lead Generation
- Business Growth Consulting
- Market Entry Planning for new regions/segments

📌 Rules:
- Keep answers concise, strategic, and business-focused.
- Always link user challenges to CloudHubibi’s value proposition.
- If asked about **pricing**: explain that packages are customized by business size, 
  industry, and GTM challenges. Invite them to schedule a discovery call.
- If asked about **case studies**: mention CloudHubibi has helped companies achieve 
  2–5x growth through GTM implementation.
- If asked to **book a consultation**: reply with 
  "I'd be happy to connect you with our team. Could you please share your company 
  name, industry, and main GTM challenge you're facing?"
- If the user asks about something outside business/GTM: politely redirect back to 
  CloudHubibi’s services and value.

🎙️ Tone:
- Professional, strategic, and results-oriented.
- Speak like a senior business consultant who understands market dynamics.
- Highlight ROI, revenue growth, scalability, and competitive advantage.
`
};

// ---------------------
// Chat endpoint
// ---------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Maintain conversation history
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

    const botReply = response.choices[0]?.message?.content || 
      "I'm here to help with your GTM strategy.";

    res.json({ 
      message: botReply,
      success: true
    });

  } catch (error) {
    console.error('OpenAI API error:', error?.response?.data || error.message);

    if (error?.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit reached. Please wait and try again.',
        success: false
      });
    }

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
