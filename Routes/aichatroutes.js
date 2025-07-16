const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/ai", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // ✅ This one works!
        messages: [
          {
            role: "system",
            content:
              "You are a helpful HR assistant chatbot on a company dashboard. Answer clearly and politely.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("🔥 OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "OpenRouter request failed",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
