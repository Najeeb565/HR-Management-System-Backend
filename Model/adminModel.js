const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superAdmin', 'companyAdmin'], 
    required: true 
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);