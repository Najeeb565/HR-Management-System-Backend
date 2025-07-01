const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Routes & Controllers
const authRoutes = require('./Routes/authroutes');
const superAdminRoutes = require('./routes/superAdmin');
const companyRoutes = require('./routes/companyroutes');
const employeesRouter = require("./Routes/employeeRoutes");
const adminRoutes = require('./Routes/adminroutes');
const companyController = require('./Controller/companycontroller');
const settingController = require('./Controller/settingController');
const { registerCompany } = require('./Controller/auth');
const taskRoutes = require('./Routes/taskroutes');
const leaveroutes =  require('./Routes/leaveroutes');
const attendanceRoutes = require("./Routes/attendanceRoutes");

const app = express();
const PORT = 5000;

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeesRouter);
app.use('/api/admin', adminRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveroutes);
app.use("/api/attendance", attendanceRoutes);


// Company Controller Routes
app.get('/api/companies', companyController.getCompanies);
app.get('/api/dashboard', companyController.getDashboardStats);
app.put('/api/companies/:id/status', companyController.changeCompanyStatus);
app.post('/api/companies', registerCompany);

// Settings Routes
app.get('/api/settings', settingController.getSettings);
app.put('/api/settings', settingController.updateSettings);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}; 

                                                                                                      
startServer();
