const jwt = require("jsonwebtoken");
module.exports.MODE_FORGET = 1;

module.exports.getToken = function (mode, data) {
	switch (mode) {
		case this.MODE_FORGET:
			return jwt.sign({ _id: data }, "resetkey", { expiresIn: "10m" });
	}
};

module.exports.verifyToken = function (mode, token) {
	// console.log("🚀 ~ file: tokenUtil.js:12 ~ token:", token);
	try {
		switch (mode) {
			case this.MODE_FORGET:
				return jwt.verify(token, "resetkey");
		}
	} catch (error) {
		console.log("🚀 ~ file: tokenUtil.js:19 ~ error:", error);
		throw "TokenInvalid";
	}
};
