const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ['Employee', 'Manager', 'Admin', 'HR'],
      default: 'Employee',
    },
    department: {
      type: String,
      required: true,
      enum: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin'],
    },
    salary: { type: Number, required: true, min: 0 },
    password: { type: String },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Terminated'],
      default: 'Active',
    },
    joiningDate: { type: Date, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    profilePicture: { type: String, trim: true },

    // 🔐 OTP fields for forgot password
    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },

    // 🎂 Birthday field added from second schema
    birthday: { type: Date },
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
