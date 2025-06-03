const asyncHandler = require('express-async-handler');
const Setting = require('../Model/settingSchema');

// Get settings
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await Setting.create({
      platformName: 'Super Admin Dashboard',
      maxCompaniesPerPage: 10,
      maxEmployeesPerCompany: 100,
      emailNotifications: true,
      maintenanceMode: false,
      globalHolidays: [
        { name: 'New Year', date: '2025-01-01' },
        { name: 'Christmas', date: '2025-12-25' }
      ],
      securitySettings: {
        passwordMinLength: 8,
        requirePasswordReset: 90,
        maxLoginAttempts: 5,
        sessionTimeout: 60
      }
    });
  }

  res.json({ success: true, data: settings });
});

// Update settings
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  
  if (!settings) {
    settings = new Setting(req.body);
  } else {
    settings.set(req.body);
  }

  await settings.save();
  res.json({ success: true, data: settings });
});

module.exports = {
  getSettings,
  updateSettings
};