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


  router.post('/', createCompany);


  // ✅ Get single company detail (Admin + SuperAdmin)
  router.get('/:id',  getCompany);

  // ✅ Get only status of a company (accessible to all logged-in roles)
  router.get('/:id/status', getCompanyStatus);

  // ✅ Create new company (SuperAdmin only)
  // router.post('/',  createCompany);

  // ✅ Update full company details (SuperAdmin only)
  router.put('/:id', updateCompany);

  // ✅ Change company status (SuperAdmin only)
  router.put('/:id/status', changeCompanyStatus);

  // ✅ Set company admin (SuperAdmin only)
  router.post('/set-admin/:companyId',  setCompanyAdmin);

  module.exports = router;
