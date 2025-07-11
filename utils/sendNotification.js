// utils/sendNotification.js
const Notification = require("../Model/notification");

const sendNotification = async ({ recipientId, role, title, message, senderName }) => {
  try {
    const notification = new Notification({
      recipientId,
      role,
      title,
      message: senderName ? `${senderName}: ${message}` : message,
    });

    await notification.save();
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

module.exports = sendNotification;
