const { parseExcel } = require("../utils/excel");
const error = require("../utils/errors");
const { isValidObjectId } = require("mongoose");
const registration = require("../database/models/registration");
const Email = require("../utils/sendMail");
const {
	upsertLesson,
	findAllCoursesByFilter,
	findCourseByFilter,
} = require("../services/courses");

module.exports.importCourse = async function importCourse(req, res) {
	let filename = req.file.originalname;
	let courses = parseExcel(filename);
	if (courses.length === 0) return res.status(200).send("No update needed");

	let failed = [];
	for (let course of courses) {
		let type = course.type;
		delete course.type;
		try {
			await upsertLesson(course, type);
		} catch (err) {
			failed.push(course.courseCode + type);
			continue;
		}
	}
	if (!(failed.length === 0)) {
		if (failed.length === courses.length)
			return res.status(500).send("All failed");
		else return res.status(500).send(`failed:${failed}`);
	}
	res.status(200).send("All successful");
};

module.exports.browseCourse = async function browseCourse(req, res) {
	try {
		const { courseCode, courseName } = req.query;
		let filter = {};
		if (courseCode) {
			filter["courseCode"] = { $regex: ".*" + courseCode + ".*" };
		}
		if (courseName) {
			filter["courseName"] = { $regex: ".*" + courseName + ".*" };
		}
		console.log(filter);
		let result = await findAllCoursesByFilter(filter);
		res.status(200).json(result != null ? result : {});
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
};

module.exports.courseInfo = async function courseInfo(req, res) {
	try {
		const cid = req.params.id;
		if (!isValidObjectId(cid)) {
			throw error.CourseIDNotValid;
		}
		const c = await findCourseByFilter({ _id: cid });
		res.status(200).json(c != null ? c : {});
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
};

// TODO
async function checkCourseCollision(user, courses, selected) {
	var collisions = [];
	for (let c of courses) {
		if (!isValidObjectId(c)) collisions.push(c);
		else {
			var findCourse = await findCourseByFilter({ _id: c });
			if (!findCourse) collisions.push(c);
		}
	}
	return collisions;
}

module.exports.selectCourse = async function selectCourse(req, res) {
	try {
		const { select, courses } = req.body;
		if (courses.length == 0) throw error.CourseIDNotValid;
		if (select) {
			var courseCollision = checkCourseCollision(
				req.user,
				courses,
				select
			);
			if (courseCollision.length != 0) {
				return res.status(500).json(courseCollision);
			}
		}

		for (let course of courses) {
			await registration.replaceOne(
				{
					courseID: course,
					studentID: req.user.id,
				},
				{
					courseID: course,
					studentID: req.user.id,
					selected: select,
				},
				{ upsert: true }
			);
		}
		// send email to student if it is a course registration
		if (select == "true") {
			let courseList = await findAllCoursesByFilter({
				_id: { $in: courses },
			});
			await Email.sendMail(req.user.email, {
				mode: Email.MODE_SELECT,
				courses: courseList,
			});
		}
		res.status(200).send("ok");
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
};
