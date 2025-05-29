// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // MongoDB connection
const authRoutes = require('./Routes/authroutes');
const { registerCompany } = require('./Controller/auth'); // Register company route
const superadmin = require('./Routes/superadminroutes'); // Superadmin routes
const app = express();
const PORT = 5000;


dotenv.config();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();

  // Routes
  app.use('/api/auth', authRoutes);
  app.post('/api/companies', registerCompany);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
