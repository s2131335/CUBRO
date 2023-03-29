const nodemailer = require("nodemailer");
const error = require("../utils/errors");

const transport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	debug: true,
	pool: true,
	auth: {
		user: process.env.SENDER_EMAIL,
		pass: process.env.SENDER_PASSWORD,
	},
});

module.exports.sendMail = async function (recipient, data) {
	let content;
	try {
		console.log(recipient);
		switch (data.mode) {
			case this.MODE_RESET:
				content = {
					subject: "CUBRO - Password Reset",
					html: `
                            <h2>Click this link to reset password</h2>
                            <p>http://${process.env.DOMAIN}:${process.env.FRONTEND_PORT}/reset_password/token=${data.payload}</p>
                            <p>This link only last for 10 min</p>`,
				};
				break;

			case this.MODE_ACTIVATE:
				content = {
					subject: "CUBRO - Account Activation",
					html: `
                            <h2>Click this link to activate your account</h2>
                            <p>http://${process.env.DOMAIN}:${process.env.FRONTEND_PORT}/activate_account/token=${data.payload}</p>
							`,
				};
				break;

			case this.MODE_SELECT:
				var courseListHTML = "<ul>";
				for (var course of data.courses) {
					courseListHTML +=
						"<li>" +
						course.courseCode +
						" - " +
						course.courseName +
						"</li>";
				}
				courseListHTML += "</ul>";
				content = {
					subject: "CUBRO - Course Registration",
					html: `
                            <h2>Congratulations!</h2>
                            <h4>You have successfully registered for the following courses:</h4>
                            ${courseListHTML}
                            <p>Thank you for using CUBRO</p>
                        `,
				};
				break;
			case this.MODE_DROP:
				var courseListHTML = "<ul>";
				for (var course of data.courses) {
					courseListHTML +=
						"<li>" +
						course.courseCode +
						" - " +
						course.courseName +
						"</li>";
				}
				courseListHTML += "</ul>";
				content = {
					subject: "CUBRO - Course Drop",
					html: `
                            <h3>Thank you for using CUBRO!</h3>
                            <h4>You have successfully dropped for the following courses:</h4>
                            ${courseListHTML}
                        `,
				};
				break;
			default:
				content = data.payload;
				break;
		}
		content.from = process.env.SENDER_EMAIL;
		content.to = recipient;
		return await transport.sendMail(content);
	} catch (err) {
		console.log("🚀 ~ file: sendMail.js:36 ~ err:", err);
		throw error.FailToSendMail;
	}
};

module.exports.MODE_RESET = 1;
module.exports.MODE_ACTIVATE = 2;
module.exports.MODE_SELECT = 3;
module.exports.MODE_DROP = 4;
