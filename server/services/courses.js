const { tutorial, lecture } = require("../database/models/courses");
const error = require("../utils/errors");

module.exports.addLesson = async function addLesson(lesson, type) {
	try {
		if (type === "T") {
			await tutorial.create(lesson);
		} else await lecture.create(lesson);
		return null;
	} catch (err) {
		throw error.DatabaseUpdate;
	}
};
