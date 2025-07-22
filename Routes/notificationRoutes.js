
// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Notification = require("../Model/Notification"); // Update to match exact file name

router.get("/:id", async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.params.id,
    }).sort({ createdAt: -1 });

    if (!Array.isArray(notifications)) {
      return res.status(500).json({ message: "Invalid response format" });
    }

    res.status(200).json(notifications);
  } catch (err) {
    console.error("❌ Error fetching notifications:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`DELETE request received for user: ${userId}`); // Debug log
    const result = await Notification.deleteMany({ recipientId: userId });
    console.log(`Deleted ${result.deletedCount} notifications for user: ${userId}`);
    const io = req.app.get("io");
    io.to(userId).emit("notifications_cleared", { userId });
    res.status(200).json({ message: "Notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Server error while clearing notifications" });
  }
});

module.exports = router;