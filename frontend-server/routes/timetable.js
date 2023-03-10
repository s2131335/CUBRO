var express = require("express");
var router = express.Router();
var course = [
	{
		courseCode: "CSCI1234",
		venue : "LSKLSKSLSKSKL",
		class : 1,
		day : 1,
		start :"1230",
		end :"1315"

		
	}
];
/* GET timetable test page. */
router.get("/", function (req, res, next) {
	res.render("timetable/timetable", { title: "Timetable" });
});

module.exports = router;
