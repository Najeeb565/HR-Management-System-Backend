const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'employee'
  },
  position: {
    type: String,
    default: 'Staff'
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  profilePic: {
    type: String,
    default: '' // Store image URL or path
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
