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
	upsertCourse,
	createCourse,
	findAllCoursesByFilter,
	findCourseByFilter,
	deleteCoursesByFilter,
	countCourseByFilter,
	findCourseAndUpdate,
} = require("../services/courses");
const {
	upsertReg,
	findRegByFilter,
	extractRegIdByFilter,
	deleteRegByFilter,
	getCourseAvailability,
} = require("../services/registration");

const { createEval, deleteEvalByFilter } = require("../services/evaluation");
const courses = require("../database/models/courses");

module.exports.importCourse = async function importCourse(req, res) {
	try {
		let filename = req.file.originalname;
		let { size, mimetype} = req.file;
		// console.log(mimetype);
		let types = ["xlsx","xls","vnd.openxmlformats-officedocument.spreadsheetml.sheet"]; // file type
		let tmpType = mimetype.split("/")[1];
		if (size > 500000) throw error.FileSizeError;
		if (types.indexOf(tmpType) == -1) throw error.FileTypeError;
		let courses = parseExcel(filename);
		if (courses.length === 0)
			return res.status(200).send("No update needed");

		let failed = [];
		for (let course of courses) {
			try {
				await upsertCourse(course);
			} catch (err) {
				console.log(
					"🚀 ~ file: courses.js:30 ~ importCourse ~ err:",
					err
				);
				failed.push(`${course.courseCode}`);
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
		writeJSON(
			path.join(__dirname, "../courses.json"),
			global.CUBRO.CourseFile
		);
	} catch (err) {
		console.warn("❗️ ~ importCourse ~ err:", err);
		return res.status(err.status||500).send(err);
	}
	res.status(200).send("All successful");
};

module.exports.browseCourse = async function browseCourse(req, res) {
	try {
		const { keyword, limit, department, instructor } = req.query;
		let filter = {
			$or: [
				{ courseCode: { $regex: keyword, $options: "i" } },
				{ courseName: { $regex: keyword, $options: "i" } },
			],
		};
		if (department != "*") {
			filter["department"] = department;
		}
		if (instructor != "") {
			filter["instructor"] = { $regex: instructor, $options: "i" };
		}
		console.log(filter);
		let result = await findAllCoursesByFilter(filter, parseInt(limit));
		console.log(result);
		res.status(200).json(result != null ? result : {});
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
};
module.exports.manageCourse = async function manageCourse(req, res) {
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
		res.render("admin/course_management", {
			title: "Course Management",
			courses: result,
		});
		// res.status(200).json(result != null ? result : {});
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
};

module.exports.courseInfo = async function courseInfo(req, res) {
	let c;
	try {
		const cid = req.params.id;
		// if (!isValidObjectId(cid)) {
		// 	throw error.CourseIDNotValid;
		// }
		c = await findCourseByFilter({ _id: cid });
		c.availableSeat = await getCourseAvailability(cid);
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
	res.status(200).render("internal/course_info", c != null ? c : {});
	// res.status(200).send(c != null ? c : {});
};

module.exports.editPage = async function editPage(req, res) {
	let c;
	try {
		const _id = req.params.id;
		console.log(`==========${_id}=========`);
		// if (!isValidObjectId(cid)) {
		// 	throw error.CourseIDNotValid;
		// }
		c = await findCourseByFilter({ _id });
	} catch (err) {
		console.error(err);
		res.status(err.status).send(err);
	}
	if (!c) c = {};
	console.log(c);
	res.render("admin/course_edit", {
		title: "Course Edit",
		c,
	});
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
	//venue
	//meetings
	//seat
	// expect frontend give us whole course object like the one from excel
	const course = ({
		courseCode,
		courseName,
		venue,
		instructor,
		seat,
		meetings,
		description,
	} = req.body);
	console.log(course);
	course.meetings = meetings;

	try {
		createCourse(course);
		updateCourseFile(course);
	} catch (err) {
		delete global.CUBRO.CourseFile[`${course.courseCode}`];
		return res.status(err.status).send(err);
	}
	writeJSON(path.join(__dirname, "../courses.json"), global.CUBRO.CourseFile);
	res.status(200).send("ok");
};

module.exports.uploadOutline = async (req, res) => {
	let _id = req.body._id;
	let { size, mimetype, path } = req.file;
	let types = ["pdf"]; // file type
	let tmpType = mimetype.split("/")[1];
	try {
		if (size > 5000000) throw error.FileSizeError;
		if (types.indexOf(tmpType) == -1) throw error.FileTypeError;

		await findCourseAndUpdate({ _id }, { file: req.file.buffer });
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
	res.status(200).send("ok");
};

module.exports.viewOutline = async function viewOutline(req,res){
    try{
        const course = await findCourseByFilter({"_id":req.params.id});
        var tmp = course.file;
        if(tmp==null) return res.send('No course outline uploaded');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="js.pdf"');
        res.status(200).send(tmp);
    }catch(error){
        console.log(error);
        return res.status(500).send("failed");
    }
}

module.exports.deleteOutline = async (req, res) => {
	let _id = req.params.id;
	console.log("id: " + _id)
	try {
		await findCourseAndUpdate({ _id }, { file: null });
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
	res.status(200).send("ok");
};

module.exports.deleteCourse = async (req, res) => {
	const _id = req.body._id;
	try {
		let course = await findCourseByFilter({ _id });
		await deleteCoursesByFilter({ _id });
		let key = `${course.courseCode}`;

		delete global.CUBRO.CourseFile[key];
		writeJSON(
			path.join(__dirname, "../courses.json"),
			global.CUBRO.CourseFile
		);
	} catch (error) {
		console.error(error);
		res.status(error.status).send(error);
	}
	res.status(200).send("ok");
};
module.exports.editCourse = (req, res) => {
	const _id = req.body._id;
	delete req.body._id;
	try {
		findCourseAndUpdate({ _id }, req.body);
	} catch (error) {
		console.warn("❗️ ~ error:", error);

		return res.status(error.status).send(error);
	}
	res.status(200).send("ok");
};

module.exports.addToCart = async function addToCart(req, res) {
	try {
		const { course } = req.body;
		let reg = await findRegByFilter({
			courseID: course,
			studentID: req.user._id,
		});
		if (reg.length > 0) throw error.RegistrationExists;

		await upsertReg(
			{
				courseID: course,
				studentID: req.user._id,
			},
			{
				courseID: course,
				studentID: req.user._id,
				selected: false,
			}
		);

		res.status(200).json({});
	} catch (err) {
		console.error(err);
		res.status(err.status || 500).send(err);
	}
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
				return course.available === 0;
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
		res.status(200).json({ status: "success" });
	} catch (err) {
		console.error(err);
		res.status(err.status || 500).send(err);
	}
};

module.exports.dropCourse = async function dropCourse(req, res) {
	try {
		let toDrop = await extractRegIdByFilter({
			courseID: req.params.id,
			studentID: req.user._id,
		});
		if (toDrop.length == 0) {
			throw error.RegistrationNotValid;
		}
		await deleteRegByFilter({
			courseID: req.params.id,
			studentID: req.user._id,
		});
		let courseList = await findAllCoursesByFilter({
			_id: req.params.id,
		});
		await Email.sendMail(req.user.email, {
			mode: Email.MODE_DROP,
			courses: courseList,
		});
		res.status(200).json({ status: "success" });
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

module.exports.myCourse = async function myCourse(req, res) {
	let myCourse;
	try {
		myCourse = await findRegByFilter({ studentID: req.user._id });
		return res.status(200).json(myCourse);
	} catch (error) {
		console.warn("❗️ ~ myCourse ~ error:", error);
		res.status(error.status).send(error);
	}
};

module.exports.addEvaluation = async function addEvaluation(req, res) {
	try {
		const cid = req.params.id;
		const { text } = req.body;
		var filter = { userID: req.user._id, courseID: cid, text: text };
		await createEval(filter);
		res.status(200).json({ status: "success" });
	} catch (error) {
		console.log(error);
		res.status(error.status).send(error);
	}
};

module.exports.deleteEvaluation = async function deleteEvaluation(req, res) {
	try {
		var filter = { _id: req.params.id };
		console.log(`filter:`);
		console.log(filter);
		await deleteEvalByFilter(filter);
		res.status(200).json({ status: "success" });
	} catch (error) {
		console.log(error);
		res.status(error.status).send(error);
	}
};
