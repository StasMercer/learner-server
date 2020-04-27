const { model, Schema } = require("mongoose");

const cycleCourse = new Schema({
    cycleName: String,
    courses: [{courseName: String, courseId: String}]
});

module.exports = model("CycleCourse", cycleCourse);
