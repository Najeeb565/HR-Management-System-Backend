// server/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://najeeb4aug24webbpt:NajeeB%40565982@cluster0.qdbit.mongodb.net/Company', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
