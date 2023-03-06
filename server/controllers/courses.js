const { parseExcel } = require("../utils/excel");
const courseService = require("../services/courses");

module.exports.importCourse = function importCourse(req, res) {
	let filename = req.file.originalname;
	let courses = parseExcel(filename);
	if (courses.length === 0) return res.status(200).send("No update needed");

	let failed = [];
	for (let course of courses) {
		let type = course.type;
		delete course.type;
		try {
			courseService.addLesson(course, type);
		} catch (err) {
			failed.push(course.courseCode + type);
			continue;
		}
	}
	if (!(failed.length === 0)) {
		if (failed.length === course.length)
			return res.status(500).send("All failed");
		else return res.status(500).send(`failed:${failed}`);
	}
	res.status(200).send("All successful");
};
