var express = require("express");
var router = express.Router();

/* GET login page. */
router.get("/", function (req, res, next) {
	if (req.isAuthenticated()) return res.redirect("/profile");

	res.render("public/login", { title: "Login" });
});

/* GET register page*/
router.get("/register", function (req, res, next) {
	res.render("public/register", { title: "Register" });
});

/* GET forget page*/
router.get("/forget", function (req, res, next) {
	res.render("public/forget", { title: "Forget" });
});

/* GET password reset */
router.get("/reset_password/:token", function (req, res, next) {
	res.render("public/reset_password", {
		title: "Password Reset",
	});
});

/* GET password reset */
router.get("/logout", function (req, res, next) {
	res.render("public/logout", {
		title: "Logout",
	});
});
module.exports = router;
