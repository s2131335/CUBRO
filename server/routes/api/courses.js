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
	myCourse,
	addToCart,
	addEvaluation,
	deleteEvaluation
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
router.get("/drop/:id", Auth.checkAuth(), dropCourse);

router.post("/create", Auth.checkAuth(), createCourse);
router.post("/delete", Auth.checkAuth(), deleteCourse);
router.post("/update", Auth.checkAuth(), editCourse);

router.post("/addToCart", Auth.checkAuth(), addToCart);
router.get("/myCourse", Auth.checkAuth(), myCourse);

router.get("/getTimetableInfo", getTimetableInfo);

router.post("/upload", Auth.checkAuth(), uploadDb, uploadOutline);
// router.get("/excel");

// evaluations
router.post("/evaluation/:id", Auth.checkAuth(), addEvaluation)
router.delete("/evaluation/:id", Auth.checkAuth(), deleteEvaluation)

module.exports = router;
