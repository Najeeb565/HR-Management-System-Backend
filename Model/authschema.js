const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  phone: { type: String, required: true },
  industry: { type: String, required: true },
  street: { type: String, required: true },
  street2: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
   status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected', 'blocked'], 
    default: 'pending' 
  },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }]
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
