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
router.get('/:email',authenticate,  getEmployeeProfile);
router.put('/:email',authenticate,  upload.single("profilePicture"), updateEmployeeProfile);

module.exports = router;