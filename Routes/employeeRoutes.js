const express = require('express');
const router = express.Router();
const { createEmployee } = require('../Controller/employeeController');

router.post('/employees', createEmployee);

module.exports = router;
