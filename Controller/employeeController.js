
const Employee = require('../Model/employee');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// ✅ Get all employees// controllers/employeeController.js
exports.getAllEmployees = async (req, res) => {
  try {
    const { companyId } = req.query; // ✅ get from query string

    if (!companyId) {
      return res.status(400).json({ message: 'companyId is required in query!' });
    }

    const employees = await Employee.find({ companyId }); // ✅ filtered

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees>', error);
    res.status(500).json({ message: 'Server Error!', error: error.message });
  }
};

// ✅ Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found!' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee>', error);
    res.status(500).json({ message: 'Server Error!', error: error.message });
  }
};

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};


exports.createEmployee = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, role,
      department, salary, status, joiningDate
    } = req.body;

    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(400).json({ message: 'Unauthorized: Missing company ID from token' });
    }




    const employeeId = 'EMP' + Date.now();
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      role,
      department,
      salary,
      status,
      joiningDate,
      companyId,
      employeeId,
      password: hashedPassword,
    });

    await newEmployee.save();
    console.log('password------,', password);

    const subject = 'Your Account Password';
    const text = `Dear ${firstName},\n\nYour account has been created.\nYour login password is: ${password}\n\nPlease login and change your password.\n\nRegards,\nHR Team`;

    await sendEmail(email, subject, text);

    res.status(201).json({
      message: 'Employee created & password sent via email!',
      employee: newEmployee,

    });

  } catch (error) {
    console.error('Error creating employee>', error);
    res.status(500).json({ message: 'Server Error!', error: error.message });
  }
};






// ✅ Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updateData = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found!' });
    }

    res.status(200).json({ message: 'Employee updated successfully!', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee>', error);
    res.status(500).json({ message: 'Server Error!', error: error.message });
  }
};

// ✅ Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    await Employee.findByIdAndDelete(employeeId);
    res.status(200).json({ message: 'Employee deleted successfully!' });
  } catch (error) {
    console.error('Error deleting employee>', error);
    res.status(500).json({ message: 'Server Error!', error: error.message });
  }
};


exports.getEmployeeStats = async (req, res) => {
  const companyId = req.query.companyId;

  if (!companyId) {
    return res.status(400).json({ success: false, message: 'Company ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({ success: false, message: 'Invalid Company ID format' });
  }

  try {
    const totalEmployees = await Employee.countDocuments({ companyId });
    const activeEmployees = await Employee.countDocuments({ companyId, status: 'Active' });
    const inactiveEmployees = await Employee.countDocuments({ companyId, status: 'Inactive' });

    const departments = await Employee.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId)  // ✅ safe conversion
        }
      },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departments
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};