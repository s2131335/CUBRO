const XLSX = require("xlsx");
const path = require("path");
const hash = require("object-hash");
const { intToChar, charToInt, writeJSON, readJSON } = require("./utils");

const DAYS = Object.freeze({
	SUN: 0,
	MON: 1,
	TUE: 2,
	WED: 3,
	THU: 4,
	FRI: 5,
	SAT: 6,
});

const HEADERS = [
	"semester",
	"courseCode",
	"courseName",
	"type",
	"class",
	"venue",
	"instructor",
	"seat",
	"dates",
	"time",
	"description",
];

const IGNORE_SPACE = ["instructor", "courseName", "description"];

function getDate(courseCode, dates, time) {
	let meetings = [];
	for (let t of time.split(",")) {
		let tmp = t.split("-");
		meetings.push({
			courseCode,
			day: DAYS[tmp[0]],
			start: tmp[1],
			end: tmp[2],
			dates: dates
				.split(",")
				.filter((item) => new Date(item).getDay() == DAYS[tmp[0]]),
		});
	}
	console.log(meetings);
	return meetings;
}

module.exports.parseExcel = function parseExcel(
	filename = path.join(__dirname, "../uploads/import.xlsx")
) {
	// Keep information about saved entries
	let CourseFile;
	try {
		CourseFile = readJSON(path.join(__dirname, "../courses.json"));
	} catch (err) {
		if (err.code === "ENOENT") CourseFile = {};
		console.log("Create courses.json");
	}

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

		let hashValue = hash(course);
		let key = `${course.courseCode}${course.semester}${course.type}${course.class}`;
		//If entry is already saved, skip it
		if (CourseFile[key] === hashValue) {
			console.log("skip");
			continue;
		}

		// Key example: CSCI13100L1
		CourseFile[key] = hashValue;
		course["meetings"] = getDate(
			course.courseCode,
			course.dates,
			course.time
		);
		delete course.time;
		delete course.dates;
		courses.push(course);
	}

	writeJSON(path.join(__dirname, "../courses.json"), CourseFile);
	return courses;
};
