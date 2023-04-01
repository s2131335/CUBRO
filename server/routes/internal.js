var express = require("express");
var router = express.Router();
const Auth = require("../middleware/auth");

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
			profile: req.user,
		});
	}
});

/* GET user search page. */
router.get("/search", Auth.checkAuth(), function (req, res, next) {
	const course = [
		{
			courseCode: "CSCI1234",
			courseName: "Fundamental of Operating System",
			venue: "LSKLSKSLSKSKL",
			class: 1,
			day: 1,
			start: "0830",
			end: "1015",
			ts: [0, 7],
		},
		{
			courseCode: "CSCI4321",
			courseName: "Software Engineering for Hardware",
			venue: "SHAWHAWHS",
			class: 2,
			day: 3,
			start: "0930",
			end: "1015",
			ts: [5, 12],
		},
		{
			courseCode: "CSCI3100",
			courseName: "Software Engineering",
			venue: "SHAWHAWHS",
			class: 2,
			day: 3,
			start: "0930",
			end: "1015",
			ts: [5, 12],
		},
		{
			courseCode: "CSCI2500",
			courseName: "Fundamental of Algorithm",
			venue: "SHAWHAWHS",
			class: 2,
			day: 3,
			start: "0930",
			end: "1015",
			ts: [5, 12],
		},
		{
			courseCode: "CSCI4430",
			courseName: "Fundamental of Cloud Computing",
			venue: "SHAWHAWHS",
			class: 2,
			day: 3,
			start: "0930",
			end: "1015",
			ts: [5, 12],
		},
	];
	res.render("internal/search", {
		title: "Search",
		data: { course },
	});
});

/* GET user search page. */
router.get("/course/info/:id", Auth.checkAuth(), function (req, res, next) {
	res.render("internal/course_info", {
		title: "Course Info",
		courseCode: "CSCI3100",
		classNo: 1,
		courseName: "Software Engineering",
		description:
			"This course introduces software life-cycles: system modelling, requirements analysis and specifications, design techniques, implementation methodology, testings, maintenance and engineering laboratory. Analytical tools: software metrics, system performance measurement and evaluation. Management techniques: estimations, planning, project management, communication skills and documentations. Introductions to CASE tools and security.",
		instructor: "Prof. Michael Lyu",
		meetings: [
			{
				dates: ["2023-02-02"],
				_id: {
					$oid: "64099edd8f618f1d44b91dbe",
				},
				courseCode: "ABCD1234",
				day: 4,
				start: "12:00",
				end: "13:30",
			},
			{
				dates: ["2023-02-01", "2023-02-08"],
				_id: {
					$oid: "64099edd8f618f1d44b91dbf",
				},
				courseCode: "ABCD1234",
				day: 3,
				start: "11:00",
				end: "12:30",
			},
			{
				dates: ["2023-02-03"],
				_id: {
					$oid: "64099edd8f618f1d44b91dc0",
				},
				courseCode: "ABCD1234",
				day: 5,
				start: "10:50",
				end: "11:50",
			},
		],
		seat: 210,
		venue: "SHB",
	});
});

/* GET user regcourse page. */
router.get("/regcourse", Auth.checkAuth(), function (req, res, next) {
	const course = [
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: 1,
			day: 1,
			start: "0830",
			end: "1015",
			ts: [0, 7],
			displayed: false,
			checked: true,
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: 1,
			day: 1,
			start: "0830",
			end: "1015",
			ts: [5, 12],
			displayed: false,
			checked: false,
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: 1,
			day: 1,
			start: "0830",
			end: "1015",
			ts: [8, 15],
			displayed: false,
			checked: false,
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: 1,
			day: 1,
			start: "0830",
			end: "1015",
			ts: [8],
			displayed: false,
			checked: true,
		},
		{
			courseCode: "CENG1234",
			venue: "NONONONO",
			class: 1,
			day: 1,
			start: "0830",
			end: "1015",
			ts: [21, 28],
			displayed: false,
			checked: true,
		},
	];
	res.render("internal/regcourse", {
		title: "Timetable Planner",
		data: { course },
	});
});

module.exports = router;
