// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./Routes/authroutes');
const companyController = require('./Controller/companycontroller'); 
const superAdminRoutes = require('./routes/superAdmin');
const { registerCompany } = require('./Controller/auth');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/superadmin', superAdminRoutes);
  app.get('/api/companies', companyController.getCompanies); // Existing route
  app.get('/api/dashboard', companyController.getDashboardStats); // New route for dashboard stats
  app.put('/api/companies/:id/status', companyController.changeCompanyStatus); // Add route for status updates

app.post('/api/companies',registerCompany);
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();