var express = require("express");
var router = express.Router();

const profile = {
	fullName: "CHAN TAI MAN",
	email: "12345678@link.cuhk.edu.hk",
	role: "STUDENT",
	contactNumber: "12345678",
};

/* GET user search page. */
router.get("/course/edit/:id", function (req, res, next) {
	res.render("admin/course_edit", {
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

module.exports = router;
