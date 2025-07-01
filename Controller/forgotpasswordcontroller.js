const Employee = require('../Model/employee');
const Admin = require('../Model/adminModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

exports.verifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check employee first
    const employee = await Employee.findOne({ email });
    if (employee) return res.json({ success: true });

    // Check admin if not employee
    const admin = await Admin.findOne({ email });
    if (admin) return res.json({ success: true });
    // console.log(admin);

    // If neither found
    return res.status(404).json({ success: false, message: 'Email not found' });

  } catch (err) {
    console.error('verifyEmail error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Try updating in Employee
    let user = await Employee.findOneAndUpdate(
      { email },
      { otp, otpExpire },
      { new: true }
    );

    // If not found, try updating in Admin
    if (!user) {
      user = await Admin.findOneAndUpdate(
        { email },
        { otp, otpExpire },
        { new: true }
      );
    }

    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });

    // Send OTP email
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`
    });

    res.json({ success: true, message: 'OTP sent to email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let user = await Employee.findOne({ email, otp });

    if (!user) {
      user = await Admin.findOne({ email, otp });
    }

    if (!user) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (Date.now() > user.otpExpire) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};



exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let user = await Employee.findOneAndUpdate(
      { email },
      { password: hashedPassword, otp: null, otpExpire: null },
      { new: true }
    );

    if (!user) {
      user = await Admin.findOneAndUpdate(
        { email },
        { password: hashedPassword, otp: null, otpExpire: null },
        { new: true }
      );
    }

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
