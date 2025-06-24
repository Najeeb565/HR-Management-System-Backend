const express = require('express');
const router = express.Router();
const employeeController = require('../Controller/employeeController');

// Check if controller is loading properly
console.log('employeeController loaded?', employeeController);

// ✅ Static or special routes should be defined first (like stats)
// router.get("/stats", employeeController.getStats); // 👈 example

// ✅ GET all employees
router.get("/", employeeController.getAllEmployees);

// ✅ CREATE a new employee
router.post("/", (req, res, next) => {
  console.log('POST /api/employees received!', req.body);
  employeeController.createEmployee(req, res, next);
});

// ✅ UPDATE an employee by ID
router.put("/:id", employeeController.updateEmployee);

// ✅ DELETE an employee by ID
router.delete("/:id", employeeController.deleteEmployee);

// ✅ GET single employee by ID (for editing) — this must come LAST
router.get("/:id", employeeController.getEmployeeById); // 👈 move this to the end

module.exports = router;