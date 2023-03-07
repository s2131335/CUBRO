var express = require("express");
var router = express.Router();

/* GET timetable test page. */
router.get("/", function (req, res, next) {
	res.render("timetable/timetable", { title: "Timetable" });
});

module.exports = router;
