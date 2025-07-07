const Employee = require('../Model/employee');


const getEmployeeProfile = async (req, res) => {
  try {
    console.log('Fetching profile for email:', req.params.email);
    const employee = await Employee.findOne({ email: req.params.email });

    if (!employee) {
      console.log('No employee found with email:', req.params.email);
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Error in getEmployeeProfile:', err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};


const updateEmployeeProfile = async (req, res) => {
  try {
    const updated = await Employee.findOneAndUpdate(
      { email: req.params.email },
      { ...req.body },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Employee not found' });

    const { password, otp, otpExpire, ...safeUser } = updated.toObject(); // ✅ remove sensitive fields
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};


module.exports = { getEmployeeProfile, updateEmployeeProfile };