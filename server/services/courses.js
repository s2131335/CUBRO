const { Course } = require("../database/models/courses");
const error = require("../utils/errors");

module.exports.countCourseByFilter = async function (filter) {
	return await Course.countDocuments(filter);
};

module.exports.upsertLesson = async function upsertLesson(lesson) {
	try {
		await Course.updateOne({ courseCode: lesson.courseCode }, lesson, {
			upsert: true,
		});
		return null;
	} catch (err) {
		console.log("🚀 ~ file: courses.js:20 ~ upsertLesson ~ err:", err);

		throw error.DatabaseUpdate;
	}
};

module.exports.findAllCoursesByFilter = async function (
	filter = {},
	limit = 10
) {
	try {
		let courses = await Course.find(filter).limit(limit);
		return courses;
	} catch (err) {
		console.log("🚀 ~ file: courses.js:20 ~ err:", err);
		return null;
	}
};

module.exports.findCourseByFilter = async function (fields) {
	try {
		console.log(fields);
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
