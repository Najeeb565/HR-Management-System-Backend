const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./Routes/authroutes');
const companyController = require('./Controller/companycontroller');
const settingController = require('./Controller/settingController');
const superAdminRoutes = require('./routes/superAdmin');
const { registerCompany } = require('./Controller/auth');
const companyRoutes = require('./routes/companyroutes');
const employeesRouter = require('./Routes/employeeRoutes');
const taskRoutes = require('./Routes/taskroutes');

const app = express();
const PORT = 5000;

dotenv.config();

console.log('Loading employeesRouter:', employeesRouter);

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/superadmin', superAdminRoutes);
  app.get('/api/companies', companyController.getCompanies);
  app.get('/api/dashboard', companyController.getDashboardStats);
  app.put('/api/companies/:id/status', companyController.changeCompanyStatus);
  app.post('/api/companies', registerCompany);
  app.use('/api/companies', companyRoutes);
  app.use('/api/employees', employeesRouter);
  // app.use('/api, taskRoutes');
  app.use('/api', taskRoutes);



  // Settings routes
  app.get('/api/settings', settingController.getSettings);
  app.put('/api/settings', settingController.updateSettings);

  // Catch-all for unmatched routes
  app.use((req, res) => {
    console.log(`Unmatched route: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();