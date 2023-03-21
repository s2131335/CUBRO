const mongoose = require("mongoose");
const { Schema } = mongoose;

const evaluationSchema = new Schema({
	courseID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "course",
	},
	text: {
		type: string,
	},
	rating: {
		type: number,
		required: true,
		max: 5,
		min: 0,
	},
	createTime: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model("evaluation", evaluationSchema);
