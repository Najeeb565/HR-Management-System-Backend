const Employee = require('../Model/employee');


const getEmployeeProfile = async (req, res) => {
  try {
    // console.log('Fetching profile for email:', req.params.email);
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
    const updateData = { ...req.body };

    // ✅ Ensure correct types:
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }

    // ✅ Optional: ensure number or date types
    if (updateData.salary) updateData.salary = Number(updateData.salary);
    if (updateData.joiningDate) updateData.joiningDate = new Date(updateData.joiningDate);
    if (updateData.dateOfBirth) updateData.dateOfBirth = new Date(updateData.dateOfBirth);

    const updated = await Employee.findOneAndUpdate(
      { email: req.params.email },
      updateData,
      { new: true, runValidators: true } 
    );


    if (!updated) return res.status(404).json({ message: 'Employee not found' });

    const { password, otp, otpExpire, ...safeUser } = updated.toObject();
    res.json(safeUser);
  } catch (err) {
    console.error("Error updating employee profile:", err);
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};



module.exports = { getEmployeeProfile, updateEmployeeProfile };