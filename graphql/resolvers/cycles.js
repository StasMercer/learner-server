const CycleCourse = require('../../models/CycleCourse');
const Course = require('../../models/Course');

const checkAuth = require("../../utils/check-auth");

module.exports = {
    Query: {
        async getCycles() {
            try {
                const cycles = await CycleCourse.find().sort({createdAt: -1});
                return cycles;
            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        async createCycle(_, {cycleName}, context){
            try{
                const user = checkAuth(context);
                if(user.role !== 'admin') throw new Error('not allowed');
                if(cycleName.trim() === '') throw new Error('cycle name is empty');
                const found = await CycleCourse.findOne({cycleName})
                if(found) throw new Error('cycle exists');

                const cycle = await CycleCourse.create({cycleName, courses: []})
                return await cycle.save()

            }catch (e) {
                throw new Error(e)
            }
        },

        async removeCycle(_, {cycleId}, context){
            const user = checkAuth(context);
            if(user.role !== 'admin') throw new Error('not allowed');
            const deleted = await CycleCourse.findByIdAndDelete(cycleId);
            if(!deleted) throw new Error('cycle did not found');
            console.log(deleted);
            return await CycleCourse.find();
        },

        async addCourseToCycle(_, {cycleId, courseId}, context){

                const user = checkAuth(context);
                if(user.role !== 'admin') throw new Error('not allowed');
                const cycle = await CycleCourse.findById(cycleId);
                if(!cycle)throw new Error('cycle not found');

                const course = await Course.findById(courseId);
                if(!course) throw new Error('course not found');

                cycle.courses.push({courseId, courseName: course.courseName})
                return await cycle.save();
        },

        async removeCourseFromCycle(_, {courseIndex, cycleId}, context){

            const user = checkAuth(context);
            if(user.role !== 'admin') throw new Error('not allowed');
            const cycle = await CycleCourse.findById(cycleId);
            if(!cycle)throw new Error('cycle not found');
            if(courseIndex >= cycle.courses.length) throw new Error('invalid index');
            cycle.courses.splice(courseIndex, 1);
            return await cycle.save();
        }
    }
}