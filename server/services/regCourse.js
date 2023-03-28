const Registration = require("../database/models/registration");
const { Tutorial, Lecture, Course } = require("../database/models/courses");
const error = require("../utils/errors");

module.exports.countFilter = async function (filter) {
	return await Course.countDocuments(filter);
};

module.exports.upsertReg = async function (oldInfo, newInfo) {
	try {
		await Registration.updateOne(oldInfo, newInfo, { upsert: true });
	} catch (err) {
		console.log("🚀 ~ file: regCourse.js:12 ~ err:", err);
		throw error.DatabaseUpdate;
	}
};

module.exports.findRegByFilter = async function (filter) {
	try {
		let reg = await Registration.find(filter);
		return reg;
	} catch (err) {
		console.log("🚀 ~ file: regCourse.js:23 ~ err:", err);
		return null;
	}
};

module.exports.getRegIdByFilter = async function (filter) {
	let reg = await exports.findRegByFilter(filter);
	if (reg) return reg.distinct("_id");
	else return null;
};

module.exports.deleteRegByFilter = async function (filter) {
	try {
		// console.log(update);
		await Registration.deleteMany(filter);
		return null;
	} catch (err) {
		console.log(
			"🚀 ~ file: regCourse.js:40 ~ module.exports.deleteRegByFilter ~ err:",
			err
		);
		throw error.DatabaseUpdate;
	}
};
