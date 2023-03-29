const Registration = require("../database/models/registration");
const error = require("../utils/errors");

module.exports.countRegByFilter = async function (filter) {
	return await Registration.countDocuments(filter);
};

module.exports.getCourseAvailability = async function (courseID) {
	let currentSeat = await exports.countRegByFilter({
		courseID,
		selected: true,
	});

	let reg = await Registration.findOne({ courseID }).populate("courseID");
	return {
		isFull: currentSeat >= reg.courseID.seat,
		courseCode: reg.courseID.courseCode,
	};
};

module.exports.upsertReg = async function (oldInfo, newInfo) {
	try {
		await Registration.updateOne(oldInfo, newInfo, { upsert: true });
	} catch (err) {
		console.log("🚀 ~ registration: upsertReg ~ err:", err);
		throw error.DatabaseUpdate;
	}
};

module.exports.findOneRegByFilter = async function (filter) {
	try {
		let reg = await Registration.findOne(filter);
		return reg;
	} catch (err) {
		console.log("🚀 ~ registration: findOneRegByFilter ~ err:", err);
		return null;
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
		let reg = await Registration.find(filter)
			.populate("courseID")
			.select("courseID -_id");
		return reg;
	} catch (err) {
		console.log("🚀 ~ registration: extractCourseIdByFilter ~ err:", err);
		return null;
	}
};

module.exports.extractRegIdByFilter = async function (filter) {
	let reg = await Registration.find(filter).distinct("_id");
	return reg;
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

(async () => {
	let a = await exports.getCourseAvailability("6422d4f2dc5a8a14ec416149");
	console.log(a);
})();
