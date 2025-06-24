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
const employeesRouter = require("./Routes/employeeRoutes");
const adminRoutes = require('./Routes/adminroutes');


const app = express();
const PORT = 5000;

dotenv.config();

console.log('Loading employeesRouter:', employeesRouter);

// Middleware
app.use(cors());

// ✅ Only keep one set of body parsers, with limits
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

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
  // app.use('', employeeRouter);
  app.use('/api/admin', adminRoutes);

  // Settings routes
  app.get('/api/settings', settingController.getSettings);
  app.put('/api/settings', settingController.updateSettings);





  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();