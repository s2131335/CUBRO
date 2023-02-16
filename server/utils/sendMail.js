const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    debug: true,
    pool:true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
})

module.exports.sendMail = async (recipient,data) => {
    try {
        if (data.mode == 'resetpw') {
            let content = {
                from: process.env.SENDER_EMAIL,
                to: recipient,
                subject: 'Password reset',
                html: `
                        <h2>Click this link to reset password</h2>
                        <p>http://${process.env.DOMAIN}:${process.env.PORT}/reset-password/${data.payload}</p>
                        <p>This link only last for 10 min</p>`,
            };
            return await transport.sendMail(content);
        }
    } catch (err) {
        console.log('here');
        throw err;
    }
};

 