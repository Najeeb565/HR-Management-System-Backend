const express = require('express');
const router = express.Router();  
const employeeController = require('../Controller/employeeController');
const {verifyToken} = require('../middleware/authMiddleware');  

const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');


router.get("/", authenticate, authorizeRoles("admin"), employeeController.getAllEmployees);


router.post("/", authenticate, authorizeRoles("admin"), (req, res, next) => {
  console.log('POST /api/employees received!', req.body);
  employeeController.createEmployee(req, res, next);
});


router.put("/:id", authenticate, authorizeRoles("admin"), employeeController.updateEmployee);

router.delete("/:id", authenticate, authorizeRoles("admin"), employeeController.deleteEmployee);

router.get("/:id", authenticate, authorizeRoles("admin", "employee"), employeeController.getEmployeeById);

module.exports = router;
