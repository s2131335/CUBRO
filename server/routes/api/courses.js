const express = require("express");
const router = express.Router();
const {
	uploadOutline,
	editPage,
	createCourse,
	deleteCourse,
	editCourse,
	browseCourse,
	courseInfo,
	selectCourse,
	dropCourse,
	getTimetableInfo,
} = require("../../controllers/courses");
const { uploadLocal, uploadDb } = require("../../middleware/upload");
const { importCourse } = require("../../controllers/courses");
const Auth = require("../../middleware/auth");

// router.post("/add");

router.post("/import-courses", Auth.checkAuth(), uploadLocal, importCourse);

router.get("/browse", Auth.checkAuth(), browseCourse);
router.get("/info/:id", Auth.checkAuth(), courseInfo);
router.get("/edit/:id", Auth.checkAuth(), editPage);
router.post("/select", Auth.checkAuth(), selectCourse);
router.post("/drop", Auth.checkAuth(), dropCourse);

router.post("/create", Auth.checkAuth(), createCourse);
router.post("/delete", Auth.checkAuth(), deleteCourse);
router.post("/update", Auth.checkAuth(), editCourse);

router.get("/getTimetableInfo", getTimetableInfo);

router.post("/upload", Auth.checkAuth(), uploadDb, uploadOutline);
// router.get("/excel");

module.exports = router;
