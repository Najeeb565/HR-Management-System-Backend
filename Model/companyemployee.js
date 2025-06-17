const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({  
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { type: String, required: true },
  joiningDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employe', EmployeeSchema);

