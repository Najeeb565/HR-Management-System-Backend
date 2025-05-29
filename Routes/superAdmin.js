const express = require("express");
const router = express.Router();
const { getAllCompanies } = require("../Controller/superAdmin");

router.get("/companies", getAllCompanies);

module.exports = router;
