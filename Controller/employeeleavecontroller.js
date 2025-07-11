const Leave = require('../Model/employeeleave');
const sendNotification = require("../utils/sendNotification");
const Admin = require("../Model/adminModel");
const Employee = require("../Model/employee");



exports.createLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, employeeId, companyId } = req.body;

    if (!leaveType || !startDate || !endDate || !reason || !employeeId || !companyId) {
      return res.status(400).json({ error: "All fields are required including companyId" });
    }

    const leave = await Leave.create({
      leaveType,
      startDate,
      endDate,
      reason,
      employeeId,
      companyId,
    });

    // 🔔 Notify Admin
    const admin = await Admin.findOne({ companyId }); // Get admin for that company
    const employee = await Employee.findById(employeeId);

    if (admin && employee) {
      await sendNotification({
        recipientId: admin._id,
        role: "admin",
        title: "New Leave Request",
        message: `${employee.firstName} requested ${leaveType} leave from ${startDate} to ${endDate}`,
        senderName: employee.firstName,
      });
    }

    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// GET /api/leaves
exports.getLeaves = async (req, res) => {
  try {
    const { employeeId, companyId } = req.query;

    const filter = {};
    if (employeeId) filter.employeeId = employeeId;
    if (companyId) filter.companyId = companyId;

    const leaves = await Leave.find(filter)
      .populate('employeeId', 'firstName email')
      .sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/leaves/:id
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updatedBy } = req.body; // updatedBy = adminId

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("employeeId", "firstName");

    // 🔔 Notify Employee
    const admin = await Admin.findById(updatedBy);
    const adminName = admin?.name || "Admin";

    await sendNotification({
      recipientId: updatedLeave.employeeId._id,
      role: "employee",
      title: "Leave Request Status Updated",
      message: `${adminName} marked your leave request as "${status}".`,
      senderName: adminName,
    });

    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
