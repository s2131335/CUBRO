var express = require("express");
var router = express.Router();
const Auth = require("../middleware/auth");
const { findCourseByFilter } = require("../services/courses");
const { departments } = require("../global_var.js");

const profile = {
	fullName: "CHAN TAI MAN",
	email: "12345678@link.cuhk.edu.hk",
	role: "STUDENT",
	contactNumber: "12345678",
};

/* GET user home page. */
router.get("/home", Auth.checkAuth(), function (req, res, next) {
	res.render("internal/home", { title: "CUBRO" });
});

/* GET user profile page. */
router.get("/profile", Auth.checkAuth(), function (req, res, next) {
	if (req.user.role.includes(Auth.ADMIN)) {
		res.render("admin/profile", {
			title: "Admin Profile",
			data: req.user,
		});
	} else {
		res.render("internal/profile", {
			title: "Profile",
			data: req.user,
		});
	}
});

/* GET user search page. */
router.get("/search", Auth.checkAuth(), function (req, res, next) {
	res.render("internal/search", {
		title: "Search",
		departments: departments,
	});
});

/* GET user search page. */
router.get(
	"/course/info/:id",
	Auth.checkAuth(),
	async function (req, res, next) {
		let c;
		try {
			const cid = req.params.id;
			c = await findCourseByFilter({ _id: cid });
		} catch (err) {
			console.error(err);
			res.status(err.status).send(err);
		}
		res.status(200).render("internal/course_info", {
			title: "Course Info",
			course: c,
		});
		// res.status(200).render("internal/course_info", c != null ? c : {});
		// res.render("internal/course_info", {
		// 	title: "Course Info",
		// 	courseCode: "CSCI3100",
		// 	classNo: 1,
		// 	courseName: "Software Engineering",
		// 	description:
		// 		"This course introduces software life-cycles: system modelling, requirements analysis and specifications, design techniques, implementation methodology, testings, maintenance and engineering laboratory. Analytical tools: software metrics, system performance measurement and evaluation. Management techniques: estimations, planning, project management, communication skills and documentations. Introductions to CASE tools and security.",
		// 	instructor: "Prof. Michael Lyu",
		// 	meetings: [
		// 		{
		// 			dates: ["2023-02-02"],
		// 			_id: {
		// 				$oid: "64099edd8f618f1d44b91dbe",
		// 			},
		// 			courseCode: "ABCD1234",
		// 			day: 4,
		// 			start: "12:00",
		// 			end: "13:30",
		// 		},
		// 		{
		// 			dates: ["2023-02-01", "2023-02-08"],
		// 			_id: {
		// 				$oid: "64099edd8f618f1d44b91dbf",
		// 			},
		// 			courseCode: "ABCD1234",
		// 			day: 3,
		// 			start: "11:00",
		// 			end: "12:30",
		// 		},
		// 		{
		// 			dates: ["2023-02-03"],
		// 			_id: {
		// 				$oid: "64099edd8f618f1d44b91dc0",
		// 			},
		// 			courseCode: "ABCD1234",
		// 			day: 5,
		// 			start: "10:50",
		// 			end: "11:50",
		// 		},
		// 	],
		// 	seat: 210,
		// 	venue: "SHB",
		// });
	}
);

/* GET user regcourse page. */
router.get("/regcourse", Auth.checkAuth(), function (req, res, next) {
	const course = [
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["001", "002", "300", "301"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["100"],
			type: "Tutorial",
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["200", "201", "400", "401"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["100"],
			type: "Tutorial",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["101", "102", "201", "202"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["302"],
			type: "Tutorial",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["001", "002", "101", "102"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "B",
			timeSlot: ["302"],
			type: "Tutorial",
		},
	];
	res.render("internal/regcourse", {
		title: "Register Course",
		data: { course },
	});
});

/* GET update password page. */
router.get("/update_password", Auth.checkAuth(), function (req, res, next) {
	if (req.user.role.includes(Auth.ADMIN)) {
		res.render("admin/update_password", {
			title: "Update Password",
			data: req.user,
		});
	} else {
		res.render("internal/update_password", {
			title: "Update Password",
			profile: req.user,
		});
	}
});

/* GET user mycourse page. */
router.get("/table", function (req, res, next) {
	const course = [
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["001", "002", "300", "301"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI1234",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["100"],
			type: "Tutorial",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["101", "102", "201", "202"],
			type: "Lecture",
		},
		{
			courseCode: "CSCI4321",
			venue: "LSKLSKSLSKSKL",
			class: "A",
			timeSlot: ["302"],
			type: "Tutorial",
		},
	];
	// var data = course.map(c =>{
	//     return {
	//         courseCode: c.courseCode,
	//         venue: c.venue,
	//         class: c.class,
	//         timeSlot: c.timeSlot,
	//         type: c.type,
	//         displayed: false,
	//     };
	// });
	// function separateTimeSlots(arr) {
	//     let result = [];
	//     arr.forEach(obj => {
	//         for(var i=0; i<obj.timeSlot.length; i++){
	//             let firstChar = obj.timeSlot[i][0];
	//             let newObj = {...obj};
	//             newObj.timeSlot = obj.timeSlot.filter(slot => slot[0] === firstChar);
	//             if (i>0){
	//                 if (obj.timeSlot[i-1][0]!=firstChar){
	//                     result.push(newObj);
	//                 }
	//             }else if(i==0){
	//                 result.push(newObj);
	//             }
	//         }
	//     });
	//     return result;
	// };
	// var courses= separateTimeSlots(data);
	res.render("internal/table", {
		title: "My Courses",
		data: course,
	});
});

/* GET user mycourse page. */
router.get("/drop", function (req, res, next) {
	res.render("internal/drop", {
		title: "Drop Courses",
	});
});

module.exports = router;
