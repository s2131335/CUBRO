var express = require("express");
var router = express.Router();

/* GET user home page. */
router.get("/home", function (req, res, next) {
	res.render("internal/home", { title: "CUBRO" });
});

module.exports = router;
