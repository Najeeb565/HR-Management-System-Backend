const mongoose = require('mongoose');
require('./authschema');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: String,
  address: String,
  profilePic: String,

  otp: {
    type: String,
    default: null
  },
  otpExpire: {
    type: Date,
    default: null
  },

  // 👇 Add these
    birthday: { type: Date },
  hireDate: Date,
  salary: Number,

  role: {
    type: String,
    enum: ['superAdmin', 'companyAdmin'],
    required: true,
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);