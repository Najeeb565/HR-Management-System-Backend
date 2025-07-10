
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ Join company room
    socket.on("joinCompanyRoom", (companyId) => {
      socket.join(companyId);
      console.log(`User joined room: ${companyId}`);
    });

    // ✅ Handle chat message
    socket.on("chatMessage", async (message) => {
      try {
        const ChatMessage = require("../Model/ChatMessage");
        await ChatMessage.create(message);

        // ✅ Emit only to same company users
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
