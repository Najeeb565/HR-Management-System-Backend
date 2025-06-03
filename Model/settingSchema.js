const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  platformName: { type: String, required: true },
  maxCompaniesPerPage: { type: Number, required: true },
  maxEmployeesPerCompany: { type: Number, required: true },
  emailNotifications: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  globalHolidays: [{
    name: { type: String, required: true },
    date: { type: String, required: true }
  }],
  securitySettings: {
    passwordMinLength: { type: Number, required: true },
    requirePasswordReset: { type: Number, required: true },
    maxLoginAttempts: { type: Number, required: true },
    sessionTimeout: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);