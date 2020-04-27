const { UserInputError } = require('apollo-server');

const Course = require('../../models/Course');
const checkAuth = require('../../utils/check-auth');
const { validateTestInput } = require('../../utils/validators');

module.exports = {
    Mutation: {
        async addTestToCourse(_, { courseId, chapterIndex, test }, context) {
            const course = await Course.findById(courseId);
            if (!course) throw new Error('course not found');
            const chapter = await course.chapters[chapterIndex];
            if (!chapter) throw new Error('no chapter');

            await course.chapters[chapterIndex].tests.push(test);
            await course.save();
            return test;
        },

        async removeTestFromCourse(_, { courseId, chapterIndex, testIndex }) {
            const course = await Course.findById(courseId);
            course.chapters[chapterIndex].tests.splice(testIndex, 1);
            await course.save();
            return course.chapters[chapterIndex];
        },
        async updateTestInChapter(
            _,
            { courseId, chapterIndex, testIndex, test },
            context
        ) {
            const user = checkAuth(context);

            const course = await Course.findById(courseId);
            if (course) {
                const { errors, valid } = validateTestInput(test);
                if (!valid) throw new UserInputError('error', { errors });

                course.chapters[chapterIndex].tests[testIndex] = test;
                await course.save();
                return true;
            }

            return false;
        },
    },
};
