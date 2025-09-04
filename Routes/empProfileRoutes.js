const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getEmployeeProfile,
  updateEmployeeProfile
} = require('../Controller/empProfileController');

const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Employee profile routes
router.get('/:email',authenticate, authorizeRoles("companyadmin", "employee", "hr"), getEmployeeProfile);
router.put('/:email',authenticate, authorizeRoles("companyadmin", "employee", "hr"), upload.single("profilePicture"), updateEmployeeProfile);

module.exports = router;