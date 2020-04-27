const { UserInputError } = require('apollo-server');

const Course = require('../../models/Course');
const checkAuth = require('../../utils/check-auth');
const { validateChapterContent } = require('../../utils/validators');

module.exports = {
    Mutation: {
        async addChapterToCourse(
            _,
            { chapterInput: { courseId, text, type, media, chapterName } },
            context
        ) {
            const user = checkAuth(context);

            const { errors, valid } = validateChapterContent(user, text, type);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const course = await Course.findById(courseId);

            if (course) {
                course.chapters.push({
                    courseId,
                    chapterName,
                    text,
                    media,
                    type,
                });

                await course.save();
                return course;
            } else {
                throw new Error('course not found');
            }
        },

        async removeChapterFromCourse(_, { courseId, chapterIndex }, context) {
            const user = checkAuth(context);
            const course = await Course.findById(courseId);

            if (course) {
                if (user.id != course.owner || user.role === 'student') {
                    throw new Error('not allowed');
                }

                if (course.chapters.length > chapterIndex) {
                    course.chapters.splice(chapterIndex, 1);
                    await course.save();
                    return course;
                } else {
                    throw new Error('wrong index');
                }
            } else {
                throw new Error('course not found');
            }
        },

        async updateChapter(
            _,
            { courseId, chapterIndex, chapterName, text, media, type },
            context
        ) {
            const user = checkAuth(context);
            const { errors, valid } = validateChapterContent(user, text, type);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            let course = await Course.findById(courseId);
            if (course) {
                course.chapters[chapterIndex].type = type;
                course.chapters[chapterIndex].chapterName = chapterName;
                course.chapters[chapterIndex].text = text;
                course.chapters[chapterIndex].media = media;

                return await course.save();
            } else {
                throw new Error('course not found');
            }
        },
    },
};
