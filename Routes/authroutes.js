const express = require("express");
const router = express.Router();

const { registerCompany, loginUser } = require("../Controller/auth");
const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ✅ Public: Login
router.post('/login', loginUser);

// ✅ SuperAdmin Only: Register Company
router.post("/companies", authenticate, authorizeRoles("superadmin"), registerCompany);

module.exports = router;
