const usersResolver = require('./users');
const courseResolver = require('./courses');
const chapterResolver = require('./chapters');
const testResolver = require('./test');
const userOperationResolver = require('./userOperation');
const cycleResolver = require('./cycles');
const adminResolver = require('./admin');

module.exports = {
    Course: {
        membersCount: (parent) => parent.members.length,
    },
    Query: {
        ...courseResolver.Query,
        ...usersResolver.Query,
        ...cycleResolver.Query,
        ...adminResolver.Query
    },
    Mutation: {
        ...userOperationResolver.Mutation,
        ...testResolver.Mutation,
        ...chapterResolver.Mutation,
        ...usersResolver.Mutation,
        ...courseResolver.Mutation,
        ...cycleResolver.Mutation,
        ...adminResolver.Mutation
    },
};
