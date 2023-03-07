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

const course = mongoose.model("course", courseSchema);
const tutorial = course.discriminator("tutorial", new mongoose.Schema({}));
const lecture = course.discriminator(
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

module.exports = { tutorial, lecture, course };
