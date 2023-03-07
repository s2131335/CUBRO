const courses = [
	{
		courseCode: "csci3101",
		day: 3,
		start: "13:00",
		end: "15:01",
	},
	{
		courseCode: "csci3100",
		day: 3,
		start: "11:00",
		end: "12:00",
	},
	{
		courseCode: "csci3103",
		day: 3,
		start: "16:30",
		end: "17:00",
	},
	{
		courseCode: "csci3102",
		day: 3,
		start: "15:00",
		end: "15:30",
	},
];
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
		intervals.push({
			code: course.courseCode,
			time: course.start,
			t: "start",
		});
		intervals.push({
			code: course.courseCode,
			time: course.end,
			t: "end",
		});
		dict[course.courseCode] = course;
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

module.exports.collisionDetection = function collisionDetection(courses) {
	let allCollisions = [];
	for (let i = 0; i < 7; i++) {
		allCollisions = allCollisions.concat(
			checkOneDay(
				courses.filter((course) => {
					return course.day === i;
				})
			)
		);
	}
	return allCollisions;
};
