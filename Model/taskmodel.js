const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  email: { type: String, required: true },
  taskTitle: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
