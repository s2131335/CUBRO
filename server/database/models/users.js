const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		nickname: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		role: {
			type: Array,
			of: String,
			default: ["STUDENT"],
		},
		gender: {
			type: String,
			default: "",
		},
		avatar: {
			type: Buffer,
		},
		contactNumber: {
			type: Number,
			required: true,
		},
		activated: {
			type: Boolean,
			default: false,
		},
		token: {
			type: String,
			default: "",
		},
	},
	{ strict: false }
);

module.exports = mongoose.model("user", userSchema);
