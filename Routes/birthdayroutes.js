// routes/birthdayRoutes.js
const express = require("express");
const router = express.Router();
const { getUpcomingBirthdays } = require("../Controller/birthdaycontroller");

router.get("/upcoming", getUpcomingBirthdays);

module.exports = router;
