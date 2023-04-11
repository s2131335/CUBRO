var express = require("express");
var router = express.Router();
const Auth = require("../middleware/auth");
const { findCourseByFilter } = require("../services/courses");
const { departments } = require("../global_var.js");
const {
	getCourseAvailability,
} = require("../services/registration");

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
		} catch (err) {
			console.error(err);
			res.status(err.status).send(err);
		}
		res.status(200).render("internal/course_info", {
			title: "Course Info",
			course: c,
		});
	}
);

/* GET user regcourse page. */
router.get("/regcourse", Auth.checkAuth(), function (req, res, next) {
	const course = [
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["001", "002", "300", "301"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["100"],
			type: "Tutorial",
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["200", "201", "400", "401"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["100"],
			type: "Tutorial",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["101", "102", "201", "202"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["302"],
			type: "Tutorial",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["001", "002", "101", "102"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["302"],
			type: "Tutorial",
		},
	];
	res.render("internal/regcourse", {
		title: "Shopping Cart",
		data: { course },
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

/* GET user mycourse page. */
router.get("/drop", function (req, res, next) {
	res.render("internal/drop", {
		title: "Drop Courses",
	});
});

module.exports = router;
