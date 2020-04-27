const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    role: String,
    password: String,
    email: String,
    createdAt: String,
    progress: [
        {
            courseId: Schema.Types.ObjectId,
            courseName: String,
            right: { type: Number, default: 0 },
            wrong: { type: Number, default: 0 },
            chapters: [
                {
                    wasMade: Boolean,
                    studentTest: [
                        {testMade:Boolean, rightAnswer: {type: [Number], default: []}, studentAnswer: {type: [Number], default: []} },
                    ],


                },
            ],


        },
    ],
});

module.exports = model('User', userSchema);
