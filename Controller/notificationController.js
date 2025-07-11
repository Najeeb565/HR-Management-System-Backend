// controllers/notificationController.js
const Notification = require("../Model/Notification");

exports.createNotification = async (req, res) => {
  try {
    const notif = new Notification(req.body);
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifs = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
};
