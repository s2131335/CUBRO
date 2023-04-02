const bcrypt = require("bcrypt");
const Users = require("../database/models/users");
const error = require("../utils/errors");

// Update operations need to inform user if failed.
// While Fetch data don't need
module.exports.addUser = async function (userData) {
	try {
		userData.password = await bcrypt.hash(userData.password, 10);
		return await Users.create(userData);
	} catch (err) {
		if (err.code === 11000) throw error.EmailExist;
		else {
			throw error.Unknown;
		}
	}
};

module.exports.updatePassword = async function (id, password) {
	try {
		let hash = await bcrypt.hash(password, 10);
		let user = await Users.findOneAndUpdate(
			{ _id: id },
			{ password: hash }
		);
	} catch (err) {
		// console.log("🚀 ~ file: users.js:20 ~ err:", err);
		throw error.DatabaseUpdate;
	}
};

module.exports.findUserByFilter = async function (fields) {
	try {
		let user = await Users.findOne(fields);
		return user;
	} catch (err) {
		console.log("🚀 ~ file: users.js:31 ~ err:", err);
		return null;
	}
};

module.exports.findAllUserByFilter = async function (filter = {}) {
	try {
		let users = await Users.find(filter);
		return users;
	} catch (err) {
		console.log("🚀 ~ file: users.js:41 ~ err:", err);
		return null;
	}
};
module.exports.findUserAndUpdate = async function (filter, update) {
	try {
		await Users.findOneAndUpdate(filter, update);

		return null;
	} catch (err) {
		console.log("🚀 ~ file: users.js:55 ~ err:", err);
		throw error.DatabaseUpdate;
	}
};

module.exports.deleteUsersByFilter = async function (filter) {
	try {
		await Users.deleteMany(filter);
		return null;
	} catch (err) {
		console.warn("❗️ ~ module.exports.deleteUsersByFilter ~ err:", err);
		throw error.DatabaseUpdate;
	}
};
