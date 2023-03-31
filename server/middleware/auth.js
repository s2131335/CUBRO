const error = require("../utils/errors");
module.exports.checkAuth = function checkAuth(permission) {
	return (req, res, next) => {
		if (!req.isAuthenticated())
			return res.status(error.NeedToLogin.status).send(error.NeedToLogin);

		if (permission && !req.user.role.includes(permission))
			return res
				.status(error.NotPermitted.status)
				.send(error.NotPermitted);

		return next();
	};
};

module.exports.ADMIN = "ADMIN";

module.exports.STUDENT = "STUDENT";

module.exports.TUTOR = "TUTOR";

module.exports.ALL = "ALL";
