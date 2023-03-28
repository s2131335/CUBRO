const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationSchema = new Schema({
	courseID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "course",
	},
	studentID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	selected: {
		type: Boolean,
		default: false, // true: selected, false: shopping cart
	},
	createTime: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model("registration", registrationSchema);
