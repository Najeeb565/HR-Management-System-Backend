
const mongoose = require('mongoose');
require('dotenv').config();  

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://najeeb4aug24webbpt:NajeeB%40565982@cluster0.qdbit.mongodb.net/Company', {
    
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
