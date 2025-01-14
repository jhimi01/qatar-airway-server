const express = require("express");
const router = express.Router();

var { sendEmail } = require("../services/sendEmail");

router.post("/sendEmail", sendEmail);

module.exports = router;