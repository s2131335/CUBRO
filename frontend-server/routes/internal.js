var express = require("express");
var router = express.Router();

const profile = {
	fullName: "CHAN TAI MAN",
	email: "12345678@link.cuhk.edu.hk",
	role: "STUDENT",
	contactNumber: "12345678",
};

/* GET user home page. */
router.get("/home", function (req, res, next) {
	res.render("internal/home", { title: "CUBRO" });
});

/* GET user profile page. */
router.get("/profile", function (req, res, next) {
	res.render("internal/profile", { title: "Profile", profile });
});

/* GET user search page. */
router.get("/search", function (req, res, next) {
	res.render("internal/search", { title: "Search" });
});

/* GET user regcourse page. */
router.get("/regcourse", function (req, res, next) {
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
			checked:true,
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
			checked: false
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
			checked : false,
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
			checked : true,
		},
	];
	res.render("internal/regcourse", {
		title: "RegisterCourse",
		data: { course },
	});
});

module.exports = router;
