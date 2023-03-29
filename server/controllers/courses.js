const path = require("path");
const error = require("../utils/errors");
const { writeJSON } = require("../utils/utils");
const { checkCollision, getTimetable } = require("../utils/planner");
const Email = require("../utils/sendMail");
const {
	parseExcel,
	getMeeting,
	updateCourseFile,
} = require("../utils/courseIO");

const {
	upsertLesson,
	findAllCoursesByFilter,
	findCourseByFilter,
	deleteCoursesByFilter,
	countCourseByFilter,
} = require("../services/courses");
const {
	upsertReg,
	findRegByFilter,
	extractRegIdByFilter,
	deleteRegByFilter,
	getCourseAvailability,
} = require("../services/registration");

module.exports.importCourse = async function importCourse(req, res) {
	let filename = req.file.originalname;
	let courses = parseExcel(filename);
	if (courses.length === 0) return res.status(200).send("No update needed");

	let failed = [];
	for (let course of courses) {
		let type = course.type;
		try {
			await upsertLesson(course);
		} catch (err) {
			console.log("🚀 ~ file: courses.js:30 ~ importCourse ~ err:", err);
			failed.push(
				`${course.courseCode}${course.semester}${course.type}${course.classNum}`
			);
			continue;
		}
	}
	if (!(failed.length === 0)) {
		for (let key of failed) {
			delete global.CUBRO.CourseFile[key];
		}
		writeJSON(
			path.join(__dirname, "../courses.json"),
			global.CUBRO.CourseFile
		);

		if (failed.length === courses.length)
			return res.status(500).send("All failed");
		else return res.status(500).send(`failed:${failed}`);
	}
	writeJSON(path.join(__dirname, "../courses.json"), global.CUBRO.CourseFile);
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

// async function checkCourseCollision(user, courses, selected) {
// 	var collisions = [];
// 	for (let c of courses) {
// 		if (!isValidObjectId(c)) collisions.push(c);
// 		else {
// 			var findCourse = await findCourseByFilter({ _id: c });
// 			if (!findCourse) collisions.push(c);
// 		}
// 		if (selected) {
// 		}
// 	}
// 	return collisions;
// }

module.exports.createCourse = (req, res) => {
	// courseCode
	//courseName
	//semester
	//venue
	//class
	//meetings
	//seat
	// expect frontend give us whole course object like the one from excel
	const course = ({
		semester,
		courseCode,
		courseName,
		type,
		classNum,
		venue,
		instructor,
		seat,
		dates,
		time,
		description,
	} = req.body);
	console.log(course);
	course.meeting = getMeeting(course.courseCode, course.dates, course.time);
	delete course.dates;
	delete course.time;

	try {
		if (updateCourseFile(course)) {
			upsertLesson(course);
		}
	} catch (err) {
		delete global.CUBRO.CourseFile[
			`${course.courseCode}${course.semester}${course.type}${course.class}`
		];
		return res.status(err.status).send(err);
	}
	writeJSON(path.join(__dirname, "../courses.json"), global.CUBRO.CourseFile);
	res.status(200).send("ok");
};
module.exports.deleteCourse = (req, res) => {
	const _id = req.body._id;
	try {
		deleteCoursesByFilter({ _id });
	} catch (error) {
		res.status(error.status).send(error);
	}
	res.status(200).send("ok");
};
module.exports.editCourse = (req, res) => {
	const {
		_id,
		semester,
		courseCode,
		courseName,
		type,
		classNum,
		venue,
		instructor,
		seat,
		dates,
		time,
		description,
	} = req.body;

	let meeting;
	if (time && dates) {
		meeting = getMeeting(courseCode, dates, time);
	}
	try {
		findCourseAndUpdate(
			{ _id },
			{
				semester,
				courseName,
				type,
				classNum,
				venue,
				instructor,
				seat,
				dates,
				description,
				meeting,
			}
		);
	} catch (error) {
		return res.status(error.status).send(error);
	}
	res.status(200).send("ok");
};

module.exports.selectCourse = async function selectCourse(req, res) {
	try {
		const { select, courses } = req.body;
		if (courses.length == 0) throw error.CourseIDNotValid;
		let toSelect = await countCourseByFilter({ _id: { $in: courses } });
		console.log(toSelect);
		if (toSelect != courses.length) {
			throw error.CourseIDNotValid;
		}

		let fullList = courses
			.map((course) => {
				return getCourseAvailability(course);
			})
			.filter((course) => {
				return course.isFull;
			});

		let collision = await checkCollision(req.user, courses);
		console.log("collision:", collision);
		if (collision.length != 0 || fullList.length != 0) {
			return res.status(500).json({ collision, full: fullList });
		}

		for (let course of courses) {
			await upsertReg(
				{
					courseID: course,
					studentID: req.user._id,
				},
				{
					courseID: course,
					studentID: req.user._id,
					selected: select,
				}
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
		let { courses } = req.body;
		for (let course of courses) {
			if (!isValidObjectId(course)) throw error.CourseIDNotValid;
		}
		let toDrop = await extractRegIdByFilter({
			courseID: { $in: courses },
			studentID: req.user._id,
		});
		if (toDrop.length != courses.length) {
			throw error.RegistrationNotValid;
		}
		await deleteRegByFilter({
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

module.exports.getTimetableInfo = async function (req, res) {
	const studentID = req.user._id;
	try {
		const selectedCourses = await findRegByFilter({ studentID });
		const courseIds = [];
		for (course of selectedCourses) {
			if (course.selected) {
				courseIds.push(course._id);
			}
		}
		const courses = await findAllCoursesByFilter({
			_id: { $in: courseIds },
		});
		const timetableInfo = [];
		for (let course of courses) {
			timetableInfo.push(getTimetable(course));
		}
		console.log(timetableInfo);
	} catch (err) {
		return res.status(err.status).send(err);
	}
	res.status(200).send(timetableInfo);
};
