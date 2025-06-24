const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connectDB = require('./config/db'); 
const authRoutes = require('./Routes/authroutes');
const companyController = require('./Controller/companycontroller'); 
const settingController = require('./Controller/settingController');
const superAdminRoutes = require('./routes/superAdmin');
const { registerCompany } = require('./Controller/auth');
const companyRoutes = require('./routes/companyroutes');
const employeesRouter = require("./Routes/employeeRoutes");
const taskRoutes = require('./Routes/taskRoutes'); // Fixed casing

const app = express();
const PORT = 5000;

dotenv.config();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend origin
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.get('/api/companies', companyController.getCompanies);
app.get('/api/dashboard', companyController.getDashboardStats);
app.put('/api/companies/:id/status', companyController.changeCompanyStatus);
app.post('/api/companies', registerCompany);
app.use('/api/companies', companyRoutes); 
app.use('/api', employeesRouter);
app.use('/api', taskRoutes);

// Settings routes
app.get('/api/settings', settingController.getSettings);
app.put('/api/settings', settingController.updateSettings);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();