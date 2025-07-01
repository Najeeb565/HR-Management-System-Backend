const Attendance = require("../Model/Attendance");
const moment = require("moment");

// Clock In
exports.clockIn = async (req, res) => {
  const testMode = req.body.testMode;
  const date = testMode
    ? moment().add(1, "days").format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  const employeeId = req.user.id;
  const time = moment().format("HH:mm");

  const alreadyMarked = await Attendance.findOne({ employeeId, date });
  if (alreadyMarked && alreadyMarked.clockIn) {
    return res.status(400).json({ message: "Already clocked in!" });
  }

  const attendance = await Attendance.findOneAndUpdate(
    { employeeId, date },
    { clockIn: time, status: "Present" },
    { upsert: true, new: true }
  );

  res.status(200).json({ message: "Clocked in successfully", attendance });
};

// Clock Out
exports.clockOut = async (req, res) => {
  try {
    const testMode = req.body.testMode; // ✅ receive from frontend
    const date = testMode
      ? moment().add(1, "days").format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");

    const employeeId = req.user.id;
    const time = moment().format("HH:mm");

    // 🔍 1. Find today's (or test) record
    let record = await Attendance.findOne({ employeeId, date });

    if (!record) {
      return res.status(400).json({ message: "No clock-in record found for this date." });
    }

    if (!record.clockIn) {
      return res.status(400).json({ message: "Please clock in first." });
    }

    if (record.clockOut) {
      return res.status(400).json({ message: "Already clocked out for this date." });
    }

    // ⏱ 2. Calculate total working hours
    const start = moment(record.clockIn, "HH:mm");
    const end = moment(time, "HH:mm");

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: "Invalid clock times." });
    }

    const duration = moment.utc(end.diff(start)).format("HH:mm");

    // 💾 3. Save the clock-out
    record.clockOut = time;
    record.totalHours = duration;
    await record.save();

    res.status(200).json({ message: "Clocked out successfully", record });

  } catch (err) {
    console.error("❌ Clock Out Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




// Get Attendance History
exports.getAttendanceHistory = async (req, res) => {
    const employeeId = req.user.id;
    const month = moment().format("YYYY-MM");

    const records = await Attendance.find({
        employeeId,
        date: { $regex: `^${month}` }
    }).sort({ date: -1 });

    res.status(200).json(records);
};
