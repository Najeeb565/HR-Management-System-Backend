// Controller/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Company = require('../Model/authschema');
const Employee = require('../Model/employee');
const Admin = require('../Model/adminModel');

const allowedRoles = ['admin', 'employee', ];

// ✅ Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role.toLowerCase(),
      companyId: user.companyId?._id || user.companyId
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// ✅ Controller: Login
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  // ✅ Basic Validation
  if (!email || !password || !allowedRoles.includes(role?.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Invalid login data' });
  }

  try {
    const normalizedRole = role.toLowerCase();
    let user;

    // ✅ Role-Based Login Logic
    if (normalizedRole === 'admin') {
      user = await Admin.findOne({ email }).populate('companyId');
    } else if (normalizedRole === 'employee') {
      user = await Employee.findOne({ email }).populate('companyId');
    }

    // ✅ Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ Password Match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // ✅ Generate Token
    const token = generateToken(user);

    // ✅ Send Response
    return res.status(200).json({
      success: true,
      message: `Login successful as ${normalizedRole}`,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.firstName || user.name,
        role: normalizedRole,
        companyId: user.companyId?._id || user.companyId,
        companyName: user.companyId?.companyName || "",
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
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
