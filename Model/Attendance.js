const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  clockIn: String,
  clockOut: String,
  totalHours: String,
  status: {
  type: String,
  enum: ["Present", "Absent", "Late", "Half Day"],
  default: "Present"
}

}, { timestamps: true });

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
