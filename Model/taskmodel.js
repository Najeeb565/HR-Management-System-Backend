const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', 
    required: true
  },
  taskTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'pending'
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", // or Admin, depending on your setup
  required: true
},
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
