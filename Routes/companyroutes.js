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

// ✅ Get single company detail
router.get('/:id', getCompany);

// ✅ Get only status of a company (React mein use ho raha hai)
router.get('/:id/status', getCompanyStatus);

// ✅ Create new company
router.post('/', createCompany);

// ✅ Update full company details
router.put('/:id', updateCompany);

// ✅ Change company status (approved, pending, etc.)
router.put('/:id/status', changeCompanyStatus);

// ✅ Set company admin

router.post('/set-admin/:companyId', setCompanyAdmin);

module.exports = router;
