const { Tutorial, Lecture, Course } = require("../database/models/courses");
const error = require("../utils/errors");

module.exports.upsertLesson = async function upsertLesson(lesson, type) {
	try {
		if (type === "T") {
			await Tutorial.updateOne(
				{ courseCode: lesson.courseCode },
				lesson,
				{ upsert: true }
			);
		} else
			await Lecture.updateOne({ courseCode: lesson.courseCode }, lesson, {
				upsert: true,
			});
		return null;
	} catch (err) {
		throw error.DatabaseUpdate;
	}
};

module.exports.findAllCoursesByFilter = async function (filter = {}) {
	try {
		let courses = await Course.find(filter);
		return courses;
	} catch (err) {
		console.log("🚀 ~ file: courses.js:20 ~ err:", err);
		return null;
	}
};

module.exports.findCourseByFilter = async function (fields) {
	try {
		let c = await Course.findOne(fields);
		return c;
	} catch (err) {
		console.log("🚀 ~ file: courses.js:30 ~ err:", err);
		return null;
	}
};

module.exports.findCourseAndUpdate = async function (filter, update) {
	try {
		// console.log(update);
		await Course.findOneAndUpdate(filter, update);
		return null;
	} catch (err) {
		console.log("🚀 ~ file: courses.js:41 ~ err:", err);
		throw error.DatabaseUpdate;
	}
};

module.exports.deleteCoursesByFilter = async function (filter) {
	try {
		// console.log(update);
		await Course.deleteMany(filter);
		return null;
	} catch (err) {
		console.log("🚀 ~ file: courses.js:52 ~ err:", err);
		throw error.DatabaseUpdate;
	}
};
