var express = require("express");
var router = express.Router();
const Auth = require("../middleware/auth");
const { findCourseByFilter } = require("../services/courses");
const { departments } = require("../global_var.js");
const {
	getCourseAvailability,
} = require("../services/registration");
const {findAllEvalByFilter} = require("../services/evaluation");

const profile = {
	fullName: "CHAN TAI MAN",
	email: "12345678@link.cuhk.edu.hk",
	role: "STUDENT",
	contactNumber: "12345678",
};

/* GET user home page. */
router.get("/home", Auth.checkAuth(), function (req, res, next) {
	res.render("internal/home", { title: "CUBRO" });
});

/* GET user profile page. */
router.get("/profile", Auth.checkAuth(), function (req, res, next) {
	if (req.user.role.includes(Auth.ADMIN)) {
		res.render("admin/profile", {
			title: "Admin Profile",
			data: req.user,
		});
	} else {
		res.render("internal/profile", {
			title: "Profile",
			data: req.user,
		});
	}
});

/* GET user search page. */
router.get("/search", Auth.checkAuth(), function (req, res, next) {
	res.render("internal/search", {
		title: "Search",
		departments: departments,
	});
});

/* GET user search page. */
router.get(
	"/course/info/:id",
	Auth.checkAuth(),
	async function (req, res, next) {
		let c;
		try {
			const cid = req.params.id;
			c = await findCourseByFilter({ _id: cid });
			c.availableSeat = await getCourseAvailability(cid);
			res.status(200).render("internal/course_info", {
				title: "Course Info",
				course: c,
			});
		} catch (err) {
			console.error(err);
			res.status(err.status).send(err);
		}
	}
);

/* GET user regcourse page. */
router.get("/regcourse", Auth.checkAuth(), function (req, res, next) {
	res.render("internal/regcourse", {
		title: "Shopping Cart",
	});
});

/* GET update password page. */
router.get("/update_password", Auth.checkAuth(), function (req, res, next) {
	if (req.user.role.includes(Auth.ADMIN)) {
		res.render("admin/update_password", {
			title: "Update Password",
			data: req.user,
		});
	} else {
		res.render("internal/update_password", {
			title: "Update Password",
			profile: req.user,
		});
	}
});

/* GET user mycourse page. */
router.get("/table", Auth.checkAuth(), function (req, res, next) {
	res.render("internal/table", {
		title: "Timetable"
	});
});


router.get("/course/evaluation/:id", Auth.checkAuth(), async function (req, res, next) {
	let c;
	try {
		const cid = req.params.id;
		let c = await findCourseByFilter({ _id: cid });
		let e = await findAllEvalByFilter({courseID: cid});
		console.log(e)
		res.render("internal/course_evaluation", {
			title: "Course Evaluation",
			course: c,
			evaluations: e,
			self_id: req.user._id
		});
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
});

module.exports = router;
