const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "", 
});

// GET Chatbot page
router.get('/chat', isLoggedIn, (req, res) => {
  res.render('chat/index', { messages: [] });
});

// POST kirim pertanyaan
router.post('/chat', isLoggedIn, async (req, res) => {
  const question = req.body.question;
  const messages = [
    { role: "user", content: question }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages,
    });

    const answer = response.choices[0].message.content;

    res.render('chat/index', {
      messages: [
        { role: 'user', content: question },
        { role: 'assistant', content: answer }
      ]
    });

  } catch (error) {
    console.error("OpenAI Error:", error.message || error);
    res.render('chat/index', {
      messages: [
        { role: 'user', content: question },
        { role: 'assistant', content: 'Terjadi kesalahan saat menghubungi AI.' }
      ]
    });
  }
});

module.exports = router;
