const XLSX = require("xlsx");
const path = require("path");
const hash = require("object-hash");
const fs = require("fs");
const { intToChar, charToInt, writeJSON, readJSON } = require("./utils");

// const DAYS = Object.freeze({
// 	SUN: 0,
// 	MON: 1,
// 	TUE: 2,
// 	WED: 3,
// 	THU: 4,
// 	FRI: 5,
// 	SAT: 6,
// });

// const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const HEADERS = [
	// need to match the order of the excel headers
	// need to match the fields in course schema
	"semester",
	"courseCode",
	"courseName",
	"department",
	"type",
	"classNum",
	"venue",
	"instructor",
	"seat",
	"dates",
	"time",
	"description",
];

const IGNORE_SPACE = ["instructor", "courseName", "description", "department"];

module.exports.parseTime = function parseTime() {};

module.exports.getMeeting = function getMeeting(courseCode, dates, timeSlot) {
	let meetings = [];
	for (let t of timeSlot.split(",")) {
		slots = t.split("-");
		let day = Number(slots.shift());

		meetings.push({
			courseCode,
			day,
			timeSlot: slots,
			dates: dates
				.split(",")
				.filter((item) => new Date(item).getDay() === day),
		});
	}
	console.log(meetings);
	return meetings;
};

// module.exports.getMeeting = function getMeeting(courseCode, dates, time) {
// 	let meetings = [];
// 	for (let t of time.split(",")) {
// 		let tmp = t.split("-");
// 		meetings.push({
// 			courseCode,
// 			day: DAYS[tmp[0]],
// 			start: tmp[1],
// 			end: tmp[2],
// 			dates: dates
// 				.split(",")
// 				.filter((item) => new Date(item).getDay() == DAYS[tmp[0]]),
// 		});
// 	}
// 	console.log(meetings);
// 	return meetings;
// };

// return true when courseFile has updated.
module.exports.updateCourseFile = function updateCourseFile(course) {
	let hashValue = hash(course);
	let key = `${course.courseCode}${course.semester}${course.type}${course.classNum}`;
	//If entry is already saved
	if (global.CUBRO.CourseFile[key] === hashValue) {
		return false;
	}
	global.CUBRO.CourseFile[key] = hashValue;
	return true;
};

module.exports.parseExcel = function parseExcel(
	filename = path.join(__dirname, "../uploads/import.xlsx")
) {
	// Keep information about saved entries
	// let CourseFile = global.CUBRO.CourseFile;
	// try {
	// 	CourseFile = readJSON(path.join(__dirname, "../courses.json"));
	// } catch (err) {
	// 	if (err.code === "ENOENT") CourseFile = {};
	// 	console.log("Create courses.json");
	// }

	let workbook = XLSX.readFile(
		path.join(__dirname, "../uploads/" + filename)
	);
	let name = workbook.SheetNames[0];
	let worksheet = workbook.Sheets[name];
	let rowNum = XLSX.utils.decode_range(worksheet["!ref"]).e.r;
	delete worksheet["!ref"];
	delete worksheet["!margins"];

	let courses = [];

	for (let i = 0; i < rowNum; i++) {
		let course = {};
		for (let j = 0; j < HEADERS.length; j++) {
			let s = `${intToChar(charToInt("A") + j)}${i + 2}`;
			let value = worksheet[s].v;
			if (!IGNORE_SPACE.includes(HEADERS[j]) && typeof value == "string")
				value = value.replaceAll(" ", "");
			course[HEADERS[j]] = value;
		}

		//If entry is already saved, skip it
		if (!exports.updateCourseFile(course)) {
			console.log("skip");
			continue;
		}

		// Key example: CSCI13100L1
		course["meetings"] = exports.getMeeting(
			course.courseCode,
			course.dates,
			course.time
		);
		delete course.time;
		delete course.dates;
		courses.push(course);
	}

	writeJSON(path.join(__dirname, "../courses.json"), global.CUBRO.CourseFile);
	// global.CUBRO.CourseFile = CourseFile;
	fs.unlinkSync(path.join(__dirname, "../uploads/" + filename));

	return courses;
};

function getAllDates(meetings) {
	let dates = [];
	for (let m of meetings) {
		dates = dates.concat(m.dates);
	}
	return dates.toString();
}

function getTimeSlots(meetings) {
	timeSlots = "";
	for (let m of meetings) {
		string = m.day.toString();
		for (let t of m.timeSlot) {
			string += `-${t}`;
		}
		timeSlots += `${string},`;
	}
	// console.log(timeSlots);
	return timeSlots;
}

function toCsv(courses) {
	const { parse } = require("json2csv");
	//courses come from db
	let data = [];

	for (let course of courses) {
		course.time = getTimeSlots(course.meetings);
		course.dates = getAllDates(course.meetings);
		course.type = course.__t;
		for (field in course) {
			if (!HEADERS.includes(field)) {
				delete course[field];
			}
		}
		data.push(course);
	}

	try {
		const result = parse(data, {
			fields: HEADERS,
			excelStrings: true,
			withBOM: true,
		});
		return result;
		// console.log(data);
	} catch (error) {}
}

//dummy data for testing purposes
const c = {
	_id: {
		$oid: "641dd25cdc5a8a14ecc37cca",
	},
	__t: "lecture",
	courseCode: "ABCD1234",
	__v: 0,
	courseName: "intro to fucking",
	classNum: "A",
	description: "This is fucking good class",
	instructor: "KKL",
	meetings: [
		{
			timeSlot: ["00", "02"],
			dates: ["2023-02-02"],
			_id: {
				$oid: "641dd25d9c8944558db35428",
			},
			courseCode: "ABCD1234",
			day: 4,
		},
		{
			timeSlot: ["03", "04"],
			dates: ["2023-02-01", "2023-02-08"],
			_id: {
				$oid: "641dd25d9c8944558db35429",
			},
			courseCode: "ABCD1234",
			day: 3,
		},
	],
	seat: 100,
	semester: 1,
	venue: "SHB",
};

// console.log(toCsv([c]));
