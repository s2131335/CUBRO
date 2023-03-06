const fs = require("fs");

module.exports.getRandomInt = function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

module.exports.intToChar = function intToChar(int) {
	return String.fromCharCode(int);
};

module.exports.charToInt = function charToInt(char) {
	return char.charCodeAt(0);
};

module.exports.writeJSON = function writeJSON(filename, object) {
	try {
		fs.writeFileSync(filename, JSON.stringify(object));
	} catch (error) {
		console.log("writeJSON error"); // TODO: throw proper error
	}
};

module.exports.readJSON = function readJSON(filename) {
	let object;
	try {
		object = JSON.parse(
			fs.readFileSync(filename, {
				encoding: "utf8",
				flag: "r",
			})
		);
	} catch (error) {
		throw error; // TODO: throw proper error
	}
	return object;
};
