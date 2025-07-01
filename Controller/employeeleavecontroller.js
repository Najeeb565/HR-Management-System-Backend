const Leave = require('../Model/employeeleave');

// POST /api/leaves
exports.createLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, employeeId } = req.body;

    // Create leave with employee ID
    const leave = await Leave.create({
      leaveType,
      startDate,
      endDate,
      reason,
      employeeId,
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
    const { employeeId } = req.query; // frontend se ID receive karo

    const filter = employeeId ? { employeeId } : {}; // agar ID hai to filter laga do

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


