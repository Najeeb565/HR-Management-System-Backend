const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getAdminProfile,
  updateAdminProfile
} = require('../Controller/companyadminprofile');

const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// ✅ Admin-only: View Profile
router.get('/profile/:email', authenticate, authorizeRoles("admin"), getAdminProfile);

// ✅ Admin-only: Update Profile
router.put('/profile/:email' , upload.single("profilePic"), authenticate, authorizeRoles("admin"), updateAdminProfile);

module.exports = router;
