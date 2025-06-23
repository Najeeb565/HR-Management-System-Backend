const express = require('express');
const router = express.Router();
const { getAdminProfile, updateAdminProfile } = require('../Controller/companyadminprofile');

// No auth middleware for now
router.get('/profile/:email', getAdminProfile);
router.put('/profile/:email', updateAdminProfile);

module.exports = router;
