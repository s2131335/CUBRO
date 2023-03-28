const registration = require("../database/models/registration");
const { findAllCoursesByFilter } = require("../services/courses");

// courses = [
// 	{
// 		courseCode: "csci3101",
// 		type: "lecture",
// 		venue: "sss",
// 		timeSlots: [],
// 		classNum: "C",
// 	},
// ];

// const courses = [
// 	{
// 		courseCode: "csci3101",
// 		day: 3,
// 		timeSlots: ["02"],
// 	},
// 	{
// 		courseCode: "csci3100",
// 		day: 3,
// 		timeSlots: ["03"],
// 	},
// 	{
// 		courseCode: "csci3103",
// 		day: 3,
// 		timeSlots: ["11"],
// 	},
// 	{
// 		courseCode: "csci3104",
// 		day: 3,
// 		timeSlots: ["10", "11"],
// 	},
// ];
//// sort meeting by start time
function sortByTime(intervals) {
	intervals.sort((a, b) => {
		const A = a.time;
		const B = b.time;
		if (A < B) {
			return -1;
		}
		if (A > B) {
			return 1;
		}

		return 0;
	});
}

function dataExtract(courses) {
	let dict = {};
	let intervals = [];
	for (let course of courses) {
		for (let slot of course.timeSlots) {
			time = global.CUBRO.TIMESLOTS[Number(slot)].split("-");
			console.log("🚀 ~ file: planner.js:48 ~ dataExtract ~ time:", time);

			intervals.push({
				code: course.courseCode,
				time: time[0],
				t: "start",
			});
			intervals.push({
				code: course.courseCode,
				time: time[1],
				t: "end",
			});
			dict[course.courseCode] = course;
		}
		delete dict[course.courseCode].courseCode;
	}
	return { intervals, dict };
}

function checkOneDay(courses) {
	let { intervals, dict } = dataExtract(courses);
	console.log("🚀 ~ file: planner.js:65 ~ check ~ dict:", dict);
	sortByTime(intervals);
	console.log("🚀 ~ file: planner.js:47 ~ check ~ courses:", intervals);
	let collisions = [];
	let open;
	for (let i = 0; i < intervals.length; i++) {
		if (!open) {
			open = intervals[i];
			continue;
		}
		if (intervals[i].code !== open.code && intervals[i].t === "start") {
			collisions.push([open.code, intervals[i].code]);
			if (dict[open.code].end < dict[intervals[i].code].end)
				open = intervals[i];
		}
		if (intervals[i].code === open.code && intervals[i].t === "end") {
			open = undefined;
		}
	}
	return collisions;
}

// input: array of meetings
// output : array of clashed pairs
function collisionDetection(meetings) {
	let allCollisions = new Set();
	for (let i = 0; i < 7; i++) {
		checkOneDay(
			meetings.filter((meeting) => {
				return meeting.day === i;
			})
		).forEach((item) => allCollisions.add(item.join("+")));
	}
	console.log("allCollisions: ", allCollisions);
	resultCollisions = [];
	for (collision of allCollisions) {
		console.log("collision:", collision);
		resultCollisions.push(collision.split("+"));
	}
	return resultCollisions;
}

module.exports.checkCollision = async function checkCollision(user, courses) {
	let userCourses = await registration
		.find({ studentID: user._id, selected: true })
		.populate("courseID")
		.select("courseID -_id");
	let meetings = [];
	for (let userCourse of userCourses) {
		meetings.push(...userCourse["courseID"]["meetings"]);
	}
	for (let course of await findAllCoursesByFilter({
		_id: { $in: courses },
	})) {
		meetings.push(...course["meetings"]);
	}
	return collisionDetection(meetings);
};

module.exports.getTimetable = function (course) {
	const timetable = {
		courseCode,
		type: course.__t,
		classNum,
		venue,
	};
	let timeSlot = [];
	for (let meeting of course.meetings) {
		timeSlot = timeSlot.join(meeting.timeSlots);
	}
	timetable.timeSlots = timeSlot;
	return timetable;
};

// collisionDetection(courses);
