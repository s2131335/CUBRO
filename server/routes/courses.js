const express = require("express");
const router = express.Router();
const {} = require("../controllers/courses");
const upload = require("../middleware/upload");
const { importCourse } = require("../controllers/courses");
const { tutorial, lecture } = require("../database/models/courses");

// router.post("/add");

router.post("/import-courses", upload, importCourse);

// router.get("/excel");

module.exports = router;
