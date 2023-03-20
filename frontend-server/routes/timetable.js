var express = require("express");
var router = express.Router();

/* GET timetable test page. */
router.get("/", function (req, res, next) {
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
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: 1,
			day: 1,
			start: "0830",
			end: "1015",
			ts: [0, 7],
			displayed: false,
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
		},
	];
	res.render("timetable/timetable", {
		title: "Timetable",
		course,
	});
});

module.exports = router;
