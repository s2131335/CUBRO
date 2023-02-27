module.exports = {
	Unknown: {
		status: 500,
		code: 4000,
		message: "Something Wrong",
	},
	EmailExist: {
		status: 500,
		code: 1000,
		message: "Email has been used",
	},
	PasswordTooShort: {
		status: 500,
		code: 1001,
		message: "Password Too Short",
	},
	TwoPasswordNotMatch: {
		status: 500,
		code: 1002,
		message: "Two Passwords Not Match",
	},
	UserNotFound: {
		status: 500,
		code: 1003,
		message: "User Not Found",
	},
	PasswordIncorrect: {
		status: 500,
		code: 1004,
		message: "Password Incorrect",
	},
	EmailNotValid: {
		status: 500,
		code: 1005,
		message: "Email Not Valid",
	},
	FailToSendMail: {
		status: 500,
		code: 1006,
		message: "Fail to send email",
	},
	TokenInvalid: {
		status: 401,
		code: 1007,
		message: "Token Invalid",
	},
	DatabaseUpdate: {
		status: 500,
		code: 1008,
		message: "Update not success",
	},
};
