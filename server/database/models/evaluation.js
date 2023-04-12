const mongoose = require("mongoose");
const { Schema } = mongoose;

const evaluationSchema = new Schema({
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	courseID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "course",
	},
	text: {
		type: String,
	},
	rating: {
		type: Number,
		max: 5,
		min: 0,
	},
	createTime: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model("evaluation", evaluationSchema);
