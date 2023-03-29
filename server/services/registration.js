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
		console.log("🚀 ~ registration: upsertReg ~ err:", err);
		throw error.DatabaseUpdate;
	}
};

module.exports.findRegByFilter = async function (filter) {
	try {
		let reg = await Registration.find(filter);
		return reg;
	} catch (err) {
		console.log("🚀 ~ registration: findRegByFilter ~ err:", err);
		return null;
	}
};

module.exports.extractCourseIdByFilter = async function (filter) {
	try {
		let reg = await exports.findRegByFilter(filter);
		return reg.populate("courseID").select("courseID -_id");
	} catch (err) {
		console.log("🚀 ~ registration: extractCourseIdByFilter ~ err:", err);
		return null;
	}
};

module.exports.extractRegIdByFilter = async function (filter) {
	let reg = await exports.findRegByFilter(filter);
	if (reg) return reg.distinct("_id");
	else return null;
};

module.exports.deleteRegByFilter = async function (filter) {
	try {
		await Registration.deleteMany(filter);
		return null;
	} catch (err) {
		console.log("🚀 ~ registration: deleteRegByFilter ~ err:", err);
		throw error.DatabaseUpdate;
	}
};
