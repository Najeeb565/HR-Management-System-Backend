const express = require("express");
const router = express.Router();
const { createMessage, getMessages } = require("../Controller/chatController");

router.get("/", getMessages);
router.post("/", createMessage);

module.exports = router;
