const express = require("express");
const router = express.Router();
const { registerCompany } = require("../Controller/auth");

router.post("/companies", registerCompany);

module.exports = router;