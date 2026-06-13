const express = require('express');
const Groq = require('groq-sdk');
const { getText } = require('./upload');
const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    const documentText = getText();

    if (!documentText) {
      return res.status(400).json({ error: 'Please upload a PDF first' });
    }

    if (!question) {
      return res.status(400).json({ error: 'Please provide a question' });
    }

    const prompt = `You are a helpful assistant. Answer the user's question based ONLY on the document below. If the answer is not in the document, say "I could not find that in the document."

DOCUMENT:
${documentText.substring(0, 8000)}

USER QUESTION: ${question}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'AI request failed', details: error.message });
  }
});

module.exports = router;