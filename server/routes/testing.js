const express = require("express");
const router = express.Router();
const { generateStudent } = require("../controllers/testing");

router.get("/gen-student/:no", generateStudent);

module.exports = router;
