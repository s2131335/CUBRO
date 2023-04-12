module.exports = {
	Unknown: {
		status: 500,
		code: 4000,
		message: "Something Wrong",
	},
	NotPermitted: {
		status: 403,
		code: 4001,
		message: "Not Permitted",
	},
	NeedToLogin: {
		status: 403,
		code: 4002,
		message: "Login Required",
	},
	ValidatorError: {
		status: 500,
		code: 1000,
		message: "Validator Error",
	},
	EmailExist: {
		status: 500,
		code: 1001,
		message: "Email has been used",
	},
	PasswordTooShort: {
		status: 500,
		code: 1002,
		message: "Password Too Short",
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
	NameNotValid: {
		status: 500,
		code: 1006,
		message: "Name Not Valid",
	},
	CourseIDNotValid: {
		status: 500,
		code: 1007,
		message: "Course ID Not Valid",
	},
	RegistrationNotValid: {
		status: 500,
		code: 1008,
		message:
			"Course ID Did Not Appear with the User's ID in Registration Database",
	},
	AccountNotActivated: {
		status: 400,
		code: 1009,
		message: "Account Not Activated",
	},
	FailToSendMail: {
		status: 500,
		code: 2001,
		message: "Fail to send email",
	},
	TokenInvalid: {
		status: 401,
		code: 3001,
		message: "Token Invalid",
	},
	DatabaseUpdate: {
		status: 500,
		code: 5001,
		message: "Update not success",
	},
	RecordNotFound: {
		status: 500,
		code: 5002,
		message: "Record Not Found",
	},
	RegistrationExists: {
		status: 500,
		code: 6001,
		message: "Registration Already Exists",
	},
	CourseExists: {
		status: 500,
		code: 6002,
		message: "Course Already Exists",
	},
};

module.exports.overrideError = function overrideError(error, message) {
	return {
		status: this[error].status,
		code: this[error].code,
		message: message,
	};
};
