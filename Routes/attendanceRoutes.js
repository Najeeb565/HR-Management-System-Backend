const express = require("express");
const router = express.Router();
const {
  clockIn,
  clockOut,
  getAttendanceHistory
} = require("../Controller/attendanceController");

const auth = require("../middleware/authMiddleware");

router.post("/clock-in", auth, clockIn);
router.post("/clock-out", auth, clockOut);
router.get("/history", auth, getAttendanceHistory);

module.exports = router;
