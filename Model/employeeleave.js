const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  leaveType: String,
  startDate: Date,
  endDate: Date,
  reason: String,
    status: {
    type: String,
    default: 'Pending',
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true, 
  },
  companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',
  required: true
}
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
