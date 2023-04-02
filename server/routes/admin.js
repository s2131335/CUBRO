var express = require("express");
var router = express.Router();
const Auth = require("../middleware/auth");
const { manageCourse } = require("../controllers/courses");
const { showAllUsers } = require("../controllers/users");

const profile = {
	fullName: "Tuan Sung Chi",
	email: "12345678@link.cuhk.edu.hk",
	role: "Admin",
	contactNumber: "12345678",
};

const users = [
	{
		id: "12345678",
		name: "Chan Tai Ming",
		role: "Student",
	},
	{
		id: "87654321",
		name: "Chan Siu Ming",
		role: "Student",
	},
	{
		id: "43218765",
		name: "Wong Tai Ming",
		role: "Student",
	},
	{
		id: "56781234",
		name: "Lam Siu Ming",
		role: "Student",
	},
	{
		id: "22222222",
		name: "Lam Tai Ming",
		role: "Student",
	},
	{
		id: "33333333",
		name: "Tai Tai Tai",
		role: "Admin",
	},
];

const courses = [
	{
		courseCode: "CSCI3100",
		courseName: "Software Engineering",
		instructor: "Prof. Michael LYU",
		seat: 210,
		venue: "SHB",
	},
	{
		courseCode: "CSCI3250",
		courseName: "Computers and Society",
		instructor: "Prof. ChAU Cheuk Chi",
		seat: 257,
		venue: "SHB",
	},
	{
		courseCode: "CSCI3320",
		courseName: "Fundamentals of Machine Learning",
		instructor: "Prof. WANG Liwei",
		seat: 150,
		venue: "ELB",
	},
	{
		courseCode: "CENG3420",
		courseName: "Computer Organization and Design",
		instructor: "Prof. Yu Bei",
		seat: 210,
		venue: "LSB",
	},
	{
		courseCode: "UGFN1000",
		courseName: "In Dialogue With Nature",
		instructor: "Dr. LAM To Kam",
		seat: 30,
		venue: "YIA",
	},
	{
		courseCode: "STAT3008",
		courseName: "Applied Regression Analysis",
		instructor: "Prof. WANG JunHui",
		seat: 200,
		venue: "SLT",
	},
];

/* GET admin profile page */
router.get("/profile", Auth.checkAuth(Auth.ADMIN), function (req, res, next) {
	res.render("admin/profile", {
		title: "Profile",
		data: profile,
	});
});

/* GET admin user_edit page */
router.get("/users", Auth.checkAuth(Auth.ADMIN), showAllUsers);
/* GET admin home page */
router.get("/home", Auth.checkAuth(Auth.ADMIN), function (req, res, next) {
	res.render("admin/home", {
		title: "Home",
	});
});

/* GET admin course_edit page. */

router.get("/courses", Auth.checkAuth(Auth.ADMIN), manageCourse);

/* GET course edit page. */
router.get(
	"/courses/edit",
	Auth.checkAuth(Auth.ADMIN),
	function (req, res, next) {
		res.render("admin/course_edit", {
			title: "Course Edit",
			courseCode: "CSCI3100",
			classNo: 1,
			courseName: "Software Engineering",
			description:
				"This course introduces software life-cycles: system modelling, requirements analysis and specifications, design techniques, implementation methodology, testings, maintenance and engineering laboratory. Analytical tools: software metrics, system performance measurement and evaluation. Management techniques: estimations, planning, project management, communication skills and documentations. Introductions to CASE tools and security.",
			instructor: "Prof. Michael LYU",
			meetings: [
				{
					dates: ["2023-02-02"],
					_id: {
						$oid: "64099edd8f618f1d44b91dbe",
					},
					courseCode: "ABCD1234",
					day: 4,
					start: "12:00",
					end: "13:30",
				},
				{
					dates: ["2023-02-01", "2023-02-08"],
					_id: {
						$oid: "64099edd8f618f1d44b91dbf",
					},
					courseCode: "ABCD1234",
					day: 3,
					start: "11:00",
					end: "12:30",
				},
				{
					dates: ["2023-02-03"],
					_id: {
						$oid: "64099edd8f618f1d44b91dc0",
					},
					courseCode: "ABCD1234",
					day: 5,
					start: "10:50",
					end: "11:50",
				},
			],
			seat: 210,
			venue: "SHB",
		});
	}
);

module.exports = router;
