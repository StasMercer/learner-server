const { model, Schema } = require("mongoose");


const courseSchema = new Schema({
    courseName: String,
    owner: {
        typeKey: Schema.Types.ObjectId,
        ref: "users",
    },
    description:{typeKey: String, default: 'Опису нема'},

    createdAt: {typeKey: String, default: "2020-04-14T11:43:56.707Z"},
    rates: [{ email: String, rate: Number }],
    ownerName: {typeKey: String, default: 'John Doe'},
    members: [
        {
            id: Schema.Types.ObjectId,
            firstName: String,
            lastName: String,
            email: String,
        },
    ],
    chapters: [
        {
            chapterName: String,
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
        },
    ],
}, { typeKey: 'typeKey' });

module.exports = model("Course", courseSchema);
