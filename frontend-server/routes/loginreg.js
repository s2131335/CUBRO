var express = require("express");
var router = express.Router();

/* GET login page. */
router.get("/", function (req, res, next) {
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

/* GET activated page*/
router.get("/activate_account/:token", function (req, res, next) {
	res.render("public/activate_account", { title: "Activate account" });
});

/* GET password reset authentication*/
router.get("/reset_password/:token", function (req, res, next) {
	res.render("public/reset_password", { title: "Password Reset Authentication" });
});

module.exports = router;
