const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const checkAuth = require("../../utils/check-auth");
const Course = require("../../models/Course");

module.exports = {
    Mutation: {
        async addUserToCourse(_, { courseId }, context) {
            let user = checkAuth(context);
            user = await User.findById(user.id);

            const course = await Course.findById(courseId);
            user.progress.forEach((element) => {
                if (element.courseId == courseId) {
                    throw new Error("You are already enrolled to this course.");
                }
            });
            course.members.push(user);
            await course.save();

            user.progress.push({ courseName: course.courseName, courseId, right:0, wrong: 0, chapters:[] });
            await user.save();
            return user;
        },

        async removeUserFromCourse(_, { courseId }, context) {
            let user = checkAuth(context);
            user = await User.findById(user.id);

            const course = await Course.findById(courseId);
            if(course){
                const removeUserIndex = course.members.findIndex(
                    (element) => element.id == user.id
                );
                course.members.splice(removeUserIndex, 1);
                await course.save();
            }

            const index = user.progress.findIndex(
                (element) => element.courseId == courseId
            );

            if (index !== -1) {
                user.progress.splice(index, 1);
                await user.save();
            } else {
                throw new Error("You are not in this course.");
            }

            return user;
        },

        async updateUserProgress(
            _,
            { courseId, chapterIndex, wasMade, testIndex, studentAnswer, rightAnswer },
            context
        ) {
            let user = checkAuth(context);
            user = await User.findById(user.id);
            let progress = null;
            let index = 0;
            for (let i = 0; i < user.progress.length; i++) {
                if (user.progress[i].courseId == courseId) {
                    progress = user.progress[i];
                    index = i;
                    break;
                }
            }

            if (progress) {

                if (!progress.chapters[chapterIndex]) {
                    progress.chapters[chapterIndex] = { wasMade };
                }

                if (testIndex !== undefined) {
                    if(progress.chapters[chapterIndex].studentTest === undefined){
                        progress.chapters[chapterIndex].studentTest = [];
                    }
                    if(progress.chapters[chapterIndex].studentTest[testIndex]  === undefined){
                        progress.chapters[chapterIndex].studentTest[testIndex] = {};
                    }
                    progress.chapters[chapterIndex].studentTest[testIndex].testMade = true;
                    progress.chapters[chapterIndex].studentTest[testIndex].rightAnswer = rightAnswer;
                    progress.chapters[chapterIndex].studentTest[testIndex].studentAnswer = studentAnswer;
                    if(JSON.stringify(rightAnswer.sort()) === JSON.stringify(studentAnswer.sort())){
                        progress.right +=1;
                    }else{

                        progress.wrong+=1;
                    }
                    for (let i = 0; i < progress.chapters[chapterIndex].studentTest.length; i++){
                        if(!progress.chapters[chapterIndex].studentTest[i]){
                            progress.chapters[chapterIndex].studentTest[i] = {};
                        }
                    }

                }


                progress.chapters[chapterIndex].wasMade = wasMade;
                user.progress[index] = progress;

                return await user.save();
            } else {
                throw new Error("You are not enrolled to thi course");
            }
        },
    },
};
