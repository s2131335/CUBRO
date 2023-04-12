const XLSX = require("xlsx");
const path = require("path");
const hash = require("object-hash");
const fs = require("fs");
const { intToChar, charToInt, writeJSON, readJSON } = require("./utils");

// const DAYS = Object.freeze({
// 	SUNDAY: 0,
// 	MONDAY: 1,
// 	TUESDAY: 2,
// 	WEDNESDAY: 3,
// 	THURSDAY: 4,
// 	FRIDAY: 5,
// 	SATURDAY: 6,
// });

const DAYS = [
	"SUNDAY",
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
];
const HEADERS = [
	// need to match the order of the excel headers
	// need to match the fields in course schema
	"courseCode",
	"courseName",
	"department",
	"instructor",
	"seat",
	"time",
	"venue",
	"description",
];

const IGNORE_SPACE = ["instructor", "courseName", "description", "department"];

module.exports.parseTime = function parseTime() {};

module.exports.getMeeting = function getMeeting(courseCode, timeSlot) {
	let meetings = [];
	for (let t of timeSlot.split(";")) {
		slots = t.split("-");
		let day = Number(slots.shift());

		meetings.push({
			courseCode,
			day,
			timeSlot: slots,
		});
	}
	console.log(meetings);
	return meetings;
};

// return true when courseFile has updated.
module.exports.updateCourseFile = function updateCourseFile(course) {
	let hashValue = hash(course);
	let key = `${course.courseCode}`;
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
	
	let courses = [];
	try {
		let workbook = XLSX.readFile(
			path.join(__dirname, "../uploads/" + filename)
		);
		let name = workbook.SheetNames[0];
		let worksheet = workbook.Sheets[name];
		let rowNum = XLSX.utils.decode_range(worksheet["!ref"]).e.r;
		delete worksheet["!ref"];
		delete worksheet["!margins"];


		for (let i = 0; i < rowNum; i++) {
			let course = {};
			for (let j = 0; j < HEADERS.length; j++) {
				let s = `${intToChar(charToInt("A") + j)}${i + 2}`;
				let value = worksheet[s].v;
				if (
					!IGNORE_SPACE.includes(HEADERS[j]) &&
					typeof value == "string"
				)
					value = value.replaceAll(" ", "");
				course[HEADERS[j]] = value;
			}
			// Keep information about saved entries
			//If entry is already saved, skip it
			if (!exports.updateCourseFile(course)) {
				console.log("skip");
				continue;
			}
			course["meetings"] = exports.getMeeting(course.courseCode, course.time);
			delete course.time;
			courses.push(course);
		}
	} catch (e) {
		console.log(e);
		throw error.ParseExcelError;
	}

	writeJSON(path.join(__dirname, "../courses.json"), global.CUBRO.CourseFile);
	// global.CUBRO.CourseFile = CourseFile;
	fs.unlinkSync(path.join(__dirname, "../uploads/" + filename));

	return courses;
};

function getTimeSlots(meetings) {
	timeSlots = "";
	for (let m of meetings) {
		string = m.day.toString();
		for (let t of m.timeSlot) {
			string += `-${t}`;
		}
		timeSlots += `${string};`;
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
	courseCode: "ABCD1234",
	__v: 0,
	courseName: "intro to fucking",
	description: "This is fucking good class",
	instructor: "KKL",
	meetings: [
		{
			timeSlot: ["00", "02"],
			_id: {
				$oid: "641dd25d9c8944558db35428",
			},
			courseCode: "ABCD1234",
			day: 4,
		},
		{
			timeSlot: ["03", "04"],
			_id: {
				$oid: "641dd25d9c8944558db35429",
			},
			courseCode: "ABCD1234",
			day: 3,
		},
	],
	seat: 100,
	venue: "SHB",
};

// console.log(toCsv([c]));
