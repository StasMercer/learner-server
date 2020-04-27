const { Schema, model } = require("mongoose");

const chapterContent = new Schema({
    text: String,
    type: String,
    media: String,
    tests: [
        {
            question: String,
            variants: [String],
            answer: [Number],
        },
    ],
});

module.exports = model("ChapterContent", chapterContent);
