const express = require('express');
const router = express.Router();
const { register } = require('../Controller/superadmincontroller');

router.post('/register', register);

module.exports = router;
