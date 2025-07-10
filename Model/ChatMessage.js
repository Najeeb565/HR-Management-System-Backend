
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  content: String,
  senderName: String,
  senderRole: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true, 
  },
   senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderRole" // dynamic ref to Admin or Employee
  },
replyTo: {
  senderName: String,
  content: String
},

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
