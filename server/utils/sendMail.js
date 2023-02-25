const nodemailer = require("nodemailer");

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
		switch (data.mode) {
			case this.MODE_RESET:
				content = {
					from: process.env.SENDER_EMAIL,
					to: recipient,
					subject: "Password reset",
					html: `
                            <h2>Click this link to reset password</h2>
                            <p>http://${process.env.DOMAIN}:${process.env.PORT}/api/users/reset-password/${data.payload}</p>
                            <p>This link only last for 10 min</p>`,
				};
				break;

			case this.MODE_VERIFY:
				// TODO: Verify email
				break;
		}
		return await transport.sendMail(content);
	} catch (err) {
		console.log("🚀 ~ file: sendMail.js:36 ~ err:", err);
		throw "FailToSendMail";
	}
};

module.exports.MODE_RESET = 1;
module.exports.MODE_VERIFY = 2;
