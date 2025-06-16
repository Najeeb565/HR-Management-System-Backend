// Controller/auth.js
const Company = require('../Model/authschema');
const Admin = require('../Model/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Employee = require('../Model/employee');

const allowedRoles = ['admin', 'employee'];


const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid credentials', success: false });
  }

  try {
    let user;

    if (role === 'admin') {
      user = await Admin.findOne({ email }).populate('companyId'); // ✅ get company data
      // console.log("Populated company:", user.companyId);
    } else if (role === 'employee') {
      user = await Employee.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password', success: false });
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, "secretKey", { expiresIn: "1d" });

    res.status(200).json({
      message: `Login successful as ${role}`,
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyId?.companyName  || "", 
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error', success: false });
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
