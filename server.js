
// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const socketSetup = require('./socket');
const path = require('path');
const notificationRoutes = require("./Routes/notificationRoutes");



// Routes & Controllers
const authRoutes = require('./Routes/authroutes');
const superAdminRoutes = require('./routes/superAdmin');
const companyRoutes = require('./routes/companyroutes');
const employeesRouter = require('./Routes/employeeRoutes');
const adminRoutes = require('./Routes/adminroutes');
const companyController = require('./Controller/companycontroller');
const settingController = require('./Controller/settingController');
// const { registerCompany } = require('./Controller/auth');
const taskRoutes = require('./Routes/taskroutes');
const birthdayRoutes = require("./Routes/birthdayroutes");
const leaveroutes =  require('./Routes/leaveroutes');

const attendanceRoutes = require("./Routes/attendanceRoutes");
const empProfileRoutes = require("./Routes/empProfileRoutes");
const chatRoutes = require('./Routes/chatRoutes');


const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


dotenv.config();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

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
app.use('/api/chat', chatRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/profile", empProfileRoutes);
app.use("/api/birthdays", birthdayRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", require("./Routes/aichatroutes"));

// Company Controller Routes
app.get('/api/companies', companyController.getCompanies);
app.get('/api/dashboard', companyController.getDashboardStats);
app.put('/api/companies/:id/status', companyController.changeCompanyStatus);
app.use('/api/companies', companyRoutes); // ✅ Yeh sahi route hai!

// Settings Routes
app.get('/api/settings', settingController.getSettings);
app.put('/api/settings', settingController.updateSettings);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Socket setup
socketSetup(io);
app.set("io", io);   

// Start Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
