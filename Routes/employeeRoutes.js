
const express = require('express');
const router = express.Router();  
const employeeController = require('../Controller/employeeController');
const {verifyToken} = require('../middleware/authMiddleware');  

// Check if controller is loading properly
console.log('employeeController loaded?', employeeController);

// ✅ GET all employees
router.get("/", verifyToken, employeeController.getAllEmployees);

// ✅ GET single employee by ID (for editing)
router.get("/:id",  verifyToken,  employeeController.getEmployeeById);

// ✅ CREATE a new employee
router.post("/",  verifyToken,  (req, res, next) => {
  console.log('POST /api/employees received!', req.body);
  employeeController.createEmployee(req, res, next);
});

// ✅ UPDATE an employee by ID
router.put("/:id",  verifyToken,  employeeController.updateEmployee);

// ✅ DELETE an employee by ID
router.delete("/:id",  verifyToken,  employeeController.deleteEmployee);

module.exports = router;
