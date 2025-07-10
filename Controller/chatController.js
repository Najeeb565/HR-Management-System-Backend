
const ChatMessage = require("../Model/ChatMessage");

exports.getMessages = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) {
            return res.status(400).json({ message: "companyId is required" });
        }
        const messages = await ChatMessage.find({ companyId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        console.error("Error fetching chat messages:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { content, senderName, senderId, companyId, replyTo } = req.body;
        console.log("Received message data:", req.body); // Debug log

        if (!senderId || !companyId || !content) {
            return res.status(400).json({ message: "senderId, companyId, and content are required" });
        }

        const newMessage = new ChatMessage({
            content,
            senderName,
            senderId,
            companyId,
            replyTo,
            timestamp: new Date(),
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ message: "Server error" });
    }
};
