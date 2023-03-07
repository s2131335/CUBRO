const { parseExcel } = require("../utils/excel");
const courseService = require("../services/courses");
const { tutorial, lecture, course } = require("../database/models/courses");

module.exports.importCourse = function importCourse(req, res) {
    let filename = req.file.originalname;
    let courses = parseExcel(filename);
    if (courses.length === 0) return res.status(200).send("No update needed");

    let failed = [];
    for (let course of courses) {
        let type = course.type;
        delete course.type;
        try {
            courseService.addLesson(course, type);
        } catch (err) {
            failed.push(course.courseCode + type);
            continue;
        }
    }
    if (!(failed.length === 0)) {
        if (failed.length === course.length)
            return res.status(500).send("All failed");
        else return res.status(500).send(`failed:${failed}`);
    }
    res.status(200).send("All successful");
};

module.exports.browseCourse = async function browseCourse(req, res) {
    try {
        const { courseCode, courseName } = req.query;
        var filter = {};
        if (courseCode) {
            filter["courseCode"] = { $regex: ".*" + courseCode + ".*" };
        }
        if (courseName) {
            filter["courseName"] = { $regex: ".*" + courseName + ".*" };
        }
        console.log(filter);
        var result = await course.find(filter);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(err.status).send(err);
    }
};
