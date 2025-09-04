const express = require("express");
const router = express.Router();
const employeeController = require("../Controller/employeeController");
const authenticate = require("../middleware/authMiddleware");

// ✅ Specific routes always come before generic (like "/:id")

// Get employee stats
router.get("/stats", authenticate, employeeController.getEmployeeStats);

// Get all employees
router.get("/", authenticate, employeeController.getAllEmployees);

// Create employee
router.post("/", authenticate, (req, res, next) => {
  console.log("POST /api/employees received!", req.body);
  employeeController.createEmployee(req, res, next);
});

// Update employee
router.put("/:id", authenticate, employeeController.updateEmployee);

// Delete employee
router.delete("/:id", authenticate, employeeController.deleteEmployee);

// Get single employee by ID
router.get("/:id", authenticate, employeeController.getEmployeeById);

module.exports = router;
