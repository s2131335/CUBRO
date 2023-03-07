const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
	courseCode: {
		type: String,
	},
	courseName: {
		type: String,
	},
	venue: {
		type: String,
	},
	class: {
		// class number
		type: Number,
	},
	meetings: [
		{
			courseCode: { type: String },
			day: {
				type: Number,
			},
			start: { type: String },
			end: { type: String },
			dates: {
				type: Array,
				of: String,
				default: [],
			},
		},
	],
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
		seat: {
			// available seat
			type: Number,
		},
	})
);

module.exports = { Tutorial, Lecture, Course };
