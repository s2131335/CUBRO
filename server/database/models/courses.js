const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
	courseCode: {
		type: String,
	},
	courseName: {
		type: String,
	},
	semester: {
		type: Number,
		required: true,
	},
	venue: {
		type: String,
	},
	classNum: {
		// class number
		type: Number,
	},
	meetings: [
		{
			courseCode: { type: String },
			day: { type: Number },
			timeSlot: {
				type: Array,
				of: String,
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
});

const Course = mongoose.model("course", courseSchema);
const Tutorial = Course.discriminator("tutorial", new mongoose.Schema({}));
const Lecture = Course.discriminator(
	"lecture",
	new mongoose.Schema({
		instructor: {
			type: String,
		},
		description: {
			type: String,
		},
	})
);

module.exports = { Tutorial, Lecture, Course };
