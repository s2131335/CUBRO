var express = require("express");
var router = express.Router();

const profile = {
	fullName: "CHAN TAI MAN",
	email: "12345678@link.cuhk.edu.hk",
	role: "STUDENT",
	contactNumber: "12345678",
};

/* GET user home page. */
router.get("/home", function (req, res, next) {
	res.render("internal/home", { title: "CUBRO" });
});

/* GET user profile page. */
router.get("/profile", function (req, res, next) {
	res.render("internal/profile", { title: "Profile", profile });
});

/* GET user search page. */
router.get("/search", function (req, res, next) {
	res.render("internal/search", { title: "Search" });
});

/* GET user regcourse page. */
router.get("/regcourse", function (req, res, next) {
	res.render("internal/regcourse", { title: "RegisterCourse" });
});

module.exports = router;
