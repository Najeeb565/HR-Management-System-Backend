const express = require("express");
const router = express.Router();

const { registerCompany, loginUser } = require("../Controller/auth");
const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const forgotController = require('../Controller/forgotpasswordcontroller');


// ✅ Public: Login
router.post('/login', loginUser);

// ✅ SuperAdmin Only: Register Company
router.post("/companies", authenticate, authorizeRoles("superadmin"), registerCompany);


router.post('/verify-email', forgotController.verifyEmail);
router.post('/send-otp', forgotController.sendOTP);
router.post('/verify-otp', forgotController.verifyOTP);
router.post('/reset-password', forgotController.resetPassword);

module.exports = router;
