const express = require('express');
const router = express.Router();
const {
  getCompany,
  createCompany,
  updateCompany,
  changeCompanyStatus,
  getCompanyStatus,
  setCompanyAdmin,
} = require('../Controller/companycontroller');

const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// ✅ Get single company detail (Admin + SuperAdmin)
router.get('/:id', authenticate, authorizeRoles("admin", "superadmin"), getCompany);

// ✅ Get only status of a company (accessible to all logged-in roles)
router.get('/:id/status', authenticate, authorizeRoles("admin", "employee", "superadmin"), getCompanyStatus);

// ✅ Create new company (SuperAdmin only)
router.post('/', authenticate, authorizeRoles("superadmin"), createCompany);

// ✅ Update full company details (SuperAdmin only)
router.put('/:id', authenticate, authorizeRoles("superadmin"), updateCompany);

// ✅ Change company status (SuperAdmin only)
router.put('/:id/status', authenticate, authorizeRoles("superadmin"), changeCompanyStatus);

// ✅ Set company admin (SuperAdmin only)
router.post('/set-admin/:companyId', authenticate, authorizeRoles("superadmin"), setCompanyAdmin);

module.exports = router;
