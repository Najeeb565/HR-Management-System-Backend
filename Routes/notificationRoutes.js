const express = require("express");
const router = express.Router();
const Notification = require("../Model/notification");

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

module.exports = router;
