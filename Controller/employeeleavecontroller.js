const Leave = require('../Model/employeeleave');

// POST /api/leaves
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

    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// GET /api/leaves
// GET /api/leaves?employeeId=6864092916530de49830bd6c
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



exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


