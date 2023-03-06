const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const error = require("../utils/errors");
// Include user model
const userService = require("../services/users");

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true,
			},
			async (req, email, password, done) => {
				let user = await userService.findUserByFilter({ email: email });
				if (!user) {
					return done(null, false, { error: error.UserNotFound });
				}
				// use bcrypt to check password correctness
				const isMatched = await bcrypt.compare(password, user.password);
				if (!isMatched) {
					return done(null, false, {
						error: error.PasswordIncorrect,
					});
				}
				if (!user.activated) {
					return done(null, false, {
						error: error.AccountNotActivated,
					});
				}
				// if password matched
				return done(null, user);
			}
		)
	);

	passport.serializeUser((user, done) => {
		console.log("serial");
		done(null, user._id);
	});

	passport.deserializeUser(async (_id, done) => {
		console.log("deserial" + _id);
		let user = await userService.findUserByFilter({ _id });
		done(null, user);
	});
};
