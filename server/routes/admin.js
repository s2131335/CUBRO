var express = require("express");
var router = express.Router();
const Auth = require("../middleware/auth");
const { manageCourse } = require("../controllers/courses");
const { showAllUsers } = require("../controllers/users");

/* GET admin home page */
router.get("/home", Auth.checkAuth(Auth.ADMIN), function (req, res, next) {
	res.render("admin/home", {
		title: "Home",
	});
});
/* GET admin user_edit page */
router.get("/users", Auth.checkAuth(Auth.ADMIN), showAllUsers);

router.get("/add_user", Auth.checkAuth(Auth.ADMIN), function (req, res, next) {
	res.render("admin/add_user", {
		title: "New User",
	});
});

/* GET admin course management page. */
router.get("/courses", Auth.checkAuth(Auth.ADMIN), manageCourse);

router.get("/add_course",Auth.checkAuth(Auth.ADMIN),function (req, res, next) {
	res.render("admin/add_course", {
		title: "New Course",
	});
});
module.exports = router;
