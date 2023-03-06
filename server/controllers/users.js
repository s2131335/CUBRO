const userService = require("../services/users");
const error = require("../utils/errors");
const passport = require("passport");
const Auth = require("../middleware/auth");
const { validationResult } = require("express-validator");
const Email = require("../utils/sendMail");
const Token = require("../utils/tokenUtil");

module.exports.login = function (req, res, next) {
	// If user already logged in
	if (req.isAuthenticated()) return res.status(201).send("Login");

	passport.authenticate("local", function (err, user, info) {
		if (err) {
			return next(err);
		}
		// if no user is returned by passport
		if (info && !(info.message in error)) {
			// console.log("🚀 ~ file: users.js:19 ~ info:", info);
			return res.status(error.Unknown.status).send(error.Unknown);
		}
		if (!user) {
			// console.log(info.message);
			return res.status(error[info.message].status).send(error[info.message]);
		}

		// login
		// save user into session
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			// console.log(req.user);
			return res.status(200).send("Login");
		});
	})(req, res, next);
};

module.exports.addUser = async function (req, res) {
	let err = validationResult(req);
	// console.log(err);
	if (!err.isEmpty()) {
		console.log("🚀 ~ file: users.js:43 ~ err:", err);
		let e = error[err.errors[0].msg];

		if (error[e]) return res.status(error[e].status).send(error[e]);
		else
			return res
				.status(error.ValidatorError.status)
				.send(error.overrideError("ValidatorError", err.errors[0].msg));
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
		// if error contain the catched error, send the error
		return res.status(error[err].status).send(error[err]);
	}
	res.status(200).send("ok");
};

module.exports.activateAccount = async function activateAccount(req, res) {
	const reqToken = req.params.token;
	try {
		let userId = await Token.verifyUserToken(reqToken, Token.MODE_ACTIVATE);
		await userService.findUserAndUpdate({ _id: userId }, { activated: true });
	} catch (err) {
		console.log("🚀 ~ file: users.js:136 ~ err:", err);
		return res.status(error[err].status).send(error[err]);
	}
	res.status(200).send("ok");
};

module.exports.logout = function (req, res, next) {
	// console.log("there");
	console.log(error.ValidatorError);
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.send("Logout");
	});
};

module.exports.showStudents = async function (req, res, next) {
	let students = await userService.findAllUserByFilter({ role: Auth.STUDENT });
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
		let validatorError = error[err.errors[0].msg];
		if (validatorError)
			return res.status(validatorError.status).send(validatorError);
		else return res.status(error.Unknown.status).send(err.errors[0].msg);
	}
	try {
		await userService.updatePassword(req.user.id, req.body.password);
	} catch (err) {
		return res.status(error[err].status).send(error[err]);
	}
	res.redirect(307, "logout");
};

module.exports.addRoles = async function (req, res, next) {
	try {
		await userService.findUserAndUpdate(
			{ _id: req.body.id },
			{ role: req.body.roles }
		);
	} catch (err) {
		return res.status(error[err].status).send(error[err]);
	}
	res.status(200).send("ok");
};

module.exports.forgetPassword = async function (req, res) {
	let email = req.body.email;
	let user = await userService.findUserByFilter({ email });
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
		await userService.findUserAndUpdate({ _id: user._id }, { token: token });
	} catch (err) {
		console.log("🚀 ~ file: users.js:119 ~ err:", err);
		return res.status(error[err].status).send(error[err]);
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
		return res.status(error[err].status).send(error[err]);
	}
	res.status(200).send("ok");
};
