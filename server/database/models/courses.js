const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
	courseCode: {
		type: String,
	},
	instructor: {
		type: String,
	},
	description: {
		type: String,
	},
	courseName: {
		type: String,
	},
	department: {
		type: String,
	},

	venue: {
		type: String,
	},

	meetings: [
		{
			courseCode: { type: String },
			day: { type: Number },
			timeSlot: {
				type: Array,
				of: String, // format: "00", "01"
			},
			dates: {
				type: Array,
				of: String,
				default: [],
			},
		},
	],
	seat: {
		// available seat
		type: Number,
	},
	file: {
		type: Buffer,
	},
});

const Course = mongoose.model("course", courseSchema);
module.exports = { Course };
