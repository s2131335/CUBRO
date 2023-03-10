const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		// nickname: {
		// 	type: String,
		// },
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
		// createTime: {
		// 	type: Date,
		// 	default: new Date(),
		// },
		// avatar: {
		// 	type: String,
		// },
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
