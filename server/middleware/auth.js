const error = require("../utils/errors");
module.exports.checkAuth = function checkAuth(permission) {
	return (req, res, next) => {
		if (!req.isAuthenticated()) return res.redirect("/redirect_login");
		// return res.status(error.NeedToLogin.status).send(error.NeedToLogin);

		if (permission && !req.user.role.includes(permission))
			return res.redirect("/redirect_home");
		// return res
		// 	.status(error.NotPermitted.status)
		// 	.send(error.NotPermitted);

		return next();
	};
};

module.exports.ADMIN = "ADMIN";

module.exports.STUDENT = "STUDENT";

module.exports.TUTOR = "TUTOR";

module.exports.ALL = "ALL";
