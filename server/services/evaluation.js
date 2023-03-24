const { Evaluation } = require("../database/models/evaluation");
const error = require("../utils/errors");

module.exports.createEval = async function createEval(eval) {
	try {
		await Evaluation.create(eval);
		return null;
	} catch (err) {
		console.log("🚀 ~ file: evaluation.js:9 ~ createEval ~ err:", err);

		throw error.DatabaseUpdate;
	}
};

module.exports.findAllEvalByFilter = async function (filter = {}) {
	try {
		let eval = await Evaluation.find(filter);
		return eval;
	} catch (err) {
		console.log("🚀 ~ file: evaluation.js:20 ~ err:", err);
		return null;
	}
};

module.exports.findEvalByFilter = async function (fields) {
	try {
		let eval = await Evaluation.findOne(fields);
		return eval;
	} catch (err) {
		console.log("🚀 ~ file: evaluation.js:30 ~ err:", err);
		return null;
	}
};

module.exports.findEvalAndUpdate = async function (filter, update) {
	try {
		// console.log(update);
		await Course.findOneAndUpdate(filter, update);
		return null;
	} catch (err) {
		console.log("🚀 ~ file: courses.js:41 ~ err:", err);
		throw error.DatabaseUpdate;
	}
};

module.exports.deleteEvalByFilter = async function (filter) {
	try {
		await Evaluation.deleteMany(filter);
		return null;
	} catch (err) {
		console.log(
			"🚀 ~ file: evaluation.js:51 ~ module.exports.deleteEvalByFilter ~ err:",
			err
		);
		throw error.DatabaseUpdate;
	}
};
