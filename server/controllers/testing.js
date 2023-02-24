const utils = require("../utils/utils");
const userService = require("../services/users");

module.exports.generateStudent = async function generateStudent(req, res) {
	for (let i = 0; i < Math.min(100, parseInt(req.params.no)); i++) {
		let tutor = {
			contactNumber: utils.getRandomInt(10000000, 99999999),
			password: "123456789",
			email: `${utils.getRandomInt(10000000, 99999999)}@gmail.com`,
			fullName: `DummyStudent${utils.getRandomInt(1, 99999999)}`,
		};
		try {
			await userService.addUser(tutor);
		} catch (err) {
			return res.send(err);
		}
	}
	return res.send(
		`successfully generated ${Math.min(100, parseInt(req.params.no))} students`
	);
};
