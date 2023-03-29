const jwt = require("jsonwebtoken");
const userService = require("../services/users");
const error = require("../utils/errors");

module.exports.MODE_FORGET = 1;
module.exports.MODE_ACTIVATE = 2;

module.exports.getToken = async function (userId, mode) {
	let token;
	switch (mode) {
		case this.MODE_FORGET:
			token = jwt.sign({ _id: userId }, "ResetKey", { expiresIn: "10m" });
			break;
		case this.MODE_ACTIVATE:
			token = jwt.sign({ _id: userId }, "ActivateKey");
			break;
	}
	try {
		await userService.findUserAndUpdate({ _id: userId }, { token: token });
	} catch (err) {
		throw err;
	}
	return token;
};

module.exports.verifyToken = function (reqToken, mode) {
	// console.log("🚀 ~ file: tokenUtil.js:12 ~ token:", token);
	let token;
	try {
		switch (mode) {
			case this.MODE_FORGET:
				token = jwt.verify(reqToken, "ResetKey");
				break;
			case this.MODE_ACTIVATE:
				token = jwt.verify(reqToken, "ActivateKey");
		}
	} catch (error) {
		console.log("🚀 ~ file: tokenUtil.js:19 ~ error:", error);
		throw error.TokenInvalid;
	}
	return token;
};

module.exports.verifyUserToken = async function verifyUserToken(
	reqToken,
	mode
) {
	let user, token;
	try {
		token = this.verifyToken(reqToken, mode);
		console.log("🚀 ~ file: users.js:129 ~ token:", token);
		user = await userService.findUserByFilter({ _id: token._id });
		if (!user || user.token !== reqToken) {
			throw error.TokenInvalid;
		}
		await userService.findUserAndUpdate({ _id: user._id }, { token: "" });
	} catch (err) {
		if (err != error.TokenInvalid) throw error.Unknown;
		else throw err;
	}
	return token._id;
};
