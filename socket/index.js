// socket/index.js

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ Join company room (for global chat)
    socket.on("joinCompanyRoom", (companyId) => {z
      socket.join(companyId);
      console.log(`User joined room: ${companyId}`);
    });

    // ✅ Join user-specific room (for private notifications)
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User joined personal room: ${userId}`);
    });

    // ✅ Handle chat message (global chat)
    socket.on("chatMessage", async (message) => {
      try {
        const ChatMessage = require("../Model/ChatMessage");
        await ChatMessage.create(message);

        // Emit to users in the same company
        io.to(message.companyId).emit("chatMessage", message);
        console.log("Message sent to room:", message.companyId);
      } catch (err) {
        console.error("Error saving chat:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
