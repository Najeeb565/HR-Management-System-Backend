
module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    socket.on("chatMessage", async (message) => {
      io.emit("chatMessage", message); // broadcast to all users
      try {
        const ChatMessage = require("../Model/ChatMessage");
        await ChatMessage.create(message); // ✅ Save to DB with companyId
      } catch (err) {
        console.error("Error saving chat:", err);
      }
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected:", socket.id);
    });
  });
};
