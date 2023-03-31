module.exports.checkAuth = function checkAuth(permission) {
	return (req, res, next) => {
		if (!req.isAuthenticated())
			return res.status(403).send("Need to login");

		if (permission && !req.user.role.includes(permission))
			return res.status(403).send("Not permitted");

		return next();
	};
};

module.exports.ADMIN = "ADMIN";

module.exports.STUDENT = "STUDENT";

module.exports.TUTOR = "TUTOR";

module.exports.ALL = "ALL";
