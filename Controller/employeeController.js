
const Employee = require('../Model/employee');
const sendEmail = require('../utils/sendEmail');

// ✅ Get all employees
// exports.getAllEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.status(200).json(employees);
//   } catch (error) {
//     console.error('Error fetching employees>', error);
//     res.status(500).json({ message:'Server Error!', error: error.message });
//   }
// };


exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ companyId: req.user.companyId });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees>', error);
    res.status(500).json({ message:'Server Error!', error: error.message });
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
 
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let password = '';

  // Add 4 random letters
  for (let i = 0; i < 4; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Add 4 random numbers
  for (let i = 0; i < 4; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Shuffle the characters (mix letters & numbers)
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};


exports.createEmployee = async (req, res) => {
  try {
    // const {
    //   firstName, lastName, email, phone, role,
    //   department, salary, status, joiningDate, companyId
    // } = req.body;
    

    // if (!companyId) {
    //   return res.status(400).json({ message: 'CompanyId is required!' });
    // }

    const {
  firstName, lastName, email, phone, role,
  department, salary, status, joiningDate
} = req.body;

const companyId = req.user.companyId;

if (!companyId) {
  return res.status(400).json({ message: 'Unauthorized: Missing company ID from token' });
}




    const employeeId = 'EMP' + Date.now();
    const password = generateRandomPassword(); // 👈 New password

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
      password, // 👈 Save to DB
    });

    await newEmployee.save();

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
