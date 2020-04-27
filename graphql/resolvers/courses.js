const {paginateResults} =  require("../../utils/utils");

const {validateCourse} =require( "../../utils/validators");

const {UserInputError} = require("apollo-server");

const Course = require("../../models/Course");
const checkAuth = require("../../utils/check-auth");
const User = require("../../models/User");

module.exports = {
    Query: {
        async getCourses() {
            try {
                const courses = await Course.find().sort({createdAt: -1});
                return courses;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getCoursesFeed(_, {pageSize, after}){
            try {
                const allCourses = await Course.find().sort({createdAt: -1});
                const courses = paginateResults({
                    after,
                    pageSize,
                    results: allCourses
                });
                return {
                    courses,
                    cursor: courses.length ? courses[courses.length - 1].createdAt : null,
                    // if the cursor of the end of the paginated results is the same as the
                    // last item in _all_ results, then there are no more results after this
                    hasMore: courses.length
                        ? courses[courses.length - 1].createdAt !==
                        allCourses[allCourses.length - 1].createdAt
                        : false
                };
            } catch (err) {
                throw new Error(err);
            }



        },

        async getCourse(_, {courseId}) {
            try{
                const course = await Course.findById(courseId);

                if (course) {
                    return course;
                }
                throw new Error('курс не знайдено');
            }catch (e) {
                throw new Error(e)
            }

        },

        async searchCourses(_, {partOfName}){
            if(partOfName.length > 2) return await Course.find({courseName: {$regex: partOfName, $options: "i"}})
            return [];
        }
    },

    Mutation: {
        async createCourse(_, {courseName, description}, context) {
            let user = checkAuth(context);
            const {errors, valid} = validateCourse(courseName, description);

            if (!valid) throw new UserInputError('CourseErrors', {errors});

            if (user.role !== "admin" && user.role !== "teacher") {
                throw new Error("This role not allowed");
            }
            const findCourse = await Course.findOne({courseName});
            if (findCourse) throw new UserInputError("CourseName error", {courseName: "Курс з такою назвою вже існує"});

            const course = new Course({
                description,
                courseName,
                owner: user.id,
                ownerName: user.firstName + ' ' +user.lastName,
                createdAt: new Date().toISOString(),
            });

            user = await User.findById(user.id);
            course.members.push(user);
            const saved = await course.save();

            user.progress.push({ courseName: course.courseName, courseId: saved.id });


            return await user.save();
        },
        async removeCourse(_, {courseId}, context){
            checkAuth(context);
            const deleted = await Course.findByIdAndDelete(courseId);
            return !!deleted;
        }

    },


};
