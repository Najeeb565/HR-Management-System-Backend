const Employee = require('../Model/companyemployee');

exports.createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      department,
      salary,
      status,
      joiningDate
    } = req.body;

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      role,
      department,
      salary,
      status,
      joiningDate
    });

    await newEmployee.save();

    res.status(201).json({
      message: 'Employee added successfully!',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

