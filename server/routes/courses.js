const express = require("express");
const router = express.Router();
const {
    browseCourse,
    courseInfo,
    selectCourse,
} = require("../controllers/courses");
const upload = require("../middleware/upload");
const { importCourse } = require("../controllers/courses");
const { tutorial, lecture } = require("../database/models/courses");
const Auth = require("../middleware/auth");

// router.post("/add");

router.post("/import-courses", upload, importCourse);

router.get("/browse", Auth.checkAuth(), browseCourse);
router.get("/info/:id", Auth.checkAuth(), courseInfo);
router.post("/select", Auth.checkAuth(), selectCourse);

// router.get("/excel");

module.exports = router;
