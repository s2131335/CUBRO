const express = require("express");
const router = express.Router();
const {
	uploadOutline,
	viewOutline,
	deleteOutline,
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
	deleteEvaluation,
	exportCourse,
	importCourse,
	removeFromCart,
} = require("../../controllers/courses");
const { uploadLocal, uploadDb } = require("../../middleware/upload");
const Auth = require("../../middleware/auth");

// router.post("/add");

router.post(
	"/import-courses",
	Auth.checkAuth(Auth.ADMIN),
	uploadLocal,
	importCourse
);
router.get("/export-courses", Auth.checkAuth(Auth.ADMIN), exportCourse);

router.get("/browse", Auth.checkAuth(), browseCourse);
router.get("/info/:id", Auth.checkAuth(), courseInfo);
router.get("/edit/:id", Auth.checkAuth(), editPage);
router.post("/select", Auth.checkAuth(), selectCourse);
router.get("/drop/:id", Auth.checkAuth(), dropCourse);

router.post("/create", Auth.checkAuth(), createCourse);
router.post("/delete", Auth.checkAuth(), deleteCourse);
router.post("/update", Auth.checkAuth(), editCourse);

router.post("/addToCart", Auth.checkAuth(), addToCart);
router.post("/removeFromCart", Auth.checkAuth(), removeFromCart);
router.get("/myCourse", Auth.checkAuth(), myCourse);

router.get("/getTimetableInfo", getTimetableInfo);

router.post("/upload", Auth.checkAuth(Auth.ADMIN), uploadDb, uploadOutline);
router.get("/outline/:id", Auth.checkAuth(), viewOutline);
router.get("/delete-outline/:id", Auth.checkAuth(), deleteOutline);
// router.get("/excel");

// evaluations
router.post("/evaluation/:id", Auth.checkAuth(), addEvaluation);
router.delete("/evaluation/:id", Auth.checkAuth(), deleteEvaluation);

module.exports = router;
