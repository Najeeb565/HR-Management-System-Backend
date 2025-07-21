
// utils/sendNotification.js
const Notification = require("../Model/Notification");

const sendNotification = async ({ recipientId, role, title, message, senderName }, io) => {
  try {
    console.log("sendNotification called with:", { recipientId, role, title, message, senderName });
    if (!io) {
      console.error("Socket.IO instance is undefined in sendNotification");
      return;
    }

    const notification = new Notification({
      recipientId,
      role,
      title,
      message: senderName ? `${senderName}: ${message}` : message,
    });

    await notification.save();
    console.log("Notification saved:", notification);

    io.to(recipientId).emit("new_notification", {
      _id: notification._id,
      recipientId,
      role,
      title,
      message: senderName ? `${senderName}: ${message}` : message,
      createdAt: notification.createdAt,
    });
    console.log(`Notification emitted to user: ${recipientId}`);
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

module.exports = sendNotification;