// Controller/auth.js
const Company = require('../Model/authschema');
const Admin = require('../Model/adminModel');

const allowedRoles = ['admin', 'employee'];

const loginUser = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !allowedRoles.includes(role)) {
    return res.status(401).json({ message: 'Invalid credentials', success: false });
  }

  return res.status(200).json({
    message: `Login successful as ${role}`,
    success: true,
  });
};

const registerCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error("Error registering company:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  loginUser,
  registerCompany,
};
