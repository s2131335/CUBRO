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
const { checkCollision } = require("../utils/planner");
const { Course } = require("../database/models/courses");

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
		if (selected) {
		}
	}
	return collisions;
}

module.exports.selectCourse = async function selectCourse(req, res) {
	try {
		const { select, courses } = req.body;
		if (courses.length == 0) throw error.CourseIDNotValid;
		var toSelect = await Course.countDocuments({ _id: { $in: courses } });
		console.log(toSelect);
		if (toSelect != courses.length) {
			throw error.CourseIDNotValid;
		}
		var collision = await checkCollision(req.user, courses);
		console.log("collision:", collision);
		if (collision.length != 0) {
			return res.status(500).json(collision);
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
		res.status(err.status || 500).send(err);
	}
};

module.exports.dropCourse = async function dropCourse(req, res) {
	try {
		var { courses } = req.body;
		for (var course of courses) {
			if (!isValidObjectId(course)) throw error.CourseIDNotValid;
		}
		var toDrop = await registration
			.find({
				courseID: { $in: courses },
				studentID: req.user._id,
			})
			.distinct("_id");
		if (toDrop.length != courses.length) {
			throw error.RegistrationNotValid;
		}
		await registration.deleteMany({
			courseID: { $in: courses },
			studentID: req.user._id,
		});
		let courseList = await findAllCoursesByFilter({
			_id: { $in: courses },
		});
		await Email.sendMail(req.user.email, {
			mode: Email.MODE_DROP,
			courses: courseList,
		});
		res.status(200).send("ok");
	} catch (err) {
		console.error(err);
		res.status(err.status || 500).send(err);
	}
};
