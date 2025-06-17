const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  email: { type: String, required: true },
  taskTitle: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
