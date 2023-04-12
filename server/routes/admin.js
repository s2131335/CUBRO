var express = require("express");
var router = express.Router();
const Auth = require("../middleware/auth");
const { manageCourse } = require("../controllers/courses");
const { showAllUsers } = require("../controllers/users");
const { findCourseByFilter } = require("../services/courses");
const {findAllEvalByFilter} = require("../services/evaluation");
const { findUserByFilter } = require("../services/users");
/* GET admin home page */
router.get("/home", Auth.checkAuth(Auth.ADMIN), function (req, res, next) {
	res.render("admin/home", {
		title: "Home",
	});
});
/* GET admin user_edit page */
router.get("/users", Auth.checkAuth(Auth.ADMIN), showAllUsers);

router.get("/add_user", Auth.checkAuth(Auth.ADMIN), function (req, res, next) {
	res.render("admin/add_user", {
		title: "New User",
	});
});

/* GET admin course management page. */
router.get("/courses", Auth.checkAuth(Auth.ADMIN), manageCourse);

router.get("/add_course",Auth.checkAuth(Auth.ADMIN),function (req, res, next) {
	console.log(global.CUBRO);
	res.render("admin/add_course", {
		title: "New Course",
		department: global.CUBRO.DEPARTMENT
	});
});

router.get("/course/evaluation/:id", Auth.checkAuth(Auth.ADMIN), async function (req, res, next) {
	try {
		const cid = req.params.id;
		let c = await findCourseByFilter({ _id: cid });
		let e = await findAllEvalByFilter({courseID: cid});
		res.render("admin/course_evaluation", {
			title: "Course Evaluation",
			course: c,
			evaluations: e
		});
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
});

router.get("/reset-password/:id", Auth.checkAuth(Auth.ADMIN), async (req, res)=>{
	try{
		let user = await findUserByFilter({_id: req.params.id});
		res.render("admin/reset_password", {title: "User Reset Password", user})
	}catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
})
module.exports = router;
