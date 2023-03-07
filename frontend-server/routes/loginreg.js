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

module.exports = router;
