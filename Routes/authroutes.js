const express = require("express");
const router = express.Router();
const { registerCompany } = require("../Controller/auth");
const { loginUser } = require('../Controller/auth');

router.post('/login', loginUser);

router.post("/companies", registerCompany);

module.exports = router;