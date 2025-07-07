
const ChatMessage = require("../Model/ChatMessage");

// GET /api/chat?companyId=...
exports.getMessages = async (req, res) => {
  try {
    const { companyId } = req.query;

    const messages = await ChatMessage.find({ companyId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/chat
exports.createMessage = async (req, res) => {
  try {
    const newMessage = new ChatMessage(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ message: "Server error" });
  }
};
