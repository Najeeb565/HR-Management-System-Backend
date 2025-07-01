
const express = require('express');
const router = express.Router();
const employeeController = require('../Controller/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');
const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// ✅ Get employee stats - PUT THIS ABOVE "/:id"
router.get("/stats", authenticate, authorizeRoles("admin"), employeeController.getEmployeeStats);

// ✅ Get all employees
router.get("/", authenticate, authorizeRoles("admin"), employeeController.getAllEmployees);

// ✅ Create employee
router.post("/", authenticate, authorizeRoles("admin"), (req, res, next) => {
  console.log('POST /api/employees received!', req.body);
  employeeController.createEmployee(req, res, next);
});

// ✅ Update employee
router.put("/:id", authenticate, authorizeRoles("admin"), employeeController.updateEmployee);

// ✅ Delete employee
router.delete("/:id", authenticate, authorizeRoles("admin"), employeeController.deleteEmployee);

// ✅ Get single employee by ID
router.get("/:id", authenticate, authorizeRoles("admin", "employee"), employeeController.getEmployeeById);

module.exports = router;
