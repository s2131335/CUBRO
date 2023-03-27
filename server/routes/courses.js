const express = require("express");
const router = express.Router();
const {
	createCourse,
	deleteCourse,
	editCourse,
	browseCourse,
	courseInfo,
	selectCourse,
	dropCourse,
} = require("../controllers/courses");
const upload = require("../middleware/upload");
const { importCourse } = require("../controllers/courses");
const Auth = require("../middleware/auth");

// router.post("/add");

router.post("/import-courses", upload, importCourse);

router.get("/browse", Auth.checkAuth(), browseCourse);
router.get("/info/:id", Auth.checkAuth(), courseInfo);
router.post("/select", Auth.checkAuth(), selectCourse);
router.post("/drop", Auth.checkAuth(), dropCourse);

router.post("/create", createCourse);
router.post("/delete", deleteCourse);
router.post("/update", Auth.checkAuth(), editCourse);
// router.get("/excel");

module.exports = router;
