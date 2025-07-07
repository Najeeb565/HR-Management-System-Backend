const express = require('express');
const router = express.Router();

const {
  getEmployeeProfile,
  updateEmployeeProfile
} = require('../Controller/empProfileController');

const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Employee profile routes
router.get('/:email',authenticate, authorizeRoles("admin", "employee", "hr"), getEmployeeProfile);
router.put('/:email',authenticate, authorizeRoles("admin", "employee", "hr"), updateEmployeeProfile);

module.exports = router;