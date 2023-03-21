const userService = require("../services/users");
const error = require("../utils/errors");
const passport = require("passport");
const Auth = require("../middleware/auth");
const { validationResult } = require("express-validator");
const Email = require("../utils/sendMail");
const Token = require("../utils/tokenUtil");

module.exports.login = function (req, res, next) {
	// If user already logged in
	if (req.isAuthenticated()) return res.status(201).send({message:"Login"});

	passport.authenticate("local", function (err, user, info) {
		if (err) {
			return next(err);
		}
		// if no user is returned by passport
		if (info && !info.error) {
			// console.log("🚀 ~ file: users.js:19 ~ info:", info);
			return res.status(error.Unknown.status).send(error.Unknown);
		}
		if (!user) {
			// console.log(info.message);
			return res.status(info.error.status).send(info.error);
		}

		// login
		// save user into session
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}

			return res.status(200).send("Login");
		});
	})(req, res, next);
};

module.exports.register = async function (req, res) {
	let err = validationResult(req);
	// console.log(err);
	if (!err.isEmpty()) {
		let validatorError = err.errors[0].msg;
		console.log("🚀 ~ file: users.js:46 ~ validatorError:", validatorError);

		return res.status(validatorError.status).send(validatorError);
	}

	let userData = req.body;
	// console.log(token);
	try {
		let user = await userService.addUser(userData);
		let token = await Token.getToken(user._id, Token.MODE_ACTIVATE);
		await Email.sendMail(userData.email, {
			mode: Email.MODE_ACTIVATE,
			payload: token,
		});
	} catch (err) {
		return res.status(err.status).send(err);
	}

	res.status(200).send("ok");
};

module.exports.addUser = async function (req, res) {
	let userData = req.body;
	try {
		let user = await userService.addUser(userData);
		let token = await Token.getToken(user._id, Token.MODE_ACTIVATE);
		await Email.sendMail(userData.email, {
			mode: Email.MODE_ACTIVATE,
			payload: token,
		});
	} catch (err) {
		return res.status(err.status).send(err);
	}
	res.status(200).send("ok");
};

module.exports.activateAccount = async function activateAccount(req, res) {
	const reqToken = req.params.token;
	try {
		let userId = await Token.verifyUserToken(reqToken, Token.MODE_ACTIVATE);
		await userService.findUserAndUpdate(
			{ _id: userId },
			{ activated: true }
		);
	} catch (err) {
		console.log("🚀 ~ file: users.js:136 ~ err:", err);
		return res.status(err.status).send(err);
	}
	res.status(200).send("ok");
};

module.exports.logout = function (req, res, next) {
	// console.log("there");
	req.logout(function (err) {
		if (err) {
			return next(err);
		}

		res.send("Logout");
	});
};

module.exports.showStudents = async function (req, res, next) {
	let students = await userService.findAllUserByFilter({
		role: Auth.STUDENT,
	});
	res.status(200).json(students);
};

module.exports.showAdmins = async function (req, res, next) {
	let admins = await userService.findAllUserByFilter({ role: Auth.ADMIN });
	res.status(200).json(admins);
};

module.exports.showAllUsers = async function (req, res, next) {
	let users = await userService.findAllUserByFilter();
	res.status(200).json(users);
};

module.exports.changePassword = async function (req, res, next) {
	let err = validationResult(req);
	if (!err.isEmpty()) {
		// console.log(err);
		let validatorError = err.errors[0].msg;
		console.log(
			"🚀 ~ file: users.js:119 ~ validatorError:",
			validatorError
		);

		if (validatorError)
			return res.status(validatorError.status).send(validatorError);
	}
	try {
		await userService.updatePassword(req.user.id, req.body.password);
	} catch (err) {
		return res.status(err.status).send(err);
	}
	res.redirect(307, "logout");
};

module.exports.modRoles = async function (req, res, next) {
	try {
		console.log(req.body.role);
		await userService.findUserAndUpdate(
			{ _id: req.body._id },
			{ role: req.body.role }
		);
	} catch (err) {
		return res.status(err.status).send(err);
	}
	res.status(200).send("ok");
};

module.exports.forgetPassword = async function (req, res) {
	let email = req.body.email;
	let user = await userService.findUserByFilter({ email });
	console.log("🚀 ~ file: users.js:159 ~ user:", user);
	if (!user)
		return res.status(error.UserNotFound.status).send(error.UserNotFound);
	if (!user.activated)
		return res
			.status(error.AccountNotActivated.status)
			.send(error.AccountNotActivated);

	const token = await Token.getToken(user._id, Token.MODE_FORGET);
	// console.log(token);
	try {
		await Email.sendMail(email, { mode: Email.MODE_RESET, payload: token });
		await userService.findUserAndUpdate(
			{ _id: user._id },
			{ token: token }
		);
	} catch (err) {
		console.log("🚀 ~ file: users.js:119 ~ err:", err);
		return res.status(err.status).send(err);
	}
	res.status(200).send("ok");
};

module.exports.resetPassword = async function (req, res) {
	const reqToken = req.params.token;
	try {
		const userId = await Token.verifyUserToken(reqToken, Token.MODE_FORGET);
		await userService.updatePassword(userId, req.body.password);
	} catch (err) {
		console.log("🚀 ~ file: users.js:136 ~ err:", err);
		return res.status(err.status).send(err);
	}
	res.status(200).send("ok");
};

module.exports.showUsers = async function (req, res) {
	let filter = req.body.filter;
	try {
		let users = await userService.findAllUserByFilter(filter);
		return res.status(200).json(users);
	} catch (err) {
		res.status(err.status).json(err);
	}
};
